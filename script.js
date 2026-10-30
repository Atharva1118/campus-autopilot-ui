
/* =========================================================
   CAMPUS AUTOPILOT — NOTICE PAGE LOGIC
   Website → n8n Webhook
   ========================================================= */

"use strict";

/* 1. CONFIGURATION */

const STORAGE_KEYS = {
  announcementWebhook: "campus_autopilot_announcement_webhook"
};

const DEFAULT_WEBHOOK_URL =
  "https://campus-autopilot.app.n8n.cloud/webhook/c494a389-57d5-4e97-84c1-dc37fdbca64e";

// Keep test mode enabled until testing is complete.
const SEND_MODE = "production";

const DIVISION_MAPPING = {
  FY: {
    CSE: ["A", "B", "C"],
    "CSE-DS": ["D"],
    "CSE-AIML": ["E", "F"],
    ENTC: ["G"],
    Chemical: ["H"],
    Civil: ["I"],
    Mechanical: ["J"]
  },

  SY: {
    CSE: ["A", "B", "C"],
    "CSE-DS": ["A", "B"],
    "CSE-AIML": ["A", "B"],
    ENTC: ["A", "B"],
    Chemical: ["A", "B"],
    Civil: ["A", "B"],
    Mechanical: ["A", "B"]
  },

  TY: {
    CSE: ["A", "B", "C"],
    "CSE-DS": ["A", "B"],
    "CSE-AIML": ["A", "B"],
    ENTC: ["A", "B"],
    Chemical: ["A", "B"],
    Civil: ["A", "B"],
    Mechanical: ["A", "B"]
  },

  "Final Year": {
    CSE: ["A", "B", "C"],
    "CSE-DS": ["A", "B"],
    "CSE-AIML": ["A", "B"],
    ENTC: ["A", "B"],
    Chemical: ["A", "B"],
    Civil: ["A", "B"],
    Mechanical: ["A", "B"]
  }
};

/* 2. DOM ELEMENTS */

const $ = id => document.getElementById(id);

const form = $("announcementForm");
const titleInput = $("announcementTitle");
const messageInput = $("announcementMessage");

const recipientInputs =
  document.querySelectorAll('input[name="recipientType"]');

const classroomFields = $("classroomFields");
const yearSelect = $("academicYear");
const branchSelect = $("branch");
const divisionSelect = $("division");

const webhookInput = $("announcementWebhook");
const submitButton = $("submitButton");
const statusBox = $("announcementStatus");

/* 3. STATUS MESSAGES */

function setStatus(message, type = "info") {
  if (!statusBox) return;

  statusBox.textContent = message;
  statusBox.className = `form-status ${type}`;
  statusBox.hidden = false;
}

function clearStatus() {
  if (!statusBox) return;

  statusBox.textContent = "";
  statusBox.hidden = true;
  statusBox.className = "form-status";
}

/* 4. SELECT HELPERS */

function populateSelect(select, placeholder, values) {
  if (!select) return;

  select.innerHTML = "";

  const first = document.createElement("option");
  first.value = "";
  first.textContent = placeholder;

  select.appendChild(first);

  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;

    select.appendChild(option);
  });
}

function getRecipientType() {
  return document.querySelector(
    'input[name="recipientType"]:checked'
  )?.value || "all";
}

/* 5. AUDIENCE SELECTION */

function updateAudienceUI() {
  const type = getRecipientType();

  if (classroomFields) {
    classroomFields.hidden = type !== "classroom";
  }

  $("allStudentsCard")?.classList.toggle(
    "selected",
    type === "all"
  );

  $("classroomCard")?.classList.toggle(
    "selected",
    type === "classroom"
  );

  updatePreview();
}

/* 6. BRANCH AND DIVISION */

function updateBranches() {
  if (!yearSelect || !branchSelect || !divisionSelect) return;

  const branches =
    yearSelect.value && DIVISION_MAPPING[yearSelect.value]
      ? Object.keys(DIVISION_MAPPING[yearSelect.value])
      : [];

  populateSelect(
    branchSelect,
    branches.length ? "Select branch" : "Select year first",
    branches
  );

  branchSelect.disabled = branches.length === 0;

  populateSelect(
    divisionSelect,
    "Select division",
    []
  );

  divisionSelect.disabled = true;

  if ($("divisionHelp")) {
    $("divisionHelp").textContent =
      "Choose year and branch first.";
  }
}

function updateDivisions() {
  if (!yearSelect || !branchSelect || !divisionSelect) return;

  const divisions =
    DIVISION_MAPPING[yearSelect.value]?.[branchSelect.value] || [];

  populateSelect(
    divisionSelect,
    divisions.length ? "Select division" : "Select branch first",
    divisions
  );

  divisionSelect.disabled = divisions.length === 0;

  if ($("divisionHelp")) {
    $("divisionHelp").textContent = divisions.length
      ? `Available divisions: ${divisions.join(", ")}`
      : "Choose year and branch first.";
  }
}

