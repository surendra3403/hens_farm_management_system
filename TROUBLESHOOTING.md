# Troubleshooting Guide

## White Page Issue

If you're seeing a white page when accessing your deployed app, here are the common causes and solutions:

### 1. Check Browser Console
Open Developer Tools (F12) and check the Console tab for any error messages.

### 2. Common Issues and Fixes

#### Duplicate Router Configuration
- **Problem**: Having both `BrowserRouter` in `main.jsx` and `Router` in `App.jsx`
- **Solution**: Remove the duplicate router wrapper from `App.jsx`

#### Incorrect Script Paths
- **Problem**: Absolute paths in `index.html` that don't work with GitHub Pages base path
- **Solution**: Use relative paths or ensure paths include the base path

#### Build Errors
- **Problem**: Build process failing due to syntax errors or missing dependencies
- **Solution**: Run `npm run build` locally to check for errors

### 3. Debug Steps

1. **Check GitHub Actions**: Go to Actions tab to see if deployment succeeded
2. **Verify Build Output**: Check that `dist/` folder contains built files
3. **Test Locally**: Run `npm run build && npm run preview` to test locally
4. **Check Network Tab**: Look for failed resource requests in Developer Tools

### 4. Environment Variables

For production deployment, ensure these are set:
```env
NODE_ENV=production
VITE_API_URL=  # Leave empty for frontend-only deployment
```

### 5. GitHub Pages Configuration

- Source: Deploy from a branch
- Branch: `gh-pages`
- Folder: `/ (root)`

### 6. Manual Deployment

If GitHub Actions fails, you can deploy manually:
```bash
npm run build
npm run deploy
```

## Still Having Issues?

1. Check the GitHub Actions logs for detailed error messages
2. Verify all dependencies are installed (`npm install`)
3. Ensure the repository name matches the base path in `vite.config.js`
4. Check that the `gh-pages` package is installed as a dev dependency
