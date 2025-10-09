# 📋 Typography Update Guide - Single Source of Truth

## ✅ **How to Update Typography (Correct Way)**

### **1. Make Changes in `typography.js` ONLY**
```javascript
// /src/design-system/tokens/typography.js
export const typography = {
  fontSize: {
    '2xl': '2.441rem',  // ← Change this value only
  },
  fontWeight: {
    semibold: 600,      // ← Change this value only  
  }
  // etc...
}
```

### **2. Run Token Build**
```bash
npm run build:tokens
```
This regenerates CSS variables from your JS tokens.

### **3. CSS Updates Automatically**
The CSS classes automatically use the updated values:
```css
.text-heading-3 {
  font-size: var(--typography-font-size-2xl);     /* ← Auto-updates from step 1 */
  font-weight: var(--typography-font-weight-semibold); /* ← Auto-updates from step 1 */
}
```

---

## 🚫 **What NOT to Do**

### **❌ Don't Edit `typography.css` Directly**
```css
/* DON'T DO THIS - will be overridden */
.text-heading-3 {
  font-size: 3rem; /* ← Hard-coded values get out of sync */
}
```

### **❌ Don't Edit CSS Variables Directly**
CSS variables are generated from tokens, so changes will be lost.

---

## 🎯 **Current System Flow**

```
typography.js → build:tokens → CSS Variables → typography.css Classes
     ↑                                              ↓
  EDIT HERE                                   AUTO-UPDATES
```

### **Files & Responsibilities:**

1. **`typography.js`** ✅ **EDIT THIS**
   - Source of truth for all typography values
   - Contains semantic scales and utility generator
   - Export tokens to CSS variable system

2. **`typography.css`** ❌ **DON'T EDIT VALUES**
   - Uses CSS variables (auto-updates from tokens)
   - Contains utility classes and base styles
   - Edit structure/new classes only, not values

---

## 📝 **Example Updates**

### **Change a Font Size:**
```javascript
// 1. Edit typography.js
fontSize: {
  '2xl': '3rem',  // Changed from 2.441rem
}

// 2. Run: npm run build:tokens
// 3. All .text-heading-3 elements auto-update!
```

### **Change Line Height:**
```javascript  
// 1. Edit typography.js
lineHeight: {
  normal: 1.4,  // Changed from 1.3
}

// 2. Run: npm run build:tokens  
// 3. All .leading-normal classes auto-update!
```

### **Add New Semantic Scale:**
```javascript
// 1. Edit typography.js - add to scales object
scales: {
  'hero-title': {
    fontSize: '6rem',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.05em'
  }
}

// 2. Add CSS class to typography.css
.text-hero-title {
  font-size: var(--typography-font-size-display1); 
  font-weight: var(--typography-font-weight-extrabold);
  line-height: var(--typography-line-height-tight);
  letter-spacing: var(--typography-letter-spacing-tight);
}
```

---

## 🎉 **Benefits of This System**

- ✅ **Single Source of Truth**: All values in `typography.js`
- ✅ **Consistency**: Can't have mismatched values
- ✅ **Easy Updates**: Change once, updates everywhere
- ✅ **Type Safety**: Token system validates values
- ✅ **Performance**: CSS variables are fast
- ✅ **Maintainable**: Clear separation of concerns
