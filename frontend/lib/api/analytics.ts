import api from './client';

export interface DashboardMetrics {
    tasks: {
        total: number;
        completed: number;
        completionRate: number;
    };
    milestones: {
        total: number;
        completed: number;
        active: number;
    };
    feedback: {
        total: number;
        averageRating: number;
    };
    team: {
        memberCount: number;
    };
}

export interface TeamMemberStats {
    _id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    avatar?: string;
    stats: {
        completedTasks: number;
        pendingTasks: number;
        rating: number;
        reviewCount: number;
    };
}

export interface MemberAnalytics {
    profile: any;
    analytics: {
        taskDistribution: Record<string, number>;
        weeklyActivity: { week: number; count: number }[];
        avgRating: number;
        totalReviews: number;
    };
    reviews: any[];
}

export interface FinancialMetrics {
    financials: {
        month: string;
        year: number;
        revenue: number;
        expenses: number;
        profit: number;
        burnRate: number;
        cashOnHand: number;
        breakdown: {
            marketing: number;
            payroll: number;
            operations: number;
            software: number;
        };
    }[];
    summary: {
        totalRevenue: number;
        totalExpenses: number;
        netProfit: number;
        currentCash: number;
        runwayMonths: number;
    };
}

export const analyticsApi = {
    getDashboardMetrics: async () => {
        const response = await api.get('/analytics/dashboard');
        return response.data;
    },

    getTaskTrend: async () => {
        const response = await api.get('/analytics/tasks-trend');
        return response.data;
    },

    getFeedbackTrend: async () => {
        const response = await api.get('/analytics/feedback-trend');
        return response.data;
    },

    getInsights: async () => {
        const response = await api.get('/analytics/insights');
        return response.data;
    },

    getTeamAnalytics: async () => {
        const response = await api.get('/analytics/team');
        return response.data;
    },

    getMemberAnalytics: async (id: string) => {
        const response = await api.get(`/analytics/member/${id}`);
        return response.data;
    },

    submitPerformanceReview: async (data: any) => {
        const response = await api.post('/analytics/review', data);
        return response.data;
    },

    getFinancialMetrics: async () => {
        const response = await api.get('/analytics/financials');
        return response.data;
    }
};
