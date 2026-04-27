# 🗳️ Secure Online Voting System (Enterprise Grade)

A full-stack, highly secure online election portal designed for universities and organizations. Built with a robust Spring Boot backend and a modern React frontend, it features real-time vote broadcasting, automated PDF report generation, and OTP-based multi-admin authentication.

## 🚀 Key Features

* **Real-Time Live Voting:** Integrated WebSockets (`SimpMessagingTemplate`) to broadcast live vote counts to the admin dashboard instantly.
* **OTP-Based Admin Gateway:** High-security access control. Admins must verify their identity via a 6-digit OTP sent to their authorized email.
* **Bulk CSV Uploads:** Automated voter registration system allowing admins to upload a full batch of students via a single `.csv` file.
* **Automated PDF Certificates:** Utilizes `OpenPDF` to dynamically generate and download official election result reports.
* **Smart Session Management:** Features a 15-minute inactivity tracker that auto-logouts users to prevent unauthorized access.

## 🛠️ Tech Stack
* **Frontend:** React.js, Tailwind CSS, Lucide Icons
* **Backend:** Java, Spring Boot, WebSockets, OpenPDF
* **Database:** MySQL