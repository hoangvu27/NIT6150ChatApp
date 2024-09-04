import json
import requests

def lambda_handler(event, context):
    # Print the received event for debugging purposes
    print("Received event:", event)

    # Extract the reCAPTCHA token from the event
    token = None
    try:
        # Assuming the token might be in a JSON body format
        if 'body' in event:
            body = json.loads(event['body'])
            token = body.get('token')
        else:
            # Directly extract the token from a field named 'response'
            token = event.get('response')

        # Handle missing token case
        if not token:
            print("Error: Missing reCAPTCHA token")
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing reCAPTCHA token'})
            }

        # Define the secret key
        secret_key = '6LclhzUqAAAAAORiNPwo1yp0srj0Kli9cpNfesg9'

        # Send the token to Google's verification service
        response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data={
                'secret': secret_key,
                'response': token
            }
        )

        # Parse the response from Google
        result = response.json()
        print("Verification result:", result)

        # Check if the verification was successful
        if result.get('success'):
            print("inside success")
            return {
                'statusCode': 200,
                'body': json.dumps({'success': True})
            }
        else:
            return {
                'statusCode': 403,
                'body': json.dumps({
                    'success': False,
                    'error-codes': result.get('error-codes')
                })
            }

    except Exception as e:
        print("Exception occurred:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error'})
        }
