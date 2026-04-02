# InvestPro - Professional Investment Platform Frontend

A modern, professional banking investment platform frontend built with React, Tailwind CSS, Recharts, and Lightweight Charts. This is a production-ready showcase of a comprehensive investment portfolio and stock management interface.


## Tech Stack

- **React 18**: Modern UI library with hooks
- **Vite**: Lightning-fast build tool
- **React Router DOM**: Client-side routing for navigating between dashboard and charts
- **Tailwind CSS**: Utility-first CSS framework customized for professional styling
- **Recharts**: Composable charting library for portfolio analytics
- **Lightweight Charts**: High-performance financial charts by TradingView
- **Axios**: HTTP client for API interactions
- **Lucide React**: Beautiful professional icon library

## Project Structure

The project follows a scalable feature-based architecture:

```text
src/
├── api/                       # API configuration and interceptors (axios.js)
├── components/
│   └── common/                # Shared UI components (e.g., TransactionModal)
├── data/
│   └── mockData.js            # Mock fallback data for development
├── features/
│   ├── portfolio/             # Portfolio analytics and dashboard features
│   │   ├── components/        # Panels: Overview, Performance, Risk, etc.
│   │   └── services/          # Portfolio API services
│   ├── stock/                 # Stock discovery and charting feature
│   │   ├── components/        # Stock Table, Detail Cards, Finder Panel
│   │   ├── pages/             # FullScreenChart route
│   │   └── services/          # Stock market API services
│   └── watchlist/             # Watchlist management feature
│       └── components/        # Watchlist buttons and UI
├── App.jsx                    # Application routing and overall layout tab structure
├── main.jsx                   # React entry point
└── index.css                  # Global styles and Tailwind directives
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

## Support

For questions or issues, please refer to the component documentation or create an issue in the repository.
