# Dashboard Layout Refactor

## 1. New Components
### Sidebar (`app/components/Sidebar.tsx`)
- Fixed width (e.g., 250px) on desktop.
- "Create Lab Bill" prominent button at top.
- Navigation links matching the screenshot.
- Accordion/Dropdown support for "Lab", "Settings".
- Responsive: Hidden on mobile (hamburger toggle).

### TopHeader (`app/components/TopHeader.tsx`)
- Blue background.
- "Home" title centered.
- Search input, Notification icon, Profile icon on right.

## 2. Layout Update (`app/layout.tsx`)
- Switch from standard flow to a Flex layout.
- Container: `display: flex; height: 100vh;`
- Sidebar: `flex-shrink: 0;`
- Main Content Area: `flex-grow: 1; display: flex; flex-direction: column; overflow-y: auto;`
  - TopHeader
  - Page Content (`children`)

## 3. Homepage Update (`app/page.tsx`)
- Update Hero section (incorporate "Good Morning").
- "Create Lab Bill" button below hero.
- Content Grid: Update icons and labeling to match screenshot (Patients, Doctors, Tests, Test Package, etc.).
- "Live Chat" floating button styling update.

## 4. Styling Strategy
- Use CSS Modules for components.
- Maintain "Premium" aesthetic: Shadows, border-radius, clean fonts (Segoe UI).
- Colorful icons for the grid (using CSS styling on FontAwesome icons to approximate the colorful look).
