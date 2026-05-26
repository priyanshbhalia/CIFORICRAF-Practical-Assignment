# Tree Monitoring Backend API

A production-ready REST API built for the Tree Monitoring system, complying with the CIFOR-ICRAF Assignment 4 specifications. It features a robust database layer, clean layered architecture, JWT authentication, request validation, and summary stats calculations.

## Technology Stack & Design Decisions

- **Runtime & Language**: Node.js with **TypeScript**. TypeScript guarantees type safety, autocompletion, and compile-time verification, making it superior for market-ready applications.
- **Framework**: **Express.js** for handling routes and HTTP middleware logic.
- **ORM & Database**: **Prisma ORM** with **MongoDB**. MongoDB is used as the document store, ensuring scalable performance, high flexibility, and production-grade storage. Schema mappings and types are automatically synchronised via Prisma.
- **Validation**: **Zod** schema validation middleware. It validates request parameters, query arguments, and body payloads before they reach the controller, returning clean, unified error responses.
- **Security**: **Helmet** (HTTP headers protection), **CORS** configuration, and **JWT (JSON Web Tokens)** for path-based access control.
- **Architecture**: Separated into Controllers, Routing, Middleware, Validation, and Database client models to adhere to the Single Responsibility Principle.

---

## Getting Started

### Prerequisites
- Node.js (version 18 or above recommended)
- npm (Node Package Manager)

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd Assignment4
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (a pre-configured `.env` is already provided):
   If you wish to customise ports or secrets, edit the `.env` file in the root:
   ```env
   PORT=3000
   DATABASE_URL="mongodb+srv://priyanshbhalia20_db_user:ZiTrb4US3NMPHBkU@cluster0.sxosjss.mongodb.net/tree_monitoring?retryWrites=true&w=majority"
   JWT_SECRET="tree_monitoring_secret_key_2026_super_secure"
   JWT_EXPIRES_IN="24h"
   ```

4. Sync your database schema indexes with MongoDB:
   ```bash
   npx prisma db push
   ```

5. Seed the database with default data (creates a test user and 10 realistic tree records):
   ```bash
   npm run db:seed
   ```

### Running the Server

#### Development Mode (with hot-reloading)
```bash
npm run dev
```
The server will start on [http://localhost:3000](http://localhost:3000).

#### Production Build & Run
```bash
npm run build
npm run start
```

### Interactive API Docs (Swagger UI)
Once the server is running, you can open the interactive API documentation at:
- **URL**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

This UI allows you to explore the schema definitions, inspect the required payloads, and execute requests directly from the browser (use the **Authorize** button with a valid JWT token to test the protected routes).

---

## Database Schema

Defined in `prisma/schema.prisma`:

### User Model (Authentication)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String (UUID) | `@id` | Primary key |
| `email` | String | `@unique` | Unique login email |
| `password` | String | | BCRYPT hashed password |
| `name` | String (optional) | | User's full name |
| `createdAt` | DateTime | `@default(now())` | User registration timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Last modification timestamp |

### Tree Model (Monitoring Records)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String (UUID) | `@id` | Primary key |
| `species` | String | `@index` | Common species name (e.g. Neem, Mango) |
| `latitude` | Float | | Latitude coordinate (-90.0 to 90.0) |
| `longitude` | Float | | Longitude coordinate (-180.0 to 180.0) |
| `plantingDate` | DateTime | | Date the tree was planted |
| `health` | String | `@index` | Tree condition (`Good` / `Fair` / `Poor`) |
| `createdAt` | DateTime | `@default(now())` | Creation timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Last modification timestamp |

---

## API Endpoints & Usage

### 1. Authentication Endpoints

#### Register User
- **URL**: `POST /api/auth/register`
- **Auth Required**: None
- **Request Body**:
  ```json
  {
    "email": "supervisor@cifor-icraf.org",
    "password": "securepassword",
    "name": "Alex Monitor"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "data": {
      "token": "eyJhbGciOi...",
      "user": {
        "id": "a1b2c3d4...",
        "email": "supervisor@cifor-icraf.org",
        "name": "Alex Monitor"
      }
    }
  }
  ```

#### Login User
- **URL**: `POST /api/auth/login`
- **Auth Required**: None
- **Default Seed Credentials**:
  - Email: `admin@cifor-icraf.org`
  - Password: `password123`
- **Request Body**:
  ```json
  {
    "email": "admin@cifor-icraf.org",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "token": "eyJhbGciOi...",
      "user": {
        "id": "e82b7d...",
        "email": "admin@cifor-icraf.org",
        "name": "Admin Tree Monitor"
      }
    }
  }
  ```

---

### 2. Tree Endpoints

#### Add a New Tree
- **URL**: `POST /trees`
- **Auth Required**: **Yes (Bearer JWT Token)**
- **Request Body**:
  ```json
  {
    "species": "Neem",
    "latitude": -1.2921,
    "longitude": 36.8219,
    "plantingDate": "2023-01-15",
    "health": "Good"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "data": {
      "tree": {
        "id": "fd90b8f0-1c4b-4890-...",
        "species": "Neem",
        "latitude": -1.2921,
        "longitude": 36.8219,
        "plantingDate": "2023-01-15T00:00:00.000Z",
        "health": "Good",
        "createdAt": "2026-05-26T07:52:10.000Z",
        "updatedAt": "2026-05-26T07:52:10.000Z"
      }
    }
  }
  ```

#### Get List of All Trees (with filtering)
- **URL**: `GET /trees`
- **Auth Required**: None
- **Query Parameters (Optional)**:
  - `species`: Filter trees by species (exact match, e.g. `?species=Neem`)
  - `health`: Filter trees by health status (e.g. `?health=Good`)
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "results": 2,
    "data": {
      "trees": [
        {
          "id": "fd90b8f0-1c4b-4890-...",
          "species": "Neem",
          "latitude": -1.2921,
          "longitude": 36.8219,
          "plantingDate": "2023-01-15T00:00:00.000Z",
          "health": "Good"
        }
      ]
    }
  }
  ```

#### Update Tree Health
- **URL**: `PUT /trees/:id`
- **Auth Required**: **Yes (Bearer JWT Token)**
- **Request Body**:
  ```json
  {
    "health": "Poor"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "tree": {
        "id": "fd90b8f0-1c4b-4890-...",
        "species": "Neem",
        "latitude": -1.2921,
        "longitude": 36.8219,
        "plantingDate": "2023-01-15T00:00:00.000Z",
        "health": "Poor",
        "updatedAt": "2026-05-26T07:55:00.000Z"
      }
    }
  }
  ```

#### Get Summary Statistics
- **URL**: `GET /trees/stats`
- **Auth Required**: None
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "totalTrees": 10,
      "speciesBreakdown": {
        "Neem": 3,
        "Mango": 2,
        "Teak": 2,
        "Moringa": 2,
        "Eucalyptus": 1
      },
      "healthBreakdown": {
        "Good": 6,
        "Fair": 2,
        "Poor": 2
      },
      "percentageGoodHealth": 60
    }
  }
}
```

---

## Postman Testing
The file `Tree_Monitoring_API.postman_collection.json` is included in the project root.

### How to use it:
1. Open Postman.
2. Click **Import** (top left) and select `Tree_Monitoring_API.postman_collection.json`.
3. The collection is pre-configured with local variables:
   - `base_url`: `http://localhost:3000`
   - `jwt_token`: Automatically captured and saved when you run the **User Login** request.
4. Execute **User Login** first to acquire the auth token automatically, then run any protected requests (e.g. Add Tree, Update Tree Health).
