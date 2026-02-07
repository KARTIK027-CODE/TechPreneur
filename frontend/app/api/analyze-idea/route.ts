import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { idea } = await req.json();

        if (!idea) {
            return NextResponse.json({ error: 'No idea provided' }, { status: 400 });
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!geminiApiKey || geminiApiKey === 'your_gemini_api_key_here') {
            const errorMsg = !geminiApiKey
                ? 'Gemini API key is missing from environment variables'
                : 'Gemini API key is still set to placeholder value';

            console.error(`[Idea Analyzer] Configuration Error: ${errorMsg}`);

            return NextResponse.json(
                { error: `${errorMsg}. Please check GEMINI_API_KEY in .env.local` },
                { status: 500 }
            );
        }

        const prompt = `
        You are an expert startup consultant and venture capitalist. 
        Analyze the following startup idea and provide a structured report.
        
        Startup Idea: "${idea}"

        Please analyze this idea based on the following 4 criteria:

        1. **Scalability Assessment**: 
           - Is this idea scalable? 
           - What are the potential bottlenecks?
           - Rate scalability from 1-10.

        2. **Target Audience & Helpfulness**: 
           - Who exactly is this helpful for? (Target User Persona)
           - What specific problem does it solve for them?
           - Is it a "Vitamin" (nice to have) or "Painkiller" (must have)?

        3. **Future Growth Strategy (Low Cost)**:
           - What features can be added later to make it a unicorn?
           - How can they expand without massive capital initially?

        4. **MVP Strategy (Minimal Cost)**:
           - How can this be built with $0 or minimal cost right now?
           - What is the absolute minimum feature set needed to launch?

        Format the output in clear Markdown with bold headings and bullet points. Be honest, critical but encouraging.
        `;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('[Idea Analyzer] Gemini API Error:', JSON.stringify(data, null, 2));
            return NextResponse.json(
                { error: `Gemini API Error: ${data.error?.message || response.statusText}` },
                { status: response.status }
            );
        }

        const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!analysis) {
            console.error('[Idea Analyzer] No analysis in response:', JSON.stringify(data, null, 2));
            throw new Error('Failed to generate analysis from Gemini');
        }

        return NextResponse.json({ analysis });

    } catch (error: any) {
        console.error('[Idea Analyzer] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to analyze idea. Please try again.' },
            { status: 500 }
        );
    }
}
