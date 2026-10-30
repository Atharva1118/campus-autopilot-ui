/* CAMPUS AUTOPILOT — NOTICE PAGE LOGIC */
"use strict";

const STORAGE_KEYS = {
  announcementWebhook: "campus_autopilot_announcement_webhook"
};

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

const $ = (id) => document.getElementById(id);

const form = $("announcementForm");
const titleInput = $("announcementTitle");
const messageInput = $("announcementMessage");
const recipientInputs = document.querySelectorAll('input[name="recipientType"]');
const classroomFields = $("classroomFields");
const yearSelect = $("academicYear");
const branchSelect = $("branch");
const divisionSelect = $("division");
const webhookInput = $("announcementWebhook");
const submitButton = $("submitButton");
const statusBox = $("announcementStatus");

function setStatus(message, type = "info") {
  statusBox.textContent = message;
  statusBox.className = `form-status ${type}`;
  statusBox.hidden = false;
}

function clearStatus() {
  statusBox.textContent = "";
  statusBox.hidden = true;
  statusBox.className = "form-status";
}

function populateSelect(select, placeholder, values) {
  select.innerHTML = "";
  const first = document.createElement("option");
  first.value = "";
  first.textContent = placeholder;
  select.appendChild(first);

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function getRecipientType() {
  return document.querySelector('input[name="recipientType"]:checked')?.value || "all";
}

function updateAudienceUI() {
  const type = getRecipientType();
  classroomFields.hidden = type !== "classroom";
  $("allStudentsCard").classList.toggle("selected", type === "all");
  $("classroomCard").classList.toggle("selected", type === "classroom");
  updatePreview();
}

function updateBranches() {
  const year = yearSelect.value;
  const branches = year && DIVISION_MAPPING[year] ? Object.keys(DIVISION_MAPPING[year]) : [];
  populateSelect(branchSelect, branches.length ? "Select branch" : "Select year first", branches);
  branchSelect.disabled = branches.length === 0;
  populateSelect(divisionSelect, "Select division", []);
  divisionSelect.disabled = true;
  $("divisionHelp").textContent = "Choose year and branch first.";
}

function updateDivisions() {
  const year = yearSelect.value;
  const branch = branchSelect.value;
  const divisions = DIVISION_MAPPING[year]?.[branch] || [];
  populateSelect(divisionSelect, divisions.length ? "Select division" : "Select branch first", divisions);
  divisionSelect.disabled = divisions.length === 0;
  $("divisionHelp").textContent = divisions.length
    ? `Available divisions: ${divisions.join(", ")}`
    : "Choose year and branch first.";
}

function updateCounter(input, counter, max) {
  $(counter).textContent = `${input.value.length} / ${max}`;
}

function updatePreview() {
  const title = titleInput.value.trim();
  const message = messageInput.value.trim();
  $("previewTitle").textContent = title || "Your notice title appears here";
  $("previewMessage").textContent = message || "Your notice message will appear here. Add the details students need to know.";

  let audience = "All Students";
  if (getRecipientType() === "classroom") {
    const year = yearSelect.value;
    const branch = branchSelect.value;
    const division = divisionSelect.value;
    audience = [year, branch, division].filter(Boolean).join(" · ") || "Specific Classroom";
  }
  $("previewAudience").textContent = audience;

  const dateValue = $("announcementDate").value;
  if (dateValue) {
    const parsed = new Date(`${dateValue}T00:00:00`);
    $("previewDate").textContent = parsed.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  } else {
    $("previewDate").textContent = "Today";
  }
}

function getWebhookUrl() {
  return (webhookInput.value || "").trim();
}

function validateForm() {
  const title = titleInput.value.trim();
  const message = messageInput.value.trim();
  const recipientType = getRecipientType();
  const date = $("announcementDate").value;
  const time = $("announcementTime").value;

  if (!title) return "Please enter a notice title.";
  if (!message) return "Please enter the notice message.";
  if (recipientType === "classroom") {
    if (!yearSelect.value) return "Please select an academic year.";
    if (!branchSelect.value) return "Please select a branch.";
    if (!divisionSelect.value) return "Please select a division.";
  }
  if ((date && !time) || (!date && time)) return "To schedule a notice, select both date and time.";
  if (date && time) {
    const scheduled = new Date(`${date}T${time}`);
    if (Number.isNaN(scheduled.getTime())) return "Please enter a valid schedule date and time.";
    if (scheduled.getTime() < Date.now() - 60000) return "The scheduled date and time must be in the future.";
  }
  if (!getWebhookUrl()) return "Add and save your n8n announcement webhook URL before publishing.";
  try {
    const url = new URL(getWebhookUrl());
    if (!["http:", "https:"].includes(url.protocol)) return "Webhook URL must start with http:// or https://.";
  } catch {
    return "Please enter a valid webhook URL.";
  }
  return "";
}

function buildPayload() {
  const recipientType = getRecipientType();
  const scheduledDate = $("announcementDate").value;
  const scheduledTime = $("announcementTime").value;

  return {
    title: titleInput.value.trim(),
    message: messageInput.value.trim(),
    recipientType,
    audience: recipientType === "all" ? "All Students" : "Specific Classroom",
    academicYear: recipientType === "classroom" ? yearSelect.value : "",
    branch: recipientType === "classroom" ? branchSelect.value : "",
    division: recipientType === "classroom" ? divisionSelect.value : "",
    scheduledDate,
    scheduledTime,
    publishMode: scheduledDate && scheduledTime ? "scheduled" : "immediate",
    source: "Campus Autopilot",
    submittedAt: new Date().toISOString()
  };
}

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
  submitButton.innerHTML = "<span>Sending to workflow...</span>";
  setStatus("Submitting your notice to the n8n workflow. Please wait.", "info");

  try {
    const response = await fetch(getWebhookUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload())
    });

    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(`Webhook returned HTTP ${response.status}${responseText ? `: ${responseText.slice(0, 250)}` : ""}`);
    }

    setStatus("Your notice was accepted by the n8n webhook. Check your n8n execution to confirm that the email/notification delivery steps completed successfully.", "success");
  } catch (error) {
    console.error("Notice submission failed:", error);
    setStatus(`Could not submit the notice. ${error.message || "Check your webhook URL, network, and n8n workflow."} If this is a CORS error, configure the webhook/server to allow requests from this website.`, "error");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
}

