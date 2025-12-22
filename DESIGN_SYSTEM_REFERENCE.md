# Design System Reference Guide

## Quick Reference for Design System Usage

### Import in Any File

```tsx
import "@/styles/admin.css"; // Auto-imported globally via layout.tsx
```

---

## 🎨 Design Tokens (CSS Variables)

### Colors

```css
--color-primary: #667eea
--color-primary-dark: #5a67d8
--color-danger: #ef4444
--color-danger-dark: #dc2626
--color-success: #22c55e
--color-warning: #f97316

--color-gray-50 through --color-gray-900
--color-bg, --color-bg-secondary, --color-bg-tertiary
--color-border, --color-border-light
```

### Typography

```css
--font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", ...
--font-size-xs: 0.75rem
--font-size-sm: 0.875rem
--font-size-base: 1rem
--font-size-lg: 1.125rem
--font-size-xl: 1.25rem
--font-size-2xl: 1.5rem

--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### Spacing (Consistent Rhythm)

```css
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem
--spacing-2xl: 2.5rem
--spacing-3xl: 3rem
```

### Effects

```css
--radius-sm: 0.375rem    /* Radius */
--radius-md: 0.5rem
--radius-lg: 0.75rem
--radius-xl: 1rem

--shadow-sm: 0 1px 2px ...        /* Shadows */
--shadow-md: 0 4px 6px ...
--shadow-lg: 0 10px 15px ...
--shadow-xl: 0 20px 25px ...

--transition-fast: 150ms           /* Animations */
--transition-base: 200ms
--transition-slow: 300ms
```

---

## 🧩 Modal System

### Structure

```tsx
<div className="modal-overlay" onClick={onCancel}>
  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
    <div className="modal-header">
      <h2 className="modal-title">Title</h2>
      <button className="modal-close">
        <X size={20} />
      </button>
    </div>
    <div className="modal-body">Message</div>
    <div className="modal-footer">
      <button className="btn btn-secondary">Cancel</button>
      <button className="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Classes

- `.modal-overlay` - Fixed overlay with blur backdrop
- `.modal-content` - Centered card with slideUp animation
- `.modal-header` - Top section with title and close button
- `.modal-body` - Message content area
- `.modal-footer` - Bottom action buttons
- `.modal-title` - Modal heading (h2)
- `.modal-close` - Close button icon

### Features

- ✅ Fixed positioning (z-index 50)
- ✅ Centered on screen
- ✅ Backdrop blur (4px)
- ✅ slideUp animation (200ms)
- ✅ Click-outside to close (on overlay)
- ✅ ESC key support

---

## 🔘 Button System

### Variants

```tsx
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-danger">Danger</button>
<button className="btn btn-primary btn-block">Full Width</button>
<button className="btn btn-primary" disabled>Disabled</button>
```

### Classes

