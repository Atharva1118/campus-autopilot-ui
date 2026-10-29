
"use strict";

const STORAGE_KEYS = {
  announcementWebhook: "campus_autopilot_announcement_webhook",
  eventWebhook: "campus_autopilot_event_webhook"
};

const DIVISION_MAPPING = {
  "FY": {
    "CSE": ["A", "B", "C"],
    "CSE-DS": ["D"],
    "CSE-AIML": ["E", "F"],
    "ENTC": ["G"],
    "Chemical": ["H"],
    "Civil": ["I"],
    "Mechanical": ["J"]
  },
  "SY": {
    "CSE": ["A", "B", "C"],
    "CSE-DS": ["A", "B"],
    "CSE-AIML": ["A", "B"],
    "Civil": ["A", "B"],
    "Mechanical": ["A", "B"],
    "ENTC": ["A", "B"],
    "Chemical": ["A", "B"]
  },
  "TY": {
    "CSE": ["A", "B", "C"],
    "CSE-DS": ["A", "B"],
    "CSE-AIML": ["A", "B"],
    "Civil": ["A", "B"],
    "Mechanical": ["A", "B"],
    "ENTC": ["A", "B"],
    "Chemical": ["A", "B"]
  },
  "Final Year": {
    "CSE": ["A", "B", "C"],
    "CSE-DS": ["A", "B"],
    "CSE-AIML": ["A", "B"],
    "Civil": ["A", "B"],
    "Mechanical": ["A", "B"],
    "ENTC": ["A", "B"],
    "Chemical": ["A", "B"]
  }
};

function getElement(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const element = getElement(id);
  if (element) element.textContent = String(value);
}

function showStatus(elementOrId, message, type = "info") {
  const element = typeof elementOrId === "string"
    ? getElement(elementOrId)
    : elementOrId;

  if (!element) return;

  element.textContent = message;
  element.className = "form-status";

  if (message) element.classList.add(type);
}

function clearStatus(elementOrId) {
  const element = typeof elementOrId === "string"
    ? getElement(elementOrId)
    : elementOrId;

  if (!element) return;

  element.textContent = "";
  element.className = "form-status";
}

function addOption(select, value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  select.appendChild(option);
}

function getFormValue(form, name) {
  const field = form.elements.namedItem(name);
  return field && typeof field.value === "string"
    ? field.value.trim()
    : "";
}

function getSelectedDivisionOptions(year, branch) {
  return DIVISION_MAPPING[year]?.[branch] || [];
}

/* NAVIGATION */

function initializeNavigation() {
  const navLinks = document.querySelectorAll(".nav-link[data-page]");
  const sections = document.querySelectorAll(".page-section");
  const pageTitle = getElement("pageTitle");
  const sidebar = getElement("sidebar");
  const menuButton = getElement("menuButton");

  if (!sidebar || !menuButton) return;

  let overlay = getElement("sidebarOverlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "sidebarOverlay";
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function navigateTo(pageName, updateHash = true) {
    const validPages = [
      "dashboard", "announcement", "schedule", "history", "settings"
    ];

    const page = validPages.includes(pageName) ? pageName : "dashboard";

    sections.forEach(section => {
      section.classList.toggle("hidden", section.id !== page);
    });

    navLinks.forEach(link => {
      const active = link.dataset.page === page;
      link.classList.toggle("active", active);

      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    if (pageTitle) {
      const activeLink = document.querySelector(
        `.nav-link[data-page="${page}"]`
      );

      pageTitle.textContent = activeLink
        ? activeLink.querySelector("span:last-child")?.textContent.trim() || page
        : page;
    }

    if (updateHash && location.hash !== `#${page}`) {
      history.replaceState(null, "", `#${page}`);
    }

    closeSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      navigateTo(link.dataset.page);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    if (link.matches(".nav-link")) return;

    link.addEventListener("click", event => {
      const page = link.getAttribute("href").slice(1);

      if (getElement(page)) {
        event.preventDefault();
        navigateTo(page);
      }
    });
  });

  menuButton.addEventListener("click", () => {
    if (sidebar.classList.contains("open")) {
      closeSidebar();
    } else {
      sidebar.classList.add("open");
      overlay.classList.add("active");
      menuButton.setAttribute("aria-expanded", "true");

      if (matchMedia("(max-width: 900px)").matches) {
        document.body.style.overflow = "hidden";
      }
    }
  });

  overlay.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeSidebar();
  });

  window.addEventListener("resize", () => {
    if (!matchMedia("(max-width: 900px)").matches) closeSidebar();
  });

  const initialPage = location.hash.replace("#", "");
  navigateTo(getElement(initialPage) ? initialPage : "dashboard", false);
}

