# Simple Typography Migration Plan

## 🎯 **Goal**: Use existing semantic scales, remove primitive usage

## 📊 **Current Semantic Scales in `index.js`**
- `display-1` (5.96rem, 700 weight, 1.2 line height)
- `display-2` (4.768rem, 700 weight, 1.2 line height)
- `heading-1` (3.815rem, 700 weight, 1.2 line height) 
- `heading-2` (3.052rem, 600 weight, 1.2 line height)
- `heading-3` (2.441rem, 600 weight, 1.3 line height)
- `heading-4` (1.953rem, 500 weight, 1.3 line height)
- `heading-5` (1.563rem, 500 weight, 1.3 line height)
- `heading-6` (1.25rem, 500 weight, 1.3 line height)
- `body-lg` (1.25rem, 400 weight, 1.6 line height)
- `body` (1rem, 400 weight, 1.8 line height)
- `body-sm` (0.8rem, 400 weight, 1.6 line height)
- `caption` (0.64rem, 400 weight, 1.3 line height)

## 🔄 **Component Mappings**

### **Button Component** (`src/design-system/components/Button.jsx`)
```jsx
// CURRENT (primitives):
fontSize: 'var(--typography-font-size-xs)'    // 0.8rem
fontSize: 'var(--typography-font-size-sm)'    // 1rem  
fontSize: 'var(--typography-font-size-lg)'    // 1.563rem

// CHANGE TO (semantic scales):
fontSize: 'var(--typography-scales-body-sm-font-size)'     // xs → body-sm (0.8rem)
fontSize: 'var(--typography-scales-body-font-size)'        // sm → body (1rem)
fontSize: 'var(--typography-scales-heading-5-font-size)'   // lg → heading-5 (1.563rem)
```

### **Typography Component** (`src/design-system/components/Typography.jsx`)
✅ **Already using semantic scales correctly** - no changes needed

### **Navigation CSS** (search for navigation files)
```css
/* CURRENT (primitives): */
font-size: var(--typography-font-size-2xl);   // 2.441rem brand
font-size: var(--typography-font-size-lg);    // 1.563rem menu

/* CHANGE TO (semantic scales): */
font-size: var(--typography-scales-heading-3-font-size);   // brand → heading-3 (2.441rem)
font-size: var(--typography-scales-heading-5-font-size);   // menu → heading-5 (1.563rem)
```

### **Modal CSS** (search for modal files) 
```css
/* CURRENT (primitives): */
font-size: var(--typography-font-size-xl);    // 1.953rem titles
font-size: var(--typography-font-size-lg);    // 1.563rem body

/* CHANGE TO (semantic scales): */
font-size: var(--typography-scales-heading-4-font-size);   // title → heading-4 (1.953rem)  
font-size: var(--typography-scales-heading-5-font-size);   // body → heading-5 (1.563rem)
```

## 🗑️ **Files to Remove**
- `src/design-system/tokens/typography/scales.js` (redundant, duplicates index.js)

## ✅ **Steps**
1. **Remove scales.js** - it's redundant 
2. **Update Button.jsx** - map button sizes to semantic scales
3. **Update CSS files** - replace primitives with semantic scales  
4. **Test & verify** - ensure no visual changes
5. **Eventually remove primitives** - once all usage migrated

## 🎯 **Result**
- Single source of truth: `typography.scales` in `index.js`
- No new definitions needed
- Components use semantic, not primitive scales
- Same visual result, cleaner system
