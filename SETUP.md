# 🚀 Telegram WebApp Setup Guide

## ✅ Integration Complete!

The TWA has been successfully integrated with the Pricetracker backend and is ready for testing.

---

## 📋 Quick Start

### 1. Start the Backend (Port 8000)

```bash
cd /home/azureuser/pricetracker/backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ **Backend is already running** (confirmed on port 8000)

### 2. Start the TWA (Port 5000)

```bash
cd /home/azureuser/pricetracker/twa
npm run dev
```

The TWA will be available at: `http://localhost:5000`

---

## 🌐 Expose TWA to Telegram (Required for Testing)

Telegram requires HTTPS for WebApps. Use one of these methods:

### Option A: Using ngrok (Recommended)

```bash
# Install ngrok
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
  sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
  echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | \
  sudo tee /etc/apt/sources.list.d/ngrok.list && \
  sudo apt update && sudo apt install ngrok

# Or download directly
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar -xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/

# Authenticate (optional but recommended)
ngrok config add-authtoken YOUR_NGROK_TOKEN

# Expose port 5000
ngrok http 5000
```

**You'll get a URL like:** `https://abc123.ngrok.io`

### Option B: Using Cloudflare Tunnel

```bash
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Create tunnel
cloudflared tunnel --url http://localhost:5000
```

### Option C: Deploy to Production (Best for permanent setup)

Deploy TWA to:
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **Azure Static Web Apps**

---

## 🤖 Configure Telegram Bot

### Step 1: Open BotFather

1. Open Telegram and search for `@BotFather`
2. Send `/mybots`
3. Select your bot: **@pricetraqor_bot** (or your bot name)

### Step 2: Set Web App URL

```
/mybots
→ Select your bot
→ Bot Settings
→ Menu Button
→ Configure menu button
→ Edit menu button URL
```

**Enter your HTTPS URL:**
```
https://your-ngrok-url.ngrok.io
```

OR if deployed:
```
https://your-twa-domain.vercel.app
```

### Step 3: (Optional) Set Commands

```
/setcommands
```

Then send:
```
start - Start tracking prices
help - Get help
products - View your tracked products
```

---

## 🧪 Testing the Integration

### Test Flow:

1. **Open Telegram** on your phone or desktop
2. **Find your bot** (@pricetraqor_bot)
3. **Click Menu button** (bottom-left corner in chat)
4. **TWA should open** in Telegram's in-app browser

### What Should Happen:

1. ✅ TWA loads with loading spinner
2. ✅ Automatic authentication with Telegram
3. ✅ Welcome toast: "Welcome [Your Name]!"
4. ✅ Watchlist screen appears (empty initially)
5. ✅ Can navigate using bottom nav
6. ✅ Profile shows your Telegram info

### Check Browser Console (for debugging):

```javascript
Telegram WebApp initialized: { initData: 'present', user: {...} }
Authenticating with backend...
Authentication successful: { access_token: '...', user: {...} }
```

---

## 🔑 Environment Variables

### Backend (.env)
```bash
PT_TELEGRAM_BOT_TOKEN="8578485588:AAHrO4Xt1QliuZnPpLG5EQ_ooziRBTFAcxc"
PT_MONGODB_URI="your_mongodb_uri"
PT_PUBLIC_BASE_URL="https://your-api-domain.com"
```

### TWA (.env)
```bash
VITE_API_URL=http://localhost:8000
VITE_TELEGRAM_BOT_NAME=pricetraqor_bot
```

**For production:**
```bash
VITE_API_URL=https://your-api-domain.com
VITE_TELEGRAM_BOT_NAME=pricetraqor_bot
```

---

## 📱 Testing Without Telegram (Development Mode)

Open `http://localhost:5000` in a regular browser:

- You'll see "Development mode - authentication skipped"
- Most features work but without real authentication
- Useful for UI development

---

## 🎯 BotFather Complete Setup

### Your Bot Details:
- **Bot Name**: PriceTraqor Bot
- **Username**: @pricetraqor_bot
- **Bot Token**: `8578485588:AAHrO4Xt1QliuZnPpLG5EQ_ooziRBTFAcxc`

### Complete Commands for BotFather:

