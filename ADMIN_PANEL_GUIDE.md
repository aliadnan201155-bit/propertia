# Propertia Admin Panel Documentation

<div align="center">
  <h1>👨‍💼 Admin Dashboard Guide</h1>
  <p><em>Complete guide for managing the Propertia platform</em></p>
</div>




---

## 📋 Table of Contents

- [Overview](#-overview)
- [Getting Started](#-getting-started)
- [Admin Features](#-admin-features)
- [Dashboard Analytics](#-dashboard-analytics)
- [Property Management](#-property-management)
- [User Management](#-user-management)
- [Appointment Management](#-appointment-management)
- [Settings & Configuration](#-settings--configuration)
- [API Integration](#-api-integration)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

The Propertia Admin Panel is a comprehensive management dashboard built with React 18, providing administrators with powerful tools to manage properties, users, appointments, and analytics.

### Key Features
- 📊 **Real-time Dashboard** with interactive charts
- 🏠 **Property Management** (CRUD operations)
- 👥 **User Management** and analytics
- 📅 **Appointment Scheduling** system
- 📈 **Advanced Analytics** with Chart.js
- 🔐 **Secure Authentication** with JWT
- 📱 **Responsive Design** with TailwindCSS
- ✨ **Smooth Animations** with Framer Motion

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- Access to Propertia backend API
- Admin credentials

### Installation

```bash
# Navigate to admin directory
cd admin

# Install dependencies
npm install

# Create environment file
touch .env.local

# Add backend URL
echo "VITE_BACKEND_URL=http://localhost:4000" > .env.local

# Start development server
npm run dev
```

The admin panel will be available at: **http://localhost:5174**

### Admin Login

**Default Credentials:**
- **Email**: `buildestate@gmail.com`
- **Password**: `buildestate123`

> ⚠️ **Security Note**: Change default credentials in production!

---

## 🏗️ Admin Features

### 🔐 Authentication System

The admin panel uses JWT-based authentication with the following flow:

1. **Login Process**:
   ```javascript
   POST /api/users/admin
   Body: { email, password }
   Response: { success, token, user }
   ```

2. **Token Storage**:
   - Stored in `localStorage` as `token`
   - Admin flag stored as `isAdmin: true`

3. **Protected Routes**:
   All admin routes are protected by `ProtectedRoute` component

### 🎨 UI Components

The admin panel uses modern UI components:

- **Error Boundary**: Catches and displays errors gracefully
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: Real-time feedback with react-hot-toast
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Configurable theme system

---

## 📊 Dashboard Analytics

### Main Dashboard (`/dashboard`)

The dashboard provides comprehensive insights:

#### 📈 Key Metrics
- **Total Properties**: Count of all listed properties
- **Active Listings**: Currently available properties
- **Total Views**: Aggregate property view count
- **Pending Appointments**: Unconfirmed appointment requests

#### 📊 Charts and Visualizations
- **Property Views Timeline**: Interactive line chart showing daily views
- **User Activity**: Registration and engagement trends
- **Revenue Analytics**: Booking and inquiry patterns
- **Geographic Distribution**: Property distribution by location

#### 🔄 Real-time Updates
```javascript
// Dashboard data fetching
useEffect(() => {
  const fetchStats = async () => {
    const response = await axios.get(`${backendurl}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStats(response.data);
  };
  
  fetchStats();
  const interval = setInterval(fetchStats, 30000); // Update every 30s
  return () => clearInterval(interval);
}, []);
```

### Chart Configuration

Using Chart.js with React:

```javascript
const chartOptions = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Date'
      }
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Views'
      }
    }
  }
};
```

---

## 🏠 Property Management

### Property Listing (`/list`)

Comprehensive property management interface:

#### 📋 Property Table
- **Search and Filter**: By name, location, price, status
- **Sorting**: By date, price, views, status
- **Bulk Actions**: Select multiple properties for batch operations
- **Export Options**: CSV, PDF export functionality

#### 🏠 Property Information Display
- **Property Images**: Thumbnail gallery with lightbox
- **Key Details**: Price, location, type, bedrooms, bathrooms
- **Status Indicators**: Available, Sold, Pending, Archived
- **Performance Metrics**: Views, inquiries, appointment requests

### Adding Properties (`/add`)

Streamlined property creation form:

#### 🖼️ Image Upload
```javascript
// Multiple image upload with ImageKit
const handleImageUpload = async (files) => {
  const uploadPromises = files.map(file => {
    return imagekit.upload({
      file: file,
      fileName: `property_${Date.now()}_${file.name}`,
      folder: '/properties'
    });
  });
  
  const uploadResults = await Promise.all(uploadPromises);
  return uploadResults.map(result => result.url);
};
```

#### 📝 Form Fields
- **Basic Information**: Title, description, property type
- **Location Details**: Address, city, state, zip code, coordinates
- **Property Features**: Bedrooms, bathrooms, square footage, lot size
- **Pricing**: Sale/rent price, price per sqft, negotiable status
- **Amenities**: Pool, garage, garden, security, etc.
- **Documents**: Property documents, floor plans, legal papers

### Updating Properties (`/update/:id`)

Edit existing property details:

```javascript
// Property update API call
const updateProperty = async (propertyId, updatedData) => {
  try {
    const response = await axios.put(
      `${backendurl}/api/products/${propertyId}`,
      updatedData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.success) {
      toast.success('Property updated successfully!');
      navigate('/list');
    }
  } catch (error) {
    toast.error('Failed to update property');
  }
};
```

---

## 👥 User Management

### User Analytics

Track user engagement and behavior:

#### 📊 User Metrics
- **Registration Trends**: New user signups over time
- **Activity Levels**: Login frequency and session duration
- **Engagement Metrics**: Property views, favorites, inquiries
- **Geographic Distribution**: User locations and preferences

#### 👤 User Profiles
- **Personal Information**: Name, email, phone, address
- **Preferences**: Property types, locations, price ranges
- **Activity History**: Recent views, searches, appointments
- **Communication**: Message history, notification preferences

### User Actions

Administrative actions for user management:

```javascript
// User management functions
const userActions = {
  // Suspend user account
  suspendUser: async (userId) => {
    await axios.put(`${backendurl}/api/admin/users/${userId}/suspend`);
  },
  
  // Reactivate user account
  reactivateUser: async (userId) => {
    await axios.put(`${backendurl}/api/admin/users/${userId}/reactivate`);
  },
  
  // Send notification to user
  sendNotification: async (userId, message) => {
    await axios.post(`${backendurl}/api/admin/notifications`, {
      userId, message
    });
  }
};
```

---

## 📅 Appointment Management

### Appointment Dashboard (`/appointments`)

Centralized appointment management:

#### 📋 Appointment List
- **Status Filtering**: Pending, Confirmed, Completed, Cancelled
- **Date Filtering**: Today, This Week, This Month, Custom Range
- **Property Filtering**: Filter by specific properties
- **Agent Assignment**: Assign appointments to available agents

#### 📅 Calendar View
```javascript
// Calendar integration for appointment scheduling
const CalendarView = () => {
  const [appointments, setAppointments] = useState([]);
  
  const calendarEvents = appointments.map(apt => ({
    id: apt._id,
    title: `${apt.propertyName} - ${apt.clientName}`,
    start: new Date(apt.scheduledDate),
    end: new Date(apt.scheduledDate + 60 * 60 * 1000), // 1 hour
    backgroundColor: getStatusColor(apt.status)
  }));
  
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      events={calendarEvents}
      eventClick={handleEventClick}
    />
  );
};
```

### Appointment Status Management

#### Status Workflow
1. **Pending**: Initial appointment request
2. **Confirmed**: Admin/agent confirmation
3. **In Progress**: Appointment currently happening
4. **Completed**: Successful appointment completion
5. **Cancelled**: Cancelled by client or admin
6. **No Show**: Client didn't attend scheduled appointment

#### Status Update Functions
```javascript
const updateAppointmentStatus = async (appointmentId, newStatus) => {
  try {
    await axios.put(`${backendurl}/api/appointments/${appointmentId}`, {
      status: newStatus,
      updatedBy: adminId,
      updateDate: new Date()
    });
    
    // Send notification based on status
    if (newStatus === 'confirmed') {
      await sendConfirmationEmail(appointmentId);
    }
    
    toast.success(`Appointment ${newStatus} successfully`);
  } catch (error) {
    toast.error('Failed to update appointment status');
  }
};
```

---

## ⚙️ Settings & Configuration

### Admin Settings

#### 🔐 Security Settings
- **Password Policy**: Minimum length, complexity requirements
- **Session Management**: Timeout settings, concurrent sessions
- **Two-Factor Authentication**: Enable/disable 2FA for admin accounts
- **API Rate Limiting**: Request limits and throttling

#### 📧 Email Configuration
```javascript
// Email template configuration
const emailTemplates = {
  propertyInquiry: {
    subject: 'New Property Inquiry - {{propertyName}}',
    template: 'inquiry-template.html',
    variables: ['clientName', 'propertyName', 'message']
  },
  appointmentConfirmation: {
    subject: 'Appointment Confirmed - {{appointmentDate}}',
    template: 'appointment-template.html',
    variables: ['clientName', 'propertyName', 'appointmentDate']
  }
};
```

#### 🎨 UI Customization
- **Theme Configuration**: Colors, fonts, layout preferences
- **Dashboard Widgets**: Customize dashboard layout and widgets
- **Branding**: Logo, company name, contact information
- **Localization**: Language and region settings

---

## 🔌 API Integration

### API Client Configuration

```javascript
// API client setup with interceptors
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
});

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API Endpoints Used by Admin Panel

