
/* =========================================================
   CAMPUS AUTOPILOT — NOTICE PAGE LOGIC
   Website → n8n Production Webhook
   ========================================================= */

"use strict";

/* =========================================================
   1. CONFIGURATION
   ========================================================= */

const STORAGE_KEYS = {
  announcementWebhook: "campus_autopilot_announcement_webhook"
};

const DEFAULT_WEBHOOK_URL =
  "https://campus-autopilot.app.n8n.cloud/webhook/c494a389-57d5-4e97-84c1-dc37fdbca64e";

const DIVISION_MAPPING = {
  FY: {
    "CSE": ["A", "B", "C"],
    "CSE-DS": ["D"],
    "CSE-AIML": ["E", "F"],
    "ENTC": ["G"],
    "Chemical": ["H"],
    "Civil": ["I"],
    "Mechanical": ["J"]
  },

  SY: {
    "CSE": ["A", "B", "C"],
    "CSE-DS": ["A", "B"],
    "CSE-AIML": ["A", "B"],
    "ENTC": ["A", "B"],
    "Chemical": ["A", "B"],
    "Civil": ["A", "B"],
    "Mechanical": ["A", "B"]
  },

  TY: {
    "CSE": ["A", "B", "C"],
    "CSE-DS": ["A", "B"],
    "CSE-AIML": ["A", "B"],
    "ENTC": ["A", "B"],
    "Chemical": ["A", "B"],
    "Civil": ["A", "B"],
    "Mechanical": ["A", "B"]
  },

  "Final Year": {
    "CSE": ["A", "B", "C"],
    "CSE-DS": ["A", "B"],
    "CSE-AIML": ["A", "B"],
    "ENTC": ["A", "B"],
    "Chemical": ["A", "B"],
    "Civil": ["A", "B"],
    "Mechanical": ["A", "B"]
  }
};

/* =========================================================
   2. DOM ELEMENTS
   ========================================================= */

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

/* =========================================================
   3. STATUS MESSAGES
   ========================================================= */

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

/* =========================================================
   4. SELECT HELPERS
   ========================================================= */

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

/* =========================================================
   5. AUDIENCE SELECTION
   ========================================================= */

function updateAudienceUI() {
  const type = getRecipientType();

  if (classroomFields) {
    classroomFields.hidden = type !== "classroom";
  }

  if ($("allStudentsCard")) {
    $("allStudentsCard").classList.toggle(
      "selected",
      type === "all"
    );
  }

  if ($("classroomCard")) {
    $("classroomCard").classList.toggle(
      "selected",
      type === "classroom"
    );
  }

  updatePreview();
}

/* =========================================================
   6. BRANCH AND DIVISION
   ========================================================= */

