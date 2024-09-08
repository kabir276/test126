import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {

    try {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const extractedText = await extractTextFromPDF(buffer);

      const response = new NextResponse(extractedText, {
        status: 200,
        headers: {
          'Content-Disposition': `attachment; filename="extracted_text.txt"`,
          'Content-Type': 'text/plain',
        },
      });

      return response;

    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ error: 'An error occurred while processing the PDF' }, { status: 500 });
    }
  } else {
    return NextResponse.json("Error adding data to spreadsheet");

  }
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
}