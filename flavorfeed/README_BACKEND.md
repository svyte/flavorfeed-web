# FlavorFeed Supabase Backend

This is the complete backend implementation for FlavorFeed using Supabase as the primary database and backend service.

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned
3. Go to Settings > API to get your project URL and anon key

### 2. Environment Configuration

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Run Database Migrations

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_indexes_and_rls.sql`
   - `supabase/migrations/003_functions_and_triggers.sql`

### 4. Configure Authentication

1. In Supabase dashboard, go to Authentication > Settings
2. Enable the providers you want (Email, Google, Apple)
3. Configure redirect URLs for OAuth providers

## 📊 Database Schema

### Core Tables

- **profiles** - User profiles extending Supabase auth
- **restaurants** - Restaurant data with location and features
- **dishes** - Menu items with detailed categorization
- **posts** - Social posts with ratings and media
- **friendships** - Social connections between users
- **subscriptions** - RevenueCat subscription management
- **ai_conversations** - AI chat history and context
- **reservations** - Restaurant bookings with smart features
- **notifications** - Multi-channel notification system

### Key Features

- **Geographic Search** - PostGIS for location-based queries
- **Full-Text Search** - PostgreSQL search vectors
- **Row Level Security** - Comprehensive data protection
- **Real-time Updates** - Supabase real-time subscriptions
- **Performance Optimized** - Strategic indexing and caching

## 🔧 Services

### Authentication Service (`lib/services/auth-service.ts`)
- User registration and login
- OAuth integration (Google, Apple)
- Profile management
- Subscription awareness

### Restaurant Service (`lib/services/restaurant-service.ts`)
- Advanced restaurant search with filters
- Location-based queries
- Menu management
- Reviews and ratings

### Social Service (`lib/services/social-service.ts`)
- Post creation and management
- Social interactions (likes, comments)
- Friend system
- Activity feeds

### Notification Service (`lib/services/notification-service.ts`)
- Multi-channel notifications
- Template system
- Real-time delivery
- User preferences

## 🎣 React Hooks

### useAuth
```typescript
const { user, profile, loading, signIn, signUp, signOut } = useAuth()
```

### useRestaurants
```typescript
const { restaurants, loading, loadMore } = useRestaurants(query, filters)
```

### useNotifications
```typescript
const { notifications, unreadCount, markAsRead } = useNotifications()
```

## 🔒 Security Features

- **Row Level Security (RLS)** on all tables
- **Subscription-aware access control**
- **Privacy settings enforcement**
- **Rate limiting ready**
- **Input validation and sanitization**

## 📈 Performance Features

- **Geographic indexes** for location queries
- **Composite indexes** for common patterns
- **Full-text search** with PostgreSQL
- **Connection pooling** ready
- **Caching strategies** implemented

## 🔄 Real-time Features

- **Live notifications**
- **Friend activity updates**
- **Restaurant availability**
- **AI conversation streaming**
- **Group planning coordination**

## 🚀 Deployment Ready

The backend is production-ready with:
- Comprehensive error handling
- Performance monitoring
- Scalable architecture
- Security best practices
- Real-time capabilities

## 🔌 External Integrations Ready

The schema and services are prepared for:
- **CKCN AI APIs** - Restaurant recommendations
- **ElevenLabs** - Voice AI responses
- **Tavus AI** - Video avatar generation
- **RevenueCat** - Subscription management
- **Google Maps** - Location services

## 📝 Usage Examples

### Create a Restaurant Post
```typescript
import { SocialService } from './lib/services/social-service'

const post = await SocialService.createPost({
  content: "Amazing dinner at this place!",
  restaurant_id: "restaurant-uuid",
  overall_rating: 5,
  images: ["image-url-1", "image-url-2"],
  visibility: "public"
})
```

### Search Restaurants
```typescript
import { RestaurantService } from './lib/services/restaurant-service'

const restaurants = await RestaurantService.searchRestaurants("italian", {
  location: { lat: 40.7128, lng: -74.0060, radius: 10 },
  priceRange: [2, 3],
  minRating: 4.0
})
```

### Send Notification
```typescript
import { NotificationService } from './lib/services/notification-service'

await NotificationService.sendNotification(
  userId,
  'friend_request',
  { username: 'John Doe' }
)
```

## 🛠️ Development

### Adding New Features

1. **Database Changes**: Add migrations to `supabase/migrations/`
2. **Services**: Extend existing services or create new ones
3. **Types**: Update `lib/database.types.ts`
4. **Hooks**: Create React hooks for new features

### Testing

The backend includes comprehensive error handling and validation. Test with:
- Invalid data inputs
- Permission edge cases
- Network failures
- Rate limiting scenarios

## 📚 Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🆘 Support

For backend-specific issues:
1. Check Supabase logs in the dashboard
2. Verify RLS policies are correct
3. Check database indexes for performance
4. Monitor real-time subscriptions

This backend provides a solid foundation for FlavorFeed's luxury food discovery experience with room for all the advanced features outlined in your specifications.