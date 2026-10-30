
"use strict";

/* =========================================================
   CAMPUS AUTOPILOT
   Announcement Management
   HTML + CSS + Vanilla JavaScript + n8n Webhooks
========================================================= */

/* =========================================================
   1. CONFIGURATION
========================================================= */

const STORAGE_KEYS = {
    announcementWebhook: "campus_autopilot_announcement_webhook"
};

const DEFAULT_ANNOUNCEMENT_WEBHOOK =
    "https://campus-autopilot.app.n8n.cloud/webhook/c494a389-57d5-4e97-84c1-dc37fdbca64e";

const SEND_MODE = "production";
const TIMEZONE = "Asia/Kolkata";

/* =========================================================
   2. YEAR MAPPING
========================================================= */

const YEAR_MAP = {
    "FY": 1,
    "SY": 2,
    "TY": 3,
    "Final Year": 4
};

/* =========================================================
   3. BRANCH MAPPING
========================================================= */

const BRANCHES = [
    "CSE",
    "CSE-DS",
    "CSE-AIML",
    "ENTC",
    "Chemical",
    "Civil",
    "Mechanical"
];

/* =========================================================
   4. DIVISION MAPPING
========================================================= */

const DIVISION_MAP = {

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
        "ENTC": ["A", "B"],
        "Chemical": ["A", "B"],
        "Civil": ["A", "B"],
        "Mechanical": ["A", "B"]
    },

    "TY": {
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
   5. DOM ELEMENTS
========================================================= */

const form = document.getElementById("announcementForm");

const titleInput =
    document.getElementById("announcementTitle");

const messageInput =
    document.getElementById("announcementMessage");

const academicYear =
    document.getElementById("academicYear");

const branchSelect =
    document.getElementById("branch");

const divisionSelect =
    document.getElementById("division");

const classroomFields =
    document.getElementById("classroomFields");

const announcementDate =
    document.getElementById("announcementDate");

const announcementTime =
    document.getElementById("announcementTime");

const submitButton =
    document.getElementById("submitButton");

const announcementStatus =
    document.getElementById("announcementStatus");

const announcementWebhook =
    document.getElementById("announcementWebhook");

const saveWebhookButton =
    document.getElementById("saveWebhookButton");

const webhookStatus =
    document.getElementById("webhookStatus");

let isSubmitting = false;

/* =========================================================
   6. WEBHOOK CONFIGURATION
========================================================= */

function getAnnouncementWebhook() {

    const savedWebhook = localStorage.getItem(
        STORAGE_KEYS.announcementWebhook
    );

    return savedWebhook || DEFAULT_ANNOUNCEMENT_WEBHOOK;

}

function saveAnnouncementWebhook() {

    const url = announcementWebhook.value.trim();

    if (!url) {
        showWebhookStatus("Please enter a webhook URL.", false);
        return;
    }

    try {

        const parsedURL = new URL(url);

        if (parsedURL.protocol !== "https:") {
            showWebhookStatus("Webhook must use HTTPS.", false);
            return;
        }

        if (!parsedURL.pathname.includes("/webhook/")) {
            showWebhookStatus(
                "Use the production webhook URL, not the test URL.",
                false
            );
            return;
        }

        localStorage.setItem(
            STORAGE_KEYS.announcementWebhook,
            url
        );

        showWebhookStatus(
            "Webhook connection saved successfully.",
            true
        );

    } catch (error) {

        showWebhookStatus(
            "Please enter a valid webhook URL.",
            false
        );

    }

}

function showWebhookStatus(message, success) {

    if (!webhookStatus) return;

    webhookStatus.textContent = message;

    webhookStatus.style.color =
        success ? "#16a36a" : "#dc4545";

}

if (announcementWebhook) {

    announcementWebhook.value =
        getAnnouncementWebhook();

}

if (saveWebhookButton) {

    saveWebhookButton.addEventListener(
        "click",
        saveAnnouncementWebhook
    );

}

/* =========================================================
   7. POPULATE BRANCHES
========================================================= */

function populateBranches() {

    if (!branchSelect) return;

    branchSelect.innerHTML =
        '<option value="">Select branch</option>';

    BRANCHES.forEach(branch => {

        const option = document.createElement("option");

        option.value = branch;
        option.textContent = branch;

        branchSelect.appendChild(option);

    });

    branchSelect.disabled = false;

}

/* =========================================================
   8. UPDATE DIVISIONS
========================================================= */

function updateDivisions() {

    if (!divisionSelect) return;

    const year = academicYear.value;
    const branch = branchSelect.value;

    divisionSelect.innerHTML =
        '<option value="">Select division</option>';

    divisionSelect.disabled = true;

    const divisions =
        DIVISION_MAP[year]?.[branch] || [];

    if (!year || !branch || divisions.length === 0) {

        updateDivisionHelp(
            "Choose year and branch first."
        );

        return;

    }

    divisions.forEach(division => {

        const option = document.createElement("option");

        option.value = division;
        option.textContent = division;

        divisionSelect.appendChild(option);

    });

    divisionSelect.disabled = false;

    updateDivisionHelp(
        "Available divisions: " + divisions.join(", ")
    );

}

function updateDivisionHelp(message) {

    const help =
        document.getElementById("divisionHelp");

    if (help) {
        help.textContent = message;
    }

}

/* =========================================================
   9. YEAR AND BRANCH EVENTS
========================================================= */

if (academicYear) {

    academicYear.addEventListener("change", function () {

        updateDivisions();
        updatePreviewAudience();

    });

}

if (branchSelect) {

    branchSelect.addEventListener("change", function () {

        updateDivisions();
        updatePreviewAudience();

    });

}

if (divisionSelect) {

    divisionSelect.addEventListener(
        "change",
        updatePreviewAudience
    );

}

/* =========================================================
   10. AUDIENCE SELECTION
========================================================= */

function getRecipientType() {

    const selected = document.querySelector(
        'input[name="recipientType"]:checked'
    );

    return selected ? selected.value : "all";

}

function updateAudienceUI() {

    const recipientType = getRecipientType();

    const allStudentsCard =
        document.getElementById("allStudentsCard");

    const classroomCard =
        document.getElementById("classroomCard");

    if (allStudentsCard) {

        allStudentsCard.classList.toggle(
            "selected",
            recipientType === "all"
        );

    }

    if (classroomCard) {

        classroomCard.classList.toggle(
            "selected",
            recipientType === "classroom"
        );

    }

    if (classroomFields) {

        classroomFields.hidden =
            recipientType !== "classroom";

    }

    if (recipientType === "classroom") {

        if (branchSelect.options.length <= 1) {
            populateBranches();
        }

        updateDivisions();

    }

    updatePreviewAudience();

}

document.querySelectorAll(
    'input[name="recipientType"]'
).forEach(radio => {

    radio.addEventListener(
        "change",
        updateAudienceUI
    );

});

/* =========================================================
   11. CHARACTER COUNTERS
========================================================= */

function updateCounter(inputId, counterId, maxLength) {

    const input =
        document.getElementById(inputId);

    const counter =
        document.getElementById(counterId);

    if (!input || !counter) return;

    function update() {

        counter.textContent =
            `${input.value.length} / ${maxLength}`;

    }

    input.addEventListener("input", update);

    update();

}

updateCounter(
    "announcementTitle",
    "titleCount",
    120
);

updateCounter(
    "announcementMessage",
    "messageCount",
    5000
);

/* =========================================================
   12. LIVE PREVIEW
========================================================= */

function updatePreview() {

    const previewTitle =
        document.getElementById("previewTitle");

    const previewMessage =
        document.getElementById("previewMessage");

    if (previewTitle) {

        previewTitle.textContent =
            titleInput.value.trim() ||
            "Your notice title appears here";

    }

    if (previewMessage) {

        previewMessage.textContent =
            messageInput.value.trim() ||
            "Your notice message will appear here. Add the details students need to know.";

    }

    updatePreviewAudience();

}

function updatePreviewAudience() {

    const previewAudience =
        document.getElementById("previewAudience");

    if (!previewAudience) return;

    const recipientType = getRecipientType();

    if (recipientType === "all") {

        previewAudience.textContent = "All Students";

    } else {

        const year =
            academicYear.value || "Year";

        const branch =
            branchSelect.value || "Branch";

        const division =
            divisionSelect.value || "Division";

        previewAudience.textContent =
            `${year} · ${branch} · ${division}`;

    }

}

titleInput.addEventListener("input", updatePreview);

messageInput.addEventListener("input", updatePreview);

/* =========================================================
   13. PREVIEW DATE
========================================================= */

function updatePreviewDate() {

    const previewDate =
        document.getElementById("previewDate");

    if (!previewDate) return;

    previewDate.textContent =
        new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

}

updatePreviewDate();

/* =========================================================
   14. STATUS MESSAGE
========================================================= */

function showAnnouncementStatus(message, success = false) {

    if (!announcementStatus) return;

    announcementStatus.hidden = false;

    announcementStatus.textContent = message;

    announcementStatus.classList.remove(
        "success",
        "error"
    );

    announcementStatus.classList.add(
        success ? "success" : "error"
    );

}

/* =========================================================
   15. VALIDATION
========================================================= */

function validateAnnouncement() {

    const errors = [];

    const title = titleInput.value.trim();
    const message = messageInput.value.trim();

    if (!title) {
        errors.push("Notice title is required.");
    }

    if (!message) {
        errors.push("Notice message is required.");
    }

    const recipientType = getRecipientType();

    if (recipientType === "classroom") {

        const year = academicYear.value;
        const branch = branchSelect.value;
        const division = divisionSelect.value;

        if (!Object.prototype.hasOwnProperty.call(YEAR_MAP, year)) {

            errors.push("Please select a valid academic year.");

        }

        if (!branch) {

            errors.push("Please select a branch.");

        }

        const allowedDivisions =
            DIVISION_MAP[year]?.[branch] || [];

        if (!allowedDivisions.includes(division)) {

            errors.push(
                "Invalid division for selected year and branch."
            );

        }

    }

    const date = announcementDate.value;
    const time = announcementTime.value;

    if ((date && !time) || (!date && time)) {

        errors.push(
            "Select both schedule date and schedule time."
        );

    }

    if (date && time) {

        const scheduledDateTime =
            new Date(`${date}T${time}:00`);

        if (Number.isNaN(scheduledDateTime.getTime())) {

            errors.push("Invalid schedule date or time.");

        } else if (scheduledDateTime <= new Date()) {

            errors.push(
                "Scheduled time must be in the future."
            );

        }

    }

    return errors;

}

/* =========================================================
   16. BUILD PAYLOAD
========================================================= */

function buildAnnouncementPayload() {

    const title = titleInput.value.trim();
    const message = messageInput.value.trim();

    const recipientType = getRecipientType();

    const year =
        recipientType === "classroom"
            ? academicYear.value
            : "";

    /*
       IMPORTANT:
       The dropdown uses FY/SY/TY/Final Year.
       The mapping below converts TY into numeric 3.
    */

    const yearNumber =
        year ? YEAR_MAP[year] : null;

    const branch =
        recipientType === "classroom"
            ? branchSelect.value
            : "";

    const division =
        recipientType === "classroom"
            ? divisionSelect.value
            : "";

    const scheduledDate =
        announcementDate.value;

    const scheduledTime =
        announcementTime.value;

    const publishMode =
        scheduledDate && scheduledTime
            ? "scheduled"
            : "immediate";

    return {

        "Title": title,

        "Message": message,

        "Notice Text":
            `Title: ${title}\n\n${message}`,

        "Recipient Type": recipientType,

        "Audience":
            recipientType === "all"
                ? "All Students"
                : "Specific Classroom",

        "Year": year,

        "Year Number": yearNumber,

        "Branch": branch,

        "Division": division,

        "Publish Mode": publishMode,

        "Scheduled Date": scheduledDate,

        "Scheduled Time": scheduledTime,

        "Send Mode": SEND_MODE,

        "Timezone": TIMEZONE,

        "Source": "Campus Autopilot Website",

        "Submitted At": new Date().toISOString()

    };

}

/* =========================================================
   17. SUBMIT ANNOUNCEMENT
========================================================= */

async function submitAnnouncement(event) {

    event.preventDefault();

    if (isSubmitting) return;

    const errors = validateAnnouncement();

    if (errors.length > 0) {

        showAnnouncementStatus(
            errors.join(" "),
            false
        );

        return;

    }

    const payload =
        buildAnnouncementPayload();

    const webhookURL =
        getAnnouncementWebhook();

    console.log(
        "Announcement Payload:",
        payload
    );

    console.log(
        "Selected Year:",
        payload.Year
    );

    console.log(
        "Selected Year Number:",
        payload["Year Number"]
    );

    console.log(
        "Production Send Mode:",
        payload["Send Mode"]
    );

    isSubmitting = true;

    submitButton.disabled = true;

    submitButton.innerHTML =
        "<span>Submitting...</span>";

    showAnnouncementStatus(
        "Submitting announcement...",
        true
    );

    try {

        const response = await fetch(webhookURL, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=UTF-8"
            },

            body: JSON.stringify(payload)

        });

        const responseText =
            await response.text();

        console.log(
            "n8n HTTP Status:",
            response.status
        );

        console.log(
            "n8n Response:",
            responseText
        );

        if (!response.ok) {

            throw new Error(
                `n8n returned HTTP ${response.status}: ${responseText}`
            );

        }

        showAnnouncementStatus(
            "Announcement accepted by n8n. Check the workflow execution and Gmail node to verify actual student email delivery.",
            true
        );

    } catch (error) {

        console.error(
            "Announcement submission error:",
            error
        );

        showAnnouncementStatus(
            "Could not submit the announcement. Browser could not receive a response from n8n. Check the production webhook execution and CORS response headers.",
            false
        );

    } finally {

        isSubmitting = false;

        submitButton.disabled = false;

        submitButton.innerHTML =
            '<span>Publish notice</span><span class="button-arrow">↗</span>';

    }

}

if (form) {

    form.addEventListener(
        "submit",
        submitAnnouncement
    );

}

/* =========================================================
   18. RESET FORM
========================================================= */

if (form) {

    form.addEventListener("reset", function () {

        setTimeout(function () {

            updateAudienceUI();

            updatePreview();

            updateCounter(
                "announcementTitle",
                "titleCount",
                120
            );

            updateCounter(
                "announcementMessage",
                "messageCount",
                5000
            );

            if (announcementStatus) {

                announcementStatus.hidden = true;
                announcementStatus.textContent = "";

            }

        }, 0);

    });

}

/* =========================================================
   19. INITIALIZE APPLICATION
========================================================= */

function initializeCampusAutopilot() {

    updateAudienceUI();

    updatePreview();

    updatePreviewDate();

    if (announcementWebhook) {

        announcementWebhook.value =
            getAnnouncementWebhook();

    }

}

initializeCampusAutopilot();
