# NVC-WEBSITE Codebase Reference

## 1. Project Overview
- **Framework:** Next.js 16 (App Router, TypeScript, React 19)
- **Styling:** TailwindCSS 4, shadcn-ui, custom CSS
- **Animation:** Framer Motion (primary), GSAP (optional/legacy)
- **UI Primitives:** Radix UI, shadcn-ui
- **State:** React hooks, context (e.g., language)
- **Data:** Supabase (API routes), fallback dummy data (for dev)

## 2. Directory Structure
- `/app` — App Router pages, layouts, API routes
- `/components` — UI components (atomic, sections, admin, ui, etc.)
- `/contexts` — React context providers (e.g., language, theme)
- `/hooks` — Custom React hooks
- `/lib` — Types, utils, dummy data, supabase helpers
- `/public` — Static assets (images, fonts, etc.)
- `/styles` — Global and custom CSS

## 3. Component Organization
- **Sections:** Feature-level UI (e.g., `projects-list-section.tsx`, `flipcountdown-section.tsx`)
- **UI:** Reusable atomic components (e.g., Button, Card, Accordion)
- **Admin:** Dashboard/admin-only components
- **Special:** Animation helpers (e.g., Reveal, AnimatedBackground)
- **Separation:** Large sections split into multiple files for maintainability

## 4. Animation & Transitions
- **Framer Motion:**
  - Used for all major entrance, hover, and layout animations
  - Patterns: `motion.div`, `AnimatePresence`, `whileInView`, `whileHover`, `transition` props
  - Staggered entrances: `delay: idx * 0.08` or similar
  - Spring transitions for tabs, overlays, etc.
  - AnimatePresence for grid/list transitions
- **GSAP:**
  - Not widely used, but available for advanced/legacy cases
- **Parallax/Mouse:**
  - Used in hero/flipcountdown sections for floating images
  - Mouse position tracked, used to set `transform: translate3d(...)`

## 5. Styling
- **TailwindCSS:**
  - Utility-first, v4 syntax (e.g., `aspect-16/10`, `bg-linear-to-t`)
  - Responsive: `md:`, `lg:`, `xl:`
  - Custom colors: `brand`, `brand-ink`, `brand-ink-strong`, etc.
- **shadcn-ui:**
  - Used for some UI primitives (Accordion, Dialog, etc.)
- **Custom CSS:**
  - For global styles, backgrounds, and overrides

## 6. Data & API
- **API Routes:**
  - `/api/projects`, `/api/services`, etc. (REST, Supabase backend)
  - Fallback to dummy data in dev (now removed for prod)
- **Types:**
  - All data models in `lib/types.ts`
- **Fetching:**
  - `fetch("/api/projects")` in client components
  - Data mapped to UI, categories generated dynamically

## 7. Notifications & Feedback
- **Toast System (react-hot-toast):**
  - **Setup:** `<Toaster />` component added in `app/layout.tsx`
  - **Import:** `import toast from "react-hot-toast"`
  - **Usage:**
    - Success: `toast.success("Message", { style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' } })`
    - Error: `toast.error("Message", { style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' } })`
    - Info: `toast("Message", { style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' } })`
  - **Dark Theme Styling:**
    - Background: `#1a1a1a`
    - Text color: `#fff`
    - Border: `1px solid #333`
  - **Best Practices:**
    - Always apply dark theme styling to match the UI
    - Use for user feedback (success, errors, warnings)
    - Avoid native `alert()` or `confirm()` - use toast or custom modals
    - Keep messages concise and actionable
  - **Example:**
    ```tsx
    toast.error("Service name already exists", {
      style: {
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid #333',
      },
    });
    ```

## 8. Image Upload Component
- **Component:** `ImageUploader` in `components/admin/image-uploader.tsx`
- **Features:**
  - Single or multiple file upload mode (default: single)
  - Drag & drop support with dropzone UI
  - 5MB max file size per image
  - Preview grid (2x2 for multiple mode)
  - Max 4 files in multiple upload mode
  - Remove individual images from selection
  - Upload to backend is handled externally via `uploadFiles()` helper

- **Props:**
  ```tsx
  interface ImageUploaderProps {
    multiple?: boolean          // Enable multi-file mode (default: false)
    maxFiles?: number           // Max files in multiple mode (default: 4)
    maxFileSize?: number        // Max size in bytes (default: 5MB)
    value?: SelectedFile[]      // Controlled state for selected files
    onChange?: (files: SelectedFile[]) => void  // Callback when files change
    disabled?: boolean          // Disable the uploader
    className?: string          // Custom container class
  }
  ```

- **Usage Pattern:**
  ```tsx
  import { ImageUploader, uploadFiles, type SelectedFile } from "./image-uploader";
  
  // In component:
  const [selectedImage, setSelectedImage] = useState<SelectedFile[]>([]);
  
  // In form submit handler:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = formData.image_url;
    if (selectedImage.length > 0) {
      const uploaded = await uploadFiles(selectedImage);
      if (uploaded.length > 0) {
        imageUrl = uploaded[0].url;
      }
    }
    // ... use imageUrl in API call
  };
  
  // In JSX:
  <ImageUploader
    value={selectedImage}
    onChange={setSelectedImage}
    disabled={isLoading}
  />
  ```

- **Multiple Files Example:**
  ```tsx
  <ImageUploader
    multiple
    maxFiles={4}
    value={selectedImages}
    onChange={setSelectedImages}
  />
  ```

- **Helper Functions:**
  - `uploadFiles(files: SelectedFile[])` - Uploads files to `/api/upload` and returns URLs
  - `cleanupFiles(files: SelectedFile[])` - Revokes object URLs to prevent memory leaks

## 9. Patterns & Best Practices
- **Client Components:**
  - `