# Lively - System Architecture

## Overview
Lively is a social networking platform built with Clean Architecture principles, featuring real-time chat, activity management, and photo uploads. Demonstrates CQRS pattern with MediatR and ASP.NET Core 3.1.

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile Browser]
    end

    subgraph "Frontend Application"
        React[React Application]
        MobX[MobX State Management]
        SignalRClient[SignalR Client]
        Router[React Router]
        UI[Semantic UI Components]
    end

    subgraph "API Gateway"
        Controllers[ASP.NET Controllers]
        SignalRHub[SignalR Hub]
        Middleware[Middleware Pipeline]
        Auth[JWT Authentication]
    end

    subgraph "Application Layer - CQRS"
        Commands[Command Handlers]
        Queries[Query Handlers]
        MediatR[MediatR Mediator]
        Validators[FluentValidation]
    end

    subgraph "Domain Layer"
        Entities[Domain Entities]
        ValueObjects[Value Objects]
        Interfaces[Domain Interfaces]
    end

    subgraph "Infrastructure Layer"
        EFCore[Entity Framework Core]
        Identity[ASP.NET Identity]
        Cloudinary[Cloudinary Service]
        JWT[JWT Token Service]
    end

    subgraph "Data Layer"
        Database[(SQL Server / SQLite)]
        PhotoStorage[(Cloudinary CDN)]
    end

    Browser --> React
    Mobile --> React
    React --> MobX
    React --> SignalRClient
    React --> Router
    React --> UI

    MobX -->|HTTP Requests| Controllers
    SignalRClient -->|WebSocket| SignalRHub

    Controllers --> Middleware
    Middleware --> Auth
    Auth --> MediatR
    SignalRHub --> MediatR

    MediatR --> Commands
    MediatR --> Queries
    Commands --> Validators
    Queries --> Validators

    Commands --> Entities
    Queries --> Entities
    Entities --> Interfaces

    Commands --> EFCore
    Queries --> EFCore
    Auth --> Identity
    Auth --> JWT
    Controllers --> Cloudinary

    EFCore --> Database
    Identity --> Database
    Cloudinary --> PhotoStorage

    style Browser fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    style React fill:#61dafb,stroke:#20232a,stroke-width:3px
    style MediatR fill:#ff6b6b,stroke:#c92a2a,stroke-width:3px
    style Entities fill:#ffd93d,stroke:#f59f00,stroke-width:2px
    style Database fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
```

## Clean Architecture Layers

```mermaid
graph TB
    subgraph "Presentation - API Layer"
        API[Controllers]
        Hubs[SignalR Hubs]
        DTOs[Data Transfer Objects]
        Filters[Action Filters]
    end

    subgraph "Application Layer"
        Activities[Activity Use Cases]
        Users[User Use Cases]
        Photos[Photo Use Cases]
        Comments[Comment Use Cases]
        AutoMapper[AutoMapper Profiles]
    end

    subgraph "Domain Layer - Core"
        Activity[Activity Entity]
        User[AppUser Entity]
        Photo[Photo Entity]
        Comment[Comment Entity]
        ActivityAttendee[ActivityAttendee]
    end

    subgraph "Infrastructure Layer"
        DataContext[ApplicationDbContext]
        PhotoAccessor[Photo Upload Service]
        UserAccessor[Current User Service]
        Security[Security Services]
    end

    subgraph "External Services"
        CloudinaryAPI[Cloudinary API]
        EmailService[Email Service]
    end

    API --> Activities
    API --> Users
    Hubs --> Comments

    Activities --> Activity
    Users --> User
    Photos --> Photo
    Comments --> Comment

    Activities --> DataContext
    Users --> DataContext
    Photos --> PhotoAccessor
    Comments --> DataContext

    PhotoAccessor --> CloudinaryAPI
    Security --> UserAccessor
    Users --> EmailService

    Activities --> AutoMapper
    Users --> AutoMapper
    Photos --> AutoMapper

    Activity --> ActivityAttendee
    User --> ActivityAttendee
    User --> Photo

    style API fill:#fa5252,stroke:#c92a2a,stroke-width:2px
    style Activities fill:#fab005,stroke:#f59f00,stroke-width:2px
    style Activity fill:#51cf66,stroke:#2f9e44,stroke-width:2px
    style DataContext fill:#339af0,stroke:#1971c2,stroke-width:2px