/* CLASSROOM DROPDOWNS */

function initializeClassroomDropdowns() {
  const recipientType = getElement("recipientType");
  const classroomFields = getElement("classroomFields");
  const academicYear = getElement("academicYear");
  const branch = getElement("branch");
  const division = getElement("division");
  const divisionHelp = getElement("divisionHelp");

  if (!recipientType || !classroomFields ||
      !academicYear || !branch || !division) return;

  function resetSelect(select, placeholder) {
    select.replaceChildren();
    addOption(select, "", placeholder);
    select.value = "";
  }

  function resetBranch() {
    resetSelect(branch, "Select branch");
    branch.disabled = true;
  }

  function resetDivision(message = "Select year and branch first") {
    resetSelect(division, message);
    division.disabled = true;
  }

  function updateBranchOptions() {
    resetBranch();
    resetDivision();

    const mapping = DIVISION_MAPPING[academicYear.value];

    if (!mapping) {
      if (divisionHelp) {
        divisionHelp.textContent = "Select an academic year first.";
      }
      return;
    }

    Object.keys(mapping).forEach(name => addOption(branch, name, name));
    branch.disabled = false;

    if (divisionHelp) {
      divisionHelp.textContent = "Select a branch to view divisions.";
    }
  }

  function updateDivisionOptions() {
    resetDivision();

    const year = academicYear.value;
    const selectedBranch = branch.value;

    if (!year || !selectedBranch) {
      if (divisionHelp) {
        divisionHelp.textContent = "Select year and branch first.";
      }
      return;
    }

    const divisions = getSelectedDivisionOptions(year, selectedBranch);

    if (!divisions.length) {
      resetDivision("No divisions available");
      return;
    }

    divisions.forEach(name => addOption(division, name, name));
    division.disabled = false;

    if (divisionHelp) {
      divisionHelp.textContent = `Available divisions: ${divisions.join(", ")}.`;
    }
  }

  function updateRecipientFields() {
    const isClassroom = recipientType.value === "classroom";

    classroomFields.classList.toggle("hidden", !isClassroom);

    academicYear.required = isClassroom;
    branch.required = isClassroom;
    division.required = isClassroom;

    if (isClassroom) {
      academicYear.disabled = false;
      if (academicYear.value) updateBranchOptions();
    } else {
      academicYear.value = "";
      academicYear.disabled = true;
      resetBranch();
      resetDivision();

      if (divisionHelp) {
        divisionHelp.textContent =
          "Classroom selection is not required for All Students.";
      }
    }
  }

  academicYear.addEventListener("change", updateBranchOptions);
  branch.addEventListener("change", updateDivisionOptions);

  recipientType.addEventListener("change", () => {
    updateRecipientFields();
    clearStatus("announcementStatus");
  });

  academicYear.disabled = true;
  resetBranch();
  resetDivision();
  updateRecipientFields();
}


/* SETTINGS */

