# Astora Backend Platform

Enterprise-Level Backend Platform for WhatsApp, SMS, Calls, AI, and Store Management.

## 🚀 Features

### Core Modules

- **WhatsApp Integration**: Support for Baileys, Evolution API, WPPConnect, and Meta WhatsApp Business API
- **SMS Management**: Send, receive, schedule, and track SMS messages
- **Call Management**: Schedule calls, reminders, auto-redial, and call logs
- **AI Chatbot**: Multi-provider support (OpenAI, Gemini, Claude, DeepSeek, Ollama)
- **Store Management**: Products, categories, orders, customers, coupons, and analytics
- **Scheduler Engine**: One-time, recurring, cron-based task scheduling with BullMQ
- **Notifications**: Real-time notifications via WebSocket

### Security Features

- **Authentication**: JWT + Refresh Tokens
- **Authorization**: Role-Based Access Control (RBAC)
- **Encryption**: AES-256 encryption for sensitive data
- **Rate Limiting**: Configurable rate limiting to prevent abuse
- **Audit Logs**: Complete audit trail for all actions
- **Brute Force Protection**: Login attempt protection

### Technical Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **Queue**: BullMQ
- **Storage**: MinIO
- **Monitoring**: Prometheus + Grafana
- **Container**: Docker

## 📁 Project Structure

```
astora-backend/
├── src/
│   ├── modules/
│   │   ├── auth/                 # Authentication & Authorization
│   │   ├── users/                # User Management
│   │   ├── roles/                # Role Management
│   │   ├── permissions/           # Permission Management
│   │   ├── devices/               # Device Management
│   │   ├── sessions/              # Session Management
│   │   ├── whatsapp/              # WhatsApp Integration
│   │   ├── contacts/              # Contact Management
│   │   ├── chat/                  # Chat & Messaging
│   │   ├── scheduler/             # Task Scheduler
│   │   ├── sms/                   # SMS Management
│   │   ├── calls/                 # Call Management
│   │   ├── ai/                    # AI & Chatbot
│   │   ├── store/                 # Store Management
│   │   ├── notifications/          # Notifications
│   │   ├── logs/                  # Application Logs
│   │   └── audit-logs/            # Audit Logs
│   ├── common/
│   │   ├── decorators/            # Custom Decorators
│   │   ├── filters/               # Exception Filters
│   │   ├── interceptors/           # Interceptors
│   │   ├── middleware/             # Middleware
│   │   ├── dto/                   # Common DTOs
│   │   └── entities/               # Base Entities
│   ├── websocket/                  # WebSocket Gateway
│   ├── config/                     # Configuration
│   └── database/                   # Database Migrations
├── docker/
│   ├── docker-compose.yml         # Docker Compose
│   ├── Dockerfile                  # Production Dockerfile
│   ├── prometheus.yml             # Prometheus Config
│   └── nginx.conf                 # Nginx Config
├── database/
│   └── schema.sql                 # PostgreSQL Schema
└── test/
    └── jest-e2e.json              # E2E Test Config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd astora-backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Start with Docker:
```bash
docker-compose up -d
```

### Development

```bash
# Start in development mode
npm run start:dev

# Run tests
npm test

# Build for production
npm run build

# Start production
npm run start:prod
```

## 📚 API Documentation

Once the application is running, visit:
- Swagger UI: `http://localhost:3000/api/docs`
- Health Check: `http://localhost:3000/api/v1/health`

## 🔐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/change-password` - Change password

### WhatsApp
- `POST /api/v1/whatsapp/accounts` - Create WhatsApp account
- `GET /api/v1/whatsapp/accounts` - List accounts
- `POST /api/v1/whatsapp/accounts/:id/connect` - Connect account
- `POST /api/v1/whatsapp/accounts/:id/messages` - Send message
- `POST /api/v1/whatsapp/accounts/:id/media` - Send media

### Chat
- `GET /api/v1/chats` - List chat threads
- `GET /api/v1/chats/:id/messages` - Get messages
- `POST /api/v1/chats/:id/mark-read` - Mark as read
- `POST /api/v1/chats/:id/archive` - Archive chat

### Scheduler
- `POST /api/v1/scheduler/tasks` - Create task
- `GET /api/v1/scheduler/tasks` - List tasks
- `POST /api/v1/scheduler/campaigns` - Create campaign

### AI
- `POST /api/v1/ai/conversations` - Create conversation
- `POST /api/v1/ai/conversations/:id/messages` - Send message
- `POST /api/v1/ai/conversations/:id/recommend-product` - Get recommendations

### Store
- `POST /api/v1/store/products` - Create product
- `GET /api/v1/store/products` - List products
- `POST /api/v1/store/orders` - Create order
- `GET /api/v1/store/analytics` - Get analytics

## 🔌 WebSocket Events

### Client Events
- `authenticate` - Authenticate socket connection
- `subscribe_chat` - Subscribe to chat updates
- `subscribe_whatsapp` - Subscribe to WhatsApp events
- `typing` - Send typing indicator

### Server Events
- `new_message` - New message received
- `message_sent` - Message sent confirmation
- `message_delivered` - Message delivered
- `message_read` - Message read receipt
- `task_created` - Task created
- `task_completed` - Task completed
- `task_failed` - Task failed
- `whatsapp.connection` - WhatsApp connection status
- `whatsapp.qr` - QR code for authentication

## 📊 Monitoring

### Prometheus Metrics
Available at `/metrics` endpoint.

### Grafana Dashboards
Access Grafana at `http://localhost:3001` (default credentials: admin/admin123)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Application port | `3000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_DATABASE` | Database name | `astora` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | Token expiry | `1h` |

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📈 Scaling

The platform is designed to scale horizontally:

1. **Stateless Design**: All state is stored in PostgreSQL/Redis
2. **Queue-Based Processing**: BullMQ handles async tasks
3. **Redis Caching**: Reduces database load
4. **WebSocket Scaling**: Use Redis adapter for multi-instance WebSocket

## 🔒 Security

- All passwords hashed with bcrypt (12 rounds)
- JWT tokens with configurable expiry
- Rate limiting on all endpoints
- CORS configuration
- Helmet.js for security headers
- Input validation with class-validator
- SQL injection prevention via TypeORM

## 📄 License

MIT License
