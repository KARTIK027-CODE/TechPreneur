import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();

        if (!query) {
            return NextResponse.json({ error: 'No query provided' }, { status: 400 });
        }

        // Get token from request headers
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        // Initialize comprehensive startup stats with DETAILED information
        const stats = {
            companyName: 'Your Startup',
            teamSize: 0,
            teamMembers: [] as any[],
            burnRate: 0,
            domain: '',
            stage: '',
            tasks: {
                total: 0,
                completed: 0,
                pending: 0,
                inProgress: 0,
                completionRate: 0,
                recentTasks: [] as any[]
            },
            milestones: {
                total: 0,
                completed: 0,
                completionRate: 0,
                list: [] as any[]
            },
            feedback: {
                score: 'N/A',
                totalFeedback: 0
            },
            departments: [] as string[]
        };

        // Fetch comprehensive data if authenticated
        if (token) {
            try {
                const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

                // Fetch startup profile
                const startupResponse = await fetch(`${backendUrl}/api/startup/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (startupResponse.ok) {
                    const startupData = await startupResponse.json();
                    console.log('[Voice Assistant] Startup Data:', JSON.stringify(startupData, null, 2));

                    stats.companyName = startupData.name || 'Your Startup';
                    stats.domain = startupData.domain || '';
                    stats.stage = startupData.stage || '';
                    stats.burnRate = startupData.burnRate || 0;

                    // Extract DETAILED team member information
                    if (startupData.teamMembers && Array.isArray(startupData.teamMembers)) {
                        stats.teamMembers = startupData.teamMembers.map((member: any) => ({
                            name: member.name,
                            email: member.email,
                            role: member.role,
                            department: member.department
                        }));
                        stats.teamSize = stats.teamMembers.length;

                        // Extract unique departments
                        stats.departments = [...new Set(stats.teamMembers.map((m: any) => m.department).filter(Boolean))];
                    }

                    // Get milestones from startup data
                    if (startupData.milestones && Array.isArray(startupData.milestones)) {
                        stats.milestones.list = startupData.milestones;
                        stats.milestones.total = startupData.milestones.length;
                        stats.milestones.completed = startupData.milestones.filter((m: any) => m.status === 'completed').length;
                        stats.milestones.completionRate = stats.milestones.total > 0
                            ? Math.round((stats.milestones.completed / stats.milestones.total) * 100)
                            : 0;
                    }
                }

                // Fetch tasks
                const tasksResponse = await fetch(`${backendUrl}/api/tasks/tasks`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (tasksResponse.ok) {
                    const tasksData = await tasksResponse.json();

                    stats.tasks.total = tasksData.length;
                    stats.tasks.completed = tasksData.filter((t: any) => t.status === 'completed').length;
                    stats.tasks.pending = tasksData.filter((t: any) => t.status === 'todo').length;
                    stats.tasks.inProgress = tasksData.filter((t: any) => t.status === 'in_progress').length;
                    stats.tasks.completionRate = stats.tasks.total > 0
                        ? Math.round((stats.tasks.completed / stats.tasks.total) * 100)
                        : 0;

                    // Store recent tasks with details
                    stats.tasks.recentTasks = tasksData.slice(0, 5).map((t: any) => ({
                        title: t.title,
                        status: t.status,
                        priority: t.priority,
                        assignedTo: t.assignedTo?.name || 'Unassigned'
                    }));
                }

                // Fetch feedback
                const feedbackResponse = await fetch(`${backendUrl}/api/feedback`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (feedbackResponse.ok) {
                    const feedbackData = await feedbackResponse.json();
                    stats.feedback.totalFeedback = feedbackData.length || 0;
                    if (feedbackData.length > 0) {
                        const avgRating = feedbackData.reduce((sum: number, f: any) => sum + (f.rating || 0), 0) / feedbackData.length;
                        stats.feedback.score = avgRating.toFixed(1);
                    }
                }

                console.log('[Voice Assistant] FINAL Stats:', JSON.stringify(stats, null, 2));

            } catch (error) {
                console.error('[Voice Assistant] Error:', error);
            }
        }

        // Use demo data if not authenticated
        if (!token) {
            stats.companyName = 'Demo Startup';
            stats.teamSize = 2;
            stats.teamMembers = [{ name: 'Demo User 1', email: 'demo1@example.com', role: 'Founder', department: 'Business' }];
            stats.burnRate = 10000;
        }

        // Use Gemini API if available
        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!geminiApiKey || geminiApiKey === 'your_gemini_api_key_here') {
            const answer = generateFallbackResponse(query, stats);
            console.log('[Voice Assistant] Fallback Response:', answer);
            return NextResponse.json({ answer });
        }

        // Create DETAILED and STRUCTURED AI context
        const teamMembersList = stats.teamMembers.length > 0
            ? stats.teamMembers.map((m: any, index: number) =>
                `${index + 1}. ${m.name} - Email: ${m.email} - Role: ${m.role}${m.department ? ` - Department: ${m.department}` : ''}`
            ).join('\n')
            : 'No team members added yet.';

        const recentTasksList = stats.tasks.recentTasks.length > 0
            ? stats.tasks.recentTasks.map((t: any, index: number) =>
                `${index + 1}. "${t.title}" - Status: ${t.status} - Priority: ${t.priority} - Assigned to: ${t.assignedTo}`
            ).join('\n')
            : 'No tasks created yet.';

        const context = `You are a professional AI assistant for VentureX startup management platform.
User is addressing you about their startup. Be concise, accurate, and use "sir" or "ma'am".

=== STARTUP: ${stats.companyName} ===

BASIC INFO:
- Company Name: ${stats.companyName}
- Industry: ${stats.domain || 'Not specified'}
- Stage: ${stats.stage || 'Not specified'}
- Monthly Burn Rate: $${stats.burnRate.toLocaleString()}

TEAM (${stats.teamSize} members total):
${teamMembersList}

Departments: ${stats.departments.length > 0 ? stats.departments.join(', ') : 'None'}

TASKS BREAKDOWN (${stats.tasks.total} total):
- ✅ Completed: ${stats.tasks.completed}
- 🔄 In Progress: ${stats.tasks.inProgress}
- ⏳ Pending: ${stats.tasks.pending}
- 📊 Completion Rate: ${stats.tasks.completionRate}%

Recent/Active Tasks:
${recentTasksList}

MILESTONES:
- Total: ${stats.milestones.total}
- Completed: ${stats.milestones.completed}
- Progress: ${stats.milestones.completionRate}%

FEEDBACK:
- Average Rating: ${stats.feedback.score}/5
- Total Responses: ${stats.feedback.totalFeedback}

=== USER QUESTION ===
"${query}"

=== INSTRUCTIONS ===
1. Answer ONLY using the EXACT data provided above
2. If asked about people, use their ACTUAL names from the team list
3. If asked about tasks, reference the ACTUAL task titles shown
4. If asked about numbers, use the EXACT numbers shown 
5. Be concise (1-2 sentences max)
6. Address the user as "sir" or "ma'am"
7. If the question is about something not in the data, say so clearly

Your answer:`;

        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: context }] }]
                })
            }
        );

        const geminiData = await geminiResponse.json();
        const answer = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
            generateFallbackResponse(query, stats);

        console.log('[Voice Assistant] AI Response:', answer);
        return NextResponse.json({ answer });

    } catch (error) {
        console.error('[Voice Assistant] Error:', error);
        return NextResponse.json(
            { answer: 'I apologize, but I encountered an error. Please try again.' },
            { status: 200 }
        );
    }
}

// ENHANCED fallback responses with comprehensive question matching
function generateFallbackResponse(query: string, stats: any): string {
    const lowerQuery = query.toLowerCase();

    // ============ TEAM MEMBER QUESTIONS ============

    // "Who are my team members?" / "List team members" / "Show me my team"
    if (
        (lowerQuery.includes('who') && (lowerQuery.includes('team') || lowerQuery.includes('member'))) ||
        (lowerQuery.includes('list') && lowerQuery.includes('team')) ||
        (lowerQuery.includes('show') && lowerQuery.includes('team'))
    ) {
        if (stats.teamMembers.length === 0) {
            return `You have no team members added yet, sir.`;
        }
        const names = stats.teamMembers.map((m: any) => m.name).join(', ');
        return `Your team consists of ${stats.teamSize} members: ${names}, sir.`;
    }

    // "How many employees?" / "Team size" / "Number of team members"
    if (
        (lowerQuery.includes('how many') && (lowerQuery.includes('employee') || lowerQuery.includes('team') || lowerQuery.includes('member'))) ||
        lowerQuery.includes('team size') ||
        (lowerQuery.includes('number of') && lowerQuery.includes('team'))
    ) {
        if (stats.teamMembers.length === 0) {
            return `You currently have no team members in ${stats.companyName}, sir.`;
        }
        return `You have ${stats.teamSize} team members, sir.`;
    }

    // General team/employee mention
    if (lowerQuery.includes('employee') || lowerQuery.includes('team member')) {
        if (stats.teamMembers.length === 0) {
            return `${stats.companyName} has no team members yet, sir.`;
        }
        const names = stats.teamMembers.map((m: any) => m.name).join(', ');
        return `${stats.companyName} has ${stats.teamSize} team members: ${names}, sir.`;
    }

    // ============ DEPARTMENT QUESTIONS ============
    // ============ ROLE-BASED QUESTIONS ============

    // "Who is the founder?" / "Who founded the company?"
    if (
        (lowerQuery.includes('who') && lowerQuery.includes('founder')) ||
        (lowerQuery.includes('who') && lowerQuery.includes('founded'))
    ) {
        const founders = stats.teamMembers.filter((m: any) => m.role?.toLowerCase() === 'founder');
        if (founders.length === 0) {
            return `No founder is listed yet, sir.`;
        }
        const founderNames = founders.map((f: any) => f.name).join(' and ');
        return `${founderNames} ${founders.length > 1 ? 'are' : 'is'} the founder${founders.length > 1 ? 's' : ''}, sir.`;
    }

    // "Who is handling [department]?" / "Who is in [department]?" / "Who leads [department]?"
    if (
        (lowerQuery.includes('who') && (lowerQuery.includes('handling') || lowerQuery.includes(' in ') || lowerQuery.includes('leads') || lowerQuery.includes('heading') || lowerQuery.includes('managing'))) &&
        (lowerQuery.includes('department') || lowerQuery.includes('business') || lowerQuery.includes('marketing') || lowerQuery.includes('development') || lowerQuery.includes('sales') || lowerQuery.includes('operations') || lowerQuery.includes('finance') || lowerQuery.includes('hr') || lowerQuery.includes('product'))
    ) {
        // Extract department name from query
        const departmentKeywords = ['business', 'marketing', 'development', 'sales', 'operations', 'finance', 'hr', 'product'];
        const foundDept = departmentKeywords.find(dept => lowerQuery.includes(dept));

        if (foundDept) {
            const deptMembers = stats.teamMembers.filter((m: any) =>
                m.department?.toLowerCase() === foundDept.toLowerCase()
            );

            if (deptMembers.length === 0) {
                return `No one is assigned to the ${foundDept.charAt(0).toUpperCase() + foundDept.slice(1)} department yet, sir.`;
            }

            const memberNames = deptMembers.map((m: any) => m.name).join(' and ');
            return `${memberNames} ${deptMembers.length > 1 ? 'are' : 'is'} handling the ${foundDept.charAt(0).toUpperCase() + foundDept.slice(1)} department, sir.`;
        }
    }

    // ============ DEPARTMENT QUESTIONS (general) ============

    if (lowerQuery.includes('department') && !lowerQuery.includes('who')) {
        if (stats.departments.length === 0) {
            return `You have no departments set up yet, sir.`;
        }
        return `You have ${stats.departments.length} departments: ${stats.departments.join(', ')}, sir.`;
    }

    // ============ TASK QUESTIONS ============

    // "What tasks are pending?" / "Pending tasks"
    if (lowerQuery.includes('pending') && lowerQuery.includes('task')) {
        if (stats.tasks.total === 0) {
            return `You have no tasks created yet, sir.`;
        }
        if (stats.tasks.pending === 0) {
            return `You have no pending tasks. All ${stats.tasks.total} tasks are either in progress or completed, sir.`;
        }
        return `You have ${stats.tasks.pending} pending tasks out of ${stats.tasks.total} total, sir.`;
    }

    // "How many tasks?" / "Total tasks"
    if (
        (lowerQuery.includes('how many') && lowerQuery.includes('task')) ||
        (lowerQuery.includes('total') && lowerQuery.includes('task'))
    ) {
        if (stats.tasks.total === 0) {
            return `You have no tasks yet, sir.`;
        }
        return `You have ${stats.tasks.total} total tasks: ${stats.tasks.completed} completed, ${stats.tasks.inProgress} in progress, and ${stats.tasks.pending} pending, sir.`;
    }

    // General task mention
    if (lowerQuery.includes('task')) {
        if (stats.tasks.total === 0) {
            return `You have no tasks created yet, sir. You can create your first task to get started.`;
        }
        return `You have ${stats.tasks.total} tasks: ${stats.tasks.completed} completed (${stats.tasks.completionRate}%), ${stats.tasks.inProgress} in progress, and ${stats.tasks.pending} pending, sir.`;
    }

    // ============ PROGRESS/COMPLETION QUESTIONS ============

    if (
        lowerQuery.includes('completion') ||
        lowerQuery.includes('progress') ||
        (lowerQuery.includes('how') && lowerQuery.includes('doing'))
    ) {
        if (stats.tasks.total === 0) {
            return `You haven't created any tasks yet, sir.`;
        }
        return `Your task completion rate is ${stats.tasks.completionRate}%. You've completed ${stats.tasks.completed} out of ${stats.tasks.total} tasks, sir.`;
    }

    // ============ FINANCIAL QUESTIONS ============

    if (
        lowerQuery.includes('burn rate') ||
        lowerQuery.includes('spending') ||
        lowerQuery.includes('money') ||
        lowerQuery.includes('expense')
    ) {
        if (stats.burnRate === 0) {
            return `Your burn rate is not set yet, sir.`;
        }
        return `Your monthly burn rate is $${stats.burnRate.toLocaleString()}, sir.`;
    }

    // ============ MILESTONE QUESTIONS ============

    if (lowerQuery.includes('milestone')) {
        if (stats.milestones.total === 0) {
            return `You have no milestones set yet, sir. You can create milestones to track major goals.`;
        }
        return `You have ${stats.milestones.total} milestones: ${stats.milestones.completed} completed and ${stats.milestones.total - stats.milestones.completed} in progress. That's ${stats.milestones.completionRate}% completion, sir.`;
    }

    // ============ FEEDBACK QUESTIONS ============

    if (lowerQuery.includes('feedback') || lowerQuery.includes('rating') || lowerQuery.includes('review')) {
        if (stats.feedback.totalFeedback === 0) {
            return `You haven't received any feedback yet, sir.`;
        }
        return `Your average feedback score is ${stats.feedback.score} out of 5, based on ${stats.feedback.totalFeedback} responses, sir.`;
    }

    // ============ COMPANY/STARTUP QUESTIONS ============

    if (
        lowerQuery.includes('company name') ||
        lowerQuery.includes('startup name') ||
        (lowerQuery.includes('what') && lowerQuery.includes('company'))
    ) {
        return `Your company name is ${stats.companyName}, sir.`;
    }

    if (
        lowerQuery.includes('company info') ||
        lowerQuery.includes('startup info') ||
        lowerQuery.includes('about company') ||
        lowerQuery.includes('tell me about')
    ) {
        const domainInfo = stats.domain ? ` in the ${stats.domain} industry` : '';
        const stageInfo = stats.stage ? `, currently in ${stats.stage.replace('_', ' ')} stage` : '';
        return `${stats.companyName} is your startup${domainInfo}${stageInfo} with ${stats.teamSize} team members, sir.`;
    }

    // ============ OVERVIEW/SUMMARY QUESTIONS ============

    if (
        lowerQuery.includes('overview') ||
        lowerQuery.includes('summary') ||
        lowerQuery.includes('status') ||
        (lowerQuery.includes('give me') && lowerQuery.includes('report'))
    ) {
        const teamInfo = stats.teamMembers.length > 0
            ? `${stats.teamSize} team members (${stats.teamMembers.map((m: any) => m.name).join(', ')})`
            : 'no team members yet';

        const taskInfo = stats.tasks.total > 0
            ? `${stats.tasks.total} tasks with ${stats.tasks.completionRate}% completion`
            : 'no tasks yet';

        return `${stats.companyName} currently has ${teamInfo}, ${taskInfo}, and a monthly burn rate of $${stats.burnRate.toLocaleString()}, sir.`;
    }

    // ============ GREETINGS ============

    if (
        lowerQuery.includes('hello') ||
        lowerQuery.includes('hi ') ||
        lowerQuery.includes('hey') ||
        lowerQuery === 'hi' ||
        lowerQuery === 'hello'
    ) {
        return `Hello sir! I'm your VentureX assistant for ${stats.companyName}. How can I help you today?`;
    }

    // ============ HELP/CAPABILITIES ============

    if (
        lowerQuery.includes('help') ||
        lowerQuery.includes('what can you do') ||
        lowerQuery.includes('how can you help')
    ) {
        return `I can help you with information about ${stats.companyName}. Ask me about team members, tasks, milestones, departments, burn rate, or request an overview of your startup, sir.`;
    }

    // ============ DEFAULT FALLBACK ============

    return `I can provide information about ${stats.companyName}. Try asking: "Who are my team members?", "How many tasks do I have?", "What's my burn rate?", or "Give me an overview", sir.`;
}
