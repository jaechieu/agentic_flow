import base64
import pdfplumber
import json
import openai

# Initialize OpenAI client
openai.api_key = "your-api-key-here"

# Helper: Standard CORS headers
def get_cors_headers(event):
    origin = event.get('headers', {}).get('origin', 'http://localhost:3000')
    return {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    }

def create_response(event, status_code, body):
    headers = {
        **get_cors_headers(event),
        'Content-Type': 'application/json'
    }
    return {
        "statusCode": status_code,
        "headers": headers,
        "body": json.dumps(body)
    }

def decode_pdf(pdf_base64, output_path):
    try:
        with open(output_path, "wb") as input_file:
            input_file.write(base64.b64decode(pdf_base64))
    except Exception as e:
        raise ValueError(f"Failed to decode PDF: {str(e)}")

def extract_pdf_text(pdf_path):
    try:
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                text += f"Page {i + 1}:\n{page_text}\n\n"
                
                # Extract tables
                tables = page.extract_tables()
                for j, table in enumerate(tables):
                    for row in table:
                        text += f"Table {j + 1} row: {str(row)}\n"
        return text
    except Exception as e:
        raise ValueError(f"Error processing the PDF: {str(e)}")

def process_with_gpt(text):
    system_prompt_template = f"""
    You are a helpful assistant. I have extracted text and data from a PDF document. Please process the following:

    I need the following information extracted from the document, formatted as valid JSON with no extra explanation or comments:

    {{
        "meeting_room_cost_per_person": double,
        "sleeping_room_cost_per_night": double,
        "breakout_room_cost_per_person": double
    }}

    Replace 'double' with the appropriate numeric values extracted from the document. You must choose a value from the Document Content. If there is tax or additional fees included, factor them in as well. Do not include any extra text. Make sure your output is valid JSON with no extra special characters.

    Document Content:
    {text}
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": system_prompt_template},
            ],
            max_tokens=300,
            temperature=0.0,
        )

        response_content = (
            response["choices"][0]["message"]["content"]
            .strip()
            .replace("`", "")
            .replace("json", "")
        )
        
        return json.loads(response_content)
    except Exception as e:
        raise ValueError(f"Error processing with GPT: {str(e)}")

def lambda_handler(event, context):
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        return create_response(event, 200, "")

    input_path = "/tmp/input.pdf"

    try:
        # Parse request body
        body = event.get("body", "{}")
        body_json = json.loads(body)
        pdf_base64 = body_json.get("pdf_base64")
        number_of_people = body_json.get("number_of_people", 90)  # Default values
        number_of_nights = body_json.get("number_of_nights", 3)
        number_of_breakout_rooms = body_json.get("number_of_breakout_rooms", 3)

        if not pdf_base64:
            return create_response(event, 400, {"error": "No PDF file provided in the payload"})

        # Process PDF
        decode_pdf(pdf_base64, input_path)
        text = extract_pdf_text(input_path)
        
        # Get GPT analysis
        extracted_data = process_with_gpt(text)

        # Calculate quotes
        extracted_data["meeting_room_quote"] = (
            number_of_people * extracted_data["meeting_room_cost_per_person"]
        )
        extracted_data["sleeping_room_quote"] = (
            number_of_people * number_of_nights * extracted_data["sleeping_room_cost_per_night"]
        )
        extracted_data["breakout_room_quote"] = (
            number_of_breakout_rooms * extracted_data["breakout_room_cost_per_person"]
        )
        extracted_data["total_quote"] = (
            extracted_data["meeting_room_quote"] + 
            extracted_data["sleeping_room_quote"] + 
            extracted_data["breakout_room_quote"]
        )

        return create_response(event, 200, {
            "message": "Processing complete.",
            "data": extracted_data
        })
    except Exception as e:
        return create_response(event, 500, {"error": f"Error processing data: {str(e)}"}) 