# Lively

A social networking platform built with Clean Architecture principles, featuring real-time chat, activity management, and photo uploads. Demonstrates CQRS pattern with MediatR and ASP.NET Core 3.1.

[View Portfolio](https://zachayers.io) | [Live Demo](https://lively.zachayers.io)

## About

Lively is a modern social networking application showcasing Clean Architecture, CQRS (Command Query Responsibility Segregation), and real-time communication with SignalR. Built with ASP.NET Core backend and React frontend with MobX state management.

## Built With

### Backend
- ASP.NET Core 3.1
- Entity Framework Core
- MediatR (CQRS pattern)
- AutoMapper
- SignalR (real-time chat)
- ASP.NET Core Identity (authentication)

### Frontend
- React 16
- MobX (state management)
- Semantic UI React
- React Router DOM
- Axios
- SignalR Client

### Infrastructure
- JWT Authentication
- Cloudinary (photo uploads)
- SQLite / SQL Server

## Getting Started

### Prerequisites

- .NET Core 3.1 SDK or higher
- Node.js 12.x or higher
- Cloudinary account (for photo uploads)
- SQL Server or SQLite

### Installation

```bash
git clone https://github.com/n73311/lively.git
cd lively
```

### Backend Setup

```bash
cd API
dotnet restore
```

Create `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=lively.db"
  },
  "TokenKey": "your-super-secret-key-here",
  "Cloudinary": {
    "CloudName": "your-cloud-name",
    "ApiKey": "your-api-key",
    "ApiSecret": "your-api-secret"
  }
}
```

Run migrations:

```bash
dotnet ef database update -p Persistence/ -s API/
dotnet run
```

### Frontend Setup

```bash
cd client-app
npm install
npm start
```

## Project Structure

```
lively/
├── Domain/            # Enterprise business rules (entities)
├── Application/       # Application business rules (use cases)
├── Persistence/       # Data access implementation
├── Infrastructure/    # External concerns (security, photos)
├── API/              # Controllers and startup configuration
└── client-app/       # React frontend application
```

## Architecture

### Clean Architecture Layers

- **Domain**: Core business entities (Activity, User, Photo, Comment)
- **Application**: CQRS handlers with MediatR, validators with FluentValidation
- **Persistence**: Entity Framework Core DbContext and repositories
- **Infrastructure**: JWT token generation, photo upload service
- **API**: ASP.NET Core controllers, SignalR hubs, middleware

### Key Features

- **CQRS Pattern**: Separated read and write operations using MediatR
- **Real-Time Chat**: SignalR hubs for instant messaging on activities
- **Photo Uploads**: Cloudinary integration with image optimization
- **JWT Authentication**: Secure token-based authentication
- **Activity Management**: Create, edit, delete, and attend activities
- **User Profiles**: Profile management with photo uploads

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.

## Author

Zachariah Ayers - [zachayers.io](https://zachayers.io)
