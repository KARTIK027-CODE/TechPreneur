const Startup = require('../models/Startup');
const User = require('../models/User');

// @desc    Create startup profile
// @route   POST /api/startup/create
// @access  Private (Founder only)
const createStartup = async (req, res) => {
    try {
        const { name, domain, stage, vision, problemStatement, solution } = req.body;

        // Check if user already has a startup
        if (req.user.startupId) {
            return res.status(400).json({ message: 'You already have a startup profile' });
        }

        // Create startup
        const startup = await Startup.create({
            name,
            domain,
            stage,
            vision,
            problemStatement,
            solution,
            founderId: req.user._id,
            teamMembers: [req.user._id],
        });

        // Update user with startup ID and set role to founder
        await User.findByIdAndUpdate(req.user._id, {
            startupId: startup._id,
            role: 'founder',
        });

        res.status(201).json(startup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get startup profile
// @route   GET /api/startup/profile
// @access  Private
const getStartupProfile = async (req, res) => {
    try {
        const startup = await Startup.findById(req.user.startupId)
            .populate('founderId', 'name email')
            .populate('teamMembers', 'name email role department managerId');

        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        res.json(startup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update startup profile
// @route   PUT /api/startup/update
// @access  Private (Founder only)
const updateStartup = async (req, res) => {
    try {
        const startup = await Startup.findById(req.user.startupId);

        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        // Check if user is the founder
        if (startup.founderId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only founder can update startup profile' });
        }

        const { name, domain, stage, vision, problemStatement, solution } = req.body;

        startup.name = name || startup.name;
        startup.domain = domain || startup.domain;
        startup.stage = stage || startup.stage;
        startup.vision = vision || startup.vision;
        startup.problemStatement = problemStatement || startup.problemStatement;
        startup.solution = solution || startup.solution;

        const updatedStartup = await startup.save();

        res.json(updatedStartup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add team member
// @route   POST /api/startup/add-member
// @access  Private (Founder only)
const addTeamMember = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;

        const startup = await Startup.findById(req.user.startupId);

        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        // Determine department based on user role
        let assignedDepartment = department;
        if (req.user.role === 'team_member') {
            // Team members can only add to their own department
            assignedDepartment = req.user.department;
            if (department && department !== req.user.department) {
                return res.status(403).json({ message: 'You can only add members to your own department' });
            }
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            // If user exists, just add them to the startup
            if (user.startupId) {
                return res.status(400).json({ message: 'User already belongs to a startup' });
            }

            user.startupId = startup._id;
            if (assignedDepartment) user.department = assignedDepartment;
            if (req.user.role === 'team_member') {
                user.managerId = req.user._id;
            }
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                password: password || 'defaultPassword123',
                role: 'team_member',
                department: assignedDepartment || null,
                startupId: startup._id,
                managerId: req.user.role === 'team_member' ? req.user._id : null,
            });
        }

        // Add to team members array
        if (!startup.teamMembers.includes(user._id)) {
            startup.teamMembers.push(user._id);
            await startup.save();
        }

        res.status(201).json({
            message: 'Team member added successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove team member
// @route   DELETE /api/startup/remove-member/:userId
// @access  Private (Founder only)
const removeTeamMember = async (req, res) => {
    try {
        const { userId } = req.params;

        const startup = await Startup.findById(req.user.startupId);

        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        // Cannot remove founder
        if (userId === startup.founderId.toString()) {
            return res.status(400).json({ message: 'Cannot remove founder' });
        }

        // Remove from team members
        startup.teamMembers = startup.teamMembers.filter(
            (memberId) => memberId.toString() !== userId
        );

        await startup.save();

        // Update user
        await User.findByIdAndUpdate(userId, {
            startupId: null,
        });

        res.json({ message: 'Team member removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createStartup,
    getStartupProfile,
    updateStartup,
    addTeamMember,
    removeTeamMember,
};