function updateBranches() {
  const year = yearSelect.value;

  const branches =
    year && DIVISION_MAPPING[year]
      ? Object.keys(DIVISION_MAPPING[year])
      : [];

  populateSelect(
    branchSelect,
    branches.length
      ? "Select branch"
      : "Select year first",
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
  const year = yearSelect.value;
  const branch = branchSelect.value;

  const divisions =
    DIVISION_MAPPING[year]?.[branch] || [];

  populateSelect(
    divisionSelect,
    divisions.length
      ? "Select division"
      : "Select branch first",
    divisions
  );

  divisionSelect.disabled = divisions.length === 0;

  if ($("divisionHelp")) {
    $("divisionHelp").textContent = divisions.length
      ? `Available divisions: ${divisions.join(", ")}`
      : "Choose year and branch first.";
  }
}

/* =========================================================
   7. CHARACTER COUNTERS
   ========================================================= */

function updateCounter(input, counter, max) {
  const counterElement = $(counter);

  if (input && counterElement) {
    counterElement.textContent =
      `${input.value.length} / ${max}`;
  }
}

/* =========================================================
   8. LIVE PREVIEW
   ========================================================= */

function updatePreview() {
  if (!titleInput || !messageInput) return;

  const title = titleInput.value.trim();
  const message = messageInput.value.trim();

  if ($("previewTitle")) {
    $("previewTitle").textContent =
      title || "Your notice title appears here";
  }

  if ($("previewMessage")) {
    $("previewMessage").textContent =
      message ||
      "Your notice message will appear here. Add the details students need to know.";
  }

  let audience = "All Students";

  if (getRecipientType() === "classroom") {
    const year = yearSelect.value;
    const branch = branchSelect.value;
    const division = divisionSelect.value;

    audience =
      [year, branch, division].filter(Boolean).join(" · ") ||
      "Specific Classroom";
  }

  if ($("previewAudience")) {
    $("previewAudience").textContent = audience;
  }

  const dateValue = $("announcementDate")?.value;

  if (dateValue && $("previewDate")) {
    const parsed = new Date(`${dateValue}T00:00:00`);

    $("previewDate").textContent =
      parsed.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
  } else if ($("previewDate")) {
    $("previewDate").textContent = "Today";
  }
}

/* =========================================================
   9. WEBHOOK CONFIGURATION
   ========================================================= */

function getWebhookUrl() {
  return (
    webhookInput?.value ||
    localStorage.getItem(STORAGE_KEYS.announcementWebhook) ||
    DEFAULT_WEBHOOK_URL
  ).trim();
}

function saveWebhook() {
  const value = getWebhookUrl();

  const status = $("webhookStatus");

  if (!value) {
    if (status) {
      status.textContent = "Enter your webhook URL first.";
      status.style.color = "#ffabb4";
    }

    return;
  }

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

  } catch (error) {
    if (status) {
      status.textContent =
        "Please enter a valid HTTP or HTTPS webhook URL.";

      status.style.color = "#ffabb4";
    }
  }
}

/* =========================================================
   10. FORM VALIDATION
   ========================================================= */

