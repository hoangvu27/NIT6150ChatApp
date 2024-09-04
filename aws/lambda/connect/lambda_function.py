import json
import boto3

# Set up DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('WebSocketConnections')

def lambda_handler(event, context):
    try:
        # Log the incoming event for debugging
        print(f"Event received: {json.dumps(event)}")
        
        connection_id = event['requestContext']['connectionId']
        
        # Save the connection ID to DynamoDB
        table.put_item(
            Item={
                'connectionId': connection_id,
                'timestamp': int(context.get_remaining_time_in_millis())
            }
        )
        
        print(f"Successfully saved connection ID: {connection_id}")
        
        # Return success response
        return {
            'statusCode': 200,
            'body': json.dumps('Connected successfully')
        }
    
    except Exception as e:
        # Log the exception for debugging
        print(f"Error occurred: {str(e)}")
        
        # Return a failure response with the error message
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }
