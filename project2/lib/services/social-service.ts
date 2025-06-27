import { supabase } from '../supabase'
import type { Database } from '../database.types'

type Post = Database['public']['Tables']['posts']['Row']
type PostInsert = Database['public']['Tables']['posts']['Insert']
type Friendship = Database['public']['Tables']['friendships']['Row']

export interface CreatePostData {
  content?: string
  images?: string[]
  video_url?: string
  restaurant_id?: string
  dish_id?: string
  overall_rating?: number
  dish_rating?: number
  service_rating?: number
  atmosphere_rating?: number
  value_rating?: number
  visit_date?: string
  meal_type?: string
  occasion?: string
  party_size?: number
  tags?: string[]
  hashtags?: string[]
  visibility?: 'public' | 'friends' | 'private'
}

export interface FeedFilters {
  following_only?: boolean
  restaurant_id?: string
  cuisine_types?: string[]
  min_rating?: number
  has_images?: boolean
}

export class SocialService {
  // Create a new post
  static async createPost(data: CreatePostData): Promise<Post> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const postData: PostInsert = {
        user_id: user.id,
        ...data,
        created_at: new Date().toISOString()
      }

      const { data: post, error } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single()

      if (error) throw error
      return post
    } catch (error) {
      console.error('Create post error:', error)
      throw error
    }
  }

  // Get user's feed
  static async getFeed(
    filters: FeedFilters = {},
    limit: number = 20,
    offset: number = 0
  ): Promise<Post[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles(username, avatar_url, subscription_tier),
          restaurants(name, cuisine_types, images),
          dishes(name),
          post_likes(user_id),
          _count:post_comments(count)
        `)

      // Apply filters
      if (filters.following_only) {
        // Get friend IDs first
        const { data: friendships } = await supabase
          .from('friendships')
          .select('requester_id, addressee_id')
          .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
          .eq('status', 'accepted')

        const friendIds = friendships?.map(f => 
          f.requester_id === user.id ? f.addressee_id : f.requester_id
        ) || []

        friendIds.push(user.id) // Include user's own posts
        query = query.in('user_id', friendIds)
      }

      if (filters.restaurant_id) {
        query = query.eq('restaurant_id', filters.restaurant_id)
      }

      if (filters.min_rating) {
        query = query.gte('overall_rating', filters.min_rating)
      }

      if (filters.has_images) {
        query = query.not('images', 'is', null)
      }

      // Apply visibility filter
      query = query.or(`visibility.eq.public,user_id.eq.${user.id}`)

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get feed error:', error)
      return []
    }
  }

  // Get user's posts
  static async getUserPosts(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Post[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          restaurants(name, images),
          dishes(name),
          post_likes(user_id),
          _count:post_comments(count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get user posts error:', error)
      return []
    }
  }

  // Like/unlike a post
  static async toggleLike(postId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Check if already liked
      const { data: existing } = await supabase
        .from('post_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single()

      if (existing) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId)

        if (error) throw error
        return false
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            user_id: user.id,
            post_id: postId
          })

        if (error) throw error
        return true
      }
    } catch (error) {
      console.error('Toggle like error:', error)
      throw error
    }
  }

  // Add comment to post
  static async addComment(
    postId: string,
    content: string,
    parentCommentId?: string
  ): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          user_id: user.id,
          post_id: postId,
          content,
          parent_comment_id: parentCommentId
        })
        .select(`
          *,
          profiles(username, avatar_url)
        `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Add comment error:', error)
      throw error
    }
  }

  // Get post comments
  static async getPostComments(
    postId: string,
    limit: number = 50
  ): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          profiles(username, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get post comments error:', error)
      return []
    }
  }

  // Send friend request
  static async sendFriendRequest(addresseeId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      if (user.id === addresseeId) {
        throw new Error('Cannot send friend request to yourself')
      }

      // Check if friendship already exists
      const { data: existing } = await supabase
        .from('friendships')
        .select('id, status')
        .or(`and(requester_id.eq.${user.id},addressee_id.eq.${addresseeId}),and(requester_id.eq.${addresseeId},addressee_id.eq.${user.id})`)
        .single()

      if (existing) {
        throw new Error('Friendship already exists')
      }

      const { error } = await supabase
        .from('friendships')
        .insert({
          requester_id: user.id,
          addressee_id: addresseeId,
          status: 'pending'
        })

      if (error) throw error
    } catch (error) {
      console.error('Send friend request error:', error)
      throw error
    }
  }

  // Respond to friend request
  static async respondToFriendRequest(
    friendshipId: string,
    response: 'accepted' | 'declined'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: response })
        .eq('id', friendshipId)

      if (error) throw error
    } catch (error) {
      console.error('Respond to friend request error:', error)
      throw error
    }
  }

  // Get user's friends
  static async getFriends(userId?: string): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const targetUserId = userId || user?.id
      if (!targetUserId) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          requester:profiles!friendships_requester_id_fkey(id, username, full_name, avatar_url),
          addressee:profiles!friendships_addressee_id_fkey(id, username, full_name, avatar_url)
        `)
        .or(`requester_id.eq.${targetUserId},addressee_id.eq.${targetUserId}`)
        .eq('status', 'accepted')

      if (error) throw error

      // Map to friend profiles
      return data?.map(friendship => {
        const friend = friendship.requester_id === targetUserId 
          ? friendship.addressee 
          : friendship.requester
        return {
          ...friend,
          friendship_id: friendship.id,
          close_friend: friendship.close_friend
        }
      }) || []
    } catch (error) {
      console.error('Get friends error:', error)
      return []
    }
  }

  // Get pending friend requests
  static async getPendingFriendRequests(): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          requester:profiles!friendships_requester_id_fkey(id, username, full_name, avatar_url)
        `)
        .eq('addressee_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get pending friend requests error:', error)
      return []
    }
  }

  // Search users
  static async searchUsers(query: string, limit: number = 20): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, bio')
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Search users error:', error)
      return []
    }
  }

  // Get user activity feed
  static async getUserActivity(
    userId: string,
    limit: number = 20
  ): Promise<any[]> {
    try {
      // This would combine posts, likes, comments, check-ins, etc.
      const [posts, likes, comments] = await Promise.all([
        this.getUserPosts(userId, limit / 3),
        this.getUserLikes(userId, limit / 3),
        this.getUserComments(userId, limit / 3)
      ])

      // Combine and sort by timestamp
      const activities = [
        ...posts.map(post => ({ type: 'post', data: post, timestamp: post.created_at })),
        ...likes.map(like => ({ type: 'like', data: like, timestamp: like.created_at })),
        ...comments.map(comment => ({ type: 'comment', data: comment, timestamp: comment.created_at }))
      ]

      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)
    } catch (error) {
      console.error('Get user activity error:', error)
      return []
    }
  }

  // Helper method to get user likes
  private static async getUserLikes(userId: string, limit: number): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select(`
          *,
          posts(*, restaurants(name))
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      return []
    }
  }

  // Helper method to get user comments
  private static async getUserComments(userId: string, limit: number): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          posts(*, restaurants(name))
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      return []
    }
  }
}