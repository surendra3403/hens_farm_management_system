# Hen's Form Management System

A comprehensive web application for managing hen farm operations with real-time data tracking, shed management, and production monitoring.

## 🚀 Features

### 🔐 Authentication & Security
- **Secure Login/Signup System**: User authentication with password hashing
- **Session Management**: Persistent login sessions
- **Protected Routes**: Access control for all farm data

### 🏠 Dashboard (Homepage)
- **Real-time Data Display**: Live farm statistics
- **Expandable Info Cards**: 
  - 🐔 Total Hen's Count (by shed)
  - 💀 Total Mortality (by shed)
  - 🥚 Total Egg-Tray's Stock (by shed)
  - 🛒 Total Egg-Tray's Selling (by shed)
  - 🍽️ Total Feed in Gudam/Warehouse
- **Date Picker**: Filter data by specific dates
- **Responsive Design**: Mobile-first approach

### 🏗️ Shed Management
- **Add New Sheds**: Create sheds with capacity and initial hen count
- **Daily Data Entry**: Track daily metrics for each shed:
  - Mortality count
  - Egg production (trays)
  - Sales (trays sold)
  - Feed consumption (kg)
  - Notes and remarks
- **Shed Operations**: Edit, delete, and view shed information
- **Real-time Updates**: Instant data synchronization

### 📊 Data Management
- **MySQL Database**: Robust data storage with relationships
- **Historical Data**: Track farm performance over time
- **Data Validation**: Input validation and error handling

### 📱 Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive layout for tablets
- **Desktop Experience**: Enhanced features for larger screens

## 🛠️ Technology Stack

### Frontend
- **React 19**: Modern React with hooks
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icons
- **Date-fns**: Date manipulation
- **Axios**: HTTP client

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **MySQL2**: Database driver
- **bcryptjs**: Password hashing
- **express-session**: Session management
- **CORS**: Cross-origin resource sharing

### Database
- **MySQL**: Relational database
- **Multiple Tables**: Users, Sheds, Production, Mortality, Sales, Feed, Notes, Gudam

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hensform_management_system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
1. **Create MySQL Database**:
   ```sql
   CREATE DATABASE hensform_management;
   ```

2. **Configure Environment Variables**:
   - Copy `env.example` to `.env`
   - Update database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=hensform_management
   ```

### 4. Start the Application

#### Development Mode (Both Frontend & Backend)
```bash
npm run dev:full
```

#### Separate Development Servers
```bash
# Terminal 1 - Backend Server
npm run server

# Terminal 2 - Frontend Development Server
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
hensform_management_system/
├── server/                 # Backend server
│   ├── config/
│   │   └── database.js     # Database configuration
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   ├── sheds.js        # Shed management routes
│   │   └── dashboard.js    # Dashboard data routes
│   └── index.js            # Main server file
├── src/                    # Frontend React app
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── sheds/          # Shed management components
│   │   └── layout/         # Layout components
│   ├── contexts/
│   │   └── AuthContext.jsx # Authentication context
│   ├── App.jsx             # Main app component
│   └── main.jsx            # App entry point
├── package.json            # Dependencies and scripts
├── env.example             # Environment variables template
└── README.md               # This file
```

## 🗄️ Database Schema

### Tables Overview
- **users**: User authentication and profiles
- **sheds**: Shed information (number, capacity)
- **shed_status**: Daily hen counts per shed
- **mortality**: Daily mortality records
- **production**: Daily egg production
- **sales**: Daily sales records
- **feed**: Daily feed consumption
- **notes**: Daily notes and remarks
- **gudam**: Warehouse feed inventory

## 🔧 Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend server
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Usage Guide

### 1. First Time Setup
1. Create an account using the signup form
2. Login with your credentials
3. Start by adding your first shed

### 2. Adding Sheds
1. Navigate to "Shed's" section
2. Click the floating "+" button
3. Enter shed number, capacity, and present hen count
4. Click "Add Shed"

### 3. Daily Data Entry
1. Select the date using the date picker
2. For each shed, enter daily data:
   - Mortality count
   - Egg production (trays)
   - Sales (trays sold)
   - Feed consumption
   - Notes
3. Click "Save" for each shed

### 4. Viewing Dashboard
1. Navigate to "Home" to see the dashboard
2. Use the date picker to view data for specific dates
3. Click on cards to expand and see detailed breakdowns

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **Session Management**: Secure session handling
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Proper cross-origin settings

## 📊 Data Features

- **Real-time Updates**: Instant data synchronization
- **Historical Tracking**: View data for any date
- **Data Export**: Ready for reporting and analysis
- **Backup Ready**: Database structure supports easy backups

## 🎨 Design Features

- **Modern UI**: Clean, professional interface
- **Mobile Responsive**: Works perfectly on all devices
- **Smooth Animations**: Enhanced user experience
- **Accessibility**: Keyboard navigation and screen reader support
- **Dark Mode Ready**: CSS structure supports theme switching

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-production-secret-key
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
DB_NAME=hensform_management
FRONTEND_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔄 Updates & Maintenance

- Regular security updates
- Performance optimizations
- New feature additions
- Bug fixes and improvements

---

**Built with ❤️ for efficient farm management**
