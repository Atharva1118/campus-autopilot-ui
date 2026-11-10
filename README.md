<a id="top"></a>

<div align="center">CAMPUS AUTOPILOT

Intelligent Campus Communication & Automation Platform

Automating Campus Communication. Simplifying Administration.

<br/><a href="https://atharva1118.github.io/campus-autopilot-ui/">
  <img src="https://img.shields.io/badge/LIVE_DEMO-OPEN_APPLICATION-2563EB?style=for-the-badge&logo=githubpages&logoColor=white" alt="Live Demo"/>
</a>
<a href="https://github.com/Atharva1118/campus-autopilot-ui">
  <img src="https://img.shields.io/badge/SOURCE_CODE-GITHUB-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository"/>
</a><br/><br/>

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
<img src="https://img.shields.io/badge/n8n-EA4B71?style=flat-square&logo=n8n&logoColor=white" alt="n8n"/>
<img src="https://img.shields.io/badge/Google_Sheets-34A853?style=flat-square&logo=googlesheets&logoColor=white" alt="Google Sheets"/>
<img src="https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=githubpages&logoColor=white" alt="GitHub Pages"/><br/><br/>

A centralized campus announcement platform that connects notice management with workflow automation, ensuring the right update reaches the right students at the right time.

</div>---

Table of Contents

