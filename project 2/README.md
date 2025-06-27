# FlavorFeed - Your Personal Culinary Concierge

A luxury food discovery app built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **AI-Powered Discovery**: Ethereal AI assistant for personalized restaurant recommendations
- **Interactive Map**: Explore restaurants with AR capabilities and real-time availability
- **Social Dining**: Connect with friends and plan group dining experiences
- **Insider Access**: Exclusive culinary experiences and premium reservations
- **Luxury Design**: Premium UI/UX with sophisticated animations and interactions

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom luxury design system
- **Animations**: Framer Motion + React Spring
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Ready for Netlify, Vercel, or any static hosting

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## 🏗️ Build & Deploy

### Development
```bash
npm run dev          # Start development server
npm run type-check   # Type checking
npm run lint         # ESLint checking
```

### Production
```bash
npm run build                # Build for production
npm run build:production     # Build with production optimizations
npm run preview             # Preview production build
```

### Deployment

The app is ready to deploy to:
- **Netlify**: Connect your repo and deploy automatically
- **Vercel**: Import project and deploy with zero config
- **GitHub Pages**: Build and deploy to `gh-pages` branch
- **Any Static Host**: Upload the `dist` folder

## 🎨 Design System

### Colors
- **Primary**: Midnight Navy (#0B1426)
- **Accent**: Champagne Gold (#D4AF37)
- **Secondary**: Royal Purple (#6B46C1)
- **Success**: Forest Emerald (#065F46)

### Typography
- **Headings**: Crimson Text (serif)
- **Body**: Inter (sans-serif)
- **Accent**: Playfair Display (serif)
- **UI**: Lato (sans-serif)

## 📱 Features Overview

### Discover Screen
- Personalized restaurant feed
- AI assistant integration
- Quick action cards
- Social activity highlights

### Explore Screen
- Interactive map with restaurant pins
- AR camera mode (when enabled)
- Layer-based filtering
- Real-time availability

### Profile Screen
- Personal dining statistics
- Achievement system
- Dining history
- Membership management

## 🔧 Customization

### Adding New Screens
1. Create component in `src/screens/`
2. Add route to navigation
3. Update types in `src/types/`

### Modifying Design System
- Colors: `tailwind.config.js`
- Fonts: `index.html` + `tailwind.config.js`
- Components: `src/components/ui/`

### Environment Variables
See `.env.example` for all available configuration options.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the design system specifications