function getStoredWebhook(key) {
  try {
    return localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function storeWebhook(key, value) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function getWebhookUrl(key) {
  return getStoredWebhook(key).trim();
}

function isValidWebhookUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ||
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function initializeSettings() {
  const form = getElement("settingsForm");
  const announcementInput = getElement("announcementWebhook");
  const eventInput = getElement("eventWebhook");

  if (!form || !announcementInput || !eventInput) return;

  announcementInput.value = getStoredWebhook(STORAGE_KEYS.announcementWebhook);
  eventInput.value = getStoredWebhook(STORAGE_KEYS.eventWebhook);

  form.addEventListener("submit", event => {
    event.preventDefault();
    clearStatus("settingsStatus");

    const announcementUrl = announcementInput.value.trim();
    const eventUrl = eventInput.value.trim();

    if (announcementUrl && !isValidWebhookUrl(announcementUrl)) {
      showStatus("settingsStatus", "Enter a valid HTTPS announcement webhook URL.", "error");
      return;
    }

    if (eventUrl && !isValidWebhookUrl(eventUrl)) {
      showStatus("settingsStatus", "Enter a valid HTTPS event webhook URL.", "error");
      return;
    }

    const savedAnnouncement = storeWebhook(
      STORAGE_KEYS.announcementWebhook, announcementUrl
    );

    const savedEvent = storeWebhook(
      STORAGE_KEYS.eventWebhook, eventUrl
    );

    if (!savedAnnouncement || !savedEvent) {
      showStatus("settingsStatus", "Could not save settings in this browser.", "error");
      return;
    }

    showStatus("settingsStatus", "Webhook settings saved in this browser.", "success");
  });
}

/* WEBHOOK REQUEST */

async function postToWebhook(url, payload) {
  if (!url) {
    throw new Error("Webhook URL is missing. Configure it in Settings.");
  }

  if (!isValidWebhookUrl(url)) {
    throw new Error("The configured webhook URL is invalid.");
  }

  let response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error(error);
    throw new Error(
      "Could not reach the webhook. Check the URL, n8n workflow, connection, and CORS settings."
    );
  }

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(
      `Webhook error: ${String(data?.message || data?.error || `HTTP ${response.status}`).slice(0, 300)}`
    );
  }

  return { httpStatus: response.status, data };
}

/* BROWSER-SESSION HISTORY */

const localExecutions = [];

