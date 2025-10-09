# Case Study Registry System

This system provides a single source of truth for all case study data, making it easy to enable/disable case studies and add new ones.

## How It Works

### 📋 Single Registry File
`/src/data/caseStudyRegistry.js` - **One file contains everything:**
- Case study metadata (title, folder, file counts)  
- Button configuration (text, icons)
- Viewer settings (Figma URLs, image paths)
- Enable/disable toggles

### 🔧 Key Features

1. **Single Source of Truth**: All case study data in one place
2. **Simple Toggle**: Change `enabled: false` to hide any case study
3. **Automatic Everything**: Buttons, images, and access are automatically managed
4. **No Complex Logic**: Direct data structure, no filtering functions needed
5. **Type Safety**: Consistent structure prevents errors

## Currently Disabled Case Studies

- `youtube-living-room` - YouTube Living Room Case Study
- `youtube-design-systems` - Design Systems Case Study  
- `apple-dev-docs` - Apple Developer Documentation Case Study

## Currently Enabled Case Studies

- `youtube-movies-shows` - YouTube Movies & Shows Case Study
- `apple-production` - Apple Production Artist Case Study
- `fetch-figma-data` - Fetch Figma Data App

## To Enable/Disable Case Studies

**Super Simple** - Edit `/src/data/caseStudyRegistry.js`:
```javascript
'youtube-living-room': {
  enabled: true, // Just flip this boolean!
  section: 'youtube',
  button: {
    text: 'YouTube Living Room Case Study',
    icon: 'icon-Lock_light'
  },
  viewer: {
    type: 'FeaturedProjectViewer',
    title: 'YouTube Living Room Case Study',
    folder: '/assets/yt_case_study_00',
    count: 18,
    fileName: 'featured_ytlr'
  }
}
```

## Adding New Case Studies

**Just add to the registry** - Everything else is automatic:

```javascript
'my-new-case-study': {
  enabled: true,
  section: 'youtube', // snapchat, youtube, apple, figma
  button: {
    text: 'My Amazing Case Study',
    icon: 'icon-Lock_light'
  },
  viewer: {
    type: 'FeaturedProjectViewer', // or 'FigmaEmbedViewer'
    title: 'My Amazing Case Study',
    folder: '/assets/my_case_study',
    count: 15,
    fileName: 'my_study'
  }
}
```

## Files Removed (Simplified!)

- ❌ `/src/config/caseStudyConfig.js` - No longer needed
- ❌ `/src/components/caseStudyButtons.js` - No longer needed  
- ✅ `/src/data/caseStudyRegistry.js` - **One file does it all**

The system automatically handles:
- Button generation and filtering
- Image preloading optimization  
- Section assignment
- Access control
