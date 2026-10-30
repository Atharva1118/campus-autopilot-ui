# Campus Autopilot – Notice Management Page

A modern, responsive web interface for creating and publishing college notices to students using n8n automation workflows.

## 1. Project Overview

Campus Autopilot simplifies campus communication by allowing administrators to create notices and distribute them to:
- All students in the college.
- Students belonging to a specific academic year, branch, and division.

The application uses HTML, CSS, and vanilla JavaScript for the frontend and n8n webhooks for backend automation.

## 2. Technologies Used

- **HTML5** – Page structure and notice form.
- **CSS3** – Responsive layout, styling, and visual effects.
- **JavaScript** – Form validation, dependent dropdowns, live preview, and webhook integration.
- **n8n** – Workflow automation and notice distribution.
- **Google Sheets** – Student data source (when configured in the n8n workflow).

## 3. Project Structure

```text
campus-autopilot/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## 4. Features

### Notice Creation
- Enter notice title.
- Write detailed notice content.
- Live character counter.
- Live notice preview.

### Recipient Selection
Two recipient options are available:

**All Students**
- Distributes the notice to all eligible students.

**Specific Classroom**
- Select academic year.
- Select branch.
- Select division.

### Academic Year and Division Mapping

**First Year (FY)**

| Branch | Division |
|---|---|
| CSE | A, B, C |
| CSE-DS | D |
| CSE-AIML | E, F |
| ENTC | G |
| Chemical | H |
| Civil | I |
| Mechanical | J |

**Second, Third and Final Year**

- CSE: A, B, C
- CSE-DS: A, B
- CSE-AIML: A, B
- ENTC: A, B
- Chemical: A, B
- Civil: A, B
- Mechanical: A, B

### Publishing Schedule
- Publish notices immediately.
- Schedule notices for a future date and time.
- Validate scheduled date and time.

### n8n Webhook Integration
- Configure the announcement webhook URL.
- Save the URL in browser local storage.
- Submit notice data using an HTTP POST request.
- Display success and error messages.

## 5. Installation and Setup

1. Download or clone the project.
2. Extract the project files.
3. Keep `index.html`, `style.css`, and `script.js` in the same folder.
4. Open `index.html` in a web browser.

No frontend framework or package installation is required.

## 6. Configure the n8n Webhook

1. Open your n8n Cloud workspace.
2. Open the Campus Autopilot announcement workflow.
3. Configure the Webhook node to accept POST requests.
4. Copy the production webhook URL.
5. Open the Campus Autopilot webpage.
6. Paste the URL into the **Announcement Webhook URL** field.
7. Click **Save connection**.

Make sure the n8n workflow is active and its webhook is configured correctly.

## 7. Notice Submission Process

1. Administrator enters the notice title.
2. Administrator writes the notice message.
3. Administrator selects the recipient type.
4. If a specific classroom is selected, the administrator selects year, branch, and division.
5. Administrator chooses immediate publishing or scheduling.
6. JavaScript validates the entered information.
7. The application sends the notice payload to the n8n webhook.
8. n8n executes the configured automation workflow.
9. The administrator can inspect the execution in n8n.

**Note:** A successful HTTP response confirms that the webhook accepted the request. It does not independently confirm that every email or notification was delivered.

## 8. Data Sent to n8n

The frontend sends a JSON payload containing:

- `title`
- `message`
- `recipientType`
- `audience`
- `academicYear`
- `branch`
- `division`
- `scheduledDate`
- `scheduledTime`
- `publishMode`
- `source`
- `submittedAt`

The n8n workflow should use these fields to identify recipients and execute the required notification process.

## 9. Important Notes

- The webhook URL is stored in the browser's local storage.
- Do not use an inactive or test-only webhook URL for production.
- Configure appropriate CORS settings if the frontend and webhook are hosted on different origins.
- Do not expose sensitive credentials in frontend JavaScript.
- Verify actual notification delivery through the n8n execution logs.
- Student data lookup and notification delivery must be configured in the n8n workflow.

## 10. Future Enhancements

- Notice history and delivery reports.
- Administrator authentication.
- File and PDF attachment support.
- Student-specific notification delivery.
- Email and mobile notifications.
- Google Calendar integration for campus events.
- Automated delivery status tracking.

## 11. Author

**Project Name:** Campus Autopilot  
**Project Type:** College Automation Project  
**Frontend:** HTML, CSS, JavaScript  
**Automation Platform:** n8n

---

*Campus Autopilot – Making campus communication smarter, simpler, and more efficient.*