```

## CQRS Pattern Implementation

```mermaid
graph LR
    subgraph "Commands - Write Operations"
        CreateActivity[Create Activity]
        UpdateActivity[Update Activity]
        DeleteActivity[Delete Activity]
        JoinActivity[Join Activity]
        UploadPhoto[Upload Photo]
        DeletePhoto[Delete Photo]
    end

    subgraph "Queries - Read Operations"
        ListActivities[List Activities]
        GetActivity[Get Activity Details]
        GetUserProfile[Get User Profile]
        GetPhotos[Get User Photos]
    end

    subgraph "MediatR Pipeline"
        Mediator[MediatR Mediator]
        ValidationBehavior[Validation Behavior]
    end

    subgraph "Handlers"
        CommandHandlers[Command Handlers]
        QueryHandlers[Query Handlers]
    end

    CreateActivity --> Mediator
    UpdateActivity --> Mediator
    DeleteActivity --> Mediator
    JoinActivity --> Mediator
    UploadPhoto --> Mediator
    DeletePhoto --> Mediator

    ListActivities --> Mediator
    GetActivity --> Mediator
    GetUserProfile --> Mediator
    GetPhotos --> Mediator

    Mediator --> ValidationBehavior
    ValidationBehavior --> CommandHandlers
    ValidationBehavior --> QueryHandlers

    style CreateActivity fill:#ff6b6b,stroke:#c92a2a,stroke-width:2px
    style ListActivities fill:#51cf66,stroke:#2f9e44,stroke-width:2px
    style Mediator fill:#748ffc,stroke:#4c6ef5,stroke-width:3px
```

## Real-Time Communication Flow

```mermaid
sequenceDiagram
    participant Client as React Client
    participant SignalR as SignalR Hub
    participant MediatR as MediatR
    participant Handler as Comment Handler
    participant DB as Database
    participant Clients as Connected Clients

    Client->>SignalR: SendComment(activityId, comment)
    SignalR->>MediatR: Send Command
    MediatR->>Handler: Handle Command
    Handler->>Handler: Validate comment
    Handler->>DB: Save comment
    DB->>Handler: Confirm saved
    Handler->>MediatR: Return result
    MediatR->>SignalR: Command completed
    SignalR->>Clients: Broadcast new comment
    Clients->>Clients: Update UI in real-time

    Note over Client,Clients: WebSocket connection maintained
```

## Authentication & Authorization Flow

```mermaid
graph TB
    subgraph "Client Authentication"
        Login[Login Request]
        Register[Register Request]
    end

    subgraph "API Layer"
        AccountController[Account Controller]
        JWTMiddleware[JWT Middleware]
    end

    subgraph "Security Services"
        TokenService[Token Generator]
        IdentityService[ASP.NET Identity]
        UserManager[User Manager]
    end

    subgraph "Storage"
        IdentityDB[(Identity Tables)]
        LocalStorage[Browser LocalStorage]
    end

    Login --> AccountController
    Register --> AccountController

    AccountController --> UserManager
    UserManager --> IdentityService
    IdentityService --> IdentityDB

    AccountController --> TokenService
    TokenService -->|JWT Token| LocalStorage

    LocalStorage -->|Bearer Token| JWTMiddleware
    JWTMiddleware -->|Validate| TokenService

    style Login fill:#e3fafc,stroke:#0c8599,stroke-width:2px
    style TokenService fill:#fff3bf,stroke:#fab005,stroke-width:2px
    style IdentityService fill:#ffe3e3,stroke:#fa5252,stroke-width:2px
```

## Photo Upload Architecture

```mermaid
graph LR
    subgraph "Client Side"
        FileInput[File Input]
        ImageCrop[Image Cropper]
        Preview[Image Preview]
    end

    subgraph "API Layer"
        PhotoController[Photo Controller]
        PhotoCommand[Add Photo Command]
    end

    subgraph "Application Layer"
        PhotoHandler[Photo Handler]
        Validator[Photo Validator]
    end

    subgraph "Infrastructure"
        PhotoAccessor[Photo Accessor Service]
        CloudinarySDK[Cloudinary SDK]
    end

    subgraph "External"
        CloudinaryCDN[(Cloudinary CDN)]
    end

    subgraph "Database"
        PhotoEntity[(Photo Records)]
    end

    FileInput --> ImageCrop
    ImageCrop --> Preview
    Preview --> PhotoController

    PhotoController --> PhotoCommand
    PhotoCommand --> PhotoHandler
    PhotoHandler --> Validator
    Validator --> PhotoAccessor

    PhotoAccessor --> CloudinarySDK
    CloudinarySDK --> CloudinaryCDN

    CloudinaryCDN -->|Photo URL| PhotoEntity
    PhotoEntity --> PhotoHandler

    style FileInput fill:#d3f9d8,stroke:#37b24d,stroke-width:2px
    style CloudinarySDK fill:#748ffc,stroke:#4c6ef5,stroke-width:2px
    style CloudinaryCDN fill:#ffd43b,stroke:#fab005,stroke-width:2px