#### Authentication
```javascript
POST /api/users/admin           // Admin login
POST /api/users/logout          // Admin logout
GET  /api/users/verify-token    // Token verification
```

#### Properties
```javascript
GET    /api/products            // Get all properties
POST   /api/products            // Create new property
GET    /api/products/:id        // Get single property
PUT    /api/products/:id        // Update property
DELETE /api/products/:id        // Delete property
```

#### Users
```javascript
GET /api/admin/users            // Get all users
GET /api/admin/users/:id        // Get single user
PUT /api/admin/users/:id        // Update user
```

#### Appointments
```javascript
GET    /api/appointments        // Get all appointments
POST   /api/appointments        // Create appointment
PUT    /api/appointments/:id    // Update appointment
DELETE /api/appointments/:id    // Delete appointment
```

#### Analytics
```javascript
GET /api/admin/stats           // Dashboard statistics
GET /api/admin/analytics       // Detailed analytics
GET /api/admin/reports         // Generate reports
```

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 🔒 Authentication Problems

**Issue**: Admin can't login
```javascript
// Debug login function
const debugLogin = async (email, password) => {
  console.log('Attempting login with:', { email });
  
  try {
    const response = await axios.post(`${backendUrl}/api/users/admin`, {
      email,
      password
    });
    
    console.log('Login response:', response.data);
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isAdmin', 'true');
      console.log('Token stored successfully');
    }
  } catch (error) {
    console.error('Login error:', error.response?.data);
  }
};
```

