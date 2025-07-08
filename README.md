# DocNet: Doctor Appointments Reservation System - Upgraded Edition

---

## 🚀 Live Demo

[https://doc-net.netlify.app](https://doc-net.netlify.app)

---

## 📖 Project Overview

DocNet is a modular, highly scalable ASP.NET Core application for booking and managing doctor appointments. Built on the Onion Architecture, it cleanly separates concerns across Domain, Application, Infrastructure, and Presentation layers. The frontend is built with Angular 19, consuming a robust ASP.NET Core Web API. Redis caching accelerates data retrieval, while real‑time notifications and an Admin Analytics module provide enhanced user engagement and operational insights.

---

## 🔥 Key Features

### Frontend (Angular)

* Angular 19 with RxJS for reactive data flows

* Bootstrap 5 for responsive UI

* ngx-swiper-wrapper for doctor/carousel sliders

* Leaflet for interactive maps

* SweetAlert2 for toast & modal alerts

* Angular SignalR Client for live notifications

* Reactive Forms with full client & server side validation

* HTTP Interceptors for JWT auth & error handling

### Core Functionality

* Patient registration, login, profile management
* Search doctors by specialty & location
* Real‑time appointment booking with availability checks
* Secure online payments (Stripe)
* Email confirmations & password recovery (ASP.NET Identity)

### Scalability & Resilience

* **Redis Caching**

### Real‑Time & Messaging

* **Notifications Module (SignalR)**:

  * Pushes live updates (new bookings, cancellations, reminders) to patients and doctors.
  * Group‑based routing: Doctors receive only their own appointment alerts.

### Analytics & Administration

* **Admin Analytics Module**:

  * Dashboard with charts for revenue, top specialties.
* **Role‑Based Access Control**:

  * Administrators have dedicated UI for user management and analytics.
  * Doctors and patients see only their own data.

---

## 🏗️ Architecture

DocNet employs the **Onion Architecture** pattern:

            +-----------------------------------+
            |          Angular Frontend         |
            |           (HTTP, SignalR)         |
            +-----------------+-----------------+
                              |
            +-----------------------------------+
            |         Presentation Layer        |
            |           (ASP.NET API)           |
            +-----------------+-----------------+
                              |
            +-----------------v-----------------+
            |         Application Layer         |
            |         (Services, DTOs)          |
            +-----------------+-----------------+
                              |
            +-----------------v-----------------+
            |           Domain Layer            |
            |      (Entities, Interfaces)       |
            +-----------------+-----------------+
                              |
            +-----------------v-----------------+
            |       Infrastructure Layer        |
            | (EF Core, Redis, Email, Payments) |
            +-----------------------------------+

* **Dependency Inversion**: Upper layers depend on abstractions defined in the Domain Layer.
* **Cross‑Cutting Concerns** (logging, caching, validation) are injected via middleware and decorators.

---

## 🛠️ Tech Stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Frontend   | Angular 19, RxJS, ngx-swiper-wrapper                    |
| Styling    | Bootstrap 5, SweetAlert2                                |
| Maps       | Leaflet                                                 |
| Real‑Time  | @microsoft/signalr                                      |
| Backend    | ASP.NET Core 9, C#, EF Core                             |
| Caching    | Redis                                                   |
| Auth       | ASP.NET Core Identity                                   |
| Data Store | SQL Server                                              |
| Hosting    | Netlify (Frontend), MonsterASP.net (Backend)            |

---

## 🚀 Getting Started

### Prerequisites

* Node.js, npm
* .NET 9 SDK
* Redis
* SQL Server

### Frontend Setup

    ```bash
    cd FrontEnd\DoctorAppointmentSystem
    npm install
    # Copy FrontEnd\DoctorAppointmentSystem\src\app\core\environments\environment.example.ts to environment.ts
    ng serve
    ```

* App will run at `http://localhost:4200`.

## Clone & Configure

    ```bash
    git clone https://github.com/MohamedKhaled999/Doctor_Appointments_System.git
    cd Doctor_Appointments_System
    ```

1. **Connection Strings** – in `appsettings.Development.json`:

        ```json
        "Logging": {
          "LogLevel": {
            "Default": "Information",
            "Microsoft.AspNetCore": "Warning"
          }
        },
        "ConnectionStrings": {
          "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=AppointmentsDb;Trusted_Connection=True;",
        },
        "JwtOptions": {
          "SecretKey": "your-secret-key",
          "Issuer": "http://localhost:5072",
          "Audience": "http://localhost:4200",
          "DurationInDays": 30
        },
        "StripeSetting": {
          "SecretKey": "your-secret-key",
          "EndPointSecret": "your-endpoint-secret"
        },
        "EmailSettings": {
          "EmailAddress": "your-email@example.com",
          "Password": "your-email-password"
        },
        "NotificationSettings": {
          "Host": "your-host",
          "Port": "your-port",
          "User": "your-user",
          "Password": "your-password"
        },
        "CachingSettings": {
          "Host": "your-host",
          "Port": "your-port",
          "User": "your-user",
          "Password": "your-password"
        },
        "FrontEnd": {
          "Url": "https://doc-net.netlify.app"
        },
        "ExtrenalLogin": {
          "googleClientId": "your-client-id",
          "facebookAppId": "your-app-id",
          "microsoftClientId": "your-client-id"
        },
        "AllowedHosts": "*"
        ```

2. **Migrate & Seed DB**

3. **Run Application**

4. **Access**

   * Frontend: `https://localhost:4200`

---

## 📂 Module Breakdown

### Notifications Module

* **SignalR Hub**: `/hubs/notifications`
* **Client Subscription**: Angular service subscribes to live events
* **Triggers**: Broadcast on booking, cancellation, reminders

### Admin Analytics Module

* **Controllers**: `AnalyticsController` exposes JSON endpoints
* **UI**: Razor partial views with Chart.js (line, pie, bar charts)
* **Data**: Aggregated via EF Core `GroupBy` and cached in Redis

---

## 📝 Contribution & Roadmap

Contributions welcome via GitHub PRs!

---

Made with ❤️ by the DocNet team.
Feel free to explore the live demo at [https://doc-net.netlify.app](https://doc-net.netlify.app).
