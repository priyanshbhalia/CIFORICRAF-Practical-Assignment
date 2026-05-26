# GreenCanopy — Agroforestry Monitoring Dashboard & Analytics Portal

Welcome to **GreenCanopy**, a production-ready, high-performance web dashboard designed to visualize and manage agroforestry monitoring logs. This project fulfills the requirements of **Assignment 2** by integrating an interactive data table, responsive analytical charting, and a fully validated record submission form within a modern, visually stunning single-page application.

---

## Key Features

### Part 1: Interactive Data Table
- **Multi-Field Filtering**: Perform refined searches using text input (matching tree species or district names) combined with drop-down selectors for District, Species, and Health Status.
- **Column Header Sorting**: Sort logs dynamically in ascending or descending order by clicking any column header (District, Species, Tree Count, Planting Date, or Health).
- **Pagination**: Paginated view rendering 8 rows per page with a clear visual summary ("Showing 1 to 8 of 22 records") and disabled boundary state navigation.
- **Status Badges**: Clean, color-coded health badges indicating logs as *Excellent*, *Good*, *Fair*, or *Poor*.

### Part 2: Dynamic Analytics Charting (Recharts)
- **District Breakdown**: Bar chart visualizing total tree counts planted per district.
- **Species Composition**: Bar chart displaying total tree counts per species.
- **Timeline Trend**: Area chart showing chronological planting activities aggregated by month and year.
- **Interactive Tooltips**: Curated tooltips mapping details on hover, adjusting dynamically to active theme palettes.

### Part 3: Validated Record Submission Form
- **Dynamic Insertion**: Submitting new records appends data to the dashboard in real time, refreshing stats, tables, and charts instantly.
- **Client-Side Form Validation**:
  - Validates that all fields are filled.
  - Verifies that the trees planted field receives a positive integer (> 0).
  - Ensures the planting date is not set in the future.
- **User Feedback**: Inline warning text highlighting fields requiring attention and a visual success toast alert upon successful log entries.

### Premium Extras
- **Forestry HSL Theme Palettes**: Optimized color schemes using deep emerald forest greens, warm timber shades, and soft sage highlights.
- **Light & Dark Mode Switcher**: Smooth visual theme changes stored inside `localStorage` for persistent user selection.
- **Dynamic Stats Cards**: Four KPIs reporting total trees planted, unique species count, active districts, and the overall survival index.
- **Local Storage Persistence**: Saved records and logs persist across browser page reloads.
- **Responsive Layout**: Adapts from fluid multi-column desktop grids to vertical single-column layouts for mobile and tablet viewports.

---

##  Technology Stack
- **Framework**: [React](https://react.dev/) + [Vite](https://vite.dev/) (fast, HMR, modern bundling)
- **Visuals & Charts**: [Recharts](https://recharts.org/) (interactive, SVG-based charts)
- **Icons**: [Lucide React](https://lucide.dev/) (clean vector stroke icons)
- **Styling**: Vanilla CSS (native CSS custom properties, grid layouts, flexbox structures, and transitions)

---

##  Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16.0.0 or higher) and `npm` installed.

### Installation
1. Navigate into the `Assignment2` directory:
   ```bash
   cd Assignment2
   ```
2. Install the project dependencies:
   ```bash
   npm install
   ```

### Running Locally
To launch the application in development mode with hot module replacement:
```bash
npm run dev
```
Open your browser and navigate to the address displayed in the console (usually `http://localhost:5173`).

### Production Build
To compile the project and bundle optimized assets for deployment:
```bash
npm run build
```
The compiled, production-ready static assets will be output to the `dist/` directory, which can be deployed to platforms like **Vercel** or **Netlify**.

---

## Project Architecture
```
Assignment2/
├── index.html                   # SEO tags, viewport details, and favicon
├── package.json                 # Project dependencies & build scripts
├── vite.config.js               # Vite compilation rules
├── src/
│   ├── main.jsx                 # DOM entry point mount
│   ├── index.css                # CSS variables, grids, tables, forms, & animations
│   ├── App.jsx                  # State manager, stats compiler, theme, and dashboard shell
│   ├── data/
│   │   └── mockData.js          # Preloaded 22 records and select inputs helper lists
│   └── components/
│       ├── DataTable.jsx        # Data list, sorting, filtering, and pagination components
│       ├── MonitoringChart.jsx  # Recharts implementation (Bar, Area)
│       └── RecordForm.jsx       # Validated form entry & toast notifications
```

---

##  Design Aesthetics & SEO Optimization
- **SEO Compliance**: Configured unique semantic headings, descriptive title tags, meta description details, and explicit accessibility tags.
- **Aesthetic Excellence**: Premium glassmorphism card layouts (`backdrop-filter`), custom scrollbars, interactive list highlights, custom form controls, and micro-animations.
