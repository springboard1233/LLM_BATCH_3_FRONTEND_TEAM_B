# Transaction Fraud Detection Dashboard

A comprehensive, real-time dashboard for monitoring and analyzing transaction fraud detection systems. Built with React, Vite, and Tailwind CSS.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.8-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3.6-cyan)

## 🚀 Features

### Core Dashboard Components

- **📊 KPI Scorecard**: Real-time metrics including total transactions, fraud detection rates, and financial volumes
- **🛡️ Risk Level Indicator**: Dynamic risk assessment with visual indicators and recommendations
- **📋 Transaction Table**: Comprehensive transaction listing with sorting, filtering, and pagination
- **🔍 Advanced Search & Filters**: Multi-criteria filtering system with real-time search capabilities
- **⚡ System Status Monitor**: Live system health monitoring and performance metrics

### Enhanced Features

- **🎯 Navigation Sidebar**: Collapsible navigation with multiple dashboard sections
- **🔔 Real-time Alerts**: Automated fraud detection notifications and system alerts
- **📈 Quick Stats Widget**: Key performance indicators at a glance
- **🔄 Auto-refresh**: Automatic data updates every 30 seconds
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Styling**: Tailwind CSS 3.3.6
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Development**: Hot Module Replacement (HMR)

## 📦 Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone or download the project files**
   ```bash
   # If you have the files locally, navigate to the project directory
   cd transaction-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   Navigate to: http://localhost:5173/
   ```

## 🎮 Usage

### Dashboard Navigation

- **Dashboard**: Main overview with all key metrics and transaction data
- **Analytics**: Advanced analytics and reporting (placeholder)
- **Fraud Detection**: Real-time fraud detection engine configuration
- **Risk Management**: Risk assessment and management tools
- **Customers**: Customer management and KYC status
- **Reports**: Generate and view detailed reports
- **Settings**: System configuration and preferences

### Key Interactions

#### Search & Filtering
- **Global Search**: Search across Transaction ID, Customer ID, Channel, or Status
- **Quick Filters**: Dropdown filters for Status and Channel
- **Advanced Filters**: 
  - Multi-select status and channel options
  - Date range picker
  - Amount range inputs
  - KYC status filtering

#### Transaction Table
- **Sorting**: Click column headers to sort data
- **Pagination**: Navigate through large datasets
- **Export**: Download transaction data (button available)
- **View Details**: Click eye icon for detailed transaction view

#### Real-time Features
- **Auto-refresh**: Data updates every 30 seconds
- **Manual Refresh**: Click refresh button in header
- **Live Alerts**: Fraud detection notifications appear in bottom-right
- **System Status**: Monitor system health in real-time

## 📊 Sample Data

The dashboard includes comprehensive sample data featuring:

- **12 Sample Transactions** with realistic fraud/legitimate mix
- **Multiple Channels**: Online Banking, Wire Transfer, Mobile App, ATM, POS, Web
- **Various Transaction Amounts**: From $450 to $50,000
- **KYC Status Indicators**: Verified and Pending statuses
- **Fraud Detection Results**: Legitimate, Safe, and Fraud classifications

## 🏗️ Project Structure

```
├── src/
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── components/
│   ├── AlertSystem.js         # Real-time alert notifications
│   ├── DashboardHeader.js     # Top navigation and controls
│   ├── DashboardLayout.js     # Main dashboard layout
│   ├── KPIScorecard.js        # Key performance indicators
│   ├── NavigationSidebar.js   # Side navigation menu
│   ├── QuickStats.js          # Quick statistics widget
│   ├── RiskLevelIndicator.js  # Risk assessment display
│   ├── SearchFilterBar.js     # Search and filtering controls
│   ├── SystemStatus.js        # System health monitoring
│   └── TransactionTable.js    # Transaction data table
├── package.json               # Project dependencies
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── README.md                 # This file
```

## 🔧 Configuration

### Vite Configuration
The project is configured to handle JSX in `.js` files:

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' }
    }
  }
})
```

### Tailwind CSS
Configured for optimal performance with content scanning:

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,jsx}"
  ],
  // ... theme and plugins
}
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deployment Options

- **Vercel**: Connect your repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after building
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **Traditional Hosting**: Upload the `dist` folder contents

## 🔌 API Integration

The dashboard is designed for easy backend integration. Replace sample data with API calls:

### Example API Integration

```javascript
// In your components, replace sample data with:
const [transactions, setTransactions] = useState([])

useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions')
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }
  
  fetchTransactions()
}, [])
```

### Expected API Data Format

```javascript
{
  "id": "TXN001",
  "customerId": "CUST001", 
  "amount": 1500.00,
  "status": "Legitimate", // "Fraud", "Safe", "Legitimate"
  "channel": "Online Banking",
  "date": "2024-01-15",
  "kycStatus": true, // boolean
  "riskLevel": "Low" // "Low", "Medium", "High"
}
```

## 🎨 Customization

### Color Scheme
The dashboard uses a professional color palette:
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)
- **Gray Scale**: Various shades for backgrounds and text

### Adding New Components
1. Create component file in root directory
2. Import in `src/App.jsx`
3. Add to appropriate section in the dashboard

### Modifying Metrics
Update the KPI calculations in `KPIScorecard.js` to match your business requirements.

## 🐛 Troubleshooting

### Common Issues

1. **JSX Syntax Errors**: Ensure Vite configuration includes JSX loader
2. **Tailwind Styles Not Loading**: Check `tailwind.config.js` content paths
3. **Hot Reload Issues**: Restart the development server with `npm run dev`

### Performance Optimization

- Use `useMemo` for expensive calculations
- Implement virtual scrolling for large datasets
- Add loading states for better UX
- Consider pagination for large transaction lists

## 📈 Future Enhancements

- [ ] Real-time WebSocket integration
- [ ] Advanced data visualization charts
- [ ] Export functionality (CSV, PDF)
- [ ] User authentication and role-based access
- [ ] Dark mode theme
- [ ] Mobile app version
- [ ] Advanced fraud detection algorithms
- [ ] Machine learning integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Lucide React** for beautiful icons
- **Tailwind CSS** for rapid UI development
- **Vite** for lightning-fast development experience
- **React Team** for the amazing framework

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the component documentation in the code

---

**Built with ❤️ for fraud detection and financial security**