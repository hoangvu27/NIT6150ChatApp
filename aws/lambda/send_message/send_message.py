import boto3
import json
import logging

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)
    
def lambda_handler(event, context):
    print(f"Received event: {json.dumps(event)}")
    print(f"Received context: {context}")
    try:
        # Extract connection ID and message from the event
        connection_id = event['requestContext']['connectionId']
        message = json.loads(event['body'])['message']
        
        # Connect to DynamoDB and add the message
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('ChatMessages')
        
        # Log to ensure the connection and message are correct
        print(f"Connection ID: {connection_id}, Message: {message}")
        
        # Add item to DynamoDB
        table.put_item(Item={
            'MessageId': connection_id + "_" + str(context.aws_request_id),
            'SenderId': connection_id,
            'Message': message,
            'Timestamp': str(context.aws_request_id)
        })
        
        # Broadcast message to other clients
        broadcast_message(connection_id, message, event)
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Message sent successfully'})
        }
    
    except Exception as e:
        # Catch and log the exception
        print(f"Error occurred: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }

def broadcast_message(sender_id, message, event):
    dynamodb = boto3.resource('dynamodb')
    connections_table = dynamodb.Table('WebSocketConnections')
    apigw = boto3.client('apigatewaymanagementapi', 
                         endpoint_url=f"https://{event['requestContext']['domainName']}/{event['requestContext']['stage']}")
    
    # Retrieve the sender's username from DynamoDB
    sender_record = connections_table.get_item(Key={'connectionId': sender_id})
    sender_username = sender_record['Item'].get('username', sender_id)  # Fallback to sender_id if username is not found
    
    # Scan for all active connections
    response = connections_table.scan()
    items = response['Items']
    
    for item in items:
        connection_id = item['connectionId']
        try:
            # Send the message to the current connection
            apigw.post_to_connection(
                ConnectionId=connection_id,
                Data=json.dumps({
                    'sender': sender_username,
                    'message': message
                })
            )
                
            logger.info(f"Message successfully sent to connection ID: {connection_id}")
        
        except apigw.exceptions.GoneException:
            # If the connection is no longer valid, delete it from the table
            logger.info(f"Connection {connection_id} is gone. Removing from WebSocketConnections table.")
            connections_table.delete_item(Key={'connectionId': connection_id})

        except Exception as e:
            # Catch all other exceptions and log the error
            logger.error(f"Error sending message to connection {connection_id}: {str(e)}")