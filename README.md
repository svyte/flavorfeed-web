# FlavorFeed 🍽️

**Discover, Share, and Experience the Best Food Around You**

FlavorFeed is a modern social food discovery platform that connects food enthusiasts with the perfect dining experiences. Using advanced recommendation technology and real-time social features, FlavorFeed helps users discover restaurants, share experiences, and connect with fellow food lovers in their community.

## ✨ Features

### 🔍 Smart Discovery
- **Intelligent Recommendations**: Personalized restaurant suggestions based on your preferences, dietary restrictions, and dining history
- **Advanced Search & Filters**: Find exactly what you're craving with comprehensive filtering options
- **Location-Based Discovery**: Discover hidden gems and popular spots near you with real-time availability
- **Voice-Powered Search**: Ask questions naturally and get spoken recommendations for hands-free discovery

### 👥 Social Experience
- **Friend Networks**: Connect with fellow food enthusiasts and see what your friends are dining on
- **Real-Time Activity Feed**: Stay updated with friend check-ins, reviews, and discoveries
- **Group Dining Coordination**: Plan meals together with built-in group features and location sharing
- **Social Reviews**: Share detailed reviews with photos and help others make better dining decisions

### 🗺️ Interactive Maps
- **Live Restaurant Map**: Explore restaurants with interactive mapping and detailed location information
- **Real-Time Wait Times**: See current wait times and make informed decisions about when to visit
- **Navigation Integration**: Get directions and estimated travel times to your chosen restaurant
- **Neighborhood Exploration**: Discover dining scenes in different areas of your city

### 🏪 Business Features
- **Restaurant Dashboard**: Comprehensive management tools for restaurant owners
- **Customer Analytics**: Understand your customers better with detailed insights and feedback analysis
- **Menu Management**: Keep your menu updated with photos, descriptions, and real-time availability
- **Subscription Tiers**: Premium features for businesses to enhance their presence and customer engagement

### 🎙️ Voice Integration
- **Conversational Interface**: Natural voice interactions for searching and getting recommendations
- **Audio Reviews**: Listen to review summaries and restaurant descriptions while on the go
- **Hands-Free Navigation**: Voice-guided directions and restaurant information
- **Accessibility Features**: Full voice support for users who prefer audio interactions

## 🛠️ Technology Stack

### Frontend & Mobile
- **React Native** with Expo managed workflow for cross-platform mobile development
- **TypeScript** for type-safe development and better code maintainability
- **Zustand** for efficient and scalable state management
- **React Navigation** for smooth navigation experiences across the app

### Backend & Database
- **Supabase** for authentication, real-time database, and file storage
- **PostgreSQL** with Row Level Security for secure and scalable data management
- **Real-time subscriptions** for live updates and social features
- **Edge Functions** for serverless backend logic and API integrations

### External Services
- **ElevenLabs** for high-quality text-to-speech and voice interaction capabilities
- **RevenueCat** for cross-platform subscription management and monetization
- **Mapbox** for interactive maps, geocoding, and location services
- **Netlify** for web deployment and serverless function hosting

### Development & Deployment
- **Expo Application Services** for building and distributing mobile apps
- **GitHub Actions** for continuous integration and automated testing
- **Sentry** for error tracking and performance monitoring
- **Analytics integration** for user behavior insights and app optimization

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or later
- npm or yarn package manager
- Expo CLI installed globally: `npm install -g @expo/cli`
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flavorfeed.git
   cd flavorfeed
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key
   EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_revenuecat_ios_key
   EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_revenuecat_android_key
   EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device testing

## ⚙️ Configuration

### Supabase Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database migration scripts from `/supabase/migrations/`
3. Configure authentication providers in the Supabase dashboard
4. Set up Row Level Security policies using the provided SQL scripts
5. Configure storage buckets for user uploads and restaurant photos

### ElevenLabs Configuration
1. Sign up for an ElevenLabs account at [elevenlabs.io](https://elevenlabs.io)
2. Generate an API key from your account dashboard
3. Configure voice settings and available voices in the app configuration
4. Set up usage monitoring to manage API costs and rate limits

### RevenueCat Setup
1. Create a RevenueCat account at [revenuecat.com](https://revenuecat.com)
2. Configure your iOS and Android apps in the RevenueCat dashboard
3. Set up subscription products and pricing in both App Store Connect and Google Play Console
4. Configure webhook endpoints for handling subscription events
5. Test subscription flows in sandbox environments

### Mapbox Configuration
1. Create a Mapbox account at [mapbox.com](https://mapbox.com)
2. Generate an access token with appropriate scopes
3. Configure map styles and customize the appearance to match your brand
4. Set up geocoding and directions API access for location features

## 📱 Development

### Project Structure
```
flavorfeed/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components for navigation
│   ├── navigation/     # Navigation configuration
│   ├── services/       # External service integrations
│   ├── store/          # Zustand state management
│   ├── utils/          # Helper functions and utilities
│   ├── types/          # TypeScript type definitions
│   └── constants/      # App constants and configuration
├── assets/             # Images, fonts, and static assets
├── supabase/          # Database schemas and migrations
├── netlify/           # Serverless functions for web deployment
└── docs/              # Documentation and guides
```

### Development Commands
```bash
# Start development server
npm start

# Run tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Generate APK for Android
npx expo build:android

# Generate IPA for iOS
npx expo build:ios
```

### Code Standards
- Use TypeScript for all new code with strict type checking enabled
- Follow React Native best practices and performance guidelines
- Implement proper error handling and user feedback for all user actions
- Write comprehensive JSDoc comments for all public functions and components
- Use consistent naming conventions and follow the established project structure
- Implement responsive design patterns that work across different screen sizes

## 🚀 Deployment

### Web Deployment (Netlify)
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   ```
   Build command: npx expo export:web
   Publish directory: dist
   ```
3. Set up environment variables in Netlify dashboard
4. Configure custom domain and SSL certificates
5. Set up continuous deployment from your main branch

### Mobile App Distribution
1. **iOS App Store**:
   - Configure app signing in Expo Application Services
   - Build production IPA using `npx expo build:ios --type archive`
   - Upload to App Store Connect and submit for review

2. **Google Play Store**:
   - Generate production APK using `npx expo build:android --type app-bundle`
   - Upload to Google Play Console and complete store listing
   - Submit for review and publishing

### Production Monitoring
- Configure Sentry for error tracking and performance monitoring
- Set up analytics tracking for user behavior and feature usage
- Implement health checks and uptime monitoring for all services
- Configure alerting for critical issues and service outages

## 🤝 Contributing

We welcome contributions to FlavorFeed! Please read our contributing guidelines and code of conduct before submitting pull requests.

### Development Process
1. Fork the repository and create a feature branch
2. Make your changes following our code standards and best practices
3. Write or update tests for any new functionality
4. Ensure all tests pass and code passes linting checks
5. Submit a pull request with a clear description of your changes

### Reporting Issues
- Use GitHub Issues to report bugs or request features
- Provide detailed reproduction steps for any bugs
- Include screenshots or videos when helpful
- Label issues appropriately for better organization

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- ElevenLabs for providing high-quality voice synthesis technology
- Supabase for the comprehensive backend-as-a-service platform
- RevenueCat for simplified subscription management
- Mapbox for powerful mapping and location services
- The React Native and Expo communities for excellent development tools

## 📞 Support

For support, feature requests, or general inquiries:
- Email: support@flavorfeed.com
- Documentation: [docs.flavorfeed.com](https://docs.flavorfeed.com)
- Community: [community.flavorfeed.com](https://community.flavorfeed.com)

---

**Built with ❤️ for food lovers everywhere**