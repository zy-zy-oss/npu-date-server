# NPU Date Server

Backend service for the NPU Date campus matching platform.

**Tech stack:** Node.js + Express + SQLite + Redis + Nodemailer

## Prerequisites

| Dependency | Version |
|------------|---------|
| Node.js    | >= 18   |
| npm        | >= 9    |
| Redis      | >= 6    |

### Install Redis

**macOS:**

```bash
brew install redis
brew services start redis
```

**Linux (Debian/Ubuntu):**

```bash
sudo apt update && sudo apt install -y redis-server
sudo systemctl enable --now redis-server
```

**Linux (Fedora/RHEL):**

```bash
sudo dnf install -y redis
sudo systemctl enable --now redis
```

Verify Redis is running:

```bash
redis-cli ping
# Expected: PONG
```

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env from the example
cp .env.example .env

# 3. Edit .env with your email credentials and other settings
#    At minimum, set EMAIL_USER and EMAIL_PASSWORD for verification emails to work.
```

## Environment Variables

| Variable       | Required | Default               | Description                        |
|----------------|----------|-----------------------|------------------------------------|
| PORT           | No       | 5001                  | Server listen port                 |
| NODE_ENV       | No       | development           | Environment mode                   |
| JWT_SECRET     | Yes      | -                     | JWT signing key                    |
| EMAIL_USER     | Yes      | -                     | SMTP sender address (163/Gmail)    |
| EMAIL_PASSWORD | Yes      | -                     | SMTP authorization code            |
| APP_URL        | No       | http://localhost:3000  | Frontend URL (used in emails)      |
| REDIS_HOST     | No       | 127.0.0.1             | Redis host                         |
| REDIS_PORT     | No       | 6379                  | Redis port                         |

## Run

```bash
# Development
npm run dev

# Production
npm start
```

The server starts at `http://localhost:5001` by default. Verify with:

```bash
curl http://localhost:5001/health
```

## API Endpoints

| Method | Path                        | Description          |
|--------|-----------------------------|----------------------|
| GET    | /health                     | Health check         |
| GET    | /api/questionnaire          | Get base questionnaire  |
| GET    | /api/questionnaire/type/date  | Get date questionnaire  |
| GET    | /api/questionnaire/type/buddy | Get buddy questionnaire |
| GET    | /api/questionnaire/type/mbti  | Get MBTI questionnaire  |
| POST   | /api/questionnaire/submit   | Submit questionnaire |
| POST   | /api/auth/send-code         | Send verification code |
| POST   | /api/auth/verify-code       | Verify email code    |

## Project Structure

```
npu-date-server/
├── src/
│   ├── server.js              # Entry point
│   ├── db/
│   │   ├── database.js        # SQLite connection & schema
│   │   └── redis.js           # Redis connection
│   ├── routes/
│   │   ├── auth.js            # Email verification endpoints
│   │   └── questionnaire.js   # Questionnaire CRUD endpoints
│   ├── services/
│   │   └── emailService.js    # Nodemailer email sending
│   └── data/
│       └── questionnaires.js  # Questionnaire definitions
├── data/                      # SQLite DB files (auto-created)
├── .env                       # Environment config (do not commit)
├── .env.example               # Environment template
└── package.json
```

## Database Schema

**questionnaires** - one record per (email, type) pair; re-submission overwrites the old record.

| Column     | Type     | Note                           |
|------------|----------|--------------------------------|
| id         | INTEGER  | Primary key                    |
| email      | TEXT     | User email                     |
| type       | TEXT     | `base` / `date` / `buddy`     |
| answers    | TEXT     | JSON blob                      |
| updated_at | DATETIME | Auto-updated on each write     |

Unique constraint: `(email, type)`

**matches** - stores matching results between two users.

| Column       | Type     | Note                                    |
|--------------|----------|-----------------------------------------|
| id           | INTEGER  | Primary key                             |
| user_a_email | TEXT     | First user                              |
| user_b_email | TEXT     | Second user                             |
| type         | TEXT     | `date` / `buddy`                        |
| score        | REAL     | Match score                             |
| status       | TEXT     | `pending` / `accepted` / `rejected`     |
| matched_at   | DATETIME | When the match was created              |
