import json
import boto3
from updateActiveUsers import send_lobby_count_update
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('WebSocketConnections')

    
def lambda_handler(event, context):
    connection_id = event['requestContext']['connectionId']
    body = json.loads(event['body'])
    username = body.get('username', '')

    if username:
        try:
            table.put_item(
                Item={
                    'connectionId': connection_id,
                    'username': username,
                    'timestamp': int(context.get_remaining_time_in_millis())
                }
            )
            print(f"User {username} joined lobby with connection ID: {connection_id}")
            
            # Update the status to "inLobby" when a user joins
            table.update_item(
                Key={'connectionId': connection_id},
                UpdateExpression="set #status = :s",
                ExpressionAttributeNames={'#status': 'status'},
                ExpressionAttributeValues={':s': 'inLobby'}
            )
            
            # Count users in the lobby and send update
            current_lobby_count = count_users_in_lobby()
            send_lobby_count_update(current_lobby_count)
            
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': f'{username} joined the lobby',
                    'connectionId': connection_id
                })
            }
        except Exception as e:
            print(f"Error occurred in joinLobby: {str(e)}")
            return {
                'statusCode': 500,
                'body': json.dumps(str(e))
            }
    else:
        return {
            'statusCode': 400,
            'body': json.dumps('Username is required')
        }

def count_users_in_lobby():
    response = table.scan(
        FilterExpression=Attr('status').eq('inLobby')
    )
    return len(response['Items'])