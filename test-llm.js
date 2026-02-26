const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

async function main() {
    try {
        console.log("Key starting with:", process.env.OPENROUTER_API_KEY?.substring(0, 10));
        const completion = await openai.chat.completions.create({
            model: 'anthropic/claude-3-haiku',
            messages: [
                { role: 'system', content: 'Return ONLY a JSON object: {"isWorking": true}' },
                { role: 'user', content: 'Test' }
            ]
        });
        console.log("Output:");
        console.log(completion.choices[0].message.content);
    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();
