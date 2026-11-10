Campus Autopilot

Intelligent Campus Communication & Automation Platform

<p align="center">
  <img src="https://img.shields.io/badge/Project-Campus%20Autopilot-2563EB?style=for-the-badge" alt="Project"/>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/n8n-Automation-EA4B71?style=for-the-badge&logo=n8n&logoColor=white" alt="n8n"/>
</p><p align="center">
  <strong>Automating Campus Communication. Simplifying Administration.</strong>
</p><p align="center">
  A centralized campus announcement interface that connects notice management with workflow automation to make institutional communication more structured, targeted, and efficient.
</p><p align="center">
  <a href="https://github.com/Atharva1118/campus-autopilot-ui">Explore Repository</a> •
  <a href="#-features">Features</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-installation-and-setup">Installation</a>
</p>---

01. Project Overview

Campus Autopilot is a web-based campus communication platform designed to simplify how educational institutions create, manage, and distribute announcements.

In traditional academic environments, notices are often communicated through multiple disconnected channels. This can lead to repeated manual work, delayed announcements, and difficulties in reaching specific student groups.

Campus Autopilot addresses this challenge through a centralized notice creation interface integrated with n8n workflow automation.

Administrators can prepare announcements, select their intended audience, configure publication preferences, and initiate automated processing through webhooks.

The Core Idea

Transform traditional manual campus communication into a structured and automation-driven process.

Project Objectives

- Centralize campus announcement creation.
- Reduce repetitive administrative communication.
- Enable academic audience segmentation.
- Support immediate and scheduled publishing.
- Connect frontend operations with automation workflows.
- Provide a foundation for scalable campus communication.

---

02. The Problem We Are Solving

Educational institutions regularly communicate academic updates, event announcements, examination schedules, placement information, and important notices.

However, conventional communication methods introduce several challenges:

Challenge| Impact
Manual notice distribution| Repetitive administrative work
Multiple communication channels| Fragmented information
No audience segmentation| Irrelevant announcements
Manual scheduling| Additional coordination
Lack of centralized management| Difficult notice tracking

Our Approach

Campus Autopilot introduces a centralized interface with configurable audience targeting and workflow automation.

Instead of manually coordinating every announcement, administrators can initiate a structured publishing workflow from one place.

---

03. Features

Notice Creation and Management

- Create announcements with custom titles and descriptions.
- Live character counting.
- Real-time notice preview.
- Input validation before submission.
- Structured announcement information.

Audience Targeting

Select the intended recipients according to the announcement requirements.

All Students

- Target the entire configured student audience.

Specific Classroom

- Select academic year.
- Select engineering branch.
- Select division.
- Prepare targeted announcement requests.

Flexible Publishing

- Immediate publishing option.
- Scheduled publishing option.
- Date and time selection.
- Schedule validation.
- Structured publishing requests.

Workflow Automation

- n8n webhook integration.
- HTTP POST communication.
- JSON-based data exchange.
- Configurable webhook URL.
- Request processing and response feedback.

Student Data Integration

Google Sheets can be integrated through n8n to retrieve student information and identify recipients according to the configured audience criteria.

---

04. Technology Stack

Technology| Role
HTML5| Frontend structure
CSS3| Styling and responsive interface
JavaScript| Application logic and validation
n8n| Workflow automation
Google Sheets| Student data integration
Webhooks| Application-to-workflow communication
JSON| Structured data exchange
Git & GitHub| Version control and project management

Technology Decisions

Vanilla JavaScript

Keeps the frontend lightweight without requiring a large framework or complex build configuration.

n8n

Provides a visual workflow automation environment for connecting external services and processing announcement requests.

Google Sheets

Provides a configurable data source for student information through automation workflows.

---

05. System Architecture

Campus Autopilot follows a frontend-to-workflow integration architecture.

High-Level Architecture

