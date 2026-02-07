import api from './client';

export const ideaApi = {
    // Get all ideas
    getIdeas: async (filters?: { category?: string; status?: string; priority?: string; search?: string }) => {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.priority) params.append('priority', filters.priority);
        if (filters?.search) params.append('search', filters.search);

        const response = await api.get(`/api/ideas?${params.toString()}`);
        return response.data;
    },

    // Get single idea
    getIdeaById: async (id: string) => {
        const response = await api.get(`/api/ideas/${id}`);
        return response.data;
    },

    // Create new idea
    createIdea: async (data: {
        title: string;
        description: string;
        category: string;
        tags?: string[];
        priority?: string;
    }) => {
        const response = await api.post('/api/ideas', data);
        return response.data;
    },

    // Update idea
    updateIdea: async (id: string, data: any) => {
        const response = await api.put(`/api/ideas/${id}`, data);
        return response.data;
    },

    // Delete idea
    deleteIdea: async (id: string) => {
        const response = await api.delete(`/api/ideas/${id}`);
        return response.data;
    },

    // Vote on idea
    voteOnIdea: async (id: string, vote: 'upvote' | 'downvote') => {
        const response = await api.post(`/api/ideas/${id}/vote`, { vote });
        return response.data;
    },

    // Get AI analysis
    analyzeIdea: async (id: string) => {
        const response = await api.post(`/api/ideas/${id}/analyze`);
        return response.data;
    },

    // Get feedback for idea
    getFeedback: async (ideaId: string) => {
        const response = await api.get(`/api/ideas/${ideaId}/feedback`);
        return response.data;
    },

    // Submit feedback
    submitFeedback: async (ideaId: string, data: { content: string; rating?: number }) => {
        const response = await api.post(`/api/ideas/${ideaId}/feedback`, data);
        return response.data;
    },

    // Update feedback
    updateFeedback: async (feedbackId: string, data: { content?: string; rating?: number }) => {
        const response = await api.put(`/api/idea-feedback/${feedbackId}`, data);
        return response.data;
    },

    // Delete feedback
    deleteFeedback: async (feedbackId: string) => {
        const response = await api.delete(`/api/idea-feedback/${feedbackId}`);
        return response.data;
    }
};