/* 7. CHARACTER COUNTERS */

function updateCounter(input, counterId, max) {
  const counter = $(counterId);

  if (input && counter) {
    counter.textContent =
      `${input.value.length} / ${max}`;
  }
}

/* 8. LIVE PREVIEW */

function updatePreview() {
  if (!titleInput || !messageInput) return;

  if ($("previewTitle")) {
    $("previewTitle").textContent =
      titleInput.value.trim() ||
      "Your notice title appears here";
  }

  if ($("previewMessage")) {
    $("previewMessage").textContent =
      messageInput.value.trim() ||
      "Your notice message will appear here. Add the details students need to know.";
  }

  let audience = "All Students";

  if (getRecipientType() === "classroom") {
    audience = [
      yearSelect?.value,
      branchSelect?.value,
      divisionSelect?.value
    ].filter(Boolean).join(" · ") || "Specific Classroom";
  }

  if ($("previewAudience")) {
    $("previewAudience").textContent = audience;
  }

  const dateValue = $("announcementDate")?.value;

  if ($("previewDate")) {
    $("previewDate").textContent = dateValue
      ? new Date(`${dateValue}T00:00:00`).toLocaleDateString(
          undefined,
          {
            day: "numeric",
            month: "short",
            year: "numeric"
          }
        )
      : "Today";
  }
}

/* 9. WEBHOOK CONFIGURATION */

function getWebhookUrl() {
  return (
    webhookInput?.value?.trim() ||
    localStorage.getItem(
      STORAGE_KEYS.announcementWebhook
    ) ||
    DEFAULT_WEBHOOK_URL
  ).trim();
}

function saveWebhook() {
  const value =
    webhookInput?.value?.trim() || DEFAULT_WEBHOOK_URL;

  const status = $("webhookStatus");

  try {
    const parsed = new URL(value);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Invalid protocol");
    }

    localStorage.setItem(
      STORAGE_KEYS.announcementWebhook,
      value
    );

    if (webhookInput) {
      webhookInput.value = value;
    }

    if (status) {
      status.textContent =
        "n8n webhook connection saved successfully.";

      status.style.color = "#9be8c1";
    }

  } catch {
    if (status) {
      status.textContent =
        "Please enter a valid HTTP or HTTPS webhook URL.";

      status.style.color = "#ffabb4";
    }
  }
}

/* 10. FORM VALIDATION */

function validateForm() {
  if (!titleInput || !messageInput) {
    return "The announcement form could not be found.";
  }

  const title = titleInput.value.trim();
  const message = messageInput.value.trim();

  const date = $("announcementDate")?.value || "";
  const time = $("announcementTime")?.value || "";

  if (!title) {
    return "Please enter a notice title.";
  }

  if (title.length > 120) {
    return "Notice title must be 120 characters or fewer.";
  }

  if (!message) {
    return "Please enter the notice message.";
  }

  if (message.length > 5000) {
    return "Notice message must be 5000 characters or fewer.";
  }

  if (getRecipientType() !== "classroom") {
    return "All Students broadcasting is not enabled yet. Please select Specific Classroom.";
  }

  if (!yearSelect?.value) {
    return "Please select an academic year.";
  }

  if (!branchSelect?.value) {
    return "Please select a branch.";
  }

  if (!divisionSelect?.value) {
    return "Please select a division.";
  }

  if ((date && !time) || (!date && time)) {
    return "To schedule a notice, select both date and time.";
  }

  if (date && time) {
    const scheduled = new Date(`${date}T${time}`);

    if (Number.isNaN(scheduled.getTime())) {
      return "Please enter a valid schedule date and time.";
    }

    if (scheduled.getTime() < Date.now() - 60000) {
      return "The scheduled date and time must be in the future.";
    }
  }

  try {
    const url = new URL(getWebhookUrl());

    if (!["http:", "https:"].includes(url.protocol)) {
      return "Invalid webhook URL.";
    }

  } catch {
    return "Please enter a valid n8n webhook URL.";
  }

  return "";
}

/* 11. BUILD N8N PAYLOAD */