flowchart TD
    A["Administrator"] --> B["Campus Autopilot Interface"]
    B --> C["Input Validation"]
    C --> D["Audience Configuration"]
    D --> E["Publishing Configuration"]
    E --> F["JSON Request"]
    F --> G["HTTP POST"]
    G --> H["n8n Webhook"]
    H --> I["Workflow Processing"]
    I --> J["Google Sheets Integration"]
    J --> K["Recipient Identification"]
    K --> L["Configured Notification Service"]
    L --> M["Students"]

Architecture Components

Component| Responsibility
Administrator| Creates and configures announcements
Frontend| Collects and validates information
Audience Configuration| Defines intended recipients
Webhook| Transfers structured data
n8n| Executes configured automation
Google Sheets| Provides student records
Notification Service| Handles configured distribution

Data Flow

1. Administrator creates an announcement.
2. Frontend validates the submitted information.
3. Audience preferences are configured.
4. Publishing details are prepared.
5. The application sends a JSON request.
6. n8n receives the request through a webhook.
7. The workflow processes the announcement.
8. Student records can be retrieved from Google Sheets.
9. Configured notification integrations handle distribution.

The actual recipient identification and notification delivery depend on the deployed n8n workflow.

---

06. Application Workflow

The application follows a structured publishing process.

flowchart TD
    A(["Start"]) --> B["Create Announcement"]
    B --> C["Enter Notice Details"]
    C --> D{"Select Audience"}
    D -->|All Students| E["Select All Students"]
    D -->|Specific Classroom| F["Select Year, Branch and Division"]
    E --> G{"Publishing Preference"}
    F --> G
    G -->|Immediate| H["Prepare Publishing Request"]
    G -->|Scheduled| I["Choose Date and Time"]
    I --> J["Validate Schedule"]
    J --> H
    H --> K["Send HTTP Request"]
    K --> L["n8n Webhook"]
    L --> M["Workflow Execution"]
    M --> N["Return Response"]
    N --> O(["End"])

---

07. Project Structure

campus-autopilot-ui/
│
├── index.html
│   └── Main application interface
│
├── style.css
│   └── UI styling and responsive design
│
├── script.js
│   └── Application logic and webhook integration
│
└── README.md
    └── Project documentation

The frontend is organized into separate HTML, CSS, and JavaScript files to maintain a clear separation of structure, presentation, and application logic.

---

08. Installation and Setup

Prerequisites

Before running the application, ensure that you have:

- Git installed.
- A modern web browser.
- Visual Studio Code (recommended).
- An n8n Cloud or self-hosted instance for workflow integration.

Step 1: Clone the Repository

git clone https://github.com/Atharva1118/campus-autopilot-ui.git

Step 2: Open the Project

cd campus-autopilot-ui

Step 3: Open in Visual Studio Code

code .

Step 4: Run the Application

Open "index.html" directly in a browser.

Alternatively, install the Live Server extension in VS Code and select:

"Open with Live Server"

No frontend dependency installation or build command is required for the current vanilla JavaScript implementation.

---

09. n8n Workflow Integration

Campus Autopilot uses webhook-based communication to connect the frontend with an n8n automation workflow.

Integration Configuration

1. Open your n8n workspace.
2. Create a new workflow.
3. Add a Webhook node.
4. Set the HTTP method to "POST".
5. Configure the expected request data.
6. Copy the production webhook URL.
7. Open Campus Autopilot.
8. Configure the webhook URL in the application.
9. Activate the n8n workflow.
10. Test the integration using an announcement request.

Workflow Overview

flowchart TD
    A["Campus Autopilot"] --> B["HTTP POST Request"]
    B --> C["n8n Webhook"]
    C --> D["Validate Request"]
    D --> E["Process Announcement"]
    E --> F["Google Sheets Lookup"]
    F --> G["Identify Recipients"]
    G --> H["Notification Integration"]
    H --> I["Workflow Result"]

The workflow can be extended with additional n8n nodes to support email, messaging, and other external notification services.

---

10. API Communication

The application uses HTTP POST requests to transfer announcement information to the configured n8n webhook.

