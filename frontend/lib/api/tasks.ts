import api from './client';
import { Milestone, Task } from '@/types';

export const taskApi = {
    // Milestones
    createMilestone: async (data: {
        title: string;
        description?: string;
        targetDate?: string;
    }): Promise<Milestone> => {
        const response = await api.post('/api/tasks/milestone', data);
        return response.data;
    },

    getMilestones: async (): Promise<Milestone[]> => {
        const response = await api.get('/api/tasks/milestones');
        return response.data;
    },

    updateMilestone: async (
        id: string,
        data: Partial<Milestone>
    ): Promise<Milestone> => {
        const response = await api.put(`/api/tasks/milestone/${id}`, data);
        return response.data;
    },

    deleteMilestone: async (id: string) => {
        const response = await api.delete(`/api/tasks/milestone/${id}`);
        return response.data;
    },

    // Tasks
    createTask: async (data: {
        milestoneId: string;
        title: string;
        description?: string;
        assignedTo?: string;
        priority?: 'low' | 'medium' | 'high';
        department?: string;
    }): Promise<Task> => {
        const response = await api.post('/api/tasks/task', data);
        return response.data;
    },

    getTasks: async (filters?: {
        milestoneId?: string;
        status?: string;
    }): Promise<Task[]> => {
        const response = await api.get('/api/tasks/tasks', { params: filters });
        return response.data;
    },

    updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
        const response = await api.put(`/api/tasks/task/${id}`, data);
        return response.data;
    },

    deleteTask: async (id: string) => {
        const response = await api.delete(`/api/tasks/task/${id}`);
        return response.data;
    },
};
