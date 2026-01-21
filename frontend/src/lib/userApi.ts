import api from './api';

const API_BASE_URL = '/admin/users';

export interface UserRequest {
  username: string;
  password?: string;
  fullName: string;
  role: string;
  divisionId?: number | null;
}

export interface UserResponse {
  id: number;
  username: string;
  fullName: string;
  role: string;
  divisionName: string | null;
  divisionId: number | null;
}

export interface Division {
  id: number;
  name: string;
}

export const userApi = {
  getAllUsers: async (): Promise<UserResponse[]> => {
    const response = await api.get(API_BASE_URL);
    return response.data;
  },

  getUserById: async (id: number): Promise<UserResponse> => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  createUser: async (data: UserRequest): Promise<UserResponse> => {
    const response = await api.post(API_BASE_URL, data);
    return response.data;
  },

  updateUser: async (id: number, data: UserRequest): Promise<UserResponse> => {
    const response = await api.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`${API_BASE_URL}/${id}`);
  },

  resetPassword: async (id: number, newPassword: string): Promise<void> => {
    await api.post(`${API_BASE_URL}/${id}/reset-password`, { newPassword });
  },

  getDivisions: async (): Promise<Division[]> => {
    const response = await api.get(`${API_BASE_URL}/divisions`);
    return response.data;
  },
};
