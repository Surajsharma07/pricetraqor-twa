/**
 * Products Service
 * Handles all product-related API calls to FastAPI backend
 */

import apiClient from './api';

export interface Product {
  _id: string;
  user_id: string;
  url: string;
  title: string;
  current_price: number;
  desired_price?: number;
  image_url?: string;
  platform: string;
  currency?: string;
  is_active: boolean;
  in_stock?: boolean;
  last_checked?: string;
  created_at: string;
  updated_at?: string;
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
  desired_price?: number;
}

export interface UpdateProductRequest {
  desired_price?: number;
  is_active?: boolean;
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
      const response = await apiClient.post<Product>('/products', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to add product:', error);
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
      const response = await apiClient.patch<Product>(`/products/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update product:', error);
      throw new Error(
        error.response?.data?.detail?.message || 
        error.response?.data?.detail || 
        'Failed to update product'
      );
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
  async toggleActive(id: string, isActive: boolean): Promise<Product> {
    return this.updateProduct(id, { is_active: isActive });
  }

  /**
   * Update desired price for a product
   */
  async updateDesiredPrice(id: string, desiredPrice?: number): Promise<Product> {
    return this.updateProduct(id, { desired_price: desiredPrice });
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
