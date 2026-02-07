const Idea = require('../models/Idea');
const IdeaFeedback = require('../models/IdeaFeedback');

// @desc    Get all ideas
// @route   GET /api/ideas
// @access  Private
exports.getIdeas = async (req, res) => {
    try {
        const { category, status, priority, search } = req.query;

        // Build filter
        const filter = { startup: req.user.startupId };

        if (category) filter.category = category;
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const ideas = await Idea.find(filter)
            .populate('submittedBy', 'name email role')
            .sort({ createdAt: -1 });

        res.json(ideas);
    } catch (error) {
        console.error('Get ideas error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single idea
// @route   GET /api/ideas/:id
// @access  Private
exports.getIdeaById = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id)
            .populate('submittedBy', 'name email role');

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        // Check if user has access to this idea
        if (idea.startup.toString() !== req.user.startupId.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(idea);
    } catch (error) {
        console.error('Get idea error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new idea
// @route   POST /api/ideas
// @access  Private
exports.createIdea = async (req, res) => {
    try {
        console.log('[Create Idea] Request received');
        console.log('[Create Idea] User:', req.user ? { id: req.user._id, name: req.user.name, startup: req.user.startup } : 'No user');
        console.log('[Create Idea] Body:', req.body);

        const { title, description, category, tags, priority } = req.body;

        // Validation
        if (!title || !description || !category) {
            console.log('[Create Idea] Validation failed: Missing required fields');
            return res.status(400).json({ message: 'Title, description, and category are required' });
        }

        if (!req.user) {
            console.log('[Create Idea] Auth failed: No user');
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!req.user.startupId) {
            console.log('[Create Idea] Validation failed: No startup');
            return res.status(400).json({ message: 'User must be associated with a startup to submit ideas' });
        }

        const idea = await Idea.create({
            title,
            description,
            category,
            tags: tags || [],
            priority: priority || 'medium',
            submittedBy: req.user._id,
            startup: req.user.startupId
        });

        await idea.populate('submittedBy', 'name email role');

        console.log('[Create Idea] Success:', idea._id);
        res.status(201).json(idea);
    } catch (error) {
        console.error('[Create Idea] Error:', error);
        console.error('[Create Idea] Error stack:', error.stack);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update idea
// @route   PUT /api/ideas/:id
// @access  Private (Founder only for status/priority)
exports.updateIdea = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        // Check access
        if (idea.startup.toString() !== req.user.startupId.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { title, description, category, tags, status, priority } = req.body;

        // Only founders can change status and priority
        if ((status || priority) && req.user.role !== 'founder') {
            return res.status(403).json({ message: 'Only founders can change status or priority' });
        }

        // Update allowed fields
        if (title) idea.title = title;
        if (description) idea.description = description;
        if (category) idea.category = category;
        if (tags) idea.tags = tags;
        if (status) idea.status = status;
        if (priority) idea.priority = priority;

        await idea.save();
        await idea.populate('submittedBy', 'name email role');

        res.json(idea);
    } catch (error) {
        console.error('Update idea error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete idea
// @route   DELETE /api/ideas/:id
// @access  Private (Founder or original submitter)
exports.deleteIdea = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        // Only founder or original submitter can delete
        if (req.user.role !== 'founder' && idea.submittedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await idea.deleteOne();

        res.json({ message: 'Idea deleted successfully' });
    } catch (error) {
        console.error('Delete idea error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Vote on idea
// @route   POST /api/ideas/:id/vote
// @access  Private
exports.voteOnIdea = async (req, res) => {
    try {
        const { vote } = req.body; // 'upvote' or 'downvote'
        const idea = await Idea.findById(req.params.id);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        // Initialize votingStats if missing
        if (!idea.votingStats) {
            idea.votingStats = {
                upvotes: 0,
                downvotes: 0,
                boardApprovals: 0,
                voters: []
            };
        }
        if (!idea.votingStats.voters) {
            idea.votingStats.voters = [];
        }

        // Check if user already voted
        const existingVoteIndex = idea.votingStats.voters.findIndex(
            v => v.user.toString() === req.user._id.toString()
        );

        if (existingVoteIndex !== -1) {
            // Remove old vote
            const oldVote = idea.votingStats.voters[existingVoteIndex].vote;
            if (oldVote === 'upvote') idea.votingStats.upvotes--;
            if (oldVote === 'downvote') idea.votingStats.downvotes--;

            idea.votingStats.voters.splice(existingVoteIndex, 1);
        }

        // Add new vote
        if (vote === 'upvote') {
            idea.votingStats.upvotes++;
            idea.votingStats.voters.push({ user: req.user._id, vote: 'upvote' });
        } else if (vote === 'downvote') {
            idea.votingStats.downvotes++;
            idea.votingStats.voters.push({ user: req.user._id, vote: 'downvote' });
        }

        // If board member (founder), count as board approval for upvotes
        if (vote === 'upvote' && req.user.role === 'founder') {
            idea.votingStats.boardApprovals++;
        }

        await idea.save();

        // Create vote feedback entry
        await IdeaFeedback.create({
            ideaId: idea._id,
            submittedBy: req.user._id,
            submittedByName: req.user.name,
            feedbackType: 'vote',
            vote,
            isBoardMember: req.user.role === 'founder'
        });

        res.json(idea);
    } catch (error) {
        console.error('Vote error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get AI analysis for idea
// @route   POST /api/ideas/:id/analyze
// @access  Private
exports.analyzeIdea = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id).populate('startup');

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!geminiApiKey || geminiApiKey === 'your_gemini_api_key_here') {
            return res.status(400).json({ message: 'Gemini API key not configured' });
        }

        // Build AI prompt
        const prompt = `You are a startup advisor analyzing a new idea/feature proposal.

**Company Context:**
Name: ${idea.startup?.name || 'Startup'}
Industry: ${idea.startup?.domain || 'Technology'}
Stage: ${idea.startup?.stage || 'Early stage'}

**Idea Details:**
Title: ${idea.title}
Description: ${idea.description}
Category: ${idea.category}

**Task:**
Analyze this idea and provide:

1. **Feasibility Score** (1-10): How technically viable is this?
2. **Market Potential** (1-10): Business value and market demand
3. **Technical Complexity** (1-10): Implementation difficulty
4. **Pros** (3 key benefits, be specific)
5. **Cons** (3 potential drawbacks)
6. **Risks** (2-3 main risks to consider)
7. **Recommendation**: Choose ONE: approve, needs-work, or reject
8. **Suggestions** (2-3 actionable next steps)

Format your response as JSON:
{
  "feasibility": <number>,
  "marketPotential": <number>,
  "technicalComplexity": <number>,
  "pros": ["...", "...", "..."],
  "cons": ["...", "...", "..."],
  "risks": ["...", "..."],
  "recommendation": "approve|needs-work|reject",
  "suggestions": ["...", "...", "..."],
  "summary": "Brief 2-3 sentence overall assessment"
}`;

        // Call Gemini API
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const geminiData = await geminiResponse.json();
        const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponse) {
            return res.status(500).json({ message: 'AI analysis failed' });
        }

        // Parse AI response (extract JSON from markdown code blocks if present)
        let analysis;
        try {
            const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) ||
                aiResponse.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiResponse;
            analysis = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error('AI response parse error:', parseError);
            return res.status(500).json({ message: 'Failed to parse AI response' });
        }

        // Update idea with AI analysis
        idea.aiAnalysis = {
            feasibility: analysis.feasibility || 5,
            marketPotential: analysis.marketPotential || 5,
            technicalComplexity: analysis.technicalComplexity || 5,
            pros: analysis.pros || [],
            cons: analysis.cons || [],
            risks: analysis.risks || [],
            recommendation: analysis.recommendation || 'needs-work',
            suggestions: analysis.suggestions || [],
            fullAnalysis: analysis.summary || aiResponse,
            analyzedAt: new Date()
        };

        await idea.save();

        // Create AI feedback entry with detailed, conversational feedback
        const aiCommentParts = [];

        // Add overall assessment
        if (analysis.summary) {
            aiCommentParts.push(analysis.summary);
        }

        // Add recommendation context
        if (analysis.recommendation === 'approve') {
            aiCommentParts.push("\n\n✅ **Recommendation: Approved**\nThis idea shows strong potential and aligns well with your goals.");
        } else if (analysis.recommendation === 'reject') {
            aiCommentParts.push("\n\n❌ **Recommendation: Not Recommended**\nThere are significant challenges that make this idea less viable at this time.");
        } else {
            aiCommentParts.push("\n\n⚠️ **Recommendation: Needs Work**\nThis idea has potential but requires some refinement before moving forward.");
        }

        // Add key insights
        if (analysis.pros && analysis.pros.length > 0) {
            aiCommentParts.push("\n\n**Key Strengths:**\n" + analysis.pros.map((p, i) => `${i + 1}. ${p}`).join('\n'));
        }

        if (analysis.cons && analysis.cons.length > 0) {
            aiCommentParts.push("\n\n**Areas of Concern:**\n" + analysis.cons.map((c, i) => `${i + 1}. ${c}`).join('\n'));
        }

        // Add actionable suggestions
        if (analysis.suggestions && analysis.suggestions.length > 0) {
            aiCommentParts.push("\n\n**Suggested Next Steps:**\n" + analysis.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n'));
        }

        const aiCommentContent = aiCommentParts.join('');

        await IdeaFeedback.create({
            ideaId: idea._id,
            isAI: true,
            submittedByName: 'AI Assistant',
            feedbackType: 'ai-analysis',
            content: aiCommentContent || 'AI analysis completed. Check the detailed metrics above.',
            rating: Math.round((analysis.feasibility + analysis.marketPotential) / 2)
        });

        res.json({ analysis: idea.aiAnalysis });
    } catch (error) {
        console.error('AI analysis error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = exports;
