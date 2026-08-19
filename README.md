# User Administration API

The backend for a portfolio administration panel that manages users and roles. It exposes a documented REST API, authenticates administrators with short-lived JWT access tokens and rotating refresh tokens, and stores data in MongoDB.

> Despite the repository's original SSO name, this service does not implement an identity provider or an OAuth/OIDC single sign-on flow. It is the administration API for the project and currently uses email/password authentication.

## Table of contents

- [Highlights](#highlights)
- [Architecture](#architecture)
- [Security decisions](#security-decisions)
- [Requirements](#requirements)
- [Local setup](#local-setup)
- [Environment variables](#environment-variables)
- [API documentation](#api-documentation)
- [Main endpoints](#main-endpoints)
- [Quality and tests](#quality-and-tests)
- [Deployment](#deployment)
- [Tradeoffs and next steps](#tradeoffs-and-next-steps)
- [License](#license)

## Highlights

- TypeScript application built with Express 5
- MongoDB persistence through Mongoose
- Runtime validation and response shaping with Zod
- Generated OpenAPI 3 documentation with an interactive Swagger UI
- HTTP-only access and refresh-token cookies
- Authorization based on an immutable role key
- Public guest-administrator login for portfolio demonstrations
- Protection against deleting system-managed users and roles
- Unit and integration tests with Vitest and Supertest
- GitHub Actions automation and Vercel serverless support

## Architecture

Requests move through small layers with distinct responsibilities:

```text
route -> middleware -> controller -> service -> DAL -> MongoDB
                              |
                              -> Zod validation
```

- `routes/` defines endpoints, middleware order, and OpenAPI metadata.
- `controllers/` translates HTTP requests and responses.
- `services/` contains validation and business rules.
- `composite-services/` coordinates operations spanning multiple services.
- `dal/` contains database queries.
- `models/` defines MongoDB persistence models.
- `schemas/` defines runtime validation and public response shapes.
- `middleware/` handles authentication, authorization, errors, and redacted request logging.
- `utilities/` contains reusable token, password, and documentation support.

## Security decisions

- Passwords are hashed with bcrypt and removed from API responses.
- Tokens are stored in HTTP-only cookies, and production cookies require HTTPS.
- Protected routes resolve the current user from the database and require the immutable `admin` role key.
- The public guest login authenticates an existing guest-administrator account without exposing its credentials to the frontend.
- Required users and roles use an immutable `systemManaged` flag and cannot be deleted through their delete endpoints.
- CORS accepts only the configured frontend origin.

This is intentionally a portfolio application rather than a complete identity platform. Refresh-token revocation, distributed rate limiting, audit-log persistence, and OAuth/OIDC federation would be appropriate next steps for a larger production system.

## Requirements

- Node.js 24
- pnpm 11.20.0
- MongoDB

## Local setup

1. Clone the repository and install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env` file using the variables documented below and replace every placeholder.

3. Ensure the database contains a role whose immutable key is `admin`, plus the administrator referenced by `GUEST_LOGIN_EMAIL` if guest login is enabled.

4. Start the development server:

   ```bash
   pnpm dev
   ```

The API defaults to `http://localhost:8080`.

## Environment variables

| Variable | Purpose | Example |
| --- | --- | --- |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/users_dev` |
| `JWT_SECRET` | Token signing secret; at least 32 characters | Generate a random value |
| `ACCESS_TOKEN_NAME` | Access-token cookie name | `accessToken` |
| `ACCESS_TOKEN_EXPIRATION` | Access-token lifetime | `15m` |
| `REFRESH_TOKEN_NAME` | Refresh-token cookie name | `refreshToken` |
| `REFRESH_TOKEN_EXPIRATION` | Refresh-token lifetime | `7d` |
| `CORS_ORIGIN` | Exact frontend origin allowed by CORS | `http://localhost:3000` |
| `GUEST_LOGIN_EMAIL` | Existing portfolio guest administrator | `guest@example.com` |
| `GUEST_LOGIN_PASSWORD` | Guest password; at least eight characters | Use a non-sensitive demo password |

Never commit `.env` files or production credentials.

## API documentation

The deployed API is available at [`https://sso-users-admin-panel-backend.vercel.app/`](https://sso-users-admin-panel-backend.vercel.app/). The root URL displays the API home route; use the [live interactive API documentation](https://sso-users-admin-panel-backend.vercel.app/docs) to explore and test the available endpoints.

With the API running:

- Interactive documentation: [`http://localhost:8080/docs`](http://localhost:8080/docs)
- OpenAPI JSON: [`http://localhost:8080/openapi.json`](http://localhost:8080/openapi.json)

Swagger UI browser assets are loaded from a pinned CDN release. The OpenAPI document itself is generated and served by this application, avoiding reliance on package static files inside a serverless deployment.

## Main endpoints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/login` | Public | Administrator login |
| `POST` | `/api/v1/auth/login/guest` | Public | Portfolio guest login |
| `POST` | `/api/v1/auth/tokens/new` | Refresh cookie | Rotate tokens |
| `POST` | `/api/v1/auth/logout` | Administrator | Clear authentication cookies |
| `GET` | `/api/v1/me/` | Administrator | Return the current user |
| `GET` | `/api/v1/users` | Administrator | List users |
| `PUT` | `/api/v1/users` | Administrator | Create or update a user |
| `DELETE` | `/api/v1/users/:id` | Administrator | Delete a non-system user |
| `GET` | `/api/v1/roles` | Administrator | List roles |
| `PUT` | `/api/v1/roles` | Administrator | Create or update a role |
| `DELETE` | `/api/v1/roles/:id` | Administrator | Delete a non-system role |
| `GET` | `/api/v1/dashboard/stats` | Administrator | Return dashboard totals |

The interactive documentation is the source of truth for request and response schemas.

## Quality and tests

```bash
pnpm quality:check       # formatting, unused code, and TypeScript
pnpm test:unit           # isolated service and utility tests
pnpm test:integrations   # HTTP tests against the configured test database
```

Integration tests create temporary records and remove them afterward. Use a dedicated test database; never point automated integration workflows at production.

GitHub Actions runs quality checks and unit tests on every push. A scheduled workflow runs integration tests using repository secrets and a separate MongoDB test connection.

## Deployment

The Express application exports the configured app without opening a listener when running on Vercel. Configure all environment variables in the Vercel project and use the production frontend URL for `CORS_ORIGIN`.

After deployment, verify `/`, `/openapi.json`, and `/docs`, then test authentication and the protected API routes.

## Tradeoffs and next steps

- Persist hashed refresh-token identifiers to support revocation and reuse detection.
- Add platform-backed rate limiting to authentication routes.
- Redact credentials and authentication cookies from application logs.
- Restrict the public guest administrator to non-destructive demo operations.
- Add persistent audit events for administrative mutations.
- Introduce granular permissions if roles expand beyond administrator access.
- Add OAuth 2.0/OpenID Connect only if the project evolves into actual SSO.

## License

Licensed under the ISC License. See [LICENSE](LICENSE).
