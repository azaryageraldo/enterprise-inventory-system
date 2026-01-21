import api from "./api";

const API_BASE_URL = "/admin/master";

export interface MasterDataItem {
  id: number;
  name: string;
  description?: string;
}

export const masterDataApi = {
  // Categories
  getCategories: async () => (await api.get<MasterDataItem[]>(`${API_BASE_URL}/categories`)).data,
  createCategory: async (data: { name: string }) => (await api.post(`${API_BASE_URL}/categories`, data)).data,
  updateCategory: async (id: number, data: { name: string }) => (await api.put(`${API_BASE_URL}/categories/${id}`, data)).data,
  deleteCategory: async (id: number) => (await api.delete(`${API_BASE_URL}/categories/${id}`)).data,

  // Units
  getUnits: async () => (await api.get<MasterDataItem[]>(`${API_BASE_URL}/units`)).data,
  createUnit: async (data: { name: string }) => (await api.post(`${API_BASE_URL}/units`, data)).data,
  updateUnit: async (id: number, data: { name: string }) => (await api.put(`${API_BASE_URL}/units/${id}`, data)).data,
  deleteUnit: async (id: number) => (await api.delete(`${API_BASE_URL}/units/${id}`)).data,

  // Divisions
  getDivisions: async () => (await api.get<MasterDataItem[]>(`${API_BASE_URL}/divisions`)).data,
  createDivision: async (data: { name: string }) => (await api.post(`${API_BASE_URL}/divisions`, data)).data,
  updateDivision: async (id: number, data: { name: string }) => (await api.put(`${API_BASE_URL}/divisions/${id}`, data)).data,
  deleteDivision: async (id: number) => (await api.delete(`${API_BASE_URL}/divisions/${id}`)).data,

  // Expense Categories
  getExpenseCategories: async () => (await api.get<MasterDataItem[]>(`${API_BASE_URL}/expense-categories`)).data,
  createExpenseCategory: async (data: { name: string; description: string }) => (await api.post(`${API_BASE_URL}/expense-categories`, data)).data,
  updateExpenseCategory: async (id: number, data: { name: string; description: string }) => (await api.put(`${API_BASE_URL}/expense-categories/${id}`, data)).data,
  deleteExpenseCategory: async (id: number) => (await api.delete(`${API_BASE_URL}/expense-categories/${id}`)).data,

  // Payment Methods
  getPaymentMethods: async () => (await api.get<MasterDataItem[]>(`${API_BASE_URL}/payment-methods`)).data,
  createPaymentMethod: async (data: { name: string; description: string }) => (await api.post(`${API_BASE_URL}/payment-methods`, data)).data,
  updatePaymentMethod: async (id: number, data: { name: string; description: string }) => (await api.put(`${API_BASE_URL}/payment-methods/${id}`, data)).data,
  deletePaymentMethod: async (id: number) => (await api.delete(`${API_BASE_URL}/payment-methods/${id}`)).data,
};
