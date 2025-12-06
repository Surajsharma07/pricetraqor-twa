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
      if (!initData) {
        throw new Error('No Telegram initData available - not running in Telegram WebApp')
      }

      // Parse initData to extract user info
      const params = new URLSearchParams(initData);
      const userStr = params.get('user');
      let telegramUser: any = {};
      
      if (userStr) {
        try {
          telegramUser = JSON.parse(userStr);
        } catch (e) {
          console.error('Failed to parse Telegram user data:', e);
          throw new Error('Invalid Telegram user data format');
        }
      }

      if (!telegramUser.id) {
        throw new Error('Telegram user ID not found in initData');
      }

      console.log('Authenticating with backend...', {
        hasTelegramUser: !!telegramUser.id,
        userId: telegramUser.id,
        username: telegramUser.username,
        firstName: telegramUser.first_name
      });

      // Log request details for mobile debugging
      const requestPayload = {
        telegram_init_data: initData,
        telegram_chat_id: telegramUser.id,
        telegram_user_id: telegramUser.id,
        telegram_username: telegramUser.username,
        full_name: `${telegramUser.first_name || ''} ${telegramUser.last_name || ''}`.trim() || 'Telegram User',
      };
      
      console.log('Sending auth request to /auth/signup:', {
        url: '/auth/signup',
        payload: requestPayload,
        timestamp: new Date().toISOString()
      });

      // Use the /auth/signup endpoint which handles both new and existing users
      const response = await apiClient.post<AuthResponse>('/auth/signup', requestPayload);

      console.log('Authentication successful:', response.data);

      // Store token and user in localStorage
      localStorage.setItem('jwt_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    } catch (error: any) {
      console.error('Telegram authentication failed:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        timestamp: new Date().toISOString()
      });
      
      let errorMsg = 'Authentication failed';
      
      const errorData = error.response?.data;
      if (errorData?.detail) {
        if (typeof errorData.detail === 'string') {
          errorMsg = errorData.detail;
        } else if (typeof errorData.detail === 'object') {
          if (errorData.detail.message) {
            errorMsg = errorData.detail.message;
          } else if (Array.isArray(errorData.detail)) {
            // Pydantic validation error - extract first error message
            const firstError = errorData.detail[0];
            if (firstError?.msg) {
              errorMsg = firstError.msg;
            }
          }
        }
      }
      
      // Include more context in error message for mobile debugging
      const finalError = `${errorMsg}${error.response?.status ? ` (HTTP ${error.response.status})` : ''}`;
      throw new Error(finalError);
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
  async linkTelegramAccount(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/link-telegram', {
        email,
        password
      });
      
      // Store token and linked user data
      localStorage.setItem('jwt_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
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
   * Delete user account
   */
  async deleteAccount(): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/delete-account', {});
      
      // Clear localStorage after successful deletion
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to delete account'
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

  /**
   * Check if user is authenticated by verifying token and user data exist
   */
  hasValidSession(): boolean {
    const token = localStorage.getItem('jwt_token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }
  /**
   * Check if email already exists
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await apiClient.post<{ exists: boolean }>('/auth/check-email', {
        email
      })
      return response.data.exists
    } catch (error: any) {
      console.error('Check email error:', error)
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to check email'
      )
    }
  }

  /**
   * Add email to Telegram-only user account
   */
  async addEmail(email: string, password: string): Promise<{ access_token: string; user: User }> {
    try {
      const response = await apiClient.post<{ access_token: string; user: User }>('/auth/add-email', {
        email,
        password
      })
      
      // Store token and user
      localStorage.setItem('jwt_token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      return response.data
    } catch (error: any) {
      console.error('Add email error:', error)
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to add email'
      )
    }
  }

  /**
   * Sign up with email and password
   */
  async signup(email: string, password: string, fullName: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/signup', {
        email,
        password,
        full_name: fullName
      })
      
      // Store token and user
      localStorage.setItem('jwt_token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      return response.data
    } catch (error: any) {
      console.error('Signup error:', error)
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to sign up'
      )
    }
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password
      })
      
      // Store token and user
      localStorage.setItem('jwt_token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      return response.data
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to login'
      )
    }
  }
}

export const authService = new AuthService();
