# TWA Integration Guide

## Overview
The TWA (Telegram Web App) has been integrated with the main Pricetracker backend. It now uses the FastAPI backend for authentication and data storage instead of Supabase and GitHub Spark.

## Architecture

```
┌─────────────────┐
│  Vite TWA       │
│  (Telegram)     │
└────────┬────────┘
         │ HTTPS/REST + JWT
         │
    ┌────┴─────────────────┐
    │  FastAPI Backend     │
    │  (Shared Core)       │
    └────┬─────────────────┘
         │
         ├── MongoDB (users, products, snapshots)
         ├── APScheduler Worker (price tracking)
         └── Telegram Bot (notifications)
```

## Changes Made

### Backend (`pricetracker/backend`)
1. ✅ **CORS Configuration** - Added TWA origins (`http://localhost:5000`) to allowed origins in `backend/app/main.py`
2. ✅ **Telegram Auth** - Already had robust Telegram WebApp authentication in `backend/app/routers/auth.py`
   - `/auth/signup` - Handles Telegram WebApp initData validation
   - `/auth/telegram-login` - Telegram Login widget support
   - `/auth/profile` - Get current user profile

### TWA (`pricetracker/twa`)
1. ✅ **New API Services**
   - `src/services/api.ts` - Axios client with JWT interceptors
   - `src/services/auth.ts` - Telegram authentication service
   - `src/services/products.ts` - Product CRUD operations

2. ✅ **Updated Types**
   - `src/lib/types.ts` - Added backend data models (User, Product, PriceSnapshot)
   - Added `productToTrackedProduct()` adapter function for backward compatibility

3. ✅ **Refactored App.tsx**
   - Removed GitHub Spark `useKV` hooks
   - Added Telegram WebApp initialization
   - Integrated FastAPI authentication and product services
   - Added loading states and error handling

4. ✅ **Environment Configuration**
   - `.env` - API URL and Telegram bot configuration
   - `.env.example` - Example configuration

5. ✅ **Removed Dependencies**
   - Removed GitHub Spark imports from `main.tsx`
   - Removed old `screens/` directory

## Setup Instructions

### 1. Backend Setup
```bash
cd /home/azureuser/pricetracker/backend

# Ensure MongoDB is running
# Ensure .env has TELEGRAM_BOT_TOKEN configured

# Start the backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. TWA Setup
```bash
cd /home/azureuser/pricetracker/twa

# Install dependencies (if not done)
npm install

# Configure environment
# Update .env with your settings:
# VITE_API_URL=http://localhost:8000
# VITE_TELEGRAM_BOT_NAME=your_bot_name

# Start development server
npm run dev
```

### 3. Testing with Telegram

#### Option A: Using ngrok (Recommended for local testing)
```bash
# In terminal 1: Start backend
cd pricetracker/backend
python -m uvicorn app.main:app --reload

# In terminal 2: Start TWA
cd pricetracker/twa
npm run dev

# In terminal 3: Expose TWA to internet
ngrok http 5000
```

Then configure your Telegram bot's menu button to point to the ngrok URL.

#### Option B: Using Telegram Web App Test Environment
Use the Telegram Bot Father to set up a test web app pointing to your local development server (requires HTTPS).

## API Endpoints Used

### Authentication
- `POST /auth/signup` - Create account with Telegram WebApp initData
- `POST /auth/telegram-login` - Login with Telegram Login widget
- `GET /auth/profile` - Get current user profile
- `PATCH /auth/profile` - Update user profile

### Products
- `GET /products` - List all products for user
- `GET /products/{id}` - Get single product
- `POST /products` - Add new product to track
- `PATCH /products/{id}` - Update product (desired_price, is_active)
- `DELETE /products/{id}` - Remove product
- `GET /products/{id}/history` - Get price history
- `POST /products/{id}/refresh` - Manually trigger price check

## Data Flow

### 1. User Authentication
```
User opens TWA → Telegram provides initData → TWA sends to /auth/signup → 
Backend validates initData → Returns JWT token → TWA stores token → 
All subsequent requests include JWT in Authorization header
```

### 2. Adding a Product
```
User enters URL → TWA calls productService.addProduct() → 
POST /products with JWT → Backend scrapes product → 
Stores in MongoDB → Returns product data → TWA updates UI
```

### 3. Viewing Price History
```
User clicks product → TWA loads product details → 
GET /products/{id}/history → Backend returns snapshots → 
TWA converts to chart data → Displays price graph
```

## Data Model Mapping

### Backend MongoDB → TWA Display

| MongoDB Field | TWA Field | Notes |
|---------------|-----------|-------|
| `_id` | `id` | MongoDB ObjectId |
| `url` | `productUrl` | Product URL |
| `title` | `title` | Product name |
| `current_price` | `currentPrice` | Latest price |
| `desired_price` | `targetPrice` | User's target price |
| `image_url` | `imageUrl` | Product image |
| `platform` | `siteDomain` | E-commerce site |
| `is_active` | `isActive` | Tracking status |
| `created_at` | `createdAt` | ISO timestamp |

## Known Issues & TODOs

### Current Limitations
1. ⚠️ Price history is not loaded in list view (performance optimization)
2. ⚠️ Settings are stored locally only (not synced with backend yet)
3. ⚠️ Profile screen still needs integration with backend user data

### Future Enhancements
1. 🔄 Sync user settings with backend
2. 🔄 Add real-time price updates via WebSocket
3. 🔄 Integrate subscription/billing features
4. 🔄 Add push notifications via Telegram Bot API

## Troubleshooting

### TWA shows "Authentication failed"
- Check that backend is running on port 8000
- Verify `TELEGRAM_BOT_TOKEN` is set in backend `.env`
- Check browser console for CORS errors
- Ensure you're opening from Telegram (initData is required)

### Products not loading
- Check JWT token is stored in localStorage
- Verify backend `/products` endpoint returns 200
- Check MongoDB connection in backend logs

### CORS errors
- Ensure `http://localhost:5000` is in backend CORS origins
- Check backend logs for CORS-related errors
- Verify `VITE_API_URL` in TWA `.env` matches backend URL

## Testing Checklist

- [ ] TWA loads without errors
- [ ] Telegram authentication works
- [ ] Can add a product
- [ ] Products list displays correctly
- [ ] Can view product details
- [ ] Price history chart renders
- [ ] Can update target price
- [ ] Can toggle product active/inactive
- [ ] Can delete product
- [ ] Profile screen loads user data
- [ ] Settings can be updated

## Production Deployment

### Backend
- Deploy to Azure Container Apps (already configured)
- Ensure MongoDB connection string is set
- Configure production CORS origins

### TWA
- Deploy to Vercel/Netlify/Azure Static Web Apps
- Update `.env` with production API URL
- Configure Telegram bot menu button with production URL
- Ensure HTTPS is enabled (required by Telegram)

## Support

For issues or questions, check:
- Backend logs: Check FastAPI console output
- TWA logs: Open browser DevTools → Console
- MongoDB: Check database collections for data
- Network: Use browser DevTools → Network tab to inspect API calls
