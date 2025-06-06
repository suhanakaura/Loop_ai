# Data Ingestion API System

This project provides a simple RESTful API system to simulate prioritized, rate-limited data ingestion.

## Features

- POST `/ingest`: Submits a new ingestion job
- GET `/status/:id`: Checks status of a given ingestion request
- Prioritized queue processing
- Batches of 3 IDs
- One batch every 5 seconds
- In-memory data store

## How to Run

```bash
npm install
node index.js
