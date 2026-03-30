# InvestPro - Professional Investment Platform Frontend

A modern, professional banking investment platform frontend built with React, Tailwind CSS, and Recharts. This is a production-ready showcase of a comprehensive investment portfolio management interface.

## Features

- **Portfolio Overview**: Quick snapshot of portfolio value, gains, and performance
- **Performance Tracking**: Real-time monitoring of investment returns across multiple time periods
- **Holdings Analysis**: Detailed view of individual holdings with gainers/losers filtering
- **Diversification Management**: Multi-dimensional portfolio distribution analysis with donut charts
- **Risk Assessment**: Professional risk metrics including Beta, Sharpe Ratio, and Sortino Ratio
- **Interactive Carousel**: Smooth transitions between feature showcases with auto-play controls
- **Responsive Design**: Optimized for desktop and tablet viewing
- **Professional UI**: Clean, modern design with financial-grade aesthetics

## Tech Stack

- **React 18**: Modern UI library with hooks
- **Vite**: Lightning-fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Composable charting library
- **Lucide React**: Beautiful icon library

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx                 # Top navigation bar
│   ├── FeatureShowcase.jsx        # Main carousel container
│   ├── FeatureMenu.jsx            # Left-side feature menu
│   ├── CarouselControls.jsx       # Playback controls
│   ├── PortfolioOverviewPanel.jsx # Portfolio dashboard
│   ├── PerformancePanel.jsx       # Performance tracking
│   ├── PotentialPanel.jsx         # Holdings analysis
│   ├── DiversificationPanel.jsx   # Asset allocation
│   └── RiskPanel.jsx              # Risk metrics
├── data/
│   └── mockData.js                # Mock financial data
├── App.jsx                        # Main app component
├── main.jsx                       # React entry point
└── index.css                      # Global styles
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Component Overview

### Navbar
- Responsive navigation with mobile menu
- Search functionality
- Language and user icons
- Call-to-action button

### FeatureShowcase
- Main carousel container managing feature state
- Auto-play with 5-second intervals
- Manual navigation controls
- Smooth transitions between panels

### Feature Panels

1. **PortfolioOverviewPanel**: Displays portfolio metrics and value/performance chart
2. **PerformancePanel**: Shows performance trends and period-based returns
3. **PotentialPanel**: Analyzes individual holdings with filtering options
4. **DiversificationPanel**: Multi-dimensional portfolio distribution analysis
5. **RiskPanel**: Professional risk metrics with visual scales

## Styling

The project uses Tailwind CSS with custom configuration:

- **Color Scheme**: Professional grays with blue accents
- **Success Color**: Green (#10B981)
- **Danger Color**: Red (#EF4444)
- **Primary Color**: Dark gray (#1F2937)
- **Accent Color**: Blue (#3B82F6)

Custom components are defined in `index.css` for reusable patterns like `.card`, `.btn`, and `.metric-card`.

## Mock Data

All data is provided through `mockData.js` including:
- Portfolio metrics and history
- Performance data by time period
- Holdings information
- Diversification breakdowns
- Risk metrics
- Navigation items

To connect to a real backend, replace the mock data imports with API calls.

## Interactions

- **Feature Selection**: Click menu items to switch panels
- **Tab Switching**: Toggle between different data views
- **Carousel Controls**: Previous/Next buttons and auto-play toggle
- **Hover Effects**: Visual feedback on interactive elements
- **Responsive**: Adapts to different screen sizes

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Responsive on tablets and larger screens

## Performance Optimizations

- Lazy component rendering
- Memoized chart components
- CSS animations for smooth transitions
- Optimized re-renders with React hooks

## Future Enhancements

- Real-time data integration
- User authentication
- Portfolio customization
- Advanced filtering options
- Export functionality
- Dark mode support
- Mobile app version

## License

MIT License - feel free to use this as a template for your projects.

## Support

For questions or issues, please refer to the component documentation or create an issue in the repository.
