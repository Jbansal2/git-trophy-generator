# Getting Started with Create React App

# GitHub Trophy Frontend

A modern React frontend for the GitHub Trophy Generator API.

## 🚀 Features

- **Live API Integration** - Connects to local backend API
- **Real-time Trophy Generation** - Generate trophies for any GitHub user
- **Multiple Themes** - Choose from Cyberpunk, Dracula, Nord, and Obsidian themes
- **API Status Monitoring** - Real-time API health and rate limit info
- **Trophy Filtering** - Filter by categories and ranks
- **Export Options** - Download SVG and copy Markdown/HTML snippets

## 🛠 Setup

### Prerequisites
- Node.js 16+ or 18+
- Backend API running on `localhost:3000` (from main repository)

### Installation

1. **Install dependencies:**
   ```bash
   cd github-trophy-frontend/frontend
   npm install
   # or
   yarn install
   ```

2. **Configure API URL:**
   The `.env` file is already configured to connect to `http://localhost:3000/trophy`

3. **Start frontend:**
   ```bash
   npm start
   # or 
   yarn start
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 🔗 Connecting to Backend

### Start Backend Server First
```bash
# In the main repository directory
npm start
```
The backend will run on `http://localhost:3000`

### Then Start Frontend
```bash
# In this frontend directory
npm start
```
The frontend will run on `http://localhost:3001`

### API Endpoints Used
- `GET /trophy` - Generate trophy SVG
- `GET /health` - API health check  
- `GET /api/rate-limit` - Rate limit information

## 🎨 Features

- **Live Trophy Preview** - See trophies update in real-time
- **Theme Selection** - Multiple visual themes available
- **Category Filtering** - Filter by Commits, PRs, Stars, etc.
- **API Status** - Visual indicators for API connectivity
- **Rate Limit Display** - Shows current API usage
- **One-click Copy** - Easy README integration

## 🔧 Configuration

Edit `.env` file to change API URL:

```env
REACT_APP_API_URL=http://localhost:3000/trophy
```

For production deployment, update to your deployed backend URL.

## 🚀 Production Build

```bash
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.js          # Main React component
│   ├── App.css         # Styling
│   └── index.js        # Entry point
├── public/
│   └── index.html      # HTML template
├── .env                # Environment variables
└── package.json        # Dependencies and scripts
```

## 🎯 Key Components

- **Generator** - Main trophy generation interface
- **API Status Monitor** - Real-time backend connectivity
- **Theme Selector** - Visual theme switching
- **Trophy Preview** - Live SVG display
- **Export Tools** - Download and sharing options

Built with ❤️ for the open source community!

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
