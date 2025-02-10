import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { NODE_TYPES } from '@/constants/nodeTypes';

const NODE_TYPE_LIST = NODE_TYPES.map(t => t.id).join(', ');

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not configured');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    console.log('Processing message:', message);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a JSON-only API that extracts workflow steps. 
          Return ONLY valid JSON matching this exact format, with no additional text:
          {
            "steps": [
              {
                "id": string,
                "label": string,
                "type": one of [${NODE_TYPE_LIST}],
                "dependencies": string[]
              }
            ]
          }

          Example output:
          {
            "steps": [
              {"id": "1", "label": "Scrape Properties", "type": "scraper", "dependencies": []},
              {"id": "2", "label": "Send to Sheets", "type": "sheets", "dependencies": ["1"]}
            ]
          }`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.0,
    });

    try {
      const result = JSON.parse(response.choices[0].message.content || '{}');
      console.log('OpenAI response:', result);
      return NextResponse.json(result);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }

  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process workflow' }, 
      { status: 500 }
    );
  }
} 