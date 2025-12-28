<div align="center">

# 🌐 Propertia Frontend

### Modern React Application for Real Estate Platform

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3+-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-latest-0055FF?style=flat-square&logo=framer)](https://www.framer.com/motion/)

[🚀 Live Demo](https://buildestate.vercel.app) • [📚 Documentation](../README.md) • [🐛 Report Issues](https://github.com/AAYUSH412/Real-Estate-Website/issues)

</div>

---

## ✨ Features

### 🏠 **Property Discovery**
- **Smart Search** - Multi-filter property search with AI recommendations
- **Virtual Tours** - Interactive image galleries with zoom capabilities
- **Location Maps** - Integrated mapping with property locations
- **Favorites System** - Save and organize preferred properties

### 🎨 **User Experience**
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Fluid Animations** - Smooth transitions powered by Framer Motion
- **Modern UI** - Clean, professional interface with TailwindCSS
- **Dark/Light Mode** - Theme switching with persistent preferences

### 🔐 **User Management**
- **Secure Authentication** - JWT-based login/registration
- **Profile Management** - User dashboard with appointment history
- **Appointment Booking** - Real-time scheduling system
- **Email Notifications** - Automated booking confirmations

### ⚡ **Performance**
- **Optimized Bundle** - Vite-powered fast development and builds
- **Lazy Loading** - Code splitting for improved load times
- **Image Optimization** - Progressive loading with ImageKit CDN
- **SEO Friendly** - Meta tags and structured data

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Core** | React 18 | Component-based UI framework |
| **Build Tool** | Vite | Fast development and bundling |
| **Styling** | TailwindCSS | Utility-first CSS framework |
| **Animations** | Framer Motion | Smooth animations and transitions |
| **Routing** | React Router v7 | Client-side navigation |
| **HTTP Client** | Axios | API communication |
| **State Management** | React Context | Global state management |
| **UI Components** | Radix UI | Accessible component primitives |
| **Icons** | Heroicons, Lucide | Modern icon libraries |
| **Forms** | Native React | Form handling and validation |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm 8+ or yarn 1.22+

### Installation

```bash
# Clone the repository
git clone https://github.com/AAYUSH412/Real-Estate-Website.git
cd Real-Estate-Website/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment Setup

Create a `.env.local` file in the frontend directory:

```bash
# API Configuration
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME=Propertia

# External Services (Optional)
VITE_IMAGEKIT_URL=your-imagekit-url
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key

# Application Settings
VITE_APP_VERSION=2.1.0
VITE_ENVIRONMENT=development
```

---

## 🏗️ Project Structure

```
frontend/
├── 📁 public/                 # Static assets
│   ├── robots.txt            # SEO robots file
│   └── sitemap.xml           # SEO sitemap
│
├── 📁 src/
│   ├── 📁 assets/            # Images, icons, static files
│   │   ├── blogdata.js       # Blog content data
│   │   ├── featuredata.js    # Feature content
│   │   ├── properties.js     # Sample property data
│   │   └── *.png, *.svg      # Image assets
│   │
│   ├── 📁 components/        # Reusable UI components
│   │   ├── Common/           # Shared components
│   │   ├── Home/             # Homepage components
│   │   ├── Property/         # Property-related components
│   │   ├── Auth/             # Authentication components
│   │   └── Layout/           # Layout components
│   │
│   ├── 📁 context/           # React Context providers
│   │   ├── AuthContext.jsx   # Authentication state
│   │   ├── ThemeContext.jsx  # Theme management
│   │   └── PropertyContext.jsx # Property state
│   │
│   ├── 📁 pages/             # Route components
│   │   ├── Home.jsx          # Landing page
│   │   ├── Properties.jsx    # Property listings
│   │   ├── PropertyDetail.jsx # Property details
│   │   ├── Profile.jsx       # User profile
│   │   ├── Login.jsx         # Authentication
│   │   └── Contact.jsx       # Contact page
│   │
│   ├── 📁 services/          # API service functions
│   │   ├── api.js            # Axios configuration
│   │   ├── authService.js    # Authentication API
│   │   ├── propertyService.js # Property API
│   │   └── userService.js    # User management API
│   │
│   ├── 📁 styles/            # Global styles
│   │   └── globals.css       # Tailwind imports
│   │
│   ├── 📁 utils/             # Utility functions
│   │   ├── constants.js      # App constants
│   │   ├── helpers.js        # Helper functions
│   │   └── validation.js     # Form validation
│   │
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles
│
├── 📄 package.json           # Dependencies and scripts
├── 📄 vite.config.js         # Vite configuration
├── 📄 tailwind.config.cjs    # TailwindCSS config
├── 📄 postcss.config.js      # PostCSS config
└── 📄 eslint.config.js       # ESLint configuration
```

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues

# Testing (when configured)
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

### Development Workflow

1. **Component Development**
   ```bash
   # Create new component
   mkdir src/components/NewComponent
   touch src/components/NewComponent/index.jsx
   touch src/components/NewComponent/NewComponent.module.css
   ```

2. **Adding New Pages**
   ```bash
   # Create page component
   touch src/pages/NewPage.jsx
   # Add route in App.jsx
   ```

3. **API Integration**
   ```bash
   # Add service function
   # Update src/services/newService.js
   # Use in components with proper error handling
   ```

### Code Style Guidelines

- Use **functional components** with hooks
- Follow **component naming conventions** (PascalCase)
- Use **TailwindCSS** for styling
- Implement **proper error boundaries**
- Add **loading states** for async operations
- Use **TypeScript-style prop validation** with PropTypes

### Component Example

```jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const PropertyCard = ({ property, onFavorite }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFavorite = async () => {
    setIsLoading(true);
    try {
      await onFavorite(property.id);
    } catch (error) {
      console.error('Failed to update favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      {/* Component content */}
    </motion.div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  onFavorite: PropTypes.func.isRequired,
};

export default PropertyCard;
```

---

## 🎨 Styling

### TailwindCSS Configuration

The project uses a custom TailwindCSS configuration with:

- **Custom color palette** matching brand guidelines
- **Extended spacing scale** for consistent layouts
- **Custom animation utilities** for micro-interactions
- **Responsive breakpoints** for mobile-first design

### Animation Guidelines

Using Framer Motion for animations:

```jsx
// Page transitions
const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 }
};

// Stagger children
const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Build Deployment

```bash
# Build the application
npm run build

# The dist/ folder contains the production build
# Upload to your hosting provider
```

### Environment Variables for Production

Set these in your deployment platform:

```bash
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_NAME=Propertia
VITE_IMAGEKIT_URL=https://your-imagekit-url
VITE_GOOGLE_MAPS_API_KEY=your-production-maps-key
VITE_ENVIRONMENT=production
```

---

## 🔧 Configuration

### Vite Configuration

Key features enabled in `vite.config.js`:

- **Hot Module Replacement** for fast development
- **Bundle optimization** for production
- **Environment variable handling**
- **Path aliases** for cleaner imports

### TailwindCSS Customization

```javascript
// tailwind.config.cjs
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('tailwindcss-animate'),
  ]
}
```

---

## 🧪 Testing

### Testing Setup (To be implemented)

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test
```

### Testing Guidelines

- Write **unit tests** for utility functions
- Create **component tests** for complex components
- Add **integration tests** for user flows
- Use **Mock Service Worker** for API mocking

---

## 🔍 Troubleshooting

### Common Issues

**Development server not starting:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build failures:**
```bash
# Check for TypeScript/ESLint errors
npm run lint
# Fix issues and rebuild
npm run build
```

**Performance issues:**
- Check bundle size with `npm run build`
- Optimize images and assets
- Implement lazy loading for routes

### Getting Help

- Check the [main documentation](../README.md)
- Look at [GitHub Issues](https://github.com/AAYUSH412/Real-Estate-Website/issues)
- Join our [Discussions](https://github.com/AAYUSH412/Real-Estate-Website/discussions)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Follow the code style guidelines
4. Test your changes thoroughly
5. Submit a pull request

### Development Standards

- **Code Quality**: Use ESLint and Prettier
- **Performance**: Optimize components and assets
- **Accessibility**: Follow WCAG guidelines
- **Documentation**: Update relevant docs

---

<div align="center">

**Built with ❤️ using React and modern web technologies**

[⭐ Star](https://github.com/AAYUSH412/Real-Estate-Website) • [🐛 Issues](https://github.com/AAYUSH412/Real-Estate-Website/issues) • [💬 Discussions](https://github.com/AAYUSH412/Real-Estate-Website/discussions)

</div>