```bash
# 1. Set description
/setdescription
→ Select your bot
→ Send: "Track product prices across e-commerce sites and get alerts when prices drop!"

# 2. Set about text
/setabouttext
→ Select your bot
→ Send: "I help you track product prices and notify you when they drop. Add products from Amazon, Flipkart, and more!"

# 3. Set commands
/setcommands
→ Select your bot
→ Send:
start - Start tracking prices
products - View tracked products
add - Add a product to track
help - Get help and support
settings - Configure your preferences

# 4. Set menu button (MOST IMPORTANT)
/mybots
→ Select your bot
→ Bot Settings
→ Menu Button
→ Configure menu button
→ Edit menu button URL
→ Send: https://YOUR-NGROK-URL.ngrok.io

# 5. Set bot picture (optional)
/setuserpic
→ Select your bot
→ Upload a logo image
```

---

## 🐛 Troubleshooting

### Issue: "Failed to initialize app"
**Solution**: Check that backend is running on port 8000

```bash
curl http://localhost:8000/healthz
# Should return: {"status":"ok"}
```

### Issue: "Authentication failed"
**Solutions**:
1. Check backend logs for errors
2. Verify `PT_TELEGRAM_BOT_TOKEN` in backend `.env`
3. Check browser console for detailed error
4. Ensure CORS is configured (already done ✅)

### Issue: "No Telegram initData available"
**Solutions**:
1. Must open TWA from Telegram app (not regular browser)
2. Check that menu button URL is configured in BotFather
3. Try closing and reopening the bot

### Issue: TWA not loading in Telegram
**Solutions**:
1. Verify URL is HTTPS (ngrok provides this)
2. Check ngrok is running: `ngrok http 5000`
3. Update menu button URL in BotFather with new ngrok URL
4. Clear Telegram cache: Settings → Data and Storage → Clear Cache

### Issue: Products not loading
**Solutions**:
1. Check JWT token in localStorage (DevTools → Application → Local Storage)
2. Verify backend products endpoint: `curl -H "Authorization: Bearer TOKEN" http://localhost:8000/products`
3. Check MongoDB is connected

---

## 📊 API Endpoints Being Used

### Authentication
- `POST /auth/signup` - Telegram auth + user creation/login
- `GET /auth/profile` - Get current user profile

### Products
- `GET /products` - List all products
- `POST /products` - Add new product
- `GET /products/{id}` - Get product details
- `PATCH /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product
- `GET /products/{id}/history` - Get price history

---

## 🚀 Production Deployment

### Deploy Backend
Already configured for Azure Container Apps

### Deploy TWA to Vercel

```bash
cd /home/azureuser/pricetracker/twa

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard:
# VITE_API_URL = https://your-backend-domain.com
```

### Update BotFather with Production URL
```
/mybots → Bot Settings → Menu Button → Edit menu button URL
→ https://your-twa.vercel.app
```

---

## ✅ Verification Checklist

- [ ] Backend running on port 8000
- [ ] TWA running on port 5000  
- [ ] ngrok exposing TWA to HTTPS
- [ ] BotFather menu button configured
- [ ] Can open TWA from Telegram
- [ ] Authentication works
- [ ] Can add products
- [ ] Can view product list
- [ ] Profile shows user info
- [ ] Settings work

---

## 📞 Quick Reference

### Start Everything:

```bash
# Terminal 1: Backend
cd /home/azureuser/pricetracker/backend && python -m uvicorn app.main:app --reload --port 8000

# Terminal 2: TWA
cd /home/azureuser/pricetracker/twa && npm run dev

# Terminal 3: ngrok
ngrok http 5000
```

### Get ngrok URL:
```bash
curl http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url'
```

### Test Backend:
```bash
curl http://localhost:8000/healthz
```

### Test TWA:
```bash
curl http://localhost:5000
```

---

## 🎉 You're Ready!

Once ngrok is running, you'll see:
```
Forwarding   https://abc123.ngrok.io -> http://localhost:5000
```

**Give this URL to BotFather:**
```
https://abc123.ngrok.io
```

Then open your Telegram bot and click the menu button!

---

**Need help?** Check the logs:
- Backend: Terminal running uvicorn
- TWA: Browser DevTools Console
- ngrok: Terminal running ngrok
