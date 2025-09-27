\# Bookstore API (Node.js + Express)



A tiny demo API with CI/CD on Jenkins and Docker.



\## Endpoints

\- `GET /health` → `{ "status": "ok" }`

\- `GET /books` → returns an in-memory list of books



\## Run locally

```bash

npm ci

node ./src/app.js

\# open http://localhost:3000/health



