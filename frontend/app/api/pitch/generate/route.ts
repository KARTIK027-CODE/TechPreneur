import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { pitchType, startupData, userData } = await req.json();

        if (!pitchType) {
            return NextResponse.json({ error: 'Pitch type is required' }, { status: 400 });
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!geminiApiKey || geminiApiKey === 'your_gemini_api_key_here') {
            // Fallback to basic template if no API key
            const pitch = generateFallbackPitch(pitchType, startupData, userData);
            return NextResponse.json({ pitch });
        }

        // Prepare context for Gemini AI
        const context = buildAIContext(pitchType, startupData, userData);

        // Call Gemini API
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
        const aiPitch = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
            generateFallbackPitch(pitchType, startupData, userData);

        return NextResponse.json({ pitch: aiPitch });

    } catch (error) {
        console.error('[Pitch Generator] Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate pitch' },
            { status: 500 }
        );
    }
}

function buildAIContext(pitchType: string, startupData: any, userData: any): string {
    const companyName = startupData?.name || 'Our Startup';
    const domain = startupData?.domain || 'technology';
    const stage = startupData?.stage || 'early stage';
    const problem = startupData?.problemStatement || 'a significant market pain point';
    const solution = startupData?.solution || 'an innovative solution';
    const vision = startupData?.vision || 'transforming the industry';
    const teamSize = startupData?.teamMembers?.length || 1;
    const founderName = userData?.name || 'Founder';

    if (pitchType === 'elevator') {
        return `You are a professional pitch writer. Create a compelling 30-second ELEVATOR PITCH for the following startup.

STARTUP INFORMATION:
- Company Name: ${companyName}
- Industry: ${domain}
- Stage: ${stage}
- Problem: ${problem}
- Solution: ${solution}
- Vision: ${vision}
- Team Size: ${teamSize} members

REQUIREMENTS:
1. Must be 60-80 words (exactly 30 seconds when spoken)
2. Follow the structure: Problem → Solution → Unique Value → Traction/Vision
3. Make it punchy, memorable, and conversational
4. Use active voice and powerful words
5. End with a clear ask or hook

Write ONLY the pitch text, no explanations or meta-commentary.`;
    }

    if (pitchType === 'investor') {
        return `You are an expert at crafting investor pitch decks. Create a compelling INVESTOR PITCH NARRATIVE for the following startup.

STARTUP INFORMATION:
- Company Name: ${companyName}
- Industry: ${domain}
- Stage: ${stage}
- Problem: ${problem}
- Solution: ${solution}
- Vision: ${vision}
- Team Size: ${teamSize} members
- Founder: ${founderName}

REQUIREMENTS:
1. Use markdown formatting with clear sections
2. Include these sections: Problem, Solution, Market Opportunity, Traction, Business Model, Team, Ask
3. Make it data-driven and compelling
4. Highlight competitive advantages
5. End with a clear funding ask

Format with **bold headers** and bullet points where appropriate.`;
    }

    if (pitchType === 'email') {
        return `You are an expert at writing high-conversion cold outreach emails. Create a COLD EMAIL for the following startup.

STARTUP INFORMATION:
- Company Name: ${companyName}
- Industry: ${domain}
- Problem: ${problem}
- Solution: ${solution}
- Founder: ${founderName}

REQUIREMENTS:
1. Subject line that gets opened (personalized, intriguing)
2. Email body: 100-150 words max
3. Personalized opening line
4. Clear value proposition in 1-2 sentences
5. Social proof or credibility signal
6. Specific, low-friction call-to-action
7. Professional signature

Format:
Subject: [compelling subject]

[Email body]

[Signature]`;
    }

    return '';
}

function generateFallbackPitch(pitchType: string, startupData: any, userData: any): string {
    const companyName = startupData?.name || 'Our Startup';
    const problem = startupData?.problemStatement || 'a significant market pain point';
    const solution = startupData?.solution || 'an innovative solution';
    const vision = startupData?.vision || 'transforming the industry';
    const founderName = userData?.name || 'Founder';
    const domain = startupData?.domain || 'tech';
    const stage = startupData?.stage || 'early';

    if (pitchType === 'elevator') {
        return `${companyName} solves ${problem} with ${solution}. We're ${stage} stage in the ${domain} space and our vision is ${vision}. We're looking for strategic partners to help us scale.`;
    }

    if (pitchType === 'investor') {
        return `**Problem**: ${problem}

**Solution**: ${companyName} - ${solution}

**Market**: Targeting the ${domain} industry with massive growth potential.

**Traction**: Currently in ${stage} stage with strong early validation.

**Business Model**: B2B SaaS with subscription revenue.

**Team**: Led by ${founderName} with ${startupData?.teamMembers?.length || 1} team members.

**Ask**: Raising capital to scale operations and accelerate growth.`;
    }

    if (pitchType === 'email') {
        return `Subject: Solving ${problem}

Hi there,

I noticed you may be dealing with ${problem}. I'm ${founderName}, founder of ${companyName}, and we've built ${solution}.

We're seeing strong traction in the ${domain} space and I believe this could add significant value for you.

Would you be open to a quick 10-minute call this week?

Best,
${founderName}
${companyName}`;
    }

    return '';
}
