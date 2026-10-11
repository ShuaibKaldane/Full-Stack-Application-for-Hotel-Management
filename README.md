# Harbor House Hotel Management

A modern hotel management platform built with React, Express, and MySQL.

The application includes two role-based experiences:

- **Customer portal** — create an account, sign in, browse hotel properties, book stays, order breakfast/lunch/dinner, and book sightseeing cabs.
- **Super admin portal** — view hotel activity and reservations, search bookings, and create reservations for guests.

## Features

### Customer

- Customer signup and login
- JWT-based authentication when the backend is connected
- Browse available properties and room types
- Book hotel stays
- View personal reservations
- Browse breakfast, lunch, and dinner menus
- Add dishes to an order cart
- Place food orders
- Browse sightseeing experiences
- Book hotel cab/sightseeing transportation

### Super admin

- Dedicated role-based dashboard
- View all user reservations
- Search reservations
- Create bookings for guests
- Review occupancy and revenue overview
- Access operations shortcuts for housekeeping and restaurant workflows

### Backend

- Express.js REST API
- MySQL database integration using `mysql2`
- Password hashing with `bcrypt`
- JWT authentication
- Role-based authorization
- Room booking date validation
- Double-booking prevention
- Customer, property, room, menu, food order, and cab booking tables
- Health check endpoint

## Tech stack

### Frontend

- React
- Vite
- Lucide React icons
- Manrope and DM Serif Display fonts
- Responsive CSS

### Backend

- Node.js
- Express.js
- MySQL
- JWT
- bcrypt
- dotenv
- CORS

## Project structure

```text
.
├── src/
│   ├── main.jsx          # React application and portal flows
│   └── styles.css        # Responsive application styling
├── server/
│   ├── db.js             # MySQL connection pool
│   └── index.js          # Express API server
├── sql/
│   ├── schema.sql        # Database and table definitions
│   └── seed.sql          # Initial admin and sample data
├── index.html
├── vite.config.js        # Vite config and API proxy
├── package.json
└── .env.example
```

## Requirements

- Node.js 18+
- npm 9+
- MySQL 8+

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/harbor-house-hotel.git
cd harbor-house-hotel
npm install
```

## Environment configuration

Create a local environment file from the example:

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS/Linux

```bash
cp .env.example .env
```

Update `.env` with your MySQL credentials and a strong JWT secret.

Example:

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=replace-this-with-a-long-random-secret
DB_HOST=localhost
DB_PORT=3306
DB_NAME=harbor_house
DB_USER=root
DB_PASSWORD=your_mysql_password
```

Do not commit `.env` to GitHub. The `.gitignore` file should contain:

```gitignore
.env
node_modules/
dist/
```

## Database setup

Start MySQL, then run the schema and seed scripts.

### macOS/Linux

```bash
mysql -u root -p < sql/schema.sql
mysql -u root -p < sql/seed.sql
```

### Windows PowerShell

```powershell
cmd /c "mysql -u root -p < sql/schema.sql"
cmd /c "mysql -u root -p < sql/seed.sql"
```

The seed script creates the single super admin account.

## Super admin login

```text
Email: admin@gmail.com
Password: test1234
```

Change this password before using the project in a real environment.

## Run the application

Open two terminals.

### Terminal 1 — backend

```bash
npm run server
```

The API runs at:

```text
http://localhost:4000
```

### Terminal 2 — frontend

```bash
npm run dev
```

The frontend runs at the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

The Vite development server proxies `/api` requests to the Express server.

## Available scripts

```bash
npm run dev          # Start the Vite frontend
npm run server       # Start the Express API
npm run server:watch # Start the API with Node watch mode
npm run build        # Create a production frontend build
npm run preview      # Preview the production frontend build
npm run check:server # Validate server JavaScript syntax
```

## API overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Properties and rooms

```text
GET  /api/properties
GET  /api/rooms
POST /api/properties       # Admin only
POST /api/rooms            # Admin only
```

### Hotel bookings

```text
GET   /api/bookings
POST  /api/bookings
PATCH /api/bookings/:id    # Admin only
```

### Restaurant and menu

```text
GET  /api/menu-items
POST /api/menu-items       # Admin only
GET  /api/orders
POST /api/orders
```

### Cab bookings

```text
GET  /api/cab-bookings
POST /api/cab-bookings
```

### Users and health

```text
GET /api/users             # Admin only
GET /api/health
```

## Frontend fallback mode

The frontend includes a local browser-storage fallback so the interface can still be previewed when MySQL or the Express API has not been configured. For real persistent data, configure MySQL and run the backend.

Local fallback data is stored in browser `localStorage` keys prefixed with `hh_`.

## Production notes

Before deploying this project:

- Replace the development JWT secret.
- Change the seeded admin password.
- Configure a production MySQL database.
- Restrict `CLIENT_ORIGIN` to the deployed frontend domain.
- Use HTTPS.
- Do not commit `.env`, database passwords, or generated build artifacts.
- Add rate limiting, request validation, logging, and production error monitoring.

## Verification

The project has been checked with:

```bash
npm run check:server
npm run build
```
