# Truck Driver Monitoring System

A modern web-based monitoring and clocking system for truck drivers with real-time tracking and AI-powered insights.

## Features

### 🔐 Authentication System
- Secure login with role-based access
- Driver portal: `driver@helpfastpersonnel.com` / `driver123`
- Staff portal: `staff@helpfastpersonnel.com` / `staff123`

### 🚛 Driver Portal
- **Uniform Photo Requirement**: Must upload uniform photo before clocking in
- **Real-time Clock In/Out**: Track work hours with precision (only after uniform verification)
- **Document Upload**: Drag & drop file upload with support for images, PDFs, and documents
- **Today's Summary**: View clock in/out times and total hours worked
- **Modern UI**: Clean, responsive design with Tailwind CSS

### 👥 Staff Portal
- **Driver Management Dashboard**: Comprehensive overview of all drivers
- **Real-time Statistics**: Total drivers, clocked in count, issues, and average hours
- **Search Functionality**: Find drivers quickly with real-time search
- **AI Insights**: Intelligent analysis with pass/fail recommendations
- **Offcanvas Modal**: Detailed AI insights with performance scoring

## Pages Overview

### 1. Login Page (`index.html`)
- Modern gradient background with truck-themed design
- Email and password authentication
- Error handling with user-friendly messages

### 2. Driver Portal (`driver-portal.html`)
- **Clock Status**: Large digital clock display with real-time updates
- **Clock In/Out Buttons**: Easy one-click clocking with visual feedback
- **Today's Summary**: Current day's work hours and times
- **Document Upload**: File management with drag & drop support
- **Responsive Design**: Works on desktop and mobile devices

### 3. Staff Portal (`staff-portal.html`)
- **Statistics Cards**: Quick overview of key metrics
- **Driver Table**: Complete list with status, times, and actions
- **Search & Filter**: Real-time driver search functionality
- **AI Insights**: Intelligent analysis with performance scoring
- **Offcanvas Modal**: Detailed insights with recommendations

## Technical Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
- **Styling**: Tailwind CSS for modern, responsive design
- **Icons**: Font Awesome for consistent iconography
- **Storage**: LocalStorage for data persistence
- **Authentication**: Role-based access control

## Getting Started

1. **Open the application**:
   - Open `index.html` in your web browser
   - The system will automatically redirect to the appropriate portal based on login

2. **Driver Login**:
   - Email: `driver@helpfastpersonnel.com`
   - Password: `driver123`
   - Access: Clock in/out, upload documents, view daily summary

3. **Staff Login**:
   - Email: `staff@helpfastpersonnel.com`
   - Password: `staff123`
   - Access: View all drivers, AI insights, performance analytics

## Key Features Explained

### Clock In/Out System
- **Uniform Verification Required**: Drivers must upload uniform photo before clocking in
- Real-time time tracking with precision
- Automatic calculation of work hours
- Visual status indicators (Clocked In/Out/Not Started)
- Persistent storage of daily data including uniform photos

### Document Upload
- Support for multiple file types (images, PDFs, documents)
- Drag & drop functionality
- File size display and management
- Delete capability for uploaded files

### AI Insights
- **Performance Scoring**: Algorithm-based driver evaluation
- **Time Analysis**: Clock in/out pattern recognition
- **Compliance Monitoring**: Hours worked vs. regulations
- **Recommendations**: Actionable insights for improvement

### Real-time Updates
- Live clock display updating every second
- Automatic data refresh
- Instant search results
- Real-time status changes

## File Structure

```
trucking/
├── index.html              # Login page
├── driver-portal.html      # Driver interface
├── staff-portal.html       # Staff dashboard
├── js/
│   ├── auth.js            # Authentication logic
│   ├── driver-portal.js   # Driver functionality
│   └── staff-portal.js    # Staff functionality
└── README.md              # This file
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Security Notes

- This is a frontend-only demo system
- In production, implement proper backend authentication
- Use HTTPS for secure data transmission
- Implement proper session management
- Add input validation and sanitization

## Future Enhancements

- Backend integration with database
- Real-time notifications
- GPS tracking integration
- Advanced analytics dashboard
- Mobile app development
- API integration for external systems

## Support

For technical support or feature requests, please contact the development team.

---

**Built with ❤️ for trucking professionals** 