Section| Section| Section
"01. Overview" (#01-overview)| "02. Live Demo" (#02-live-demo)| "03. Problem Statement" (#03-problem-statement)
"04. Features" (#04-features)| "05. How to Use" (#05-how-to-use)| "06. Technology Stack" (#06-technology-stack)
"07. Architecture" (#07-system-architecture)| "08. Application Workflow" (#08-application-workflow)| "09. Project Structure" (#09-project-structure)
"10. Getting Started" (#10-getting-started)| "11. Deployment" (#11-deployment)| "12. n8n Integration" (#12-n8n-integration)
"13. API Reference" (#13-api-reference)| "14. Security" (#14-security-notes)| "15. Roadmap" (#15-roadmap)
"16. Contributing" (#16-contributing)| "17. Author" (#17-author)| 

---

01. Overview

Campus Autopilot is a web-based campus communication platform designed to simplify how educational institutions create, manage, and distribute announcements.

In traditional academic environments, notices are distributed through disconnected channels such as messaging groups, notice boards, emails, and word of mouth. This results in repetitive administrative work, delayed updates, and difficulties reaching specific academic groups.

Campus Autopilot introduces a centralized notice management interface that connects announcement creation with automated distribution workflows.

How It Works

1. An administrator creates an announcement.
2. Selects the intended audience, either all students or a specific classroom.
3. Chooses immediate or scheduled publishing.
4. Reviews the announcement and provides final approval.
5. The application sends a structured JSON request to an n8n webhook.
6. The configured workflow identifies recipients and handles notification distribution.

The frontend uses lightweight HTML, CSS, and JavaScript, while n8n manages configurable automation and external service integrations.

Project Objectives

- Centralize campus announcement creation.
- Reduce repetitive administrative communication.
- Enable audience segmentation by academic year, branch, and division.
- Support immediate and scheduled publishing.
- Introduce an approval checkpoint before production delivery.
- Connect frontend operations with automation workflows.
- Establish a foundation for scalable campus communication.

---

02. Live Demo

<div align="center">Experience Campus Autopilot

<a href="https://atharva1118.github.io/campus-autopilot-ui/">
  <img src="https://img.shields.io/badge/LAUNCH_LIVE_APPLICATION-2563EB?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Launch Application"/>
</a>Live Application: "campus-autopilot-ui" (https://atharva1118.github.io/campus-autopilot-ui/)

Source Code: "GitHub Repository" (https://github.com/Atharva1118/campus-autopilot-ui)

</div>«[!NOTE]
The application is hosted as a static frontend on GitHub Pages. To enable actual notice delivery, configure your own n8n webhook URL in the Automation Connection panel. Without a configured and active workflow, no notifications are delivered. Use a test workflow before connecting real student data.»

---

03. Problem Statement

Educational institutions regularly communicate academic updates, examination schedules, event announcements, placement information, and important notices.

Traditional communication methods introduce several challenges:

Challenge| Impact
Manual notice distribution| Repetitive administrative work
Multiple communication channels| Fragmented information
Lack of audience segmentation| Students receive irrelevant announcements
Manual scheduling| Additional coordination
No centralized management| Difficult notice tracking
No approval checkpoint| Risk of sending incorrect announcements

Our Solution

Campus Autopilot provides a centralized interface with:

- Structured announcement creation.
- Configurable audience targeting.
- Immediate and scheduled publishing.
- Final approval before production delivery.
- Webhook-based workflow automation.
- Integration with external student data sources.

---

04. Features

4.1 Notice Creation

- Create announcements with custom titles and descriptions.
- Title field with a 120-character limit.
- Message field with a 5,000-character limit.
- Live character counters.
- Multi-paragraph message support.
- Required-field validation.
- Real-time notice preview.

4.2 Intelligent Audience Targeting

Choose the appropriate recipient group.

Audience| Description
All Students| Targets the entire configured student audience.
Specific Classroom| Targets students according to academic year, branch, and division.

Supported academic years:

- First Year (FY)
- Second Year (SY)
- Third Year (TY)
- Fourth Year (Final Year)

Branch and division options depend on the selected academic configuration.

4.3 Flexible Publishing

- Immediate Publishing: Submit an announcement for immediate workflow processing.
- Scheduled Publishing: Select a future date and time.
- Date and time validation.
- Structured publishing preferences.

4.4 Final Approval Safeguard

- Mandatory approval checkbox.
- Explicit production delivery confirmation.
- Review before submitting the announcement.
- Pending approval status until confirmation.

4.5 Workflow Automation

- n8n webhook integration.
- HTTP POST communication.
- JSON-based data exchange.
- Configurable webhook URL.
- Browser-based connection configuration.
- Request response feedback.

4.6 Student Data Integration

Google Sheets can be integrated through n8n to retrieve student records and identify recipients according to the selected audience.

---

05. How to Use

Follow these steps to create and submit an announcement.

Step| Action
01| Open the "Campus Autopilot Live Demo" (https://atharva1118.github.io/campus-autopilot-ui/).
02| Open Automation Connection and configure your n8n production webhook URL.
03| Enter the announcement title and message.
04| Select All Students or Specific Classroom.
05| Choose the academic year, branch, and division if required.
06| Select immediate or scheduled publishing.
07| Review the announcement using the live preview.
08| Confirm the production approval checkbox.
09| Click Publish Notice to submit the request.

Use the Clear Form option to reset the announcement form.

«[!IMPORTANT]
Publishing a request to the webhook does not necessarily mean that all student notifications have been delivered. Delivery depends on the configured n8n workflow.»

---

06. Technology Stack

Technology| Purpose
HTML5| Frontend structure
CSS3| Styling and responsive interface
JavaScript| Application logic and validation
n8n| Workflow automation
Google Sheets| Student data source
Webhooks| Frontend-to-workflow communication
JSON| Structured data exchange
GitHub Pages| Static application hosting
Git & GitHub| Version control and collaboration

Why This Technology Stack?

Vanilla JavaScript

Keeps the application lightweight without requiring a frontend framework or complex build process.

n8n Automation

Provides a visual automation environment for connecting external services and processing announcement requests.

Google Sheets

Provides a configurable data source for student information through automation workflows.

GitHub Pages

Enables straightforward hosting of the static frontend directly from the repository.

---

07. System Architecture

Campus Autopilot follows a frontend-to-workflow integration architecture.

High-Level Architecture

flowchart TD
    A["Administrator"] --> B["Campus Autopilot Interface"]
    B --> C["Input Validation"]
    C --> D["Audience Configuration"]
    D --> E["Publishing Configuration"]
    E --> F["Approval Confirmation"]
    F --> G["JSON Request"]
    G --> H["HTTP POST"]
    H --> I["n8n Webhook"]
    I --> J["Workflow Processing"]
    J --> K["Google Sheets Lookup"]
    K --> L["Recipient Identification"]
    L --> M["Notification Service"]
    M --> N["Students"]

    style A fill:#2563EB,color:#fff
    style I fill:#EA4B71,color:#fff
    style N fill:#16A34A,color:#fff

Architecture Components

Component| Responsibility
Administrator| Creates and approves announcements
Frontend| Collects input and performs validation
Audience Configuration| Defines intended recipients
Webhook| Transfers structured data
n8n| Executes automation workflows
Google Sheets| Provides student records
Notification Service| Handles configured distribution

Data Flow

1. The administrator creates a notice.
2. JavaScript validates the submitted information.
3. Audience and publishing preferences are configured.
4. The administrator approves the announcement.
5. The frontend sends a JSON request to the configured webhook.
6. n8n receives and processes the request.
7. Student information can be retrieved from Google Sheets.
8. Configured notification integrations handle distribution.

«[!NOTE]
Recipient lookup and notification delivery depend on the actual n8n workflow configuration.»

---

08. Application Workflow

The application follows a structured announcement publishing process.

flowchart TD
    A(["Start"]) --> B["Create Announcement"]
    B --> C["Enter Notice Details"]
    C --> D{"Select Audience"}

    D -->|All Students| E["Entire Student Audience"]
    D -->|Specific Classroom| F["Select Year, Branch and Division"]

    E --> G{"Publishing Mode"}
    F --> G

    G -->|Immediate| H["Prepare Publishing Request"]
    G -->|Scheduled| I["Choose Date and Time"]

    I --> J["Validate Schedule"]
    J --> H

    H --> K["Approval Confirmation"]
    K --> L["Send HTTP POST Request"]
    L --> M["n8n Webhook"]
    M --> N["Workflow Execution"]
    N --> O["Return Response"]
    O --> P(["End"])

---

09. Project Structure

campus-autopilot-ui/
│
├── index.html
│   └── Main application interface
│
├── style.css
│   └── UI styling and responsive design
│
├── script.js
│   └── Application logic, validation and webhook integration
│
└── README.md
    └── Project documentation

The project follows a simple frontend architecture with a clear separation of structure, presentation, and application logic.

---

10. Getting Started

Prerequisites

- Git installed on your system.
- A modern web browser.
- Visual Studio Code (recommended).
- n8n Cloud or a self-hosted n8n instance for automation.

Step 1: Clone the Repository

git clone https://github.com/Atharva1118/campus-autopilot-ui.git

Step 2: Navigate to the Project

cd campus-autopilot-ui

Step 3: Open in Visual Studio Code

code .

Step 4: Run the Application

Open "index.html" directly in your browser.

Alternatively, install the Live Server extension in Visual Studio Code and select:

Open with Live Server

No frontend dependency installation or build command is required for the current implementation.

---

11. Deployment

Campus Autopilot is a static frontend application and can be deployed through GitHub Pages.

Deployment Steps

1. Push the project to your GitHub repository.
2. Open repository Settings.
3. Navigate to Pages.
4. Under Build and Deployment, select Deploy from a branch.
5. Select the "main" branch.
6. Select the "/ (root)" directory.
7. Click Save.
8. Wait for GitHub Pages to complete deployment.

Live Deployment

"https://atharva1118.github.io/campus-autopilot-ui/" (https://atharva1118.github.io/campus-autopilot-ui/)

---

12. n8n Integration

Campus Autopilot communicates with n8n through an HTTP webhook.

Configuration Steps

1. Open your n8n workspace.
2. Create a new workflow.
3. Add a Webhook node.
4. Configure the HTTP method as "POST".
5. Configure the expected request data.
6. Copy the production webhook URL.
7. Open Campus Autopilot.
8. Paste the URL into the Automation Connection panel.
9. Save the connection.
10. Activate the n8n workflow.
11. Submit a test announcement.

Workflow Architecture

flowchart LR
    A["Campus Autopilot"] --> B["HTTP POST"]
    B --> C["n8n Webhook"]
    C --> D["Validate Request"]
    D --> E["Process Announcement"]
    E --> F["Google Sheets Lookup"]
    F --> G["Identify Recipients"]
    G --> H["Notification Integration"]
    H --> I["Workflow Result"]

The workflow can be extended using additional n8n nodes to support:

- Email notifications.
- Messaging integrations.
- Student record lookup.
- Scheduled delivery.
- Workflow execution logging.

The actual integrations depend on the configured workflow.

---

13. API Reference

Campus Autopilot uses HTTP POST requests to communicate with the configured n8n webhook.

Request Configuration

Parameter| Value
Method| "POST"
Content-Type| "application/json"
Endpoint| Configured n8n webhook URL
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

«[!NOTE]
This is an illustrative payload. The actual request structure must match the fields and values generated by "script.js".»

Expected Workflow Processing

The n8n workflow can use the received information to:

- Validate announcement details.
- Identify the intended audience.
- Retrieve matching student records.
- Execute configured notification workflows.
- Return a workflow response.

---

14. Security Notes

Security and reliability are essential for applications handling institutional communication and student information.

Recommended Security Practices

- Validate incoming webhook requests.
- Implement authentication for administrative access.
- Avoid exposing private API credentials in frontend code.
- Restrict access to student information.
- Configure appropriate CORS policies.
- Protect webhook endpoints against unauthorized requests.
- Maintain workflow execution logs.
- Verify notification delivery independently of webhook acceptance.

«[!WARNING]
The webhook URL is stored in browser local storage, which is not a secure secret store. Production deployments should use an authenticated backend or an appropriate access-control mechanism.»

«[!CAUTION]
Test the workflow using sample student data and your own email address before enabling notifications for real students.»

---

15. Roadmap

Current Implementation

- [x] Notice creation interface
- [x] Title and message fields
- [x] Live character counters
- [x] Real-time notice preview
- [x] Audience selection
- [x] Academic year selection
- [x] Branch and division selection
- [x] Immediate publishing option
- [x] Scheduled publishing interface
- [x] Date and time validation
- [x] Final approval confirmation
- [x] Webhook configuration
- [x] HTTP request integration
- [x] GitHub Pages deployment

Planned Enhancements

- [ ] Secure administrator authentication
- [ ] Role-based access management
- [ ] Centralized backend and database
- [ ] Notice history and editing
- [ ] Notification delivery tracking
- [ ] Email notification integration
- [ ] Mobile notification integration
- [ ] Document and PDF attachments
- [ ] Analytics dashboard
- [ ] Administrative audit logs
- [ ] Student-specific notifications

Long-Term Vision

Area| Planned Development
Centralized Dashboard| Unified campus communication management
Smart Audience Management| Advanced student segmentation
Multi-Channel Communication| Email and messaging integrations
Analytics| Announcement and delivery insights
Administration| Secure authentication and authorization

---

16. Contributing

Contributions, suggestions, and improvements are welcome.

Contribution Guidelines

1. Fork the repository.
2. Create a new feature branch.
3. Implement your changes.
4. Test the updated functionality.
5. Submit a pull request with a clear description.

For major changes, please open an issue first to discuss your proposal.

---

17. Author

<div align="center">Atharva Ghorpade

B.Tech Computer Science & Engineering

<br/><a href="https://github.com/Atharva1118">
  <img src="https://img.shields.io/badge/GitHub-Atharva1118-181717?style=for-the-badge&logo=github" alt="GitHub"/>
</a>
<a href="https://www.linkedin.com/in/atharva-ghorpade-45842732b/">
  <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin" alt="LinkedIn"/>
</a><br/><br/>

Project Links

"Live Application" (https://atharva1118.github.io/campus-autopilot-ui/) · "GitHub Repository" (https://github.com/Atharva1118/campus-autopilot-ui)

</div>---

<div align="center">CAMPUS AUTOPILOT

Intelligent Automation for a Connected Campus.

Designed and developed to simplify institutional communication through technology.

<br/><a href="#top">⬆ Back to Top</a>

</div>
