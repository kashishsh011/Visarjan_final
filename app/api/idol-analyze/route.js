import { analyzeIdolImage } from '@/lib/gemini';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image');

        if (!file) {
            return Response.json({ error: 'No image provided' }, { status: 400 });
        }

        if (file.size > 4 * 1024 * 1024) {
            return Response.json({ error: 'Image too large. Max 4MB.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString('base64');
        const mimeType = file.type;

        const result = await analyzeIdolImage(base64, mimeType);

        return Response.json(result);

    } catch (error) {
        console.error('Gemini analyze error:', error);
        return Response.json(
            { error: 'Analysis failed. Please try again.' },
            { status: 500 }
        );
    }
}