- `.btn` - Base button styles
- `.btn-primary` - Blue (#667eea), shadow, visually dominant
- `.btn-secondary` - Gray outline, for cancel/dismiss actions
- `.btn-danger` - Red (#ef4444), for destructive operations
- `.btn-block` - Full width (width: 100%)

### States

- **Default** - Rounded, padded, transition ready
- **Hover** - Color darker, shadow larger, lifts up
- **Active** - Translation down (pressed effect)
- **Disabled** - Gray text, no pointer, no hover effects
- **Focus** - Outline visible (browser default)

---

## 📝 Form System

### Container & Sections

```tsx
<form className="form-container">
  <div className="form-section">
    <h3 className="form-section-title">Section Title</h3>

    <div className="form-group">{/* Single field */}</div>

    <div className="form-group-row">{/* Side-by-side fields */}</div>
  </div>
</form>
```

### Input Elements

```tsx
<div className="form-group">
  <label htmlFor="name" className="form-label form-label-required">
    Field Name
  </label>
  <input id="name" className="form-input" required />
  <p className="form-helper-text">Optional helper text</p>
</div>

<select className="form-select">
  <option>Option 1</option>
</select>

<textarea className="form-textarea"></textarea>

{error && (
  <div className="form-error">
    <AlertCircle size={20} />
    <p>Error message</p>
  </div>
)}
```

### Classes

- `.form-container` - Flex column, gap-lg
- `.form-section` - Grouped fields with spacing
- `.form-section-title` - Uppercase, bold, smaller font
- `.form-group` - Single field wrapper
- `.form-group-row` - Responsive grid (2-3 columns)
- `.form-label` - Field label styling
- `.form-label-required::after` - Adds red asterisk
- `.form-input`, `.form-select`, `.form-textarea` - Input styling
- `.form-error` - Error message wrapper (red background)
- `.form-helper-text` - Hint text (gray, smaller)

### Responsive Grid

```css
.form-group-row {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}
```

- Minimum column width: 250px
- Auto-fills columns
- Breaks to 1 column on mobile (< 640px)

---

## 🏠 Page Layout System

### Full Page Structure

```tsx
<div className="admin-page">
  <header className="admin-header">
    <div className="admin-header-content">{/* Logo, navigation, etc */}</div>
  </header>

  <main className="admin-main">
    <div className="admin-card">
      <div className="admin-card-header">
        <h1 className="admin-card-title">Page Title</h1>
        <p className="admin-card-subtitle">Subtitle or description</p>
      </div>
      {/* Content */}
    </div>
  </main>
</div>
```

### Classes

- `.admin-page` - Full-height page background
- `.admin-header` - Sticky top header with shadow
- `.admin-header-content` - Centered content max-width (1280px)
- `.admin-main` - Main content area, max-width 768px
- `.admin-card` - White card with shadow and padding
- `.admin-card-header` - Title + subtitle section
- `.admin-card-title` - 2xl, bold, dark text
- `.admin-card-subtitle` - Smaller, gray text

### Features

- ✅ Sticky header (z-index 40)
- ✅ Centered content (max-width 1280px)
- ✅ Card elevation with shadow
- ✅ Responsive padding (mobile: --spacing-lg)
- ✅ Background color (--color-bg-secondary)

---

## 🖼️ Image Upload System

### Upload Area

```tsx
<div className="form-section">
  <h3 className="form-section-title">Upload Image</h3>
  <div className="image-upload-area">
    <input
      type="file"
      className="hidden"
      id="upload-input"
      onChange={handleUpload}
    />
    <label htmlFor="upload-input" className="image-upload-label">
      {imageSelected ? (
        <>
          <div className="image-preview-wrapper">
            <img src={imageBase64} className="image-preview" alt="Preview" />
          </div>
          <p className="image-upload-success">
            <span className="image-upload-success-dot" />
            Image selected & compressed
          </p>
          <div className="image-compression-info">
            <p>Original: {originalSize}</p>
            <p>Compressed: {compressedSize}</p>
            <p className="image-compression-ratio">Reduced by 60%</p>
          </div>
        </>
      ) : (
        <div className="image-upload-placeholder">
          <div className="image-upload-icon-wrapper">
            <Upload className="image-upload-icon" />
          </div>
          <p className="image-upload-title">Click to upload</p>
          <p className="image-upload-subtitle">PNG, JPG, WebP...</p>
        </div>
      )}
    </label>
  </div>
</div>
```

### Gallery

```tsx
<div className="image-gallery">
  {images.map((image, idx) => (
    <div key={idx} className="image-thumbnail-wrapper">
      <img src={image} className="image-thumbnail" alt="Thumbnail" />
      <button className="image-remove-button" onClick={() => remove(idx)}>
        ✕
      </button>
    </div>
  ))}
</div>
```

### Classes

- `.image-upload-area` - Dashed border, hover effect
- `.image-upload-label` - Clickable label (cursor: pointer)
- `.image-upload-placeholder` - Icon + text when empty
- `.image-upload-icon-wrapper` - Icon container with bg
- `.image-upload-icon` - Icon styling (primary color)
- `.image-upload-title` - "Click to upload" text
- `.image-upload-subtitle` - File type hints
- `.image-preview-wrapper` - Preview container
- `.image-preview` - Preview image (max-height 300px)
- `.image-upload-success` - Success message with dot
- `.image-compression-info` - Size comparison display
- `.image-gallery` - Grid layout (100px columns)
- `.image-thumbnail-wrapper` - Relative container
- `.image-thumbnail` - Thumbnail image (object-fit: cover)
- `.image-remove-button` - Red button with hover scale

---

## ⚡ Responsive Design

### Mobile Breakpoint (< 640px)

```css
@media (max-width: 640px) {
  .admin-main {
    padding: var(--spacing-lg) var(--spacing-sm);
  }
  .admin-card {
    padding: var(--spacing-lg);
  }
  .form-group-row {
    grid-template-columns: 1fr;
  }
  .modal-content {
    max-width: 100%;
  }
}
```

- Form rows stack to 1 column
- Padding reduced for mobile
- Modal uses full width
- Spacing compressed

---

## 🎨 Color Palette

### Primary Action

```
Primary: #667eea
Hover: #5a67d8
Text: white
Shadow: rgba(102, 126, 234, 0.1)
```

### Danger/Destructive

```
Background: #ef4444
Hover: #dc2626
Text: white
Shadow: rgba(239, 68, 68, 0.1)
```

### Success

```
Color: #22c55e
Usage: Checkmarks, success messages
```

### Neutral/Gray Scale

```
Gray-50: #f9fafb  (lightest backgrounds)
Gray-100: #f3f4f6 (secondary backgrounds)
Gray-400: #9ca3af (placeholder text)
Gray-500: #6b7280 (secondary text)
Gray-700: #374151 (primary text)
Gray-900: #111827 (darkest text)
```

---

## 🔄 Usage Examples

### Modal Example (Delete Confirmation)

```tsx
import ConfirmDialog from "@/components/ConfirmDialog";

export default function ItemCard() {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <button onClick={() => setShowDelete(true)}>Delete</button>

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete Item?"
        message="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </>
  );
}
```

### Form Example (Create Item)

```tsx
<form className="form-container">
  <div className="form-section">
    <h3 className="form-section-title">Basic Information</h3>

    <div className="form-group">
      <label htmlFor="name" className="form-label form-label-required">
        Item Name
      </label>
      <input
        id="name"
        type="text"
        className="form-input"
        placeholder="e.g., Blue Denim Jacket"
        required
      />
    </div>

    <div className="form-group-row">
      <div className="form-group">
        <label htmlFor="cat" className="form-label form-label-required">
          Category
        </label>
        <select id="cat" className="form-select" required>
          <option>Men</option>
          <option>Women</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="price" className="form-label form-label-required">
          Price (₹)
        </label>
        <input
          id="price"
          type="number"
          className="form-input"
          placeholder="0.00"
          required
        />
      </div>
    </div>
  </div>

  <div className="form-section">
    <button type="submit" className="btn btn-primary btn-block">
      Add Item
    </button>
  </div>
</form>
```

---

## ✅ Best Practices

1. **Always use design tokens** - Never hardcode colors, spacing, etc.
2. **Section your forms** - Use `.form-section` to group related fields
3. **Responsive grids** - Use `.form-group-row` for side-by-side fields
4. **One source of truth** - Update admin.css, not individual component styles
5. **Semantic classes** - Use `.admin-page`, `.admin-card`, etc. for structure
6. **Mobile first** - Design system is mobile-first by default
7. **Accessibility** - Include labels, required indicators, error messages
8. **Feedback** - Show loading, success, and error states
9. **Consistency** - All modals use same structure, all buttons use variants
10. **Testing** - Verify all states: default, hover, active, disabled, focus

---

## 📚 Additional Resources

See `UX_REDESIGN_COMPLETE.md` for:

- Before/After comparisons
- Full redesign summary
- Testing checklist
- Component rebuild details

---

**Last Updated**: Session 6 Continuation  
**Design System Version**: 1.0  
**Status**: Production Ready ✅
