# Node.js Express TypeScript SQLite Project

A backend API project built with modern JavaScript technologies.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side execution
- **Express**: Web framework for building REST APIs
- **TypeScript**: Type-safe JavaScript superset
- **SQLite**: Lightweight relational database
- **Sequelize**: ORM for database interactions

## Purpose

This project serves as a backend API with relational database support, implementing best practices for modern JavaScript development. The combination of Express and TypeScript provides a robust framework for building scalable applications, while SQLite offers a lightweight database solution.

## Features

- Type-safe API development with TypeScript
- RESTful API design with Express
- Data persistence with SQLite
- ORM integration with Sequelize
- Modern JavaScript practices and patterns

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run start

# Build for production
npm run compile
```

## Project Structure

```
├── src/
│   ├── controllers/   # Request handlers
│   ├── models/        # Data models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── db/            # Database configuration
│   ├── config/        # Application configuration
│   ├── middleware/    # Express middleware
│   ├── types/         # TypeScript type definitions
│   └── server.ts      # Entry point
├── tests/             # Test suite
├── scripts/           # Utility scripts
├── dist/              # Compiled output
├── tsconfig.json      # TypeScript configuration
└── package.json       # Dependencies and scripts
```