```

## State Management with MobX

```mermaid
graph TB
    subgraph "MobX Stores"
        ActivityStore[Activity Store]
        UserStore[User Store]
        ProfileStore[Profile Store]
        CommentStore[Comment Store]
        CommonStore[Common Store]
    end

    subgraph "React Components"
        ActivityList[Activity List]
        ActivityDetails[Activity Details]
        UserProfile[User Profile]
        ChatBox[Chat Box]
    end

    subgraph "API Agents"
        ActivityAgent[Activity Agent]
        UserAgent[User Agent]
        PhotoAgent[Photo Agent]
    end

    subgraph "Backend API"
        API[ASP.NET Core API]
    end

    ActivityList -->|observe| ActivityStore
    ActivityDetails -->|observe| ActivityStore
    UserProfile -->|observe| ProfileStore
    ChatBox -->|observe| CommentStore

    ActivityStore -->|action| ActivityAgent
    UserStore -->|action| UserAgent
    ProfileStore -->|action| PhotoAgent

    ActivityAgent --> API
    UserAgent --> API
    PhotoAgent --> API

    API -->|response| ActivityStore
    API -->|response| UserStore
    API -->|response| ProfileStore

    style ActivityStore fill:#845ef7,stroke:#5f3dc4,stroke-width:2px
    style UserStore fill:#ff6b6b,stroke:#c92a2a,stroke-width:2px
    style API fill:#20c997,stroke:#087f5b,stroke-width:2px
```

## Database Schema

```mermaid
erDiagram
    USERS ||--o{ ACTIVITIES : hosts
    USERS ||--o{ PHOTOS : uploads
    USERS ||--o{ COMMENTS : writes
    ACTIVITIES ||--o{ ACTIVITY_ATTENDEES : has
    USERS ||--o{ ACTIVITY_ATTENDEES : attends
    ACTIVITIES ||--o{ COMMENTS : receives

    USERS {
        string Id PK
        string UserName
        string DisplayName
        string Email
        string Bio
        datetime CreatedAt
    }

    ACTIVITIES {
        guid Id PK
        string Title
        datetime Date
        string Description
        string Category
        string City
        string Venue
    }

    PHOTOS {
        string Id PK
        string Url
        bool IsMain
        string UserId FK
    }

    ACTIVITY_ATTENDEES {
        string UserId FK
        guid ActivityId FK
        bool IsHost
    }

    COMMENTS {
        int Id PK
        string Body
        string UserId FK
        guid ActivityId FK
        datetime CreatedAt
    }
```

## Technology Stack

### Backend
- **ASP.NET Core 3.1**: Web API framework
- **Entity Framework Core**: ORM for data access
- **MediatR**: CQRS pattern implementation
- **AutoMapper**: Object-to-object mapping
- **FluentValidation**: Input validation
- **ASP.NET Identity**: User authentication
- **SignalR**: Real-time communication
- **JWT**: Token-based authentication

### Frontend
- **React 16**: UI library
- **MobX**: State management
- **Semantic UI React**: Component library
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client
- **SignalR Client**: WebSocket client
- **Formik**: Form management
- **Yup**: Schema validation

### Infrastructure
- **SQL Server / SQLite**: Relational database
- **Cloudinary**: Photo storage and CDN
- **JWT Bearer**: API authentication

## Key Design Patterns

1. **Clean Architecture**: Separation of concerns across layers
2. **CQRS**: Command Query Responsibility Segregation
3. **Mediator Pattern**: Decoupled request handling
4. **Repository Pattern**: Data access abstraction
5. **Dependency Injection**: Loose coupling
6. **Observer Pattern**: MobX reactive state
7. **Factory Pattern**: SignalR connection creation

## Performance Optimizations

### Backend
- EF Core query optimization with projections
- Lazy loading disabled for performance
- AutoMapper query extensions
- Response caching for read operations
- Database indexing on foreign keys

### Frontend
- MobX computed values for derived state
- React.memo for component memoization
- Code splitting with React.lazy
- Virtual scrolling for large lists
- Debounced search inputs
- Optimistic UI updates

## Security Measures

- JWT token authentication
- HTTPS-only communication
- CORS policy configuration
- SQL injection prevention via EF Core
- XSS protection in React
- File upload validation
- Rate limiting on API endpoints
- Password hashing with Identity
