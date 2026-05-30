# TestFlow - Advanced Test Management Platform

## 🚀 New Features (v2.0)

TestFlow has been upgraded with **5 powerful enterprise features**:

### 1. **Real-time Dashboard** ⚡
- Live updates of test execution with WebSocket
- Monitor running tests across all environments
- Real-time status indicators for each test
- Environment load visualization

### 2. **Advanced Analytics & Insights** 📊
- Comprehensive test analytics dashboard
- Pass rate trends over time
- Flaky test detection
- Top failing tests identification
- Test duration analytics
- Performance benchmarking

### 3. **Test Environment Management** 🔧
- Support for multiple environments (Dev, Staging, QA, Production)
- Environment health status monitoring
- Configure environment-specific settings
- Track environment performance

### 4. **Notifications & Alerts** 🔔
- Multi-channel notifications (Email, Slack, In-App)
- Critical test failure alerts
- Customizable notification preferences
- Daily test summary reports
- Test completion notifications

### 5. **Integrations** 🔗
- **GitHub Integration**: Push test results to repos
- **Jira Integration**: Link tests to issues
- **GitHub Actions**: Trigger tests in CI/CD pipelines
- **Jenkins Integration**: Orchestrate test runs
- **Slack Integration**: Send alerts and reports
- Test connection verification
- Automated data syncing

---

## 📋 Project Structure

### Backend (`/backend`)
```
models/
├── User.js                  # User with role-based access
├── Environment.js           # Environment configuration
├── TestExecution.js         # Test execution tracking
├── Notification.js          # Notification system
├── Integration.js           # Third-party integrations
└── Analytics.js             # Analytics data

routes/
├── environments.js          # Environment CRUD & status
├── analytics.js             # Analytics endpoints
├── notifications.js         # Notification management
├── integrations.js          # Integration management
└── tests.js                 # Real-time test tracking

middleware/
└── auth.js                  # JWT auth & role-based access
```

### Frontend (`/src/components`)
```
├── Analytics.jsx            # Analytics dashboard with charts
├── RealtimeDashboard.jsx    # Live test monitoring
├── NotificationCenter.jsx   # Notification UI
├── EnvironmentManagement.jsx # Manage test environments
└── IntegrationsManagement.jsx # Manage integrations
```

---

## 🛠️ Installation & Setup

### 1. **Install Dependencies**

```bash
# Frontend
npm install

# Backend
cd backend && npm install
```

### 2. **Environment Variables** (`.env` in backend)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/testflow
JWT_SECRET=your_jwt_secret_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 3. **Start Development**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

---

## 📊 API Endpoints

### Analytics
- `GET /api/analytics/dashboard` - Get analytics summary
- `GET /api/analytics/trend/pass-rate` - Get pass rate trends
- `GET /api/analytics/trend/duration` - Get duration trends
- `GET /api/analytics/distribution/status` - Get test distribution

### Environments
- `POST /api/environments` - Create environment
- `GET /api/environments` - List all environments
- `GET /api/environments/:id` - Get environment details
- `PUT /api/environments/:id` - Update environment
- `PATCH /api/environments/:id/status` - Update status
- `DELETE /api/environments/:id` - Delete environment

### Notifications
- `POST /api/notifications` - Create notification
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

### Integrations
- `POST /api/integrations` - Create integration
- `GET /api/integrations` - List integrations
- `POST /api/integrations/:id/test` - Test connection
- `POST /api/integrations/:id/sync` - Sync data
- `PUT /api/integrations/:id` - Update integration
- `DELETE /api/integrations/:id` - Delete integration

### Tests (Real-time)
- `POST /api/tests` - Create/update test execution
- `GET /api/tests/running` - Get running tests
- `GET /api/tests/:id` - Get test details

---

## 🔑 Key Technologies

**Frontend:**
- React 19 with Vite
- Recharts for analytics visualization
- Socket.io-client for real-time updates
- Tailwind CSS for styling
- React Router for navigation

**Backend:**
- Express.js
- MongoDB with Mongoose
- Socket.io for WebSocket
- JWT for authentication
- Nodemailer for emails
- Axios for HTTP requests

---

## 🎯 Next Steps

1. **Deploy MongoDB** - Set up MongoDB Atlas or local instance
2. **Configure Email** - Set up Gmail App Password or SMTP
3. **Add User Authentication** - Create login/signup flows
4. **Set up WebSocket** - Configure Socket.io server
5. **Create CI/CD pipelines** - Integrate with GitHub Actions/Jenkins

---

## 📝 License

MIT License

---

## 🤝 Contributing

Contributions welcome! Please create a feature branch and submit a PR.