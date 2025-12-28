# Propertia Backend Documentation



<div align="center">
  <img src="./frontend/src/assets/home-regular-24.png" alt="Propertia Logo" width="100" />
  
  <h2>🏠 Propertia Backend API</h2>
  
  > Complete guide to setup and run the Propertia backend server
  
  [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express-4.21+-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-8.9+-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
</div>

---

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [📦 Prerequisites](#-prerequisites)
- [⚙️ Installation](#️-installation)
- [🔧 Configuration](#-configuration)
- [🏃‍♂️ Running the Application](#️-running-the-application)
- [🐳 Docker Setup](#-docker-setup)
- [📡 API Endpoints](#-api-endpoints)
- [🔌 Environment Variables](#-environment-variables)
- [🛠️ Development](#️-development)
- [🚀 Deployment](#-deployment)
- [🔍 Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd "house rental website/backend"

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

---

## 📦 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **MongoDB** - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recommended) or local installation
- **Git** - [Download](https://git-scm.com/)

### Optional but Recommended:
- **Docker** & **Docker Compose** - [Download](https://www.docker.com/) (for containerized deployment)
- **Postman** or **Thunder Client** - For API testing

---

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "house rental website"
```

### 2. Navigate to Backend Directory
```bash
cd backend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Verify Installation
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v8.0.0 or higher
```

---

## 🔧 Configuration

### 1. Environment Setup

Create a `.env.local` file in the `backend` directory:

```bash
cp .env.example .env.local  # If .env.example exists
# OR
touch .env.local            # Create new file
```

### 2. Configure Environment Variables

Add the following variables to your `.env.local` file:

```env
# Environment Variables Configuration
# Copy this file to .env.local and fill in your actual values

# ===========================================
# SERVER CONFIGURATION
# ===========================================
PORT=4000
NODE_ENV=development
BACKEND_URL="http://localhost:4000"

# ===========================================
# DATABASE CONFIGURATION
# ===========================================
# MongoDB Connection String
# Get this from MongoDB Atlas or use local MongoDB
MONGO_URI="your_mongodb_connection_string_here"

# ===========================================
# AUTHENTICATION & SECURITY
# ===========================================
# Generate a strong random string for JWT
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# ===========================================
# EMAIL CONFIGURATION (Required for user notifications)
# ===========================================
# Brevo (SendinBlue) SMTP Configuration
SMTP_USER="your_smtp_user@smtp-brevo.com"
SMTP_PASS="your_smtp_password"
EMAIL="your_email@gmail.com"

# Admin Credentials
ADMIN_EMAIL="admin@buildestate.com"
ADMIN_PASSWORD="secure_admin_password_123"

# ===========================================
# FRONTEND CONFIGURATION
# ===========================================
# URL where your frontend is running
WEBSITE_URL="http://localhost:5173"

# ===========================================
# IMAGE STORAGE (Optional - ImageKit)
# ===========================================
# Sign up at https://imagekit.io for free account
IMAGEKIT_PUBLIC_KEY="public_your_public_key_here"
IMAGEKIT_PRIVATE_KEY="private_your_private_key_here"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_endpoint"

# ===========================================
# AI SERVICES (Optional - for property search)
# ===========================================
# Firecrawl for web scraping - https://www.firecrawl.dev/
FIRECRAWL_API_KEY=fc-your_firecrawl_api_key_here

# HuggingFace for AI models - https://huggingface.co/
HUGGINGFACE_API_KEY=hf_your_huggingface_api_key_here
MODEL_ID=mistralai/Mistral-7B-Instruct-v0.2

# OpenRouter for AI services - https://openrouter.ai/
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_api_key_here

# OpenAI API - https://platform.openai.com/
OPENAI_API_KEY=sk-proj-your_openai_api_key_here

# Azure AI Services - https://azure.microsoft.com/en-us/products/ai-services,
#https://github.com/marketplace/models
AZURE_API_KEY=your_azure_api_key_here
USE_AZURE=true
```

### 3. Database Setup

#### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Replace `MONGO_URI` in `.env.local`

#### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGO_URI=mongodb://localhost:27017/buildestate`

---

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Start with auto-reload (recommended for development)
npm run dev

# OR start without auto-reload
npm start
```

### Production Mode
```bash
# Set NODE_ENV to production
export NODE_ENV=production

# Start the server
npm start
```

### Verify Server is Running
- Open your browser and visit: `http://localhost:4000`
- You should see a health check response
- API status endpoint: `http://localhost:4000/status`

---

## 🐳 Docker Setup

### Prerequisites
- Docker and Docker Compose installed

### 1. Using Docker Compose (Recommended)
```bash
# From the project root directory
cd backend

# Build and start the container
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop the container
docker-compose down
```

### 2. Using Docker Directly
```bash
# Build the Docker image
docker build -t buildestate-backend .

# Run the container
docker run -p 4000:4000 --env-file .env.local buildestate-backend

# Run in background
docker run -d -p 4000:4000 --env-file .env.local buildestate-backend
```

### 3. Docker Environment Variables
When using Docker, ensure your `.env.local` file has the correct database URL:
```env
# For Docker, use host.docker.internal for local MongoDB
MONGO_URI=mongodb://host.docker.internal:27017/buildestate

# OR use MongoDB Atlas (recommended)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/buildestate
```

---

## 📡 API Endpoints

### Base URL
- **Development**: `http://localhost:4000`
- **Production**: `https://your-deployment-url.com`

### Authentication Endpoints
```
POST   /api/users/register          # User registration
POST   /api/users/login             # User login
POST   /api/users/forgot            # Password reset request
POST   /api/users/reset/:token      # Reset password
POST   /api/users/admin             # Admin login
GET    /api/users/me                # Get current user info
```

### Property Endpoints
```
GET    /api/products                # Get all properties
POST   /api/products                # Create new property (admin)
PUT    /api/products/:id            # Update property (admin)
DELETE /api/products/:id            # Delete property (admin)
POST   /api/properties/search       # AI-powered property search
GET    /api/locations/:city/trends  # Get location trends
```

### Appointment Endpoints
```
GET    /api/appointments             # Get user appointments
POST   /api/appointments             # Create new appointment
PUT    /api/appointments/:id         # Update appointment
DELETE /api/appointments/:id         # Cancel appointment
```

### Forms & Contact
```
POST   /api/forms                   # Submit contact form
GET    /api/forms                   # Get form submissions (admin)
```

### News & Blog
```
GET    /api/news                    # Get news articles
POST   /api/news                    # Create news article (admin)
PUT    /api/news/:id                # Update news article (admin)
DELETE /api/news/:id                # Delete news article (admin)
```

### Admin Endpoints
```
GET    /api/admin/stats             # Get dashboard statistics
GET    /api/admin/users             # Get all users
GET    /api/admin/properties        # Get all properties
```

---

## 🔌 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `NODE_ENV` | Environment mode | `development` or `production` |

### Email Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `SMTP_USER` | SMTP username | Yes |
| `SMTP_PASS` | SMTP password | Yes |
| `EMAIL` | Sender email | Yes |
| `ADMIN_EMAIL` | Admin email | Yes |
| `ADMIN_PASSWORD` | Admin password | Yes |

### AI Services (Optional)

| Variable | Description | Required |
|----------|-------------|----------|
| `FIRECRAWL_API_KEY` | Web scraping API | No |
| `OPENAI_API_KEY` | OpenAI API key | No |
| `AZURE_API_KEY` | Azure AI API key | No |
| `HUGGINGFACE_API_KEY` | HuggingFace API key | No |

### Image Storage

| Variable | Description | Required |
|----------|-------------|----------|
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key | No |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key | No |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit endpoint | No |

---

## 🛠️ Development

### Project Structure
```
backend/
├── config/              # Configuration files
│   ├── config.js        # App configuration
│   ├── mongodb.js       # Database connection
│   ├── imagekit.js      # Image storage config
│   └── nodemailer.js    # Email configuration
├── controller/          # Request handlers
│   ├── Usercontroller.js
│   ├── propertyController.js
│   ├── appointmentController.js
│   └── ...
├── middleware/          # Custom middleware
│   ├── authmiddleware.js
│   ├── multer.js
│   └── statsMiddleware.js
├── models/              # Database models
│   ├── Usermodel.js
│   ├── propertymodel.js
│   ├── appointmentModel.js
│   └── ...
├── routes/              # API routes
│   ├── UserRoute.js
│   ├── propertyRoutes.js
│   ├── appointmentRoute.js
│   └── ...
├── services/            # Business logic
│   ├── aiService.js
│   └── firecrawlService.js
├── uploads/             # File uploads (local)
├── server.js            # Main application file
├── package.json         # Dependencies
├── Dockerfile           # Docker configuration
└── docker-compose.yml   # Docker Compose setup
```

### Available Scripts

```bash
# Development with auto-reload
npm run dev

# Production start
npm start

# Install dependencies
npm install

# Build (for deployment)
npm run build

# Render deployment build
npm run render-build
```

### Code Quality
- Uses ES6+ modules (`"type": "module"`)
- Express.js with modern middleware
- MongoDB with Mongoose ODM
- JWT authentication
- Input validation
- Error handling middleware
- Rate limiting
- Security headers (Helmet)
- CORS configuration

---

## 🚀 Deployment

### Render.com (Recommended)
1. Connect your GitHub repository
2. Configure build settings:
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm start`
3. Add environment variables in Render dashboard
4. Deploy

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in the backend directory
3. Configure environment variables in Vercel dashboard

### Railway
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Docker Deployment
```bash
# Build production image
docker build -t buildestate-backend:prod .

# Run with production environment
docker run -d -p 4000:4000 --env-file .env.production buildestate-backend:prod
```

### Environment-Specific Configuration

#### Development
```env
NODE_ENV=development
BACKEND_URL=http://localhost:4000
WEBSITE_URL=http://localhost:5173
```

#### Production
```env
NODE_ENV=production
BACKEND_URL=https://your-backend-domain.com
WEBSITE_URL=https://your-frontend-domain.com
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process using port 4000
lsof -ti:4000 | xargs kill -9

# OR use different port
PORT=5000 npm run dev
```

#### 2. MongoDB Connection Failed
- Check your MongoDB URI
- Ensure MongoDB service is running
- Verify network connectivity
- Check firewall settings

#### 3. Environment Variables Not Loading
```bash
# Verify .env.local exists and has correct format
cat .env.local

# Check if dotenv is loading properly
console.log(process.env.PORT) // Add this in server.js temporarily
```

#### 4. CORS Issues
- Verify frontend URL in CORS configuration
- Check if credentials are set correctly
- Ensure proper headers are sent from frontend

#### 5. JWT Token Issues
```bash
# Verify JWT_SECRET is set
echo $JWT_SECRET

# Check token format in requests
Authorization: Bearer <your_token_here>
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# OR for specific modules
DEBUG=express:* npm run dev
```

### Logs
```bash
# View server logs
npm run dev

# For Docker
docker-compose logs -f

# For production (PM2)
pm2 logs buildestate-backend
```

---

## 📊 Performance & Monitoring

### Rate Limiting
- Configured for 500 requests per 15 minutes per IP
- Prevents API abuse
- Returns proper error messages

### Security Features
- Helmet.js for security headers
- CORS protection
- JWT authentication
- Input validation
- Password hashing with bcrypt

### Database Optimization
- MongoDB connection pooling
- Proper indexing on models
- Connection timeout configuration

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Add tests if applicable
5. Commit: `git commit -m 'Add new feature'`
6. Push: `git push origin feature/new-feature`
7. Submit a pull request

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](../LICENSE) file for details.

---

## 🆘 Support

- **Documentation Issues**: Open an issue on GitHub
- **Email Support**: Contact the development team
- **Community**: Join our Discord/Slack community

---

## 📝 Changelog

### v1.0.0 (Current)
- Initial release
- User authentication system
- Property management
- AI-powered search
- Email notifications
- Admin dashboard
- Docker support

---

<div align="center">
  <p>Built with ❤️ by the Propertia Team</p>
  <p>
    <a href="https://github.com/AAYUSH412/Real-Estate-Website">GitHub</a> •
    <a href="https://buildestate.vercel.app">Live Demo</a> •
    <a href="#-support">Support</a>
  </p>
</div>
