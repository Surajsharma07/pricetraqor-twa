/**
 * Authentication Service
 * Handles Telegram WebApp authentication with FastAPI backend
 */

import apiClient from './api';

export interface User {
  _id: string;
  email: string;
  full_name: string;
  telegram_id?: number;
  telegram_user_id?: number;
  telegram_username?: string;
  telegram_chat_id?: number;
  photo_url?: string;
  mobile_number?: string;
  plan: string;
  current_count: number;
  max_products: number;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
  needs_profile_setup?: boolean;
  locale?: string;
  timezone?: string;
  currency?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface SignupData {
  email?: string;
  password?: string;
  full_name: string;
  telegram_username?: string;
  telegram_chat_id?: number;
  telegram_user_id?: number;
  telegram_init_data?: string;
}

class AuthService {
  /**
   * Authenticate with Telegram WebApp using initData
   */
  async authenticateWithTelegram(initData: string): Promise<AuthResponse> {
    try {
      // Parse initData to extract user info
      const params = new URLSearchParams(initData);
      const userStr = params.get('user');
      let telegramUser: any = {};
      
      if (userStr) {
        try {
          telegramUser = JSON.parse(userStr);
        } catch (e) {
          console.error('Failed to parse Telegram user data:', e);
        }
      }

      console.log('Authenticating with backend...', {
        hasTelegramUser: !!telegramUser.id,
        userId: telegramUser.id
      });

      // Use the /auth/signup endpoint which handles both new and existing users
      const response = await apiClient.post<AuthResponse>('/auth/signup', {
        telegram_init_data: initData,
        telegram_chat_id: telegramUser.id,
        telegram_user_id: telegramUser.id,
        telegram_username: telegramUser.username,
        full_name: `${telegramUser.first_name || ''} ${telegramUser.last_name || ''}`.trim() || 'Telegram User',
        // Note: Telegram Web App initData does not include photo_url
        // The backend should fetch this via Telegram Bot API using getUserProfilePhotos
      });

      console.log('Authentication successful:', response.data);

      // Store token and user in localStorage
      localStorage.setItem('jwt_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    } catch (error: any) {
      console.error('Telegram authentication failed:', error.response?.data || error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Authentication failed'
      );
    }
  }

  /**
   * Login with Telegram (for existing users)
   */
  async loginWithTelegram(telegramData: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
  }): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/telegram-login', telegramData);

      localStorage.setItem('jwt_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    } catch (error: any) {
      console.error('Telegram login failed:', error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Login failed'
      );
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<{ status: string; data: User }>('/auth/profile');
      const user = response.data.data;
      
      // Update localStorage with fresh user data
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      console.error('Failed to get current user:', error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to fetch user data'
      );
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<Pick<User, 'full_name' | 'telegram_username' | 'email' | 'mobile_number' | 'locale' | 'timezone' | 'currency'>>): Promise<User> {
    try {
      const response = await apiClient.patch<User>('/auth/profile', updates);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to update profile'
      );
    }
  }

  /**
   * Link Telegram account to existing Pricetracker account
   */
  async linkTelegramAccount(email: string, password: string): Promise<{ message: string; user: User }> {
    try {
      const response = await apiClient.post<{ message: string; user: User }>('/auth/link-telegram', {
        email,
        password
      });
      
      // Update localStorage with linked user data
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Failed to link Telegram account:', error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to link account'
      );
    }
  }

  /**
   * Change user password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Failed to change password:', error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to change password'
      );
    }
  }

  /**
   * Logout - clear local storage
   */
  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  /**
   * Get stored user from localStorage
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Helper to extract Telegram chat ID from initData
   */
  private getTelegramChatId(initData: string): number | undefined {
    try {
      const params = new URLSearchParams(initData);
      const userStr = params.get('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id;
      }
    } catch (error) {
      console.error('Failed to parse Telegram initData:', error);
    }
    return undefined;
  }

  /**
   * Helper to extract Telegram user ID from initData
   */
  private getTelegramUserId(initData: string): number | undefined {
    return this.getTelegramChatId(initData); // Same as chat_id in Telegram WebApp
  }

  /**
   * Helper to extract Telegram user name from initData
   */
  private getTelegramUserName(initData: string): string {
    try {
      const params = new URLSearchParams(initData);
      const userStr = params.get('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Telegram User';
      }
    } catch (error) {
      console.error('Failed to parse Telegram initData:', error);
    }
    return 'Telegram User';
  }
}

export const authService = new AuthService();
