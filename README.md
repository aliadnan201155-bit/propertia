<div align="center">

<!-- Hero Banner -->
<img src="./frontend/src/assets/home-regular-24.png" width="80" height="80" alt="Propertia Logo">

# 🏠 Propertia

<h3 align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=28&pause=1000&color=3B82F6&center=true&vCenter=true&width=600&lines=Next-Generation+Real+Estate;AI-Powered+Property+Analysis;Modern+Full-Stack+Platform" alt="Typing SVG" />
</h3>

<!-- Badges with modern styling -->
<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge&logo=open-source-initiative&logoColor=white" alt="License">
  <img src="https://img.shields.io/badge/Node.js-18+-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/React-18+-61DAFB.svg?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/MongoDB-Latest-47A248.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-3+-06B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/AI-Powered-FF6B6B.svg?style=for-the-badge&logo=openai&logoColor=white" alt="AI Powered">
</p>

<!-- Action Buttons -->
<p align="center">
  <a href="https://buildestate.vercel.app">
    <img src="https://img.shields.io/badge/Live_Demo-4285F4?style=for-the-badge&logoColor=white" alt="Live Demo">
  </a>
  <a href="./API_TESTING_GUIDE.md">
    <img src="https://img.shields.io/badge/📚_API_Docs-34A853?style=for-the-badge&logoColor=white" alt="API Docs">
  </a>
  <a href="./ADMIN_PANEL_GUIDE.md">
    <img src="https://img.shields.io/badge/🎯_Admin_Panel-EA4335?style=for-the-badge&logoColor=white" alt="Admin Panel">
  </a>
  <a href="./COMPLETE_PROJECT_SETUP_GUIDE.md">
    <img src="https://img.shields.io/badge/🔧_Setup_Guide-FBBC04?style=for-the-badge&logoColor=black" alt="Setup Guide">
  </a>
</p>

<!-- GitHub Stats -->
<p align="center">
  <img src="https://img.shields.io/github/stars/AAYUSH412/Real-Estate-Website?style=for-the-badge&logo=github&color=yellow" alt="GitHub Stars">
  <img src="https://img.shields.io/github/forks/AAYUSH412/Real-Estate-Website?style=for-the-badge&logo=github&color=blue" alt="GitHub Forks">
  <img src="https://img.shields.io/github/issues/AAYUSH412/Real-Estate-Website?style=for-the-badge&logo=github&color=red" alt="GitHub Issues">
  <img src="https://img.shields.io/github/license/AAYUSH412/Real-Estate-Website?style=for-the-badge&color=green" alt="License">
</p>

<!-- Feature Highlights -->
<div align="center">
  <table>
    <tr>
      <td align="center">🤖</td>
      <td align="center">⚡</td>
      <td align="center">🔒</td>
      <td align="center">📱</td>
    </tr>
    <tr>
      <td align="center"><b>AI-Powered</b></td>
      <td align="center"><b>Lightning Fast</b></td>
      <td align="center"><b>Secure</b></td>
      <td align="center"><b>Responsive</b></td>
    </tr>
    <tr>
      <td align="center">Smart property analysis</td>
      <td align="center">Vite + React 18</td>
      <td align="center">JWT Authentication</td>
      <td align="center">Mobile-first design</td>
    </tr>
  </table>
</div>

</div>

<!-- Divider -->
<div align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

## 🌟 Overview

> **Propertia** is a cutting-edge, full-stack real estate platform that transforms property discovery and management through AI-powered insights, seamless user experience, and comprehensive administrative tools.


<summary><h3>🎯 Key Features</h3></summary>

<div align="center">
<table>
<tr>
<td width="50%">
        
### 🔍 **Smart Property Search**
- AI-enhanced search algorithms
- Intelligent filtering & recommendations
- Predictive property matching
- Real-time market insights

### 🤖 **AI Integration**
- Property valuation analysis
- Market trend predictions
- Investment opportunity scoring
- Automated property descriptions

### 🔐 **Security & Authentication**
- JWT-based secure authentication
- Role-based access control
- Multi-factor authentication ready
- Data encryption & privacy
</td>
<td width="50%">

