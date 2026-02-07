export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'founder' | 'team_member';
    startupId?: string;
    department?: string | null;
    managerId?: string | null;
}

export interface Startup {
    _id: string;
    name: string;
    domain: string;
    stage: 'ideation' | 'mvp' | 'beta' | 'early_traction';
    vision?: string;
    problemStatement?: string;
    solution?: string;
    founderId: string;
    teamMembers: User[];
    createdAt: string;
    updatedAt: string;
}

export interface Milestone {
    _id: string;
    startupId: string;
    title: string;
    description?: string;
    targetDate?: string;
    status: 'pending' | 'in_progress' | 'completed';
    completedAt?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    _id: string;
    milestoneId: string;
    startupId: string;
    title: string;
    description?: string;
    assignedTo?: User;
    status: 'todo' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    completedAt?: string;
    createdBy: User;
    createdAt: string;
    updatedAt: string;
    milestoneId_populated?: Milestone;
}

export interface Feedback {
    _id: string;
    startupId: string;
    type: 'internal' | 'external';
    source?: string;
    feedbackText: string;
    rating?: number;
    category?: 'idea' | 'execution' | 'product' | 'market';
    submittedBy?: User;
    submittedByName?: string;
    createdAt: string;
}

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

export interface Insight {
    type: 'success' | 'warning' | 'info';
    title: string;
    message: string;
}

export interface Pitch {
    problem: string;
    solution: string;
    market: {
        domain: string;
        stage: string;
        description: string;
    };
    traction: {
        tasksCompleted: number;
        totalTasks: number;
        completionRate: string;
        milestonesAchieved: number;
        feedbackScore: string;
        feedbackCount: number;
        summary: string;
    };
    team: Array<{
        name: string;
        role: string;
        email: string;
    }>;
    roadmap: Array<{
        title: string;
        description?: string;
        targetDate?: string;
    }>;
    vision: string;
}