Request Configuration

Parameter| Value
HTTP Method| POST
Content Type| application/json
Integration| n8n Webhook
Data Format| JSON

Example JSON Payload

{
  "title": "Important Academic Announcement",
  "message": "Students are informed about the upcoming academic activity.",
  "recipientType": "specific",
  "audience": "classroom",
  "academicYear": "Third Year",
  "branch": "CSE",
  "division": "A",
  "publishMode": "immediate",
  "scheduledDate": "",
  "scheduledTime": "",
  "source": "Campus Autopilot"
}

This is an illustrative example. The actual payload structure should match the fields generated by the current frontend implementation.

Request Processing

The n8n workflow can use the received data to:

- Validate announcement details.
- Determine the target audience.
- Retrieve matching student information.
- Execute configured notification workflows.
- Return an execution response.

---

11. Security and Reliability

Campus communication systems may handle institutional and student information. Security must therefore be considered throughout the development process.

Recommended Security Practices

- Validate incoming webhook requests.
- Implement authentication for administrative access.
- Avoid exposing private API credentials in frontend code.
- Restrict access to student information.
- Configure appropriate CORS policies.
- Protect webhook endpoints against unauthorized requests.
- Maintain execution logs for troubleshooting.
- Validate notification delivery independently of webhook acceptance.

Security note: A webhook URL stored in browser local storage is not a secure secret. Production deployments should use an authenticated backend or another suitable access-control mechanism.

---

12. Implementation Status

The following roadmap distinguishes the current frontend capabilities from future development.

Current Frontend Capabilities

- [x] Notice creation interface
- [x] Notice title and message fields
- [x] Live character counter
- [x] Notice preview
- [x] Audience selection
- [x] Academic year selection
- [x] Branch and division selection
- [x] Immediate publishing option
- [x] Scheduled publishing interface
- [x] Date and time validation
- [x] Webhook configuration
- [x] HTTP request integration

Future Enhancements

- [ ] Secure administrator authentication
- [ ] Role-based access management
- [ ] Centralized backend and database
- [ ] Notice history and editing
- [ ] Notification delivery tracking
- [ ] Email notification integration
- [ ] Mobile notification integration
- [ ] Document and PDF attachments
- [ ] Advanced analytics dashboard
- [ ] Audit logs
- [ ] Student-specific notifications

---

13. Future Scope

Campus Autopilot is designed with extensibility in mind.

Potential future developments include:

Centralized Campus Dashboard

A unified dashboard for managing announcements and institutional communication.

Smart Audience Management

More advanced student segmentation using academic information and configurable filters.

Multi-Channel Notifications

Integration with email and other messaging platforms.

Analytics and Reporting

Insights into announcement activity, workflow execution, and notification delivery.

Secure Administration

Authentication, authorization, and administrative activity tracking.

The long-term objective is to evolve Campus Autopilot into a broader campus communication and automation ecosystem.

---

14. Contributing

Contributions and suggestions are welcome.

To contribute:

1. Fork this repository.
2. Create a new feature branch.
3. Make your changes.
4. Test the functionality.
5. Submit a pull request with a clear description.

For major changes, consider opening an issue first to discuss the proposed improvements.

---

15. Developer

<p align="center">
  <strong>Atharva Ghorpade</strong>
  <br/>
  B.Tech Computer Science and Engineering
  <br/><br/>
  <a href="https://github.com/Atharva1118">
    <img src="https://img.shields.io/badge/GitHub-Atharva1118-181717?style=for-the-badge&logo=github" alt="GitHub"/>
  </a>
  <a href="https://www.linkedin.com/in/atharva-ghorpade-45842732b/">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin" alt="LinkedIn"/>
  </a>
</p>---

<p align="center">
  <strong>CAMPUS AUTOPILOT</strong>
  <br/>
  Intelligent Automation for a Connected Campus.
  <br/><br/>
  <sub>Designed and developed to simplify institutional communication through technology.</sub>
</p>
