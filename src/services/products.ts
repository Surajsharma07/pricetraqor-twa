/**
 * Products Service
 * Handles all product-related API calls to FastAPI backend
 */

import apiClient from './api';

export interface Product {
  _id: string;
  marketplace: string;
  url: string;
  affiliate_url?: string | null;
  title: string | null;
  image_url?: string | null;
  mrp?: number | null;
  last_snapshot_price: number | null;
  last_snapshot_currency?: string | null;
  last_snapshot_at?: string | null;
  last_alert_at?: string | null;
  price_change_pct?: number | null;
  availability_text?: string | null;
  status: string;
  alert_type?: string | null;
  alert_threshold_percentage?: number | null;
  alert_threshold_price?: number | null;
  created_at: string;
  updated_at: string;
  hydrated_at?: string | null;
  category?: string | null;
  tags?: string[];
  notes?: string | null;
  specifications?: any[] | null;
  brand?: string | null;
  rating?: number | null;
  slug?: string | null;
}

export interface PriceSnapshot {
  _id: string;
  product_id: string;
  price: number;
  fetched_at: string;
  in_stock: boolean;
  currency?: string;
}

export interface CreateProductRequest {
  url: string;
  marketplace: 'amazon' | 'flipkart' | 'reliance' | 'croma';
  alert_type?: 'percentage_drop' | 'fixed_price' | 'price_below' | 'stock_recovery' | null;
  alert_threshold_percentage?: number;
  alert_threshold_price?: number;
}

export interface UpdateProductRequest {
  desired_price?: number;
  is_active?: boolean;
}

/**
 * Detect marketplace from product URL
 */
function detectMarketplace(url: string): 'amazon' | 'flipkart' | 'reliance' | 'croma' {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('amazon.in') || lowerUrl.includes('amazon.com')) {
    return 'amazon';
  }
  if (lowerUrl.includes('flipkart.com')) {
    return 'flipkart';
  }
  if (lowerUrl.includes('reliancedigital.in') || lowerUrl.includes('jiomart.com')) {
    return 'reliance';
  }
  if (lowerUrl.includes('croma.com')) {
    return 'croma';
  }
  
  // Default to amazon if can't detect
  return 'amazon';
}

class ProductService {
  /**
   * Get all products for the authenticated user
   */
  async getProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<{ items: Product[] }>('/products');
      return response.data.items || [];
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to fetch products'
      );
    }
  }

  /**
   * Get a single product by ID
   */
  async getProduct(id: string): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch product:', error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to fetch product'
      );
    }
  }

  /**
   * Add a new product to track
   */
  async addProduct(data: CreateProductRequest): Promise<Product> {
    try {
      // Auto-detect marketplace if not provided
      const payload = {
        ...data,
        marketplace: data.marketplace || detectMarketplace(data.url),
      };
      
      const response = await apiClient.post<{ product: Product }>('/products', payload);
      // Backend returns { product: ProductOut, initial_snapshot_enqueued: bool }
      return response.data.product;
    } catch (error: any) {
      console.error('Failed to add product:', error);
      console.error('Error response:', error.response);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to add product'
      );
    }
  }

  /**
   * Update a product
   */
  async updateProduct(id: string, data: UpdateProductRequest): Promise<Product> {
    try {
      const response = await apiClient.patch<{ status: string; data: Product }>(`/products/${id}`, data)
      return response.data.data
    } catch (error: any) {
      console.error('Failed to update product:', error)
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to update product'
      )
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error: any) {
      console.error('Failed to delete product:', error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to delete product'
      );
    }
  }

  /**
   * Get price history for a product
   */
  async getPriceHistory(id: string): Promise<PriceSnapshot[]> {
    try {
      const response = await apiClient.get<{ snapshots: PriceSnapshot[] }>(`/products/${id}/history`);
      return response.data.snapshots || [];
    } catch (error: any) {
      console.error('Failed to fetch price history:', error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to fetch price history'
      );
    }
  }

  /**
   * Toggle product active status
   */
  async toggleActive(id: string, isActive: boolean): Promise<void> {
    try {
      const endpoint = isActive ? 'resume' : 'pause'
      await apiClient.patch(`/products/${id}/${endpoint}`)
    } catch (error: any) {
      console.error('Failed to toggle product:', error)
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to toggle product status'
      )
    }
  }

  /**
   * Update desired price for a product
   */
  async updateDesiredPrice(id: string, desiredPrice?: number): Promise<void> {
    try {
      await apiClient.patch(`/products/${id}`, { 
        alert_type: desiredPrice ? 'price_below' : null,
        alert_threshold_price: desiredPrice || null 
      })
    } catch (error: any) {
      console.error('Failed to update desired price:', error)
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to update desired price'
      )
    }
  }

  /**
   * Update product alert configuration
   */
  async updateAlert(
    id: string,
    alertType?: string,
    alertThresholdPrice?: number,
    alertThresholdPercentage?: number
  ): Promise<Product> {
    try {
      const payload: any = {}
      
      if (alertType) {
        payload.alert_type = alertType
        if (alertType === 'price_below' && alertThresholdPrice) {
          payload.alert_threshold_price = alertThresholdPrice
        }
        if (alertType === 'percentage_drop' && alertThresholdPercentage) {
          payload.alert_threshold_percentage = alertThresholdPercentage
        }
      } else {
        // Remove alerts
        payload.alert_type = null
        payload.alert_threshold_price = null
        payload.alert_threshold_percentage = null
      }
      
      const response = await apiClient.patch<{ data: Product }>(`/products/${id}`, payload)
      return response.data.data
    } catch (error: any) {
      console.error('Failed to update alert:', error)
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to update alert'
      )
    }
  }

  /**
   * Manually trigger a price check for a product
   */
  async refreshPrice(id: string): Promise<Product> {
    try {
      const response = await apiClient.post<Product>(`/products/${id}/refresh`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to refresh price:', error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to refresh price'
      );
    }
  }
}

export const productService = new ProductService();
