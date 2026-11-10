Campus Autopilot

Intelligent Campus Communication & Notice Automation Platform

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/n8n-Automation-EA4B71?style=for-the-badge&logo=n8n&logoColor=white" />
  <img src="https://img.shields.io/badge/Google%20Sheets-34A853?style=for-the-badge&logo=googlesheets&logoColor=white" />
</p><p align="center">
  <strong>Streamlining institutional communication through intelligent automation.</strong>
</p><p align="center">
  A web-based campus notice management solution designed to simplify announcement creation, audience targeting, scheduling, and automated distribution using n8n workflows.
</p><p align="center">
  <a href="https://github.com/Atharva1118/campus-autopilot-ui">Repository</a> •
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#installation--setup">Installation</a>
</p>---

01. Overview

Campus Autopilot is a campus communication and notice management platform designed to make institutional announcements more organized, accessible, and efficient.

Traditional campus communication often involves manually preparing announcements and distributing them across multiple student groups. Campus Autopilot introduces a centralized interface that enables administrators to create notices, define their target audience, schedule publication, and initiate automated distribution through n8n workflows.

The platform combines a lightweight frontend with workflow automation to establish a structured communication process.

Problem Statement

- Manual notice distribution consumes administrative time.
- Reaching specific academic groups can be difficult.
- Repeated announcements create unnecessary administrative work.
- Scheduled communication requires additional coordination.
- Centralized notice management is often missing.

Proposed Solution

Campus Autopilot provides a unified notice creation interface with:

- Centralized announcement management.
- Academic audience segmentation.
- Immediate and scheduled publishing options.
- Automated webhook-based workflow execution.
- Configurable student data integration.

---

02. Key Features

Notice Management

- Create announcements with a custom title and detailed message.
- Live character counter.
- Real-time notice preview.
- Input validation before submission.

Intelligent Audience Targeting

Choose between two distribution modes:

Mode| Description
All Students| Targets all eligible students
Specific Classroom| Targets students using academic year, branch, and division

Academic Segmentation

The platform supports academic audience selection through dependent dropdowns.

- Academic Year
- Engineering Branch
- Division

The available divisions are dynamically mapped according to the configured academic structure.

Flexible Publishing

- Publish notices immediately.
- Schedule announcements for future publication.
- Validate scheduled date and time.
- Prepare structured publishing requests.

Workflow Automation

- n8n webhook integration.
- HTTP POST-based communication.
- Configurable webhook connection.
- Browser-side webhook configuration storage.
- Success and error feedback.

Student Data Integration

Google Sheets can be configured as a student data source through the n8n workflow for recipient identification and distribution.

---

03. Technology Stack

Technology| Implementation
HTML5| Semantic page structure
CSS3| Responsive user interface and styling
JavaScript| Application logic, validation, and interactions
n8n| Backend workflow automation
Google Sheets| Configurable student data source
Webhooks| Frontend-to-automation communication
JSON| Structured data exchange

Why This Technology Stack?

The application uses vanilla JavaScript to keep the frontend lightweight and easy to maintain. n8n provides a visual automation layer that allows distribution logic and external service integrations to be configured independently of the user interface.

---

04. System Architecture

Campus Autopilot follows a frontend-to-workflow architecture.

flowchart TD
    A["Administrator"] --> B["Campus Autopilot UI"]
    B --> C["Form Validation"]
    C --> D["Audience Selection"]
    D --> E["Publishing Configuration"]
    E --> F["HTTP POST Request"]
    F --> G["n8n Webhook"]
    G --> H["Workflow Execution"]
    H --> I["Google Sheets Integration"]
    I --> J["Recipient Identification"]
    J --> K["Configured Distribution Service"]
    K --> L["Student Notifications"]

Architecture Explanation

1. The administrator creates a notice through the web interface.
2. JavaScript validates the submitted information.
3. The application identifies the selected audience.
4. Publishing preferences are included in the request.
5. The frontend sends a JSON payload to the configured n8n webhook.
6. n8n processes the incoming request.
7. The workflow can retrieve relevant student information from Google Sheets.
8. Configured distribution nodes handle the notification process.

Note: Actual recipient lookup and notification delivery depend on the n8n workflow configuration.

---

05. Application Workflow

flowchart TD
    A["Start"] --> B["Create Notice"]
    B --> C["Enter Title and Message"]
    C --> D{"Select Audience"}
    D -->|All Students| E["Select Entire Student Audience"]
    D -->|Specific Classroom| F["Select Year, Branch and Division"]
    E --> G{"Publishing Mode"}
    F --> G
    G -->|Immediate| H["Publish Request"]
    G -->|Scheduled| I["Select Date and Time"]
    I --> J["Validate Schedule"]
    J --> H
    H --> K["Send Webhook Request"]
    K --> L["Execute n8n Workflow"]
    L --> M["Display Response"]

---

