# IUBAT Smart Library - Frontend

React.js frontend for the IUBAT Smart Library management system.

## Features

- **Main Library Interface**: Student entry/exit with real-time feedback
- **E-Library Management**: PC selection and usage tracking
- **Admin Dashboard**: Login, reports, and system management
- **Modern UI**: Gradient designs, responsive layout, professional styling

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000/`

**Note**: Make sure the Django backend is running on `http://127.0.0.1:8000/` before starting the frontend.

## Project Structure

```
frontend/
├── public/           # Static files
├── src/
│   ├── App.js       # Main application component
│   ├── App.css      # Main styles with modern gradients
│   ├── ELibrary.js  # E-Library PC management
│   ├── AdminDashboard.js # Admin interface
│   └── index.js     # Application entry point
├── package.json     # Node.js dependencies
└── README.md        # This file
```

## Components

### Main Library (`App.js`)
- Student ID input with real-time validation
- Entry/exit tracking with immediate feedback
- Navigation between different sections

### E-Library (`ELibrary.js`)
- Visual PC status grid (Available/In Use/Out of Order)
- PC selection and check-in/check-out functionality
- Real-time status updates

### Admin Dashboard (`AdminDashboard.js`)
- Secure admin login
- Time-based and student-based reports
- System statistics and data management

## API Integration

The frontend communicates with the Django backend via:
- **Proxy Configuration**: All `/api/*` requests are forwarded to `http://127.0.0.1:8000/`
- **Axios HTTP Client**: Handles all API communications
- **Real-time Updates**: Components refresh data automatically

## Dependencies

- **React 19.1.1**: Core framework
- **Axios**: HTTP client for API communications
- **React Scripts**: Build and development tools

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
