# 🚀 How to Run Propertia Project - Complete Guide



This guide provides step-by-step instructions to run the complete Propertia real estate platform locally.

## 📋 Project Components

Propertia consists of three main applications:

1. **Backend API** (Port 4000) - Express.js server with MongoDB
2. **Frontend** (Port 5173) - React user interface  
3. **Admin Panel** (Port 5174) - React admin dashboard

---

## ⚡ Quick Start (Recommended)

### One-Command Setup

```bash
# Clone repository
git clone https://github.com/AAYUSH412/Real-Estate-Website.git
cd Real-Estate-Website

# Install all dependencies
npm run setup

# Start all three applications
npm run dev
```

This will open:
- Frontend: http://localhost:5173
- Admin Panel: http://localhost:5174
- Backend API: http://localhost:4000

---

## 🔧 Prerequisites

Before starting, ensure you have:

- **Node.js** v16+ installed
- **npm** v7+ installed
- **Git** installed
- **MongoDB Atlas** account (free)
- **ImageKit** account (free)
- **Brevo** SMTP account (free)

---

## 📚 Detailed Setup Instructions

### Step 1: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure environment variables (see below)
# Edit .env.local with your actual values

# Start backend server
npm run dev
```

#### Backend Environment Variables (`.env.local`)

```env
# Server
PORT=4000
NODE_ENV=development
BACKEND_URL=http://localhost:4000

# Database (Required)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/buildestate

# Authentication (Required)
JWT_SECRET=your_long_random_secret_key_here

# Email (Required)
SMTP_USER=your_smtp_user@smtp-brevo.com
SMTP_PASS=your_smtp_password
EMAIL=your_email@gmail.com
ADMIN_EMAIL=admin@buildestate.com
ADMIN_PASSWORD=admin123

# Image Storage (Required)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint

# Frontend URL
WEBSITE_URL=http://localhost:5173

# AI Services (Optional)
OPENAI_API_KEY=your_openai_key
AZURE_API_KEY=your_azure_key
FIRECRAWL_API_KEY=your_firecrawl_key
```

### Step 2: Frontend Setup

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:4000" > .env.local

# Start frontend server
npm run dev
```

### Step 3: Admin Panel Setup

```bash
# Open new terminal
cd admin

# Install dependencies
npm install

# Create environment file
echo "VITE_BACKEND_URL=http://localhost:4000" > .env.local

# Start admin server
npm run dev
```

---

## 🗂️ Application Features

### Frontend (http://localhost:5173)
- Home page with property listings
- User registration and login
- Property search and filtering
- Property details with image galleries
- Appointment booking system
- AI-powered property recommendations
- Contact forms

### Admin Panel (http://localhost:5174)
- Admin login (use ADMIN_EMAIL and ADMIN_PASSWORD from .env)
- Dashboard with statistics and charts
- Property management (add, edit, delete)
- Appointment management
- User analytics

### Backend API (http://localhost:4000)
- RESTful API endpoints
- Authentication system
- Database operations
- Email notifications
- Image upload handling
- AI service integrations

---

## 🔑 Default Admin Credentials

```
Email: admin@buildestate.com
Password: admin123
```

*Note: These can be changed in the backend .env.local file*

---

## 📊 Database Setup

### MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Add your IP to allowed list
5. Create a database user
6. Get connection string and add to `MONGO_URI` in backend/.env.local

### Local MongoDB (Alternative)

```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Use local connection string
MONGO_URI=mongodb://localhost:27017/buildestate
```

---

## 🖼️ Image Storage Setup

### ImageKit (Required for property images)

1. Sign up at [ImageKit.io](https://imagekit.io)
2. Get your credentials from dashboard
3. Add to backend/.env.local:
   ```env
   IMAGEKIT_PUBLIC_KEY=public_your_key
   IMAGEKIT_PRIVATE_KEY=private_your_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
   ```

---

## 📧 Email Setup

### Brevo SMTP (Required for notifications)

1. Sign up at [Brevo.com](https://www.brevo.com)
2. Go to SMTP settings
3. Create SMTP credentials
4. Add to backend/.env.local:
   ```env
   SMTP_USER=your_user@smtp-brevo.com
   SMTP_PASS=your_password
   ```

---

## 🤖 AI Services Setup (Optional)

### Enable AI Features

Add these to backend/.env.local for enhanced property search:

```env
# OpenAI (for property analysis)
OPENAI_API_KEY=sk-proj-your_key

# Azure AI (for advanced features)
AZURE_API_KEY=your_azure_key
USE_AZURE=true

# HuggingFace (for ML models)
HUGGINGFACE_API_KEY=hf_your_key

# FireCrawl (for web scraping)
FIRECRAWL_API_KEY=fc-your_key
```

---

## 🛠️ Development Scripts

### Root Level Commands
```bash
# Install all dependencies
npm run setup

# Start all applications
npm run dev

# Build all for production
npm run build
```

### Individual Application Commands

#### Backend
```bash
cd backend
npm run dev    # Development with hot reload
npm start      # Production mode
```

#### Frontend
```bash
cd frontend
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview build
```

#### Admin Panel
```bash
cd admin
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview build
```

---

## 🔍 Testing the Setup

### 1. Backend Test
Visit http://localhost:4000 - Should show API status page

### 2. Frontend Test
Visit http://localhost:5173 - Should show home page with properties

### 3. Admin Panel Test
1. Visit http://localhost:5174
2. Login with admin credentials
3. Check dashboard loads properly

### 4. Full Integration Test
1. Register a new user on frontend
2. Browse properties
3. Schedule an appointment
4. Check appointment in admin panel

---

## ❗ Common Issues & Solutions

### Port Already in Use
```bash
# Kill processes on ports
sudo lsof -ti:4000 | xargs kill -9
sudo lsof -ti:5173 | xargs kill -9
sudo lsof -ti:5174 | xargs kill -9
```

### Environment Variables Not Loading
- Ensure file is named `.env.local` (not `.env`)
- Restart development servers after changes
- Check file is in correct directory

### Database Connection Failed
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Ensure correct username/password

### Images Not Loading
- Verify ImageKit credentials
- Check ImageKit dashboard for usage
- Ensure images are being uploaded

### Email Not Sending
- Verify Brevo SMTP credentials
- Check email limits (300/day on free plan)
- Test with a simple email first

---

## 📱 Mobile Testing

All applications are responsive. Test on:
- Desktop browsers
- Mobile browsers
- Tablet devices

Use browser dev tools to simulate different screen sizes.

---

## 🔒 Security Notes

- Never commit .env.local files
- Use strong JWT secrets in production
- Enable MongoDB Atlas IP whitelisting
- Use HTTPS in production
- Regularly update dependencies

---

## 📈 Performance Tips

- Backend uses compression middleware
- Frontend uses Vite for fast builds
- Images are optimized through ImageKit
- Database queries are optimized
- API includes rate limiting

---

## 🎯 Next Steps

After setting up locally:

1. Explore all features
2. Add sample properties through admin panel
3. Test user registration and booking
4. Customize styling and content
5. Deploy to production platforms

---

## 🆘 Need Help?

1. Check console errors in browser
2. Check terminal output for errors
3. Verify all environment variables
4. Ensure all services are running
5. Review the troubleshooting section

---

<div align="center">
  <h3>🎉 You're Ready to Build Amazing Real Estate Experiences!</h3>
  <p>Happy coding! 🚀</p>
</div>