function saveWebhook() {
  const value = getWebhookUrl();
  if (!value) {
    $("webhookStatus").textContent = "Enter your webhook URL first.";
    $("webhookStatus").style.color = "#ffabb4";
    return;
  }
  try {
    const parsed = new URL(value);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Invalid protocol");
    localStorage.setItem(STORAGE_KEYS.announcementWebhook, value);
    $("webhookStatus").textContent = "Connection URL saved in this browser.";
    $("webhookStatus").style.color = "#9be8c1";
  } catch {
    $("webhookStatus").textContent = "Enter a valid http:// or https:// URL.";
    $("webhookStatus").style.color = "#ffabb4";
  }
}

function resetFormState() {
  clearStatus();
  updateAudienceUI();
  updateBranches();
  updatePreview();
  updateCounter(titleInput, "titleCount", 120);
  updateCounter(messageInput, "messageCount", 5000);
}

function initialize() {
  const savedWebhook = localStorage.getItem(STORAGE_KEYS.announcementWebhook);
  if (savedWebhook) webhookInput.value = savedWebhook;

  recipientInputs.forEach((input) => input.addEventListener("change", updateAudienceUI));
  yearSelect.addEventListener("change", () => { updateBranches(); updatePreview(); });
  branchSelect.addEventListener("change", () => { updateDivisions(); updatePreview(); });
  divisionSelect.addEventListener("change", updatePreview);

  titleInput.addEventListener("input", () => {
    updateCounter(titleInput, "titleCount", 120);
    updatePreview();
  });
  messageInput.addEventListener("input", () => {
    updateCounter(messageInput, "messageCount", 5000);
    updatePreview();
  });
  $("announcementDate").addEventListener("change", updatePreview);
  $("announcementTime").addEventListener("change", updatePreview);

  $("saveWebhookButton").addEventListener("click", saveWebhook);
  $("resetButton").addEventListener("click", () => {
    window.setTimeout(resetFormState, 0);
  });
  form.addEventListener("submit", publishNotice);

  updateBranches();
  updateAudienceUI();
  updateCounter(titleInput, "titleCount", 120);
  updateCounter(messageInput, "messageCount", 5000);
  updatePreview();
}

document.addEventListener("DOMContentLoaded", initialize);
