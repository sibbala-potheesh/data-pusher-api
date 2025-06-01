# Data Pusher

## Overview

Data Pusher is an Express.js web application designed to receive data for specific accounts and forward that data to multiple configured external platforms (destinations) via webhooks. Each account can have multiple destinations with customizable HTTP methods and headers.

---

## Getting Started

To install dependencies:

```bash
npm i
```

To run the application in development mode:

```bash
npm run dev
```

---

## Features

- Manage Accounts with unique email and auto-generated secret tokens
- Manage multiple Destinations per Account with configurable URL, HTTP method, and headers
- Receive JSON data securely using an app secret token
- Forward data to all destinations of an account using specified HTTP method and headers
- Handle different HTTP methods (GET, POST, PUT) appropriately
- Clean-up related Destinations when an Account is deleted
- Use Postman or Thunder Client to test API endpoints easily

---

## Modules

### 1. Account Module

- Fields:
  - **email** (string, mandatory, unique)
  - **accountId** (string, unique)
  - **accountName** (string, mandatory)
  - **appSecretToken** (string, auto-generated)
  - **website** (string, optional)

### 2. Destination Module

- Belongs to an Account
- Fields:
  - **url** (string, mandatory)
  - **httpMethod** (string, mandatory; e.g., GET, POST, PUT)
  - **headers** (object, mandatory; key-value pairs, multiple headers supported)

Example headers:

```json
{
  "APP_ID": "1234APPID1234",
  "APP_SECRET": "enwdj3bshwer43bjhjs9ereuinkjcnsiurew8s",
  "ACTION": "user.update",
  "Content-Type": "application/json",
  "Accept": "*"
}
```

### 3. Data Handler Module

- **Endpoint:** `/server/incoming_data` (POST)
- **Functionality:**
  - Receives only JSON data via POST requests.
  - Requires `CL-X-TOKEN` header containing the app secret token.
  - Identifies the account using the secret token.
  - Forwards the received data to all destinations configured for the account:
    - If the destination's HTTP method is **GET**, sends the data as query parameters.
    - If the method is **POST** or **PUT**, sends the data as JSON in the request body.
  - Uses any Node.js HTTP client (e.g., `axios`, `node-fetch`) to forward data.
- **Validation:**
  - If the secret token is missing, responds with `{ "message": "Un Authenticate" }`.
  - If the HTTP method is GET and the incoming data is not JSON, responds with `{ "message": "Invalid Data" }`.

---

## API Endpoints

### Account APIs

- **Create Account:** `POST /accounts`
- **Read Account(s):** `GET /accounts` or `GET /accounts/:accountId`
- **Update Account:** `PUT /accounts/:accountId`
- **Delete Account:** `DELETE /accounts/:accountId`
  - Deleting an account also deletes all its destinations.

### Destination APIs

- **Create Destination:** `POST /accounts/:accountId/destinations`
- **Read Destinations:** `GET /accounts/:accountId/destinations`
- **Update Destination:** `PUT /destinations/:destinationId`
- **Delete Destination:** `DELETE /destinations/:destinationId`

### Data Handler API

- **Receive Data:** `POST /server/incoming_data`
  - Headers: `CL-X-TOKEN: <appSecretToken>`
  - Body: JSON data

---

## Example Workflow

1. **Create an Account**
   Register an account with a unique email and account name. The app secret token is auto-generated.

2. **Add Destinations**
   Add one or more destinations to the account, specifying the URL, HTTP method, and headers.

3. **Send Data**
   Send a POST request with JSON data to `/server/incoming_data` including the `CL-X-TOKEN` header. The server identifies the account and forwards the data to all destinations.

---

## Notes

- All data is handled securely using the app secret token.
- Destinations are automatically cleaned up when an account is deleted.
- Supports flexible HTTP methods and custom headers for each destination.
- Proper error messages are returned for authentication and data validation issues.
- You can use API testing tools like Postman or Thunder Client to verify and interact with the endpoints.

---