### 📱 **Modern User Experience**
- Responsive design across all devices
- Progressive Web App (PWA) ready
- Dark/Light mode switching
- Smooth animations & transitions

### 📊 **Analytics Dashboard**
- Real-time property analytics
- User engagement metrics
- Revenue tracking & reporting
- Interactive data visualizations

### 📧 **Communication System**
- Automated email notifications
- In-app messaging system
- Appointment scheduling
- Lead management tools

</td>
</tr>
</table>
</div>


<!-- Architecture Section -->
<div align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

## 🏗️ System Architecture

<div align="center">

```mermaid
graph TB
    subgraph "🌐 Frontend Layer"
        A[User Portal<br/>React 18 + Vite<br/>Port: 5173]
        B[Admin Dashboard<br/>React 18 + Chart.js<br/>Port: 5174]
    end
    
    subgraph "⚙️ Backend Layer"
        C[API Server<br/>Express.js + Node.js<br/>Port: 4000]
        D[AI Services<br/>Azure AI + OpenAI]
        E[Email Service<br/>Nodemailer + SMTP]
    end
    
    subgraph "💾 Data Layer"
        F[(MongoDB Atlas<br/>Database)]
        G[ImageKit CDN<br/>Media Storage]
    end
    
    A --> C
    B --> C
    C --> D
    C --> E
    C --> F
    C --> G
    
    style A fill:#61DAFB,stroke:#333,stroke-width:2px,color:#000
    style B fill:#FF6B6B,stroke:#333,stroke-width:2px,color:#000
    style C fill:#339933,stroke:#333,stroke-width:2px,color:#fff
    style D fill:#FF9500,stroke:#333,stroke-width:2px,color:#000
    style E fill:#EA4335,stroke:#333,stroke-width:2px,color:#fff
    style F fill:#47A248,stroke:#333,stroke-width:2px,color:#fff
    style G fill:#0066CC,stroke:#333,stroke-width:2px,color:#fff
```

</div>

### 🔧 Technology Stack

<div align="center">
  <table>
    <thead>
      <tr>
        <th>🏷️ Category</th>
        <th>⚡ Technologies</th>
        <th>🎯 Purpose</th>
        <th>📊 Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Frontend</b></td>
        <td>
          <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React">
          <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite" alt="Vite">
          <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind">
        </td>
        <td>User-facing property portal</td>
        <td>🟢 Production Ready</td>
      </tr>
      <tr>
        <td><b>Admin Panel</b></td>
        <td>
          <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React">
          <img src="https://img.shields.io/badge/Chart.js-4-FF6384?style=flat-square&logo=chart.js" alt="Chart.js">
          <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind">
        </td>
        <td>Management dashboard</td>
        <td>🟢 Production Ready</td>
      </tr>
      <tr>
        <td><b>Backend</b></td>
        <td>
          <img src="https://img.shields.io/badge/Node.js-18-339933?style=flat-square&logo=node.js" alt="Node.js">
          <img src="https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express" alt="Express">
          <img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens" alt="JWT">
        </td>
        <td>API server & business logic</td>
        <td>🟢 Production Ready</td>
      </tr>
      <tr>
        <td><b>Database</b></td>
        <td>
          <img src="https://img.shields.io/badge/MongoDB-8.9-47A248?style=flat-square&logo=mongodb" alt="MongoDB">
          <img src="https://img.shields.io/badge/Mongoose-ODM-880000?style=flat-square" alt="Mongoose">
        </td>
        <td>Data persistence & modeling</td>
        <td>🟢 Production Ready</td>
      </tr>
      <tr>
        <td><b>AI Services</b></td>
        <td>
          <img src="https://img.shields.io/badge/Azure_AI-0078D4?style=flat-square&logo=microsoft-azure" alt="Azure">
          <img src="https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai" alt="OpenAI">
          <img src="https://img.shields.io/badge/HuggingFace-FFD21E?style=flat-square&logo=huggingface" alt="HuggingFace">
        </td>
        <td>Property analysis & insights</td>
        <td>🟡 Beta</td>
      </tr>
      <tr>
        <td><b>DevOps</b></td>
        <td>
          <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker" alt="Docker">
          <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel" alt="Vercel">
          <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=github-actions" alt="GitHub Actions">
        </td>
        <td>Deployment & CI/CD</td>
        <td>🟢 Active</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Quick Start Section -->
