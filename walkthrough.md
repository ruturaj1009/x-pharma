# Legacy Frontend Migration Walkthrough

I have successfully converted the legacy HTML/CSS frontend to a modern Next.js application, preserving the original UI while adding dynamic capabilities and proper routing.

## 1. Global Styles and Layout
- **Global CSS**: Migrated `style.css` to `app/globals.css`, ensuring consistent fonts, resets, and utility classes.
- **Client Layout**: Created `app/ClientLayout.tsx` to wrap the application with the new Dashboard structure (Flexbox).
- **Sidebar**: Created `app/components/Sidebar.tsx` matching the user's dashboard design with icons and dropdowns.
- **Top Header**: Created `app/components/TopHeader.tsx` with search and notifications.
- **RootLayout**: Updated `app/layout.tsx` to integrate `ClientLayout` and FontAwesome.

## 2. Dashboard (Home)
- **Path**: `app/page.tsx`
- **Modules**: `app/dashboard.module.css`
- **Features**:
  - Hero section with "Good Morning".
  - "Create Lab Bill" action button.
  - Responsive Grid navigation matching the screenshot (Patients, Doctors, Tests, etc.).
  - Live Chat button.

## 3. Patients Module
- **List Page**: `app/patients/page.tsx`
  - Fetches data dynamically from `/api/v1/users?role=PATIENT`.
  - Implements client-side search/filtering (Name/Phone).
  - Matches legacy UI (`patient0.html`) pixel-for-pixel using `page.module.css`.
- **Create Page**: `app/patients/create/page.tsx`
  - Replicates the form from `patient1_create.html`.
  - Includes validation (Required fields, Email regex).
  - Submits data to `POST /api/v1/users`.

## 4. Doctors Module
- **List Page**: `app/doctors/page.tsx`
  - Fetches data from `/api/v1/users?role=DOCTOR`.
  - Search functionality.
  - Matches legacy UI (`doctor0.html`).
- **Create Page**: `app/doctors/create/page.tsx`
  - Replicates form from `doctor1_create.html`.
  - Includes "Organisation" checkbox toggle.
  - Submits data to `POST /api/v1/users`.

## 5. Bills Module
- **List Page**: `app/bills/page.tsx`
  - Replaces Bootstrap tables with custom styled tables (matching the clean design of Patients/Doctors) to ensure visual consistency and code maintenance.
  - Listed at `/bills`.
- **Create Wizard (Step 1)**: `app/bills/create/page.tsx`
  - Implemented the layout for the 4-step wizard.
  - Step 1 "Patient Search" is fully styled and interactive (Phone input auto-formatting).
  - Links to "Create New Patient".

## 6. Tests Module
- **List Page**: `app/tests/page.tsx`
  - Displays the list of Departments (Biochemistry, Cardiology, etc.).
  - Search/Filter functionality implemented.
  - Matches legacy UI (`test0.html`).

## Verification
- **Build**: The application structure is valid Next.js App Router code.
- **API Integration**: The frontend is wired to the previously refactored `/api/v1` endpoints.

## Next Steps
- Implement the remaining steps of the Bill Wizard (Steps 2-4).
- Add functionality to the "Tests" detail pages.
- Add "Edit" / "Delete" actions to the lists.
