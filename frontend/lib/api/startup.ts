import api from './client';
import { Startup } from '@/types';

export const startupApi = {
    create: async (data: any) => {
        const response = await api.post('/api/startup/create', data);
        return response.data;
    },

    getProfile: async (): Promise<Startup | null> => {
        try {
            const response = await api.get('/api/startup/profile');
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    },

    update: async (data: any) => {
        const response = await api.put('/api/startup/update', data);
        return response.data;
    },

    addTeamMember: async (data: { name: string; email: string; password: string; department?: string | null }) => {
        const response = await api.post('/api/startup/add-member', data);
        return response.data;
    },

    removeTeamMember: async (userId: string) => {
        const response = await api.delete(`/api/startup/remove-member/${userId}`);
        return response.data;
    },
};
