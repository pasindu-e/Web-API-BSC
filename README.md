# Sri Lanka Police Tuk-Tuk Monitoring API

**NIBM Index:** COBSCCOMP251P-001  
A REST API for tracking vehicles, GPS pings, provinces, districts, and police stations across Sri Lanka.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Database | MongoDB Atlas (Mongoose ODM) |
| API Docs | Swagger UI (swagger-jsdoc + swagger-ui-express) |
| Environment | dotenv |
| Dev Server | nodemon |
| Testing | Jest + Supertest |

---

## Project Structure

```
web-api-bsc-app/
│
├── src/
│   ├── config/
│   │   ├── db.js            # MongoDB connection + in-memory data loader
│   │   ├── env.js           # Environment variable definitions
│   │   ├── logger.js        # Console logger utility
│   │   └── swagger.js       # OpenAPI 3.0 spec configuration
│   │
│   ├── controllers/         # HTTP request/response handling
│   │   ├── district.controller.js
│   │   ├── ping.controller.js
│   │   ├── province.controller.js
│   │   ├── station.controller.js
│   │   └── vehicle.controller.js
│   │
│   ├── services/            # Business logic layer
│   │   ├── district.service.js
│   │   ├── ping.service.js
│   │   ├── province.service.js
│   │   ├── station.service.js
│   │   └── vehicle.service.js
│   │
│   ├── repositories/        # Data access layer (MongoDB queries)
│   │   ├── district.repository.js
│   │   ├── ping.repository.js
│   │   ├── province.repository.js
│   │   ├── station.repository.js
│   │   └── vehicle.repository.js
│   │
│   ├── models/              # Data shape definitions (JSDoc typedefs)
│   │   ├── district.model.js
│   │   ├── ping.model.js
│   │   ├── province.model.js
│   │   ├── station.model.js
│   │   └── vehicle.model.js
│   │
│   ├── routes/              # Express route definitions
│   │   ├── district.routes.js
│   │   ├── ping.routes.js
│   │   ├── province.routes.js
│   │   ├── station.routes.js
│   │   ├── vehicle.routes.js
│   │   └── index.js         # Aggregates all routes under /v1/api
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js        # X-API-Key authentication
│   │   ├── error.middleware.js       # Global error handler
│   │   └── validation.middleware.js  # Request body validation factory
│   │
│   ├── validators/
│   │   └── ping.validator.js         # Ping body validation rules
│   │
│   ├── utils/
│   │   ├── ApiError.js       # Custom error class with HTTP status
│   │   ├── ApiResponse.js    # Standardised success response wrapper
│   │   ├── asyncHandler.js   # Wraps async controllers for error forwarding
│   │   └── constants.js      # HTTP status code constants
│   │
│   ├── app.js               # Express app setup (no listen call)
│   └── server.js            # MongoDB connect → app.listen
│
├── tests/
│   ├── pings.test.js
│   └── vehicles.test.js
│
├── .env                     # Local environment variables (not committed)
├── .env.example             # Environment variable template
├── nodemon.json             # nodemon watch configuration
├── generateSeed.js          # Seed data generator (outputs seed.json)
└── package.json
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env` and fill in your MongoDB Atlas URI:
```bash
cp .env.example .env
```

```env
PORT=5000
API_KEY=key_v01
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net
MONGODB_DB=web-api-bsc
```

### 3. Run the server
```bash
# Production
npm start

# Development (auto-restart on changes)
npm run dev
```

### 4. Run tests
```bash
npm test
```

---

## API Endpoints

Base URL: `http://localhost:5000`  
Interactive docs: `http://localhost:5000/api-docs`

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/v1/api/provinces` | Get all provinces |
| GET | `/v1/api/provinces/:id` | Get a province by ID |
| GET | `/v1/api/districts` | Get all districts |
| GET | `/v1/api/districts/:id` | Get a district by ID |
| GET | `/v1/api/stations` | Get all stations |
| GET | `/v1/api/stations/:id` | Get a station by ID |
| GET | `/v1/api/vehicles` | Get all vehicles |
| GET | `/v1/api/vehicles/:id` | Get a vehicle by ID (includes `last_ping`) |
| GET | `/v1/api/vehicles/:id/pings` | Get all pings for a vehicle |
| GET | `/v1/api/vehicles/:id/last-position` | Get most recent ping for a vehicle |
| GET | `/v1/api/pings` | Get all pings |
| GET | `/v1/api/pings/:id` | Get a ping by ID |

### Protected Endpoints

Requires header: `X-API-Key: key_v01`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/api/vehicles/:id/pings` | Create a new GPS ping for a vehicle |

**POST body:**
```json
{
  "latitude": 6.9271,
  "longitude": 79.8612,
  "timestamp": "2026-06-21T14:16:41.979Z"
}
```
Returns `201 Created` with a `Location` header pointing to the new ping.

---

## Response Format

**Success**
```json
{
  "success": true,
  "message": "Success",
  "data": { }
}
```

**Error**
```json
{
  "success": false,
  "message": "Resource not found",
  "errors": []
}
```

---

## Architecture

The project follows a layered architecture to separate concerns:

```
Request → Route → Controller → Service → Repository → MongoDB
                                  ↑
                             ApiError thrown
                                  ↓
                          Error Middleware → Response
```

- **Routes** — define URL paths and apply middleware
- **Controllers** — extract request data, call services, send responses
- **Services** — business logic; throw `ApiError` for domain violations
- **Repositories** — only layer that reads/writes data
- **Middlewares** — auth, validation, and error handling applied as pipeline steps
