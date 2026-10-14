# HavenCare — Website Prototype

A responsive React + Vite + Tailwind CSS prototype for HavenCare, a property-care service for people who own vacant or occasionally used homes and want to preserve them without renting or selling.

## Prototype features

- Landing page explaining the HavenCare idea
- Services page
- Owner dashboard with illustrative sample property and maintenance data
- Booking request modal with form validation
- New requests appear in the dashboard during the current browser session
- Demo interaction to approve a sample repair estimate
- Responsive layout for mobile and desktop

## Requirements

- Node.js 20.19+ or 22.12+ recommended
- npm

## Run locally

1. Extract the ZIP file.
2. Open the extracted `havencare-prototype` folder in VS Code.
3. Open the VS Code terminal (**Terminal → New Terminal**).
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL Vite prints in the terminal (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Important prototype limitations

- Dashboard information is sample data.
- Requests are held in React state and are not saved permanently; refreshing the page resets them.
- The form does not send emails, make real bookings, or transmit form information to a server.
- There is no real login, database, payment system, or verified caretaker workflow.
- Photos load from Unsplash and Google Fonts loads from Google Fonts, so those visual assets need an internet connection.

## Suggested next steps

1. Replace the sample dashboard with real customer-specific data.
2. Add Supabase authentication and a database.
3. Add secure role-based access for homeowners and service staff.
4. Implement image uploads and inspection reports.
5. Add booking notifications and an approval audit trail.
6. Publish through a hosting provider after privacy and security review.