function buildPayload() {
  const scheduledDate =
    $("announcementDate")?.value || "";

  const scheduledTime =
    $("announcementTime")?.value || "";

  const title = titleInput.value.trim();
  const message = messageInput.value.trim();

  let noticeText =
    `Title: ${title}\n\n${message}`;

  if (scheduledDate && scheduledTime) {
    noticeText +=
      `\n\nScheduled Date: ${scheduledDate}` +
      `\nScheduled Time: ${scheduledTime}` +
      "\nTimezone: Asia/Kolkata";
  }

  return {
    "Branch": branchSelect.value,
    "Year": yearSelect.value,
    "Division": divisionSelect.value,

    "Notice Text": noticeText,

    "Title": title,
    "Message": message,

    "Recipient Type": "classroom",
    "Audience": "Specific Classroom",

    "Scheduled Date": scheduledDate,
    "Scheduled Time": scheduledTime,

    "Publish Mode":
      scheduledDate && scheduledTime
        ? "scheduled"
        : "immediate",

    "Send Mode": SEND_MODE,

    "Timezone": "Asia/Kolkata",

    "Source": "Campus Autopilot Website",

    "Submitted At": new Date().toISOString()
  };
}

/* 12. SUBMIT NOTICE TO N8N */

async function publishNotice(event) {
  event.preventDefault();

  clearStatus();

  const validationMessage = validateForm();

  if (validationMessage) {
    setStatus(validationMessage, "error");
    return;
  }

  if (!submitButton) {
    setStatus("Publish button could not be found.", "error");
    return;
  }

  const originalButtonText = submitButton.innerHTML;

  submitButton.disabled = true;

  submitButton.innerHTML =
    "<span>Sending to Campus Autopilot...</span>";

  setStatus(
    "Submitting your announcement to n8n. Please wait.",
    "info"
  );

  try {
    /*
     * text/plain normally avoids the browser OPTIONS preflight.
     * The n8n response must still allow the website origin.
     */

    const response = await fetch(getWebhookUrl(), {
      method: "POST",
      mode: "cors",

      headers: {
        "Content-Type": "text/plain;charset=UTF-8"
      },

      body: JSON.stringify(buildPayload())
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        `n8n returned HTTP ${response.status}` +
        (responseText
          ? `: ${responseText.slice(0, 250)}`
          : "")
      );
    }

    let result = responseText;

    try {
      result = responseText
        ? JSON.parse(responseText)
        : {};

    } catch {
      // Plain text response is also accepted.
    }

    console.log("n8n webhook response:", result);

    setStatus(
      "Announcement received by n8n. Check the n8n execution to confirm validation. Test mode is enabled.",
      "success"
    );

  } catch (error) {
    console.error("Notice submission failed:", error);

    setStatus(
      "Could not submit the announcement. " +
      (error.message ||
        "Check your internet connection and n8n webhook configuration.") +
      " If this remains a CORS error, inspect the OPTIONS/POST request in DevTools.",
      "error"
    );

  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
}

/* 13. RESET FORM */

function resetFormState() {
  clearStatus();

  updateAudienceUI();
  updateBranches();
  updatePreview();

  updateCounter(titleInput, "titleCount", 120);
  updateCounter(messageInput, "messageCount", 5000);
}

/* 14. INITIALIZE WEBSITE */

function initialize() {
  if (!form || !titleInput || !messageInput) {
    console.error(
      "Campus Autopilot: Required announcement form elements were not found."
    );

    return;
  }

  const savedWebhook = localStorage.getItem(
    STORAGE_KEYS.announcementWebhook
  );

  if (webhookInput) {
    webhookInput.value =
      savedWebhook || DEFAULT_WEBHOOK_URL;
  }

  recipientInputs.forEach(input => {
    input.addEventListener("change", updateAudienceUI);
  });

  yearSelect?.addEventListener("change", () => {
    updateBranches();
    updatePreview();
  });

  branchSelect?.addEventListener("change", () => {
    updateDivisions();
    updatePreview();
  });

  divisionSelect?.addEventListener(
    "change",
    updatePreview
  );

  titleInput.addEventListener("input", () => {
    updateCounter(titleInput, "titleCount", 120);
    updatePreview();
  });

  messageInput.addEventListener("input", () => {
    updateCounter(messageInput, "messageCount", 5000);
    updatePreview();
  });

  $("announcementDate")?.addEventListener(
    "change",
    updatePreview
  );

  $("announcementTime")?.addEventListener(
    "change",
    updatePreview
  );

  $("saveWebhookButton")?.addEventListener(
    "click",
    saveWebhook
  );

  $("resetButton")?.addEventListener("click", () => {
    window.setTimeout(resetFormState, 0);
  });

  form.addEventListener("submit", publishNotice);

  updateBranches();
  updateAudienceUI();

  updateCounter(titleInput, "titleCount", 120);
  updateCounter(messageInput, "messageCount", 5000);

  updatePreview();

  console.log(
    `Campus Autopilot initialized. Send mode: ${SEND_MODE}.`
  );
}

document.addEventListener(
  "DOMContentLoaded",
  initialize
);