function createRequestId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `request-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function recordLocalExecution(record) {
  localExecutions.unshift({
    id: createRequestId(),
    timestamp: new Date().toISOString(),
    ...record
  });

  if (localExecutions.length > 100) localExecutions.length = 100;

  renderHistory();
  updateDashboardStats();
}

function updateDashboardStats() {
  setText("totalAnnouncements",
    localExecutions.filter(r => r.task === "Announcement").length);

  setText("totalEvents",
    localExecutions.filter(r => r.task === "Event").length);

  setText("successfulRuns",
    localExecutions.filter(r => r.status === "success").length);

  setText("failedRuns",
    localExecutions.filter(r => r.status === "failed").length);
}

function renderHistory() {
  const body = getElement("historyTableBody");
  if (!body) return;

  const search = (getElement("historySearch")?.value || "").toLowerCase().trim();
  const filter = getElement("historyFilter")?.value || "all";

  const records = localExecutions.filter(record => {
    const searchable = [
      record.task, record.audience, record.title,
      record.status, record.message
    ].join(" ").toLowerCase();

    return searchable.includes(search) &&
      (filter === "all" || record.status === filter);
  });

  body.replaceChildren();

  if (!records.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "empty-state";

    const title = document.createElement("strong");
    title.textContent = localExecutions.length
      ? "No matching records"
      : "No execution records loaded";

    const description = document.createElement("p");
    description.textContent = localExecutions.length
      ? "Try another search or status filter."
      : "Requests from this browser session appear here. Connect a backend to view actual n8n execution logs.";

    cell.append(title, description);
    row.appendChild(cell);
    body.appendChild(row);
    return;
  }

  records.forEach(record => {
    const row = document.createElement("tr");

    const titleCell = document.createElement("td");
    const title = document.createElement("strong");
    title.textContent = record.title || record.task;
    titleCell.appendChild(title);

    const audienceCell = document.createElement("td");
    audienceCell.textContent = record.audience || "—";

    const timeCell = document.createElement("td");
    timeCell.textContent = new Date(record.timestamp).toLocaleString();

    const statusCell = document.createElement("td");
    const badge = document.createElement("span");

    badge.className = {
      success: "status-success",
      failed: "status-failed",
      pending: "status-pending"
    }[record.status] || "status-pending";

    badge.textContent = {
      success: "HTTP accepted",
      failed: "Request failed",
      pending: "Pending"
    }[record.status] || record.status;

    statusCell.appendChild(badge);

    const detailsCell = document.createElement("td");
    detailsCell.textContent = record.message || "—";

    row.append(titleCell, audienceCell, timeCell, statusCell, detailsCell);
    body.appendChild(row);
  });
}

function initializeHistory() {
  getElement("historySearch")?.addEventListener("input", renderHistory);
  getElement("historyFilter")?.addEventListener("change", renderHistory);

  getElement("refreshHistory")?.addEventListener("click", () => {
    renderHistory();
    showStatus(
      "historyStatus",
      "Browser-session history refreshed. This is not the authoritative n8n execution log.",
      "info"
    );
  });

  renderHistory();
  updateDashboardStats();
      }




/* ANNOUNCEMENT VALIDATION */

function validateAnnouncement(form) {
  const title = getFormValue(form, "title");
  const message = getFormValue(form, "message");
  const recipient = getFormValue(form, "recipientType");

  if (!title || !message) {
    return "Enter an announcement title and message.";
  }

  if (!["all", "classroom"].includes(recipient)) {
    return "Choose All Students or Specific Classroom.";
  }

  const date = getFormValue(form, "scheduledDate");
  const time = getFormValue(form, "scheduledTime");

  if (Boolean(date) !== Boolean(time)) {
    return "Enter both the scheduled date and time, or leave both empty.";
  }

  if (date && time) {
    const scheduled = new Date(`${date}T${time}`);

    if (Number.isNaN(scheduled.getTime()) || scheduled <= new Date()) {
      return "Choose a valid future date and time.";
    }
  }

  if (recipient === "classroom") {
    const year = getFormValue(form, "academicYear");
    const branch = getFormValue(form, "branch");
    const division = getFormValue(form, "division");

    if (!year || !branch || !division) {
      return "Select an academic year, branch, and division.";
    }

    if (!getSelectedDivisionOptions(year, branch).includes(division)) {
      return "Invalid classroom selection.";
    }
  }

  return null;
}

/* ANNOUNCEMENT FORM */

function initializeAnnouncementForm() {
  const form = getElement("announcementForm");
  if (!form) return;

  form.addEventListener("reset", () => {
    setTimeout(() => {
      clearStatus("announcementStatus");
      getElement("recipientType")?.dispatchEvent(new Event("change"));
    }, 0);
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    clearStatus("announcementStatus");

    const error = validateAnnouncement(form);

    if (error) {
      showStatus("announcementStatus", error, "error");
      return;
    }

    const recipient = getFormValue(form, "recipientType");

    const payload = {
      requestId: createRequestId(),
      type: "announcement",
      title: getFormValue(form, "title"),
      message: getFormValue(form, "message"),
      recipientType: recipient,
      academicYear: recipient === "classroom" ? getFormValue(form, "academicYear") : "",
      branch: recipient === "classroom" ? getFormValue(form, "branch") : "",
      division: recipient === "classroom" ? getFormValue(form, "division") : "",
      scheduledDate: getFormValue(form, "scheduledDate"),
      scheduledTime: getFormValue(form, "scheduledTime"),
      submittedAt: new Date().toISOString()
    };

    const audience = recipient === "all"
      ? "All Students"
      : `${payload.academicYear} · ${payload.branch} · Division ${payload.division}`;

    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;

    showStatus("announcementStatus", "Submitting request to n8n...", "info");

    try {
      const result = await postToWebhook(
        getWebhookUrl(STORAGE_KEYS.announcementWebhook),
        payload
      );

      recordLocalExecution({
        task: "Announcement",
        title: payload.title,
        audience,
        status: "success",
        message: `HTTP ${result.httpStatus}: webhook accepted the request. Email delivery is not yet verified.`
      });

      showStatus(
        "announcementStatus",
        "Request accepted by the webhook. Check n8n execution results to confirm notification delivery.",
        "success"
      );

      form.reset();
    } catch (error) {
      recordLocalExecution({
        task: "Announcement",
        title: payload.title,
        audience,
        status: "failed",
        message: error.message
      });

      showStatus("announcementStatus", error.message, "error");
    } finally {
      if (button) button.disabled = false;
    }
  });
}

/* EVENT VALIDATION */

function validateEvent(form) {
  const required = [
    "title", "description", "date", "location",
    "startTime", "endTime", "audience"
  ];

  if (required.some(name => !getFormValue(form, name))) {
    return "Complete all required event fields.";
  }

  const audience = getFormValue(form, "audience");

  if (!["all", "classroom", "staff"].includes(audience)) {
    return "Choose a valid event audience.";
  }

  const date = getFormValue(form, "date");
  const start = new Date(`${date}T${getFormValue(form, "startTime")}`);
  const end = new Date(`${date}T${getFormValue(form, "endTime")}`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Enter a valid event date and time.";
  }

  if (start <= new Date()) {
    return "The event start time must be in the future.";
  }

  if (end <= start) {
    return "The event end time must be later than the start time.";
  }

  return null;
}

/* EVENT FORM */

function initializeEventForm() {
  const form = getElement("eventForm");
  if (!form) return;

  form.addEventListener("reset", () => clearStatus("eventStatus"));

  form.addEventListener("submit", async event => {
    event.preventDefault();
    clearStatus("eventStatus");

    const error = validateEvent(form);

    if (error) {
      showStatus("eventStatus", error, "error");
      return;
    }

    const payload = {
      requestId: createRequestId(),
      type: "event",
      title: getFormValue(form, "title"),
      description: getFormValue(form, "description"),
      date: getFormValue(form, "date"),
      location: getFormValue(form, "location"),
      startTime: getFormValue(form, "startTime"),
      endTime: getFormValue(form, "endTime"),
      audience: getFormValue(form, "audience"),
      organizer: getFormValue(form, "organizer"),
      submittedAt: new Date().toISOString()
    };

    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;

    showStatus("eventStatus", "Submitting event request to n8n...", "info");

    try {
      const result = await postToWebhook(
        getWebhookUrl(STORAGE_KEYS.eventWebhook),
        payload
      );

      recordLocalExecution({
        task: "Event",
        title: payload.title,
        audience: payload.audience,
        status: "success",
        message: `HTTP ${result.httpStatus}: webhook accepted the request. Calendar creation is not yet verified.`
      });

      showStatus(
        "eventStatus",
        "Request accepted. Check n8n execution and Google Calendar to verify event creation.",
        "success"
      );

      form.reset();
    } catch (error) {
      recordLocalExecution({
        task: "Event",
        title: payload.title,
        audience: payload.audience,
        status: "failed",
        message: error.message
      });

      showStatus("eventStatus", error.message, "error");
    } finally {
      if (button) button.disabled = false;
    }
  });
}

/* START APPLICATION */

function initializeCampusAutopilot() {
  initializeNavigation();
  initializeClassroomDropdowns();
  initializeSettings();
  initializeHistory();
  initializeAnnouncementForm();
  initializeEventForm();

  console.info("Campus Autopilot initialized.");
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeCampusAutopilot,
    { once: true }
  );
} else {
  initializeCampusAutopilot();
}

