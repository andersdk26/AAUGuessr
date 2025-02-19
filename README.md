# AAUGuessr

Description

## How to Run Locally

### Prerequisites

Ensure you have the following installed:

1. [Node.js](https://nodejs.org/) (Version 22 or higher recommended)
2. [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
3. [rustup](https://rustup.rs/)
4. [PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) including pgAdmin

### Steps 1: **Clone the Repository**

```bash
git clone https://github.com/QuackSquad/AND-WebApp.git
cd AND-WebApp/frontend
```

### Steps 2: **Install Frontend Dependencies**

```bash
npm install
```

Or with Yarn:

```bash
yarn install
```

### Steps 3: **Run the Frontend Development Server**

Start the app locally:

```bash
npm run dev
```

Or with Yarn:

```bash
yarn dev
```

### Steps 4: **Create Database and User**

Create the database _AND-WebApp_ and the user \*AND-WebApp with all privileges

```sql
   CREATE DATABASE AND;

   CREATE USER "AND-WebApp" WITH PASSWORD 'abcd1234';

   GRANT ALL PRIVILEGES ON DATABASE "AND" TO "AND-WebApp";
```

### Steps 5: **Import tables**

Import tables from backup: _backend/database/AND.sql_

### Steps 6: **Install Backend Dependencies**

Set rust to nightly version

```bash
cd ../backend
rustup default nightly
```

### Steps 7: **Build Backend**

```bash
cargo build
```

### Steps 8: **Run Backend locally**

```bash
cargo run
```

### Steps 9: Access the App

Open your browser and navigate to:\
**http://localhost:5173**

## Build Frontend for Production

To create a production build:

```bash
npm run build
```

Or with Yarn:

```bash
yarn build
```

The optimized files will be located in the dist folder.
