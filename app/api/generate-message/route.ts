import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { studentInfo, lastInteraction, messageType } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    // Build the prompt based on message type
    let prompt = '';
    
    if (messageType === 'initial') {
      prompt = `You are a friendly and professional recruitment assistant for INTO Saint Louis University (INTO SLU).

Generate a personalized WhatsApp message for a NEW prospective international student with the following details:
- First Name: ${studentInfo.firstName}
- Country: ${studentInfo.country}
- Program of Interest: ${studentInfo.program}
- Status: ${studentInfo.status}

Guidelines:
- Keep it warm, conversational, and welcoming
- Use their first name
- Reference their country and program
- Be concise (2-3 sentences max)
- End with an engaging question or call-to-action
- Use emojis sparingly (1-2 max)
- Focus on building rapport and offering help

DO NOT include:
- Email addresses
- Phone numbers
- Formal signatures
- Any personally identifiable information

Generate ONLY the message text, nothing else.`;
    } else {
      // Follow-up message
      prompt = `You are a friendly and professional recruitment assistant for INTO Saint Louis University (INTO SLU).

Generate a personalized FOLLOW-UP WhatsApp message for a prospective international student with the following details:
- First Name: ${studentInfo.firstName}
- Country: ${studentInfo.country}
- Program of Interest: ${studentInfo.program}
- Status: ${studentInfo.status}

PREVIOUS INTERACTION:
${lastInteraction || 'No previous interaction recorded'}

Guidelines:
- Reference the previous interaction naturally
- Keep it warm and conversational
- Show continuity in the conversation
- Be concise (2-3 sentences max)
- Provide value (answer questions, offer next steps, share relevant info)
- End with an engaging question or call-to-action
- Use emojis sparingly (1-2 max)

DO NOT include:
- Email addresses
- Phone numbers
- Formal signatures
- Any personally identifiable information

Generate ONLY the message text, nothing else.`;
    }

    // Generate message using Gemini
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt,
    });

    return NextResponse.json({ message: text.trim() });
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate message' },
      { status: 500 }
    );
  }
}
