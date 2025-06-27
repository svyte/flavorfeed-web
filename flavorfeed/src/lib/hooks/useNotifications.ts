import { useState, useEffect } from 'react'
import { NotificationService } from '../services/notification-service'
import { supabase } from '../supabase'
import type { Database } from '../database.types'

type Notification = Database['public']['Tables']['notifications']['Row']

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [notificationsData, unreadCountData] = await Promise.all([
        NotificationService.getUserNotifications(user.id, 50),
        NotificationService.getUnreadCount(user.id)
      ])

      setNotifications(notificationsData)
      setUnreadCount(unreadCountData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()

    // Subscribe to real-time notifications
    const { data: { user } } = supabase.auth.getUser()
    if (!user) return

    const subscription = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev])
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const markAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId)
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true, read_at: new Date().toISOString() }
            : notification
        )
      )
      
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await NotificationService.markAllAsRead(user.id)
      
      setNotifications(prev => 
        prev.map(notification => ({ 
          ...notification, 
          read: true, 
          read_at: new Date().toISOString() 
        }))
      )
      
      setUnreadCount(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all as read')
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications
  }
}