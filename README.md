# Ping Map

A 3D interactive globe that calculates the theoretical minimum ping time between two points on Earth.

## Features

- Interactive 3D Earth globe with OpenStreetMap tiles
- Click to place two points on the globe
- Automatic calculation of theoretical minimum ping time
- Visual connection line between points
- Real-world map data visualization
- Automatic deployment to GitHub Pages
## How it Works

The application calculates the minimum theoretical ping time based on:

1. The great-circle distance between two points (shortest path on the surface of a sphere)
2. The speed of light in fiber optic cables (approximately 68% of the speed of light in vacuum)
3. The round-trip time (ping is a round-trip measurement)

The globe uses OpenStreetMap tiles to display real geographic data on the 3D sphere.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ping-map.git
cd ping-map
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Click on the globe to place the first point
2. Click on another location to place the second point
3. The theoretical minimum ping time will be displayed in the bottom right corner
4. Click again to update the second point's position

## Deployment

The project is automatically deployed to GitHub Pages using GitHub Actions. Any push to the main branch will trigger a build and deployment to GitHub Pages.

To deploy manually:

```bash
npm run build
```

## Security

This project uses Gitleaks to scan for secrets and sensitive information in the codebase. The scan runs automatically on:
- Every push to the main branch
- Pull requests targeting the main branch
- Weekly scheduled scans
- Manual triggers via GitHub Actions

## License

This project uses:
- OpenStreetMap data which is © OpenStreetMap contributors and available under the Open Database License (ODbL)
- Earth textures derived from NASA's Blue Marble imagery, which is in the public domain

## Notes

The calculated ping times represent the theoretical minimum based solely on the speed of light in fiber optic cables. Real-world ping times are typically much higher due to:

- Network routing (non-direct paths)
- Processing delays at routers and switches
- Last-mile connectivity issues
- Protocol overhead

This application is educational and demonstrates the physical limits of network latency. 
