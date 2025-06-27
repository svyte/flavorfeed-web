import { supabase } from '../supabase'
import type { Database } from '../database.types'

type Notification = Database['public']['Tables']['notifications']['Row']

export interface NotificationTemplate {
  type: string
  title: string
  body: string
  variables: string[]
  priority: 'low' | 'normal' | 'high' | 'urgent'
  channels: ('push' | 'email' | 'sms' | 'in_app')[]
}

export class NotificationService {
  private static templates: Record<string, NotificationTemplate> = {
    friend_request: {
      type: 'friend_request',
      title: '👋 New friend request',
      body: '{username} wants to connect with you',
      variables: ['username'],
      priority: 'normal',
      channels: ['push', 'in_app']
    },
    friend_accepted: {
      type: 'friend_accepted',
      title: '🎉 Friend request accepted',
      body: '{username} accepted your friend request',
      variables: ['username'],
      priority: 'normal',
      channels: ['push', 'in_app']
    },
    post_like: {
      type: 'post_like',
      title: '❤️ Someone liked your post',
      body: '{username} liked your post about {restaurant}',
      variables: ['username', 'restaurant'],
      priority: 'low',
      channels: ['push', 'in_app']
    },
    post_comment: {
      type: 'post_comment',
      title: '💬 New comment on your post',
      body: '{username} commented on your post about {restaurant}',
      variables: ['username', 'restaurant'],
      priority: 'normal',
      channels: ['push', 'in_app']
    },
    reservation_reminder: {
      type: 'reservation_reminder',
      title: '🍽️ Reservation reminder',
      body: 'Your reservation at {restaurant} is in {time}',
      variables: ['restaurant', 'time'],
      priority: 'high',
      channels: ['push', 'email', 'in_app']
    },
    reservation_confirmed: {
      type: 'reservation_confirmed',
      title: '✅ Reservation confirmed',
      body: 'Your reservation at {restaurant} for {date} is confirmed',
      variables: ['restaurant', 'date'],
      priority: 'high',
      channels: ['push', 'email', 'in_app']
    },
    ai_suggestion: {
      type: 'ai_suggestion',
      title: '🤖 AI recommendation',
      body: 'Based on your tastes, you might love {restaurant}',
      variables: ['restaurant'],
      priority: 'normal',
      channels: ['push', 'in_app']
    },
    insider_event: {
      type: 'insider_event',
      title: '⭐ Exclusive event available',
      body: 'New insider event at {restaurant} - {event_name}',
      variables: ['restaurant', 'event_name'],
      priority: 'high',
      channels: ['push', 'email', 'in_app']
    },
    achievement: {
      type: 'achievement',
      title: '🏆 Achievement unlocked',
      body: 'You earned the "{achievement}" badge!',
      variables: ['achievement'],
      priority: 'normal',
      channels: ['push', 'in_app']
    },
    subscription: {
      type: 'subscription',
      title: '💎 Subscription update',
      body: '{message}',
      variables: ['message'],
      priority: 'high',
      channels: ['push', 'email', 'in_app']
    }
  }

  // Send notification to user
  static async sendNotification(
    userId: string,
    type: string,
    variables: Record<string, string> = {},
    customData?: any
  ): Promise<void> {
    try {
      const template = this.templates[type]
      if (!template) {
        throw new Error(`Unknown notification type: ${type}`)
      }

      // Get user notification preferences
      const userPrefs = await this.getUserNotificationPreferences(userId)
      if (!userPrefs.enabled || !userPrefs.types.includes(type)) {
        return // User has disabled this notification type
      }

      // Build notification content
      let title = template.title
      let body = template.body

      // Replace variables
      template.variables.forEach(variable => {
        const value = variables[variable] || `{${variable}}`
        title = title.replace(`{${variable}}`, value)
        body = body.replace(`{${variable}}`, value)
      })

      // Store notification in database
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message: body,
          data: { ...variables, ...customData },
          priority: template.priority,
          channels: template.channels.filter(channel => userPrefs.channels.includes(channel))
        })

      if (error) throw error

      // Send via enabled channels (would integrate with external services)
      await this.sendViaChannels(userId, template.channels, { title, body }, type)
    } catch (error) {
      console.error('Send notification error:', error)
    }
  }

  // Get user notifications
  static async getUserNotifications(
    userId: string,
    limit: number = 50,
    offset: number = 0,
    unreadOnly: boolean = false
  ): Promise<Notification[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)

      if (unreadOnly) {
        query = query.eq('read', false)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get user notifications error:', error)
      return []
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId)

      if (error) throw error
    } catch (error) {
      console.error('Mark as read error:', error)
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          read: true,
          read_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error
    } catch (error) {
      console.error('Mark all as read error:', error)
    }
  }

  // Get unread count
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error('Get unread count error:', error)
      return 0
    }
  }

  // Update notification preferences
  static async updateNotificationPreferences(
    userId: string,
    preferences: {
      enabled: boolean
      channels: string[]
      types: string[]
      quietHours?: { start: string; end: string }
    }
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_settings: preferences
        })
        .eq('id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Update notification preferences error:', error)
    }
  }

  // Schedule notification
  static async scheduleNotification(
    userId: string,
    type: string,
    scheduledFor: Date,
    variables: Record<string, string> = {}
  ): Promise<void> {
    try {
      const template = this.templates[type]
      if (!template) {
        throw new Error(`Unknown notification type: ${type}`)
      }

      let title = template.title
      let body = template.body

      // Replace variables
      template.variables.forEach(variable => {
        const value = variables[variable] || `{${variable}}`
        title = title.replace(`{${variable}}`, value)
        body = body.replace(`{${variable}}`, value)
      })

      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message: body,
          data: variables,
          priority: template.priority,
          channels: template.channels,
          scheduled_for: scheduledFor.toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Schedule notification error:', error)
    }
  }

  // Send bulk notifications
  static async sendBulkNotification(
    userIds: string[],
    type: string,
    variables: Record<string, string> = {},
    batchSize: number = 100
  ): Promise<void> {
    try {
      // Process in batches
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize)
        
        await Promise.allSettled(
          batch.map(userId => 
            this.sendNotification(userId, type, variables)
          )
        )

        // Brief delay between batches
        if (i + batchSize < userIds.length) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    } catch (error) {
      console.error('Send bulk notification error:', error)
    }
  }

  // Private helper methods
  private static async getUserNotificationPreferences(userId: string): Promise<any> {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('notification_settings')
        .eq('id', userId)
        .single()

      return data?.notification_settings || {
        enabled: true,
        channels: ['push', 'in_app'],
        types: Object.keys(this.templates)
      }
    } catch (error) {
      return {
        enabled: true,
        channels: ['push', 'in_app'],
        types: Object.keys(this.templates)
      }
    }
  }

  private static async sendViaChannels(
    userId: string,
    channels: string[],
    content: { title: string; body: string },
    type: string
  ): Promise<void> {
    // This would integrate with external services like FCM, SendGrid, Twilio, etc.
    // For now, we'll just log the channels
    console.log(`Sending notification via channels: ${channels.join(', ')}`, {
      userId,
      content,
      type
    })
  }
}