# 🛒 PriceTraqor - Telegram Web App

A Telegram mini app for tracking ecommerce product prices with real-time alerts and comprehensive price history.

## ✨ Features

### Core Functionality
- 📊 **Price Tracking** - Monitor prices from major ecommerce platforms
- 📈 **Price History** - Visual charts showing price trends over time
- 🔔 **Smart Alerts** - Get notified when prices drop
- 🎯 **Target Pricing** - Set your ideal price and get alerts
- 🔍 **QR Scanner** - Scan product QR codes to add items quickly
- 🌓 **Theme Support** - Dark/light mode with neomorphism design

### Telegram Integration
- ⚡ **Native Back Button** - Seamless navigation with Telegram's header button
- 🎯 **MainButton** - Primary actions like "Add to Watchlist" use Telegram's native button
- 📳 **Haptic Feedback** - Tactile responses for all interactions
- 🎨 **Theme Sync** - Auto-adapts to Telegram's color scheme
- 💾 **CloudStorage** - Settings persist across devices
- 📤 **Share Products** - Share deals with friends and groups
- 🗣️ **Native Dialogs** - Telegram's native confirmation dialogs
- 🔗 **In-App Browser** - Open product links in Telegram

### Design
- 🎭 **Neomorphism UI** - Modern soft UI design with depth
- 🌟 **Glass Morphism** - Frosted glass effects throughout
- 🎪 **Smooth Animations** - Polished transitions and interactions
- 📱 **Mobile Optimized** - Perfect for Telegram mobile apps

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Telegram account (for testing in Telegram)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Surajsharma07/pricetraqor-twa.git
cd pricetraqor-twa
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## 🏗️ Project Structure

```
pricetraqor-twa/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── WatchlistScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   ├── AddProductScreen.tsx
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   │   └── useTelegramWebApp.ts  # TWA SDK integration
│   ├── services/         # API services
│   │   ├── auth.ts      # Authentication
│   │   ├── products.ts  # Product operations
│   │   └── api.ts       # API client
│   ├── lib/             # Utilities and helpers
│   │   ├── types.ts     # TypeScript types
│   │   └── helpers.ts   # Helper functions
│   └── styles/          # CSS and theme files
├── public/              # Static assets
├── TWA_FEATURES.md      # TWA features documentation
├── ENHANCEMENTS_SUMMARY.md  # Recent enhancements
└── INTEGRATION.md       # Integration guide
```

## 📱 Telegram Web App Features

### useTelegramWebApp Hook
All Telegram features are accessible through a single hook:

```typescript
const twa = useTelegramWebApp()

// Haptic feedback
twa.haptic.impact('medium')
twa.haptic.notification('success')
twa.haptic.selection()

// MainButton for primary actions
twa.mainButton.show('Add to Watchlist', handleAdd)
twa.mainButton.setLoading(true)

// Navigation
twa.backButton.show(() => goBack())
twa.navigation.openLink(url)

// Dialogs
const confirmed = await twa.dialog.showConfirm('Are you sure?')

// Storage
await twa.cloudStorage.setItem('key', 'value')

// Scanner
const qrData = await twa.scanQR('Scan QR code')

// Share
twa.share.switchInlineQuery('Check this out!')

// Theme
twa.theme.setBackgroundColor('#000000')
```

See [TWA_FEATURES.md](./TWA_FEATURES.md) for complete documentation.

## 🎨 Design Philosophy

The app uses a **neomorphism** design language:
- Soft shadows creating depth
- Subtle gradients
- Raised and inset surfaces
- Glass morphism effects
- Smooth animations

All TWA features are implemented without breaking this design aesthetic.

## 🔧 Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: TailwindCSS 4, Custom CSS
- **UI Components**: Radix UI
- **Charts**: Recharts
- **Icons**: Phosphor Icons
- **TWA**: @twa-dev/sdk
- **Build**: Vite
- **Backend**: FastAPI (separate repo)

## 📚 Documentation

- [TWA Features Guide](./TWA_FEATURES.md) - Comprehensive TWA integration docs
- [Enhancements Summary](./ENHANCEMENTS_SUMMARY.md) - Recent improvements
- [Integration Guide](./INTEGRATION.md) - Backend integration details
- [Product Requirements](./PRD.md) - Original product specification

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

The app can be deployed to:
- Vercel
- Netlify  
- Azure Static Web Apps
- GitHub Pages

Ensure you configure the Telegram bot's menu button to point to your deployed URL.

## 🔒 Security

- ✅ Passed CodeQL security scanning
- ✅ No known vulnerabilities
- ✅ Secure authentication with Telegram
- ✅ Safe external link handling
- ✅ Validated user input

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 🙏 Acknowledgments

- Telegram for the Web App platform
- GitHub Spark for the development tools
- Radix UI for accessible components
- The open-source community

## 📞 Support

For issues or questions:
- Check existing issues in GitHub
- Review the documentation files
- Check backend logs for API issues
- Use browser DevTools for frontend debugging

## 🎯 Roadmap

Future enhancements being considered:
- [x] MainButton integration for primary actions
- [ ] Payment integration for premium features
- [ ] More ecommerce platform support
- [ ] Price prediction using ML
- [ ] Group price tracking and sharing

---

Built with ❤️ using Telegram Web Apps
