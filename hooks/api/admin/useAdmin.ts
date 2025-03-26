import { useState } from 'react';
import apiClient from '../apiClient';

export interface AdminDashboardResponse {
  items: any[];
  columns: string[];
}

export interface Item {
  [key: string]: any;
}

export const useAdmin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get all items for admin dashboard
   */
  const getAdminDashboard = async (): Promise<AdminDashboardResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<AdminDashboardResponse>('/admin');
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch dashboard data');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get item by ID
   */
  const getItemById = async (itemId: string): Promise<Item | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<Item>(`/item/update/${itemId}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch item');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new item
   */
  const createItem = async (item: Item): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.post('/item/create', {
        item: JSON.stringify(item)
      });
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create item');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing item
   */
  const updateItem = async (itemId: string, item: Item): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.post(`/item/update/${itemId}`, {
        item: JSON.stringify(item)
      });
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update item');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete an item
   */
  const deleteItem = async (itemId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.post(`/item/delete/${itemId}`);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete item');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getAdminDashboard,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    isLoading,
    error
  };
};

export default useAdmin;
