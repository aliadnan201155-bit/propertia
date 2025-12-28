# Propertia - Complete Project Setup Guide



<div align="center">
  <img src="./frontend/src/assets/home-regular-24.png" alt="Propertia Logo" width="100" />
  <h1>🏢 Propertia Real Estate Platform</h1>
  <p><em>A comprehensive real estate platform with AI-powered insights, user management, and admin dashboard</em></p>
</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Manual Setup](#-manual-setup)
- [Environment Configuration](#-environment-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Admin Panel Guide](#-admin-panel-guide)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎯 Project Overview

Propertia is a modern, full-stack real estate platform consisting of three main applications:

### 🌐 **Frontend** (User Portal)
- Property listings and search
- User authentication and profiles
- AI-powered property recommendations
- Property details and booking system
- Contact forms and inquiries

### 👨‍💼 **Admin Panel** (Management Dashboard)
- Property management (CRUD operations)
- User management and analytics
- Appointment scheduling and tracking
- Dashboard with real-time statistics
- Content management system

### ⚙️ **Backend** (API Server)
- RESTful API with Express.js
- MongoDB database integration
- JWT authentication system
- AI service integrations
- Email notifications
- Image management with ImageKit

---

## 🏗️ Architecture

```
Propertia/
├── frontend/          # React.js user interface (Port: 5173)
├── admin/            # React.js admin dashboard (Port: 5174)
├── backend/          # Express.js API server (Port: 4000)
├── package.json      # Root package with workspace scripts
└── README.md         # Project documentation
```

### Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 18, Vite, TailwindCSS, Framer Motion | User interface with animations |
| **Admin** | React 18, Vite, TailwindCSS, Chart.js | Management dashboard |
| **Backend** | Node.js, Express.js, MongoDB, JWT | API server and authentication |
| **Database** | MongoDB Atlas | Data persistence |
| **AI Services** | Azure AI, OpenAI, HuggingFace | Property analysis and recommendations |
| **Storage** | ImageKit | Image storage and optimization |
| **Email** | Nodemailer, Brevo SMTP | Email notifications |

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v7.0.0 or higher) or **yarn** (latest)
- **Git** - [Download](https://git-scm.com/)

### Required Services
- **MongoDB Atlas** account - [Sign up](https://www.mongodb.com/atlas)
- **ImageKit** account (for image storage) - [Sign up](https://imagekit.io/)
- **Brevo** account (for email services) - [Sign up](https://www.brevo.com/)

### Optional AI Services (for enhanced features)
- **Azure AI** account - [Sign up](https://azure.microsoft.com/en-us/services/cognitive-services/)
- **OpenAI** API key - [Get API key](https://platform.openai.com/)
- **HuggingFace** account - [Sign up](https://huggingface.co/)
- **FireCrawl** API key - [Sign up](https://firecrawl.dev/)

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux

---

## 🚀 Quick Start

### One-Command Setup

```bash
# Clone the repository
git clone https://github.com/AAYUSH412/Real-Estate-Website.git
cd Real-Estate-Website

# Install all dependencies
npm run setup

# Start all services
npm run dev
```

This will start:
- 🌐 **Frontend**: http://localhost:5173
- 👨‍💼 **Admin Panel**: http://localhost:5174
- ⚙️ **Backend API**: http://localhost:4000

---

## 🔨 Manual Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/AAYUSH412/Real-Estate-Website.git
cd Real-Estate-Website
```

### Step 2: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your configuration

# Start backend server
npm run dev
```

### Step 3: Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
touch .env.local
# Add: VITE_API_BASE_URL=http://localhost:4000

# Start frontend server
npm run dev
```

### Step 4: Admin Panel Setup
```bash
cd ../admin

# Install dependencies
npm install

# Create environment file
touch .env.local
# Add: VITE_BACKEND_URL=http://localhost:4000

# Start admin panel
npm run dev
```

---

## 🔐 Environment Configuration

### Backend Environment (.env.local)

Create `backend/.env.local` with the following variables:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/buildestate

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (Brevo SMTP)
SMTP_USER=your_brevo_smtp_user
SMTP_PASS=your_brevo_smtp_password
EMAIL=your_notification_email@gmail.com
ADMIN_EMAIL=admin@buildestate.com
ADMIN_PASSWORD=admin123

# Image Storage (ImageKit)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id

# AI Services (Optional)
AZURE_API_KEY=your_azure_ai_key
OPENAI_API_KEY=your_openai_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
FIRECRAWL_API_KEY=your_firecrawl_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# Model Configuration
MODEL_ID=mistralai/Mistral-7B-Instruct-v0.2
USE_AZURE=true

# URLs
BACKEND_URL=http://localhost:4000
WEBSITE_URL=http://localhost:5173
```

### Frontend Environment (.env.local)

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:4000
```

### Admin Environment (.env.local)

Create `admin/.env.local`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

---

## 💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run setup` | Install all dependencies for all projects |
| `npm run dev` | Start all services in development mode |
| `npm run build` | Build all projects for production |
| `npm start` | Start production server |

### Individual Project Scripts

#### Backend
```bash
cd backend
npm run dev        # Start with nodemon (auto-reload)
npm start          # Start production server
```

#### Frontend
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

#### Admin Panel
```bash
cd admin
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 🌐 API Endpoints

### Authentication Endpoints
```
POST /api/users/register          # User registration
POST /api/users/login            # User login
POST /api/users/admin            # Admin login
POST /api/users/forgot-password  # Password reset
```

### Property Endpoints
```
GET    /api/products              # Get all properties
POST   /api/products              # Create property (Admin)
GET    /api/products/:id          # Get single property
PUT    /api/products/:id          # Update property (Admin)
DELETE /api/products/:id          # Delete property (Admin)
```

### Admin Endpoints
```
GET /api/admin/stats             # Dashboard statistics
GET /api/admin/users             # User management
GET /api/admin/properties        # Property management
```

### Appointment Endpoints
```
GET    /api/appointments         # Get appointments
POST   /api/appointments         # Create appointment
PUT    /api/appointments/:id     # Update appointment
DELETE /api/appointments/:id     # Delete appointment
```

---

## 👨‍💼 Admin Panel Guide

### Admin Login
Default admin credentials:
- **Email**: buildestate@gmail.com
- **Password**: buildestate123

### Admin Features

#### 🏠 **Property Management**
- **Add Properties**: Upload images, set details, pricing
- **Edit Properties**: Update existing listings
- **Delete Properties**: Remove outdated listings
- **View Analytics**: Track property performance

#### 👥 **User Management**
- **View Users**: Browse all registered users
- **User Analytics**: Track user activity and engagement
- **Communication**: Send notifications and updates

#### 📊 **Dashboard Analytics**
- **Property Statistics**: Total listings, active properties
- **User Metrics**: Registration trends, activity levels
- **Appointment Tracking**: Scheduled viewings and inquiries
- **Revenue Analytics**: Booking and inquiry trends

#### 📅 **Appointment Management**
- **View Appointments**: All scheduled property viewings
- **Status Updates**: Confirm, reschedule, or cancel appointments
- **Calendar Integration**: Visual appointment scheduling

### Admin Panel Navigation

```
/login           # Admin authentication
/dashboard       # Main analytics dashboard
/list           # Property listings management
/add            # Add new property
/update/:id     # Edit existing property
/appointments   # Appointment management
```

---

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

### Individual Docker Builds

```bash
# Backend
cd backend
docker build -t buildestate-backend .
docker run -p 4000:4000 buildestate-backend

# Admin Panel
cd admin
docker build -t buildestate-admin .
docker run -p 5174:80 buildestate-admin
```

---

## 🌍 Production Deployment

### Backend (Render/Railway)
1. Connect your repository
2. Set environment variables
3. Deploy with auto-deployment enabled

### Frontend (Vercel/Netlify)
1. Connect repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

### Admin Panel (Vercel/Netlify)
1. Connect repository
2. Set root directory: `admin`
3. Set build command: `npm run build`
4. Set output directory: `dist`

---

## 🔍 API Testing

Use the provided API testing guide:

```bash
# Health check
curl http://localhost:4000/status

# Get properties
curl http://localhost:4000/api/products

# Admin login
curl -X POST http://localhost:4000/api/users/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"buildestate@gmail.com","password":"buildestate123"}'
```

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 4000
npx kill-port 4000

# Or find and kill manually
lsof -ti:4000 | xargs kill -9
```

#### MongoDB Connection Issues
1. Check MONGO_URI in environment variables
2. Ensure MongoDB Atlas IP whitelist includes your IP
3. Verify database credentials

#### Environment Variables Not Loading
1. Ensure `.env.local` files exist in correct directories
2. Restart development servers after adding variables
3. Check for typos in variable names

#### Image Upload Issues
1. Verify ImageKit configuration
2. Check API keys and endpoint URL
3. Ensure proper CORS settings

#### Email Not Sending
1. Verify Brevo SMTP credentials
2. Check email configuration in backend
3. Ensure sender email is verified

### Debug Mode

Enable debug logging:

```env
# In backend/.env.local
NODE_ENV=development
DEBUG=buildestate:*
```

---

## 📁 Project Structure

```
Propertia/
├── backend/
│   ├── config/           # Database and service configurations
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Custom middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # AI and external services
│   ├── uploads/         # File upload directory
│   └── server.js        # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context providers
│   │   ├── assets/      # Static assets
│   │   └── styles/      # CSS and styling
│   └── public/          # Public static files
├── admin/
│   ├── src/
│   │   ├── components/  # Admin UI components
│   │   ├── pages/       # Admin pages
│   │   └── contexts/    # Admin-specific contexts
│   └── public/          # Admin static files
└── package.json         # Workspace configuration
```

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**:
   ```bash
   npm test
   ```
5. **Commit your changes**:
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

---

## 📞 Support

For support and questions:

- **GitHub Issues**: [Create an issue](https://github.com/AAYUSH412/Real-Estate-Website/issues)
- **Email**: aayushvaghela12@gmail.com
- **Documentation**: Check README.md files in each directory

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/AAYUSH412">Aayush Vaghela</a></p>
  <p>⭐ If you found this project helpful, please give it a star!</p>
</div>