06. Project Structure

campus-autopilot-ui/
│
├── index.html       # Application structure
├── style.css        # UI design and responsive styling
├── script.js        # Application logic and webhook integration
│
└── README.md        # Project documentation

The project follows a simple frontend architecture with separate HTML, CSS, and JavaScript files.

---

07. Installation & Setup

Prerequisites

- Modern web browser
- Git
- n8n Cloud account or self-hosted n8n instance (for automation)

Step 1: Clone the Repository

git clone https://github.com/Atharva1118/campus-autopilot-ui.git

Step 2: Navigate to the Project

cd campus-autopilot-ui

Step 3: Launch the Application

Open "index.html" in your browser.

Alternatively, use the VS Code Live Server extension.

No frontend package installation or build process is required.

---

08. n8n Webhook Configuration

The application communicates with an n8n workflow through an HTTP webhook.

Configuration Steps

1. Open your n8n workspace.
2. Create or open the Campus Autopilot announcement workflow.
3. Add a Webhook node.
4. Configure the HTTP method as "POST".
5. Configure the expected request data.
6. Copy the production webhook URL.
7. Open Campus Autopilot in your browser.
8. Enter the webhook URL in the announcement configuration field.
9. Save the connection.
10. Activate the n8n workflow.

Integration Flow

Campus Autopilot
       |
       | HTTP POST
       v
   n8n Webhook
       |
       v
  Workflow Processing
       |
       v
 Student Data Lookup
       |
       v
 Notification Distribution

The actual workflow nodes and external notification services must be configured separately in n8n.

---

09. API & Data Communication

Campus Autopilot uses JSON to transfer announcement information to the n8n workflow.

HTTP Configuration

Parameter| Value
Method| POST
Content Type| application/json
Integration| n8n Webhook
Communication| HTTP Request

Sample Request Payload

{
  "title": "Important Academic Announcement",
  "message": "Students are informed about the upcoming academic activity.",
  "recipientType": "specific",
  "audience": "classroom",
  "academicYear": "Third Year",
  "branch": "CSE",
  "division": "A",
  "scheduledDate": "",
  "scheduledTime": "",
  "publishMode": "immediate",
  "source": "Campus Autopilot",
  "submittedAt": "2026-11-10T10:00:00.000Z"
}

This is an illustrative payload. Actual values depend on the administrator's selections.

Expected Processing

The n8n workflow can use the received fields to:

- Identify the intended student audience.
- Retrieve matching student records.
- Process immediate or scheduled publishing requests.
- Execute configured notification services.

---

10. Security & Reliability Considerations

Security and reliability are important for any application handling institutional communication.

Recommended deployment considerations:

- Restrict webhook access using appropriate authentication.
- Validate incoming data inside the n8n workflow.
- Avoid exposing API credentials in frontend JavaScript.
- Configure appropriate CORS policies.
- Protect student information and restrict access to authorized administrators.
- Use production webhook URLs for deployment.
- Maintain workflow execution logs.
- Distinguish successful webhook acceptance from confirmed notification delivery.

Important: The current frontend stores its configured webhook URL in browser local storage. This should not be treated as a secure credential store.

---

11. Current Implementation & Roadmap

Implemented

- [x] Notice creation interface
- [x] Live character counter
- [x] Notice preview
- [x] Audience selection
- [x] Academic year, branch and division selection
- [x] Immediate publishing option
- [x] Scheduled publishing option
- [x] Date and time validation
- [x] n8n webhook configuration
- [x] HTTP POST integration
- [x] Success and error feedback

Planned Enhancements

- [ ] Administrator authentication and role-based access
- [ ] Notice history and management dashboard
- [ ] Notification delivery tracking
- [ ] PDF and document attachments
- [ ] Email and mobile notification integrations
- [ ] Student-specific communication
- [ ] Advanced analytics and reporting
- [ ] Google Calendar integration
- [ ] Centralized backend and database
- [ ] Audit logs and administrative activity tracking

---

12. Future Vision

Campus Autopilot aims to evolve into a centralized campus communication ecosystem.

The long-term vision includes connecting announcements, academic notifications, student information, and institutional workflows through a unified automation platform.

The architecture is intended to support additional integrations and capabilities as the application develops.

---

13. Contribution

Contributions, suggestions, and improvements are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test the updated functionality.
5. Submit a pull request with a clear description.

---

14. Author

Atharva Ghorpade

B.Tech Computer Science & Engineering

GitHub: "@Atharva1118" (https://github.com/Atharva1118)

Project Repository: "Campus Autopilot" (https://github.com/Atharva1118/campus-autopilot-ui)

---

<p align="center">
  <strong>Campus Autopilot</strong>
  <br/>
  Automating Campus Communication. Simplifying Administration.
  <br/><br/>
  <sub>Designed and developed with a focus on automation, usability, and scalability.</sub>
</p>
