# Typography Migration Mapping - Phase A Complete

## ✅ Phase A: Semantic Scale Coverage Added

### **Button Component Scales** (Replaces Button.jsx fontSize usage)
| Old Primitive | New Semantic Scale | CSS Variable | Usage |
|---------------|-------------------|--------------|-------|
| `fontSize.xs` | `button-small` | `--typography-scales-button-small-*` | Button xs size |
| `fontSize.sm` | `button-medium` | `--typography-scales-button-medium-*` | Button sm/md sizes |
| `fontSize.lg` | `button-large` | `--typography-scales-button-large-*` | Button lg size |

### **UI Component Scales** (Replaces general fontSize usage)
| Old Primitive | New Semantic Scale | CSS Variable | Usage |
|---------------|-------------------|--------------|-------|
| `fontSize.xs` | `ui-small` | `--typography-scales-ui-small-*` | Small UI elements |
| `fontSize.md` | `ui-medium` | `--typography-scales-ui-medium-*` | Medium UI elements |
| `fontSize.lg` | `ui-large` | `--typography-scales-ui-large-*` | Large UI elements |
| `fontSize['3xl']` | `ui-xlarge` | `--typography-scales-ui-xlarge-*` | Extra large UI (FigmaEmbedViewer) |

### **Navigation Scales** (Replaces navigation fontSize usage)
| Old Primitive | New Semantic Scale | CSS Variable | Usage |
|---------------|-------------------|--------------|-------|
| `fontSize['2xl']` | `nav-brand` | `--typography-scales-nav-brand-*` | Navigation brand/logo |
| `fontSize.lg` | `nav-menu` | `--typography-scales-nav-menu-*` | Navigation menu items |

### **Modal Scales** (Replaces modal fontSize usage)
| Old Primitive | New Semantic Scale | CSS Variable | Usage |
|---------------|-------------------|--------------|-------|
| `fontSize.xl` | `modal-title` | `--typography-scales-modal-title-*` | Modal titles |
| `fontSize.lg` | `modal-body` | `--typography-scales-modal-body-*` | Modal body text |

### **Form Scales** (Replaces form fontSize usage)
| Old Primitive | New Semantic Scale | CSS Variable | Usage |
|---------------|-------------------|--------------|-------|
| `fontSize.md` | `form-label` | `--typography-scales-form-label-*` | Form labels |
| `fontSize.sm` | `form-input` | `--typography-scales-form-input-*` | Form inputs |
| `fontSize.xs` | `form-help` | `--typography-scales-form-help-*` | Form help text |

### **Weight Variants** (Replaces fontWeight usage)
| Old Primitive | New Semantic Scale | CSS Variable | Usage |
|---------------|-------------------|--------------|-------|
| `fontWeight.light` | `text-light` | `--typography-scales-text-light-*` | Light text weight |
| `fontWeight.medium` | `text-medium` | `--typography-scales-text-medium-*` | Medium text weight |
| `fontWeight.semibold` | `text-semibold` | `--typography-scales-text-semibold-*` | Semibold text weight |
| `fontWeight.bold` | `text-bold` | `--typography-scales-text-bold-*` | Bold text weight |

## 📋 **Next Phase B: Component Migration**

Now that all semantic scales exist, we can migrate components:

### **Priority 1: Button Component**
**File**: `src/design-system/components/Button.jsx`
**Changes**:
```jsx
// BEFORE
fontSize: 'var(--typography-font-size-xs)'

// AFTER  
fontSize: 'var(--typography-scales-button-small-font-size)'
fontWeight: 'var(--typography-scales-button-small-font-weight)'
```

### **Priority 2: CSS Files**
**Files**: `navigation.css`, `modal.css`, `PasswordGate.css`
**Changes**:
```css
/* BEFORE */
font-size: var(--typography-font-size-lg);

/* AFTER */
font-size: var(--typography-scales-nav-menu-font-size);
font-weight: var(--typography-scales-nav-menu-font-weight);
```

### **Priority 3: JavaScript Components**
**Files**: `FigmaEmbedViewer.jsx`, `Typography.jsx`, `applyTokens.js`

## 🎯 **Current State**
- ✅ **Complete semantic scale coverage** for all primitive usage
- ✅ **No breaking changes** - all existing code still works  
- ✅ **Ready for migration** - components can now switch to semantic scales
- ✅ **Token file size**: 14.82KB (increased temporarily for dual support)

## 🚀 **Migration Benefits**
- **Semantic meaning**: `button-small` vs `fontSize.xs`  
- **Complete typography**: Each scale includes fontSize + fontWeight + lineHeight + letterSpacing
- **Design consistency**: Buttons use button scales, not arbitrary sizes
- **Maintainable**: Single source of truth for component typography

## 📝 **Migration Commands Ready**
All CSS variables are now generated and available:
- `--typography-scales-button-small-font-size`
- `--typography-scales-nav-brand-font-weight` 
- `--typography-scales-modal-title-line-height`
- etc.

**Ready to proceed to Phase B: Component Migration!**