<div align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

## 🚀 Quick Start

<div align="center">

### ⚡ One-Command Setup

<img src="https://img.shields.io/badge/Setup_Time-2_minutes-00D4AA?style=for-the-badge&logo=stopwatch&logoColor=white" alt="Setup Time">

</div>

<details>
<summary><h3>📋 Prerequisites Checklist</h3></summary>

- [ ] **Node.js** 16+ and **npm** 8+ ([Download](https://nodejs.org/))
- [ ] **MongoDB** Atlas account ([Free Signup](https://www.mongodb.com/cloud/atlas))
- [ ] **Git** ([Download](https://git-scm.com/))
- [ ] **ImageKit** account for CDN ([Free Signup](https://imagekit.io/))
- [ ] **Brevo** SMTP for emails ([Free Signup](https://www.brevo.com/))

</details>

### 🎯 Lightning Fast Setup

```bash
# 🔥 Clone the repository
git clone https://github.com/AAYUSH412/Real-Estate-Website.git
cd Real-Estate-Website

# ⚡ Install all dependencies and start development servers
npm run setup && npm run dev
```

<div align="center">

**🎉 That's it! Your development environment is ready!**

<table>
  <tr>
    <td align="center">
      <img src="https://img.shields.io/badge/🌐_Frontend-5173-61DAFB?style=for-the-badge" alt="Frontend">
      <br>
      <a href="http://localhost:5173">localhost:5173</a>
    </td>
    <td align="center">
      <img src="https://img.shields.io/badge/👨‍💼_Admin-5174-FF6B6B?style=for-the-badge" alt="Admin">
      <br>
      <a href="http://localhost:5174">localhost:5174</a>
    </td>
    <td align="center">
      <img src="https://img.shields.io/badge/⚙️_API-4000-339933?style=for-the-badge" alt="API">
      <br>
      <a href="http://localhost:4000">localhost:4000</a>
    </td>
  </tr>
</table>

</div>

<details>
<summary><h3>🔧 Manual Setup (Advanced)</h3></summary>

```bash
# Backend setup
cd backend
npm install
cp .env.example .env.local
# Configure your .env.local file (see configuration section)
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev

# Admin panel setup (new terminal)
cd admin
npm install
npm run dev
```

</details>

<!-- Configuration Section -->
<div align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

## 🔧 Configuration

<div align="center">
  <img src="https://img.shields.io/badge/Configuration-Easy_Setup-4CAF50?style=for-the-badge&logo=gear&logoColor=white" alt="Easy Configuration">
</div>

<details open>
<summary><h3>🌍 Environment Variables</h3></summary>

Each application requires environment configuration. Here's a quick reference:

<div align="center">
  <table>
    <tr>
      <th width="33%">🔧 Backend (.env.local)</th>
      <th width="33%">🌐 Frontend (.env.local)</th>
      <th width="33%">👨‍💼 Admin (.env.local)</th>
    </tr>
    <tr>
      <td valign="top">

```env
# 🗄️ Database
MONGO_URI=your_mongodb_connection

# 🔐 Security
JWT_SECRET=your_jwt_secret

# 📧 Email Service
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# 🖼️ Image Storage
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_url

# 🤖 AI Services (Optional)
HUGGINGFACE_API_KEY=your_key
OPENROUTER_API_KEY=your_key
FIRECRAWL_API_KEY=your_key
```

</td>
<td valign="top">

```env
# 🌐 API Configuration
VITE_API_BASE_URL=http://localhost:4000

# 🏷️ App Settings
VITE_APP_NAME=Propertia

# 🎨 Customization
VITE_THEME_COLOR=#3B82F6
VITE_BRAND_NAME=Propertia
```

</td>
<td valign="top">

```env
# 🔗 Backend Connection
VITE_BACKEND_URL=http://localhost:4000

# 👨‍💼 Admin Settings
VITE_ADMIN_EMAIL=admin@buildestate.com
VITE_ADMIN_NAME=Propertia Admin
```

</td>
</tr>
</table>
</div>

> 📖 **Need detailed configuration?** Check our [Complete Setup Guide](./COMPLETE_PROJECT_SETUP_GUIDE.md) for comprehensive environment setup with examples.

</details>

<details>
<summary><h3>🛠️ Service Setup Guides</h3></summary>

<div align="center">
  <table>
    <tr>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
        <br>
        <a href="https://www.mongodb.com/cloud/atlas">Free Atlas Setup</a>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/ImageKit-0066CC?style=for-the-badge&logo=imagekit&logoColor=white" alt="ImageKit">
        <br>
        <a href="https://imagekit.io/">Free CDN Setup</a>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/Brevo-0052CC?style=for-the-badge&logo=mail.ru&logoColor=white" alt="Brevo">
        <br>
        <a href="https://www.brevo.com/">Free SMTP Setup</a>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI">
        <br>
        <a href="https://platform.openai.com/">AI Services</a>
      </td>
    </tr>
  </table>
</div>

</details>

<!-- Applications Section -->
<div align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

## 📱 Applications Overview

<div align="center">
  <img src="https://img.shields.io/badge/Microservices-Architecture-FF6B6B?style=for-the-badge&logo=microservices&logoColor=white" alt="Microservices">
</div>

<div align="center">
  <table>
    <tr>
      <td width="33%" align="center">
        
### 🌐 Frontend Portal
        
<img src="https://img.shields.io/badge/Port-5173-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="Frontend Port">

**Modern Property Discovery Platform**

- 🏠 Interactive property browsing
- 🔍 AI-powered search & filtering  
- 👤 User authentication & profiles
- 📅 Appointment booking system
- 🎨 Progressive Web App (PWA)
- 📱 Mobile-first responsive design
- ⚡ SEO optimized with structured data
        
<a href="http://localhost:5173">
  <img src="https://img.shields.io/badge/View_Live-4285F4?style=for-the-badge&logoColor=white" alt="View Frontend">
</a>
</td>
<td width="33%" align="center">
        
### 👨‍💼 Admin Dashboard
        
<img src="https://img.shields.io/badge/Port-5174-FF6B6B?style=for-the-badge&logo=react&logoColor=white" alt="Admin Port">

**Comprehensive Management Hub**

- 📊 Real-time analytics dashboard
- 🏠 Property management (CRUD)
- 👥 User & appointment management  
- 📈 Interactive charts & reports
- 🔧 System configuration tools
- 📤 Bulk operations & data export
- 🎯 Role-based access control
        
<a href="http://localhost:5174">
  <img src="https://img.shields.io/badge/Admin_Panel-EA4335?style=for-the-badge&logoColor=white" alt="View Admin">
</a>

</td>
<td width="33%" align="center">
        
### ⚙️ API Server
        
<img src="https://img.shields.io/badge/Port-4000-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Backend Port">

**Robust Backend Infrastructure**

- 🚀 RESTful API with 50+ endpoints
- 🔐 JWT authentication system
- 🤖 AI service integrations
- 📧 Email notification system  
- 🖼️ Image upload & processing
- 🛡️ Security & rate limiting
- 📊 Request logging & monitoring
        
<a href="http://localhost:4000">
  <img src="https://img.shields.io/badge/API_Docs-34A853?style=for-the-badge&logoColor=white" alt="View API">
</a>

</td>
</tr>
</table>
</div>

### 🔧 Tech Stack Breakdown

<details>
<summary><h4>🌐 Frontend Technologies</h4></summary>

```
React 18          → Modern component-based architecture
Vite             → Lightning-fast build tool & dev server  
TailwindCSS      → Utility-first CSS framework
Framer Motion    → Smooth animations & transitions
React Router v7  → Client-side navigation
Axios            → HTTP client for API calls
React Context    → Global state management
React Helmet     → SEO meta tag management
```

</details>

<details>
<summary><h4>👨‍💼 Admin Panel Technologies</h4></summary>

```
React 18         → Component-based UI framework
Chart.js         → Interactive data visualizations
TailwindCSS      → Consistent design system
Flowbite React   → UI component library
React Hot Toast  → Notification system
Lucide React     → Modern icon library
Framer Motion    → Smooth page transitions
```

</details>

<details>
<summary><h4>⚙️ Backend Technologies</h4></summary>

```
Node.js 18+      → JavaScript runtime environment
Express.js       → Web application framework
MongoDB          → NoSQL document database
Mongoose         → ODM for MongoDB
JWT              → JSON Web Token authentication
Bcrypt           → Password hashing
Multer           → File upload middleware
Nodemailer       → Email delivery system
Helmet           → Security headers
CORS             → Cross-origin resource sharing
```

</details>

<!-- Development Section -->
<div align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

## 🛠️ Development

<div align="center">
  <img src="https://img.shields.io/badge/Developer-Friendly-00D4AA?style=for-the-badge&logo=code&logoColor=white" alt="Developer Friendly">
</div>

<details open>
<summary><h3>🚀 Available Scripts</h3></summary>

<div align="center">
  <table>
    <tr>
      <th width="25%">🔥 Development</th>
      <th width="25%">🏗️ Building</th>
      <th width="25%">🧹 Maintenance</th>
      <th width="25%">🐳 Docker</th>
    </tr>
    <tr>
      <td valign="top">

```bash
# Start all services
npm run dev

# Individual services
npm run dev:backend
npm run dev:frontend  
npm run dev:admin

# Quick setup
npm run setup
```

</td>
<td valign="top">

```bash
# Build all apps
npm run build

# Individual builds
npm run build:backend
npm run build:frontend
npm run build:admin

# Production start
npm run start:prod
```

</td>
<td valign="top">

```bash
# Lint all code
npm run lint
npm run lint:fix

# Clean installs
npm run clean
npm run clean:build

# Health checks
npm run health
```

</td>
<td valign="top">

```bash
# Docker operations
npm run docker:build
npm run docker:up
npm run docker:down

# View logs
npm run docker:logs
```

</td>
</tr>
</table>
</div>

</details>

<details>
<summary><h3>🎯 Development Workflow</h3></summary>

```mermaid
gitGraph
    commit id: "Initial Setup"
    branch feature/new-feature
    checkout feature/new-feature
    commit id: "Add Feature"
    commit id: "Write Tests"
    commit id: "Update Docs"
    checkout main
    merge feature/new-feature
    commit id: "Deploy to Production"
```

**Step-by-step process:**

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. ✍️ **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. 📤 **Push** to the branch (`git push origin feature/amazing-feature`)  
5. 🔀 **Open** a Pull Request

</details>

<details>
<summary><h3>📋 Code Standards</h3></summary>

<div align="center">
  <table>
    <tr>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint">
        <br>
        <b>Code Quality</b>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier">
        <br>
        <b>Code Formatting</b>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/Conventional-Commits-FE5196?style=for-the-badge&logo=conventionalcommits&logoColor=white" alt="Conventional Commits">
        <br>
        <b>Commit Messages</b>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
        <br>
        <b>Type Safety</b>
      </td>
    </tr>
  </table>
</div>

**Commit Message Format:**
```
type(scope): description

Examples:
feat(frontend): add property search filters
fix(backend): resolve authentication issue
docs(readme): update installation guide
```

</details>

<!-- Documentation Section -->
<div align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

## 📚 Documentation Hub

<div align="center">
  <img src="https://img.shields.io/badge/Documentation-Comprehensive-4CAF50?style=for-the-badge&logo=gitbook&logoColor=white" alt="Documentation">
</div>

<div align="center">
  <table>
    <tr>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/📖_Setup_Guide-Complete-4285F4?style=for-the-badge" alt="Setup Guide">
        <br>
        <a href="./COMPLETE_PROJECT_SETUP_GUIDE.md"><b>Complete Setup Guide</b></a>
        <br>
        <small>Comprehensive installation & configuration</small>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/🎯_Admin_Panel-Guide-EA4335?style=for-the-badge" alt="Admin Guide">
        <br>
        <a href="./ADMIN_PANEL_GUIDE.md"><b>Admin Panel Guide</b></a>
        <br>
        <small>Dashboard usage & management features</small>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/📡_API_Docs-Reference-34A853?style=for-the-badge" alt="API Docs">
        <br>
        <a href="./API_TESTING_GUIDE.md"><b>API Documentation</b></a>
        <br>
        <small>Complete API reference & testing</small>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/⚙️_Backend-Architecture-FF9500?style=for-the-badge" alt="Backend Docs">
        <br>
        <a href="./BACKEND_DOCUMENTATION.md"><b>Backend Documentation</b></a>
        <br>
        <small>Architecture & deployment guide</small>
      </td>
    </tr>
  </table>
</div>

### 📋 Quick Reference Guides

<details>
<summary><h4>🚀 Deployment Options</h4></summary>

<div align="center">
  <table>
    <tr>
      <th>Platform</th>
      <th>Frontend</th>
      <th>Admin Panel</th>
      <th>Backend</th>
      <th>Database</th>
    </tr>
    <tr>
      <td><b>🟢 Recommended</b></td>
      <td>Vercel</td>
      <td>Vercel</td>
      <td>Railway/Render</td>
      <td>MongoDB Atlas</td>
    </tr>
    <tr>
      <td><b>🟡 Alternative</b></td>
      <td>Netlify</td>
      <td>Netlify</td>
      <td>Heroku</td>
      <td>Local MongoDB</td>
    </tr>
    <tr>
      <td><b>🐳 Docker</b></td>
      <td colspan="4">Self-hosted with Docker Compose</td>
    </tr>
  </table>
</div>

**Quick Deploy Commands:**

```bash
# Frontend to Vercel
cd frontend && vercel --prod

# Admin Panel to Vercel  
cd admin && vercel --prod

# Backend to Railway
# Connect your GitHub repository to Railway
```

</details>

<details>
<summary><h4>🔧 Environment Setup Templates</h4></summary>

**Backend Environment Template:**
```bash
# Core Configuration
NODE_ENV=production
PORT=4000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/buildestate

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters

# Email Service (Brevo)
SMTP_USER=your-email@smtp-brevo.com
SMTP_PASS=your-smtp-password

# Image Storage (ImageKit)
IMAGEKIT_PUBLIC_KEY=public_your_key_here
IMAGEKIT_PRIVATE_KEY=private_your_key_here
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id/

# AI Services (Optional)
HUGGINGFACE_API_KEY=hf_your_key_here
OPENROUTER_API_KEY=sk-or-v1-your_key_here
```

</details>

<!-- Contributing Section -->
<div align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

## 🤝 Contributing

<div align="center">
  <img src="https://img.shields.io/badge/Contributors-Welcome-FF69B4?style=for-the-badge&logo=github&logoColor=white" alt="Contributors Welcome">
  <img src="https://img.shields.io/badge/First_Timers-Friendly-00D4AA?style=for-the-badge&logo=heart&logoColor=white" alt="First Timers Friendly">
</div>

We love contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

<details>
<summary><h3>🌟 Ways to Contribute</h3></summary>

<div align="center">
  <table>
    <tr>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/🐛_Bug_Reports-EA4335?style=for-the-badge" alt="Bug Reports">
        <br>
        <b>Report Issues</b>
        <br>
        <small>Found a bug? Let us know!</small>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/✨_Feature_Requests-4285F4?style=for-the-badge" alt="Feature Requests">
        <br>
        <b>Suggest Features</b>
        <br>
        <small>Have an idea? Share it!</small>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/📖_Documentation-34A853?style=for-the-badge" alt="Documentation">
        <br>
        <b>Improve Docs</b>
        <br>
        <small>Help others understand</small>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/💻_Code_Contributions-FF9500?style=for-the-badge" alt="Code">
        <br>
        <b>Write Code</b>
        <br>
        <small>Build awesome features</small>
      </td>
    </tr>
  </table>
</div>

</details>

<details>
<summary><h3>🚀 Quick Contribution Guide</h3></summary>

1. **🍴 Fork** the repository
2. **📋 Create** an issue (if one doesn't exist)
3. **🌿 Create** your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **✍️ Commit** your changes:
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
5. **📤 Push** to your branch:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **🔀 Submit** a Pull Request

</details>

<details>
<summary><h3>🏆 Hall of Fame</h3></summary>

<div align="center">

**Thanks to all contributors who have made Propertia better! 🎉**

<a href="https://github.com/AAYUSH412/Real-Estate-Website/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=AAYUSH412/Real-Estate-Website" alt="Contributors">
</a>

*Become a contributor and see your avatar here!*

</div>

</details>

---

<!-- Footer Section -->
<div align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

## 📄 License & Author

<div align="center">
  <table>
    <tr>
      <td align="center" width="50%">
        
### � License
        
This project is licensed under the **MIT License**
        
<a href="./LICENSE">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License">
</a>
        
*Feel free to use, modify, and distribute*

</td>
      <td align="center" width="50%">
        
### 👨‍💻 Author
        
**Aayush Vaghela**
        
<a href="https://github.com/AAYUSH412">
  <img src="https://img.shields.io/badge/GitHub-AAYUSH412-181717?style=for-the-badge&logo=github" alt="GitHub">
</a>
        
<a href="mailto:aayushvaghela12@gmail.com">
  <img src="https://img.shields.io/badge/Email-aayushvaghela12@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email">
</a>

</td>
    </tr>
  </table>
</div>

---

## 🙏 Acknowledgments

<div align="center">
  <table>
    <tr>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/Open_Source-Community-FF69B4?style=for-the-badge&logo=opensource&logoColor=white" alt="Open Source">
        <br>
        <b>Open Source Community</b>
        <br>
        <small>For amazing tools & libraries</small>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/Contributors-Heroes-00D4AA?style=for-the-badge&logo=github&logoColor=white" alt="Contributors">
        <br>
        <b>All Contributors</b>
        <br>
        <small>For making this project better</small>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/Modern_Tech-Stack-4285F4?style=for-the-badge&logo=react&logoColor=white" alt="Tech Stack">
        <br>
        <b>Modern Technologies</b>
        <br>
        <small>React, Node.js, MongoDB & more</small>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/Best_Practices-Followed-34A853?style=for-the-badge&logo=checkmarx&logoColor=white" alt="Best Practices">
        <br>
        <b>Industry Standards</b>
        <br>
        <small>Security, performance & accessibility</small>
      </td>
    </tr>
  </table>
</div>

---

<!-- Call to Action -->
<div align="center">
  
### ⭐ **If you find Propertia helpful, please give it a star!** ⭐

<a href="https://github.com/AAYUSH412/Real-Estate-Website">
  <img src="https://img.shields.io/github/stars/AAYUSH412/Real-Estate-Website?style=for-the-badge&logo=github&color=FFD700" alt="GitHub Stars">
</a>

**Your support motivates us to keep building awesome features! 🚀**

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://buildestate.vercel.app">
          <img src="https://img.shields.io/badge/🚀_Try_Live_Demo-4285F4?style=for-the-badge&logoColor=white" alt="Try Live Demo">
        </a>
      </td>
      <td align="center">
        <a href="./COMPLETE_PROJECT_SETUP_GUIDE.md">
          <img src="https://img.shields.io/badge/Read_Full_Docs-34A853?style=for-the-badge&logoColor=white" alt="Read Documentation">
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/AAYUSH412/Real-Estate-Website/issues">
          <img src="https://img.shields.io/badge/🐛_Report_Issues-EA4335?style=for-the-badge&logoColor=white" alt="Report Issues">
        </a>
      </td>
    </tr>
  </table>
</div>

---

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=14&pause=1000&color=888888&center=true&vCenter=true&width=600&lines=Built+with+❤️+for+the+real+estate+industry;Happy+coding!+🎉" alt="Footer Message">
</p>

</div>