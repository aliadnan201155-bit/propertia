# Add Property Button Configuration

## Setup Instructions

To enable the "Add Property" button to redirect to your admin portal, add the following environment variable to your `frontend/.env.local` file:

```bash
VITE_ADMIN_URL=http://localhost:5174
```

**For production:**
```bash
VITE_ADMIN_URL=https://your-admin-domain.com
```

## How It Works

- The "Add Property" button appears in the navbar **only when a user is logged in**
- Clicking the button opens the admin portal in a **new tab**
- If `VITE_ADMIN_URL` is not set, it defaults to `http://localhost:5174`

## Button Locations

1. **Desktop**: Green button between navigation links and auth section
2. **Mobile**: Appears at the bottom of the mobile menu, above the account section

## Styling

The button features:
- Green gradient background (from-green-500 to-emerald-600)
- Plus circle icon
- Smooth hover animations
- Shadow effects for premium look