**Solutions**:
1. Verify backend is running on correct port
2. Check admin credentials in database
3. Ensure CORS is properly configured
4. Verify JWT secret matches between frontend and backend

#### 📊 Dashboard Not Loading

**Issue**: Dashboard statistics not displaying

**Debug Steps**:
```javascript
// Check API connectivity
const testAPIConnection = async () => {
  try {
    const response = await fetch(`${backendUrl}/status`);
    console.log('API Status:', response.status);
    
    const statsResponse = await fetch(`${backendUrl}/api/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log('Stats Response:', statsResponse.status);
  } catch (error) {
    console.error('API Connection Error:', error);
  }
};
```

#### 🖼️ Image Upload Issues

**Issue**: Property images not uploading

**Debug Function**:
```javascript
const debugImageUpload = async (file) => {
  console.log('File details:', {
    name: file.name,
    size: file.size,
    type: file.type
  });
  
  // Check file size (limit: 10MB)
  if (file.size > 10 * 1024 * 1024) {
    console.error('File too large');
    return;
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    console.error('Invalid file type');
    return;
  }
  
  try {
    // Upload to ImageKit
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    console.log('Upload successful:', response.data);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Performance Optimization

#### 🚀 Load Time Optimization
```javascript
// Lazy load dashboard components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PropertyList = lazy(() => import('./pages/List'));
const AddProperty = lazy(() => import('./pages/Add'));

// Memoize expensive calculations
const memoizedStats = useMemo(() => {
  return calculateComplexStatistics(rawData);
}, [rawData]);

// Virtualize large lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedPropertyList = ({ properties }) => (
  <List
    height={600}
    itemCount={properties.length}
    itemSize={80}
    itemData={properties}
  >
    {PropertyRow}
  </List>
);
```

#### 📱 Mobile Responsiveness
```css
/* Responsive dashboard layout */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 📚 Additional Resources

### Learning Resources
- [React Documentation](https://reactjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Framer Motion Guide](https://www.framer.com/motion/)

### Development Tools
- **React Developer Tools**: Browser extension for debugging
- **Tailwind CSS IntelliSense**: VS Code extension
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting

### Testing
```bash
# Run tests
npm test

# Test with coverage
npm run test:coverage

# E2E testing with Playwright
npm run test:e2e
```

---

## 🔄 Updates and Maintenance

### Version Updates
```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest
```

### Security Audits
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Force fix (use with caution)
npm audit fix --force
```

---

<div align="center">
  <p>📚 For more detailed information, check the individual component documentation</p>
  <p>🐛 Found a bug? <a href="https://github.com/AAYUSH412/Real-Estate-Website/issues">Create an issue</a></p>
  <p>💡 Have suggestions? We'd love to hear from you!</p>
</div>
