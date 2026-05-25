# Tree Species Selector 

A premium, interactive React Native mobile application built with **Expo**, **TypeScript**, and **Lucide Icons**. This application serves as a specimen browser for various tree species, categorized by their ecological and economic roles (e.g., Fruit, Timber, Shade, Medicinal, and Ornamental).

---

##  Key Features

- **Rich Specimen Dataset**: Pre-populated with 10 detailed tree species including scientific names, dimensions, growth rates, origins, descriptions, and ecological impacts.
- **Dynamic Category Filtering**: Horizontally scrollable pill selector to instantly filter trees by category (Fruit, Timber, Shade, Medicinal, Ornamental) complete with intuitive icons.
- **Instant Search (Extra Credit)**: Interactive search bar filtering results by common or scientific names in real time.
- **Interactive Detail Modal**: Smooth sliding bottom-sheet detail modal displaying comprehensive information, statistics, and ecological benefits.
- **Silky Smooth Scrolling**: Implemented using React Native's optimized `FlatList` with light-weight assets for stutter-free scrolling performance.
- **Premium Natural Aesthetics**: Crafted around a cohesive green botanical color palette with rounded borders, card elevation, and visual states.
- **Accessibility Friendly**: Inclusive design with semantic screen reader tags (`accessibilityLabel`, `accessibilityRole`, `accessibilityState`), touch target sizes, and focus states.

---

## 🛠️ Tech Stack & Design System

- **Core**: React Native (Expo SDK 56)
- **Language**: TypeScript
- **Icons**: Lucide React Native
- **Styling**: Vanilla React Native StyleSheet API (Natural Palette: Forest Green `#2E8B57`, Olive `#556B2F`, Mint Accent `#E8F2E8`, Dark Slate `#2E3A2E`)
- **Assets**: Hand-crafted watercolor tree illustrations representing botanical details.

---

##  Project Structure

```text
Assignment1/
├── assets/
│   └── images/          # Watercolor tree illustrations (neem, mango, mahogany, etc.)
├── components/
│   ├── SearchBar.tsx      # Interactive search bar input
│   ├── CategoryFilter.tsx # Horizontal scrolling category selector
│   ├── TreeCard.tsx       # Specimen list item card
│   └── DetailModal.tsx    # Bottom sheet detailing species characteristics
├── data/
│   └── species.ts       # TypeScript models and 10+ species database entries
├── App.tsx              # Application root and state coordinator
├── package.json         # Project metadata and dependencies
└── tsconfig.json        # TypeScript configuration
```

---

##  How to Run the Project

### 1. Prerequisites
Ensure you have **Node.js** (v18+ or v20+) installed on your machine.

### 2. Install Dependencies
Navigate into the project directory and install the required npm packages:
```bash
cd Assignment1
npm install
```

### 3. Run the Development Server
Launch the Expo bundler:
```bash
npm run start
```
*Alternatively, you can start the project specifically for Android (`npm run android`) or iOS (`npm run ios`).*

