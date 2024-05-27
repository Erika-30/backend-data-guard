# Data Guard: Robust Web Application

## Overview

Data Guard, a robust web application, is designed to manage user authentication and CSV data uploads. It ensures data integrity through extensive validation and provides a user-friendly interface for data management.

## Key Features

### User Authentication:

- Provides Signup, Login, and Logout functionality.
- Employs JWT-based authentication for secure access control.

### CSV Data Upload:

- Facilitates CSV file upload and parsing.
- Validates data against predefined schemas before storage.
- Stores validated data into the database.

### Database Management:

- Includes migration scripts for database creation and seeding.
- Offers comprehensive scripts for various database operations.

## Prerequisites

Ensure the following are installed on your system:

- Node.js (version 14.x or higher)
- PostgreSQL (version 12.x or higher)
- TypeScript

## Getting Started

### Installation

Clone the repository:

```sh
git clone https://github.com/yourusername/backend-data-guard.git
cd backend-data-guard
```

Install dependencies:

```sh
npm install
```

Set up environment variables: Create a .env file in the root directory and add the following variables:

```sh
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key
PGHOST=localhost
PGPORT=5432
PGDATABASE=yourdatabase
PGUSER=yourusername
PGPASSWORD=yourpassword
PGADMINDATABASE=postgres
```

### Database Setup

1. Create the database and tables:

```sh
npm run db:create
```

2. Apply migrations:

```sh
npm run db:migrate
```

3. Seed the database:

```sh
npm run db:seed
```

### Running the Application

Start the application in development mode:

```sh
npm run dev
```

The server will be running at http://localhost:3000.

## API Endpoints

### Authentication

- Signup: POST /auth/signup
- Login: POST /auth/login
- Logout: POST /auth/logout
- Protected Route: GET /auth/protected

## Data Upload

- Upload CSV: POST /user/upload
