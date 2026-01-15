# GMAO Dashboard - Next.js Application

A comprehensive maintenance management (GMAO - Gestion de Maintenance Assistée par Ordinateur) dashboard built with Next.js 14, TypeScript, and React.

## Features

- 📊 **Real-time Dashboard** - Visualize KPIs with interactive Chart.js charts
- 🧮 **KPI Calculators** - MTBF, MTTR, OEE, RPN, Availability, and Stock calculators
- 🤖 **AI Assistant** - Chat interface for maintenance-related questions
- 📚 **Documentation** - Complete reference guide for maintenance concepts
- 🌓 **Dark/Light Theme** - Toggle between themes with persistent storage
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## Project Structure

```
gmao-dashboard/
├── app/
│   ├── (sections)/
│   │   ├── calculators/
│   │   │   └── page.tsx
│   │   ├── chat/
│   │   │   └── page.tsx
│   │   └── documentation/
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── CalculatorCard.tsx
│   ├── ChatInterface.tsx
│   ├── ChartWrapper.tsx
│   ├── DashboardCharts.tsx
│   ├── Header.tsx
│   ├── StatCard.tsx
│   └── ThemeProvider.tsx
├── lib/
│   ├── dataLoader.ts
│   └── kpiCalculator.ts
├── public/
│   └── data/
│       ├── AMDEC.csv
│       ├── GMAO_Integrator.csv
│       └── Workload.csv
├── types/
│   └── index.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## Installation

1. **Clone or create the project directory:**

```bash
mkdir gmao-dashboard
cd gmao-dashboard
```

2. **Create all the files as shown in the artifacts above**

3. **Create the data directory and add your CSV files:**

```bash
mkdir -p public/data
```

Copy your CSV files (`AMDEC.csv`, `GMAO_Integrator.csv`, `Workload.csv`) into the `public/data/` directory.

4. **Install dependencies:**

```bash
npm install
```

## CSV File Format

Ensure your CSV files use semicolon (`;`) as delimiter and have these columns:

### AMDEC.csv & GMAO_Integrator.csv
- Column containing "type" (Type de panne)
- Column containing "arrêt" or "durée" (Durée arrêt (h))
- Column containing "désignation" (Désignation)

### Workload.csv
- Column containing "type" (Type de panne)
- Column containing "heures" (Nombre d'heures)
- Column containing "coût" and "intervention" (Coût total intervention)
- Column containing "prénom" (optional - Technician name)

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Key Technologies

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Data visualization
- **PapaParse** - CSV parsing
- **Lucide React** - Icon library

## Pages

### 1. Dashboard (`/`)
- Real-time KPI statistics cards
- 5 interactive charts visualizing maintenance data
- Server-side data loading for optimal performance

### 2. Calculators (`/calculators`)
- MTBF Calculator
- MTTR Calculator
- Availability Calculator
- OEE Calculator
- RPN Calculator
- Stock Minimum Calculator

### 3. AI Assistant (`/chat`)
- Interactive chat interface
- Pre-defined responses for maintenance questions
- Suggested questions and capabilities sidebar

### 4. Documentation (`/documentation`)
- Comprehensive maintenance terminology guide
- KPI formulas and examples
- AMDEC/RPN analysis guide
- Stock management formulas
- Maintenance types overview

## Data Loading

The application uses **server-side data loading** in Next.js:

- CSV files are read from `public/data/` directory
- Data is parsed and normalized on the server
- Charts and KPIs are calculated server-side
- No Python HTTP server needed - Next.js handles everything

## Theme Support

The application supports dark and light themes:
- Toggle via the theme button in the header
- Theme preference is saved to localStorage
- CSS variables ensure consistent theming

## Customization

### Adding New Calculators

1. Edit `app/(sections)/calculators/page.tsx`
2. Add a new `<CalculatorCard>` with your fields and calculation logic

### Modifying Charts

1. Edit `components/DashboardCharts.tsx`
2. Add or modify chart configurations using Chart.js options

### Adding Chat Responses

1. Edit `components/ChatInterface.tsx`
2. Update the `getAIResponse()` function with new question patterns

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Other Platforms

Build the static export:

```bash
npm run build
```

Deploy the `.next` folder to your hosting provider.

## Troubleshooting

### CSV Files Not Loading

- Ensure CSV files are in `public/data/` directory
- Check that delimiter is semicolon (`;`)
- Verify column names contain expected keywords

### Charts Not Rendering

- Check browser console for errors
- Ensure data is properly formatted
- Verify Chart.js is properly imported

### Theme Not Persisting

- Check localStorage is enabled in browser
- Verify ThemeProvider is wrapping the app

## License

MIT

## Support

For issues or questions, please check the documentation page or create an issue in the repository.