# Score Buddy

**Kev's Bitchin' Print Calculator** - A web-based tool for calculating print layouts and scoring positions.

## 🚀 Features

- Interactive print layout calculator
- Support for various fold types (bifold, trifold, gatefold, custom)
- Real-time score position calculations
- Visual layout preview with scoring lines
- Responsive design with dark/light themes
- Metric/Imperial unit support

## 🛠️ Development

### Prerequisites

- Node.js 18+ (for running tests and build scripts)
- Modern web browser (for ES modules support)

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install` (optional, no external dependencies currently)
3. Run tests: `npm test`
4. Build the project: `npm run build`
5. Serve locally: `npm run dev`

### Scripts

- `npm test` - Run all test suites
- `npm run build` - Run tests and build static assets
- `npm run build:static` - Build static assets only
- `npm run dev` - Start local development server

## 🔄 CI/CD & Preview Deployments

This repository includes automated GitHub Actions workflows for pull request previews:

### PR Preview Workflow

When you open a pull request, the workflow automatically:

1. **Tests** - Runs the complete test suite to ensure code quality
2. **Builds** - Creates deployable static assets
3. **Deploys** - Publishes a preview environment to GitHub Pages
4. **Comments** - Adds a comment to your PR with the preview URL

The preview is automatically updated when you push new commits to your PR, and cleaned up when the PR is merged or closed.

### Workflow Features

- ✅ Triggers on all PR events (opened, updated, closed)
- ✅ Uses Node.js 20 LTS for stability and performance
- ✅ Comprehensive test coverage before deployment
- ✅ Automatic preview URL commenting
- ✅ Cleanup when PRs are closed
- ✅ Secure deployment with proper GitHub Pages permissions

## 📁 Project Structure

```
Score_Buddy/
├── .github/workflows/           # GitHub Actions workflows
│   └── deploy-pr-preview.yml   # PR preview deployment
├── src/                        # Source code modules
│   ├── config/                 # Configuration files
│   ├── layout/                 # Layout calculation logic
│   ├── render/                 # Canvas rendering functions
│   ├── scoring/                # Scoring calculations
│   └── ui/                     # User interface components
├── styles/                     # CSS stylesheets
├── tests/                      # Test suites
├── index.html                  # Main HTML file
├── app.js                      # Application entry point
├── visualizer.js               # Visualization functions
└── package.json               # Node.js package configuration
```

## 🧪 Testing

The project includes comprehensive test coverage:

- **Scoring Tests** - Validate scoring position calculations
- **Layout Tests** - Test layout calculation logic  
- **Rendering Tests** - Verify canvas drawing functions
- **Integration Tests** - End-to-end functionality testing

Tests use Node.js built-in `assert` module and ES module imports.

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Open a pull request

Your PR will automatically get a preview environment for testing!

## 📄 License

MIT License - see LICENSE file for details.