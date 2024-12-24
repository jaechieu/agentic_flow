import { ProcessedPDFData } from "../types/types";

export async function processPDF(
  file: File, 
  numberOfPeople: number = 90,
  numberOfNights: number = 3,
  numberOfBreakoutRooms: number = 3
): Promise<ProcessedPDFData> {
  const LAMBDA_URL = 'https://lnwmc5tn5p4lwzq3hep3biv5du0ghkzy.lambda-url.us-east-1.on.aws/';
  
  const base64Data = await fileToBase64(file);
  
  try {
    const response = await fetch(LAMBDA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pdf_base64: base64Data,
        number_of_people: numberOfPeople,
        number_of_nights: numberOfNights,
        number_of_breakout_rooms: numberOfBreakoutRooms
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to process PDF');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  }
}

// Helper function to convert File to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
} 