function validateForm() {
  const title = titleInput.value.trim();
  const message = messageInput.value.trim();

  const recipientType = getRecipientType();

  const date = $("announcementDate")?.value || "";
  const time = $("announcementTime")?.value || "";

  if (!title) {
    return "Please enter a notice title.";
  }

  if (!message) {
    return "Please enter the notice message.";
  }

  // Current n8n workflow supports specific classroom targeting.
  if (recipientType !== "classroom") {
    return "All Students broadcasting is not enabled yet. Please select Specific Classroom.";
  }

  if (!yearSelect.value) {
    return "Please select an academic year.";
  }

  if (!branchSelect.value) {
    return "Please select a branch.";
  }

  if (!divisionSelect.value) {
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

  const webhook = getWebhookUrl();

  if (!webhook) {
    return "Please configure your n8n webhook URL.";
  }

  try {
    const url = new URL(webhook);

    if (!["http:", "https:"].includes(url.protocol)) {
      return "Invalid webhook URL.";
    }
  } catch {
    return "Please enter a valid webhook URL.";
  }

  return "";
}

/* =========================================================
   11. BUILD N8N PAYLOAD
   IMPORTANT: Field names match the n8n validation node.
   ========================================================= */

function buildPayload() {
  const scheduledDate =
    $("announcementDate")?.value || "";

  const scheduledTime =
    $("announcementTime")?.value || "";

  const title = titleInput.value.trim();
  const message = messageInput.value.trim();

  let noticeText =
    "Title: " + title + "\n\n" +
    message;

  if (scheduledDate && scheduledTime) {
    noticeText +=
      "\n\nScheduled Date: " + scheduledDate +
      "\nScheduled Time: " + scheduledTime +
      "\nTimezone: Asia/Kolkata";
  }

  return {
    // EXACT FIELD NAMES EXPECTED BY N8N
    "Branch": branchSelect.value,
    "Year": yearSelect.value,
    "Division": divisionSelect.value,
    "Notice Text": noticeText,

    // Additional information for downstream nodes
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

    "Timezone": "Asia/Kolkata",

    "Source": "Campus Autopilot Website",

    "Submitted At": new Date().toISOString()
  };
}

/* =========================================================
   12. SUBMIT NOTICE TO N8N
   ========================================================= */

async function publishNotice(event) {
  event.preventDefault();

  clearStatus();

  const validationMessage = validateForm();

  if (validationMessage) {
    setStatus(validationMessage, "error");
    return;
  }

  const originalButtonText = submitButton.innerHTML;

  submitButton.disabled = true;

  submitButton.innerHTML =
    "<span>Sending to Campus Autopilot...</span>";

  setStatus(
    "Submitting your announcement to the n8n workflow. Please wait.",
    "info"
  );

  try {
    const response = await fetch(getWebhookUrl(), {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(buildPayload())
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        `n8n returned HTTP ${response.status}` +
        (
          responseText
            ? `: ${responseText.slice(0, 250)}`
            : ""
        )
      );
    }

    let result = null;

    try {
      result = responseText
        ? JSON.parse(responseText)
        : null;
    } catch {
      // n8n may return plain text.
    }

    console.log("n8n webhook response:", result || responseText);

    setStatus(
      "Announcement submitted successfully to n8n. Check the n8n execution to confirm validation, faculty approval, email sending and calendar processing.",
      "success"
    );

  } catch (error) {
    console.error("Notice submission failed:", error);

    setStatus(
      "Could not submit the announcement. " +
      (error.message || "Check your internet connection and n8n webhook configuration.") +
      " If the browser reports a CORS error, configure Allowed Origins in the n8n Webhook node.",
      "error"
    );

  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
}

/* =========================================================
   13. RESET FORM
   ========================================================= */

function resetFormState() {
  clearStatus();

  updateAudienceUI();
  updateBranches();

  updatePreview();

  updateCounter(titleInput, "titleCount", 120);
  updateCounter(messageInput, "messageCount", 5000);
}

/* =========================================================
   14. INITIALIZE WEBSITE
   ========================================================= */

function initialize() {
  if (!form || !titleInput || !messageInput) {
    console.error(
      "Campus Autopilot: Required announcement form elements were not found."
    );

    return;
  }

  // Load saved webhook or use the production webhook.
  const savedWebhook =
    localStorage.getItem(STORAGE_KEYS.announcementWebhook);

  if (webhookInput) {
    webhookInput.value =
      savedWebhook || DEFAULT_WEBHOOK_URL;
  }

  // Recipient selection
  recipientInputs.forEach(input => {
    input.addEventListener("change", updateAudienceUI);
  });

  // Academic year, branch and division
  yearSelect.addEventListener("change", () => {
    updateBranches();
    updatePreview();
  });

  branchSelect.addEventListener("change", () => {
    updateDivisions();
    updatePreview();
  });

  divisionSelect.addEventListener(
    "change",
    updatePreview
  );

  // Title and message counters
  titleInput.addEventListener("input", () => {
    updateCounter(titleInput, "titleCount", 120);
    updatePreview();
  });

  messageInput.addEventListener("input", () => {
    updateCounter(messageInput, "messageCount", 5000);
    updatePreview();
  });

  // Schedule preview
  $("announcementDate")?.addEventListener(
    "change",
    updatePreview
  );

  $("announcementTime")?.addEventListener(
    "change",
    updatePreview
  );

  // Buttons
  $("saveWebhookButton")?.addEventListener(
    "click",
    saveWebhook
  );

  $("resetButton")?.addEventListener("click", () => {
    window.setTimeout(resetFormState, 0);
  });

  // Form submission
  form.addEventListener("submit", publishNotice);

  // Initial UI
  updateBranches();
  updateAudienceUI();

  updateCounter(titleInput, "titleCount", 120);
  updateCounter(messageInput, "messageCount", 5000);

  updatePreview();

  console.log(
    "Campus Autopilot announcement page initialized."
  );
}

document.addEventListener(
  "DOMContentLoaded",
  initialize
);
