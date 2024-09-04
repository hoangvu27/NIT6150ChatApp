import boto3
import json
from updateActiveUsers import send_lobby_count_update
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('WebSocketConnections')

def lambda_handler(event, context):
    connection_id = event['requestContext']['connectionId']
    
    # Remove the connection from the table (or update the status)
    table.delete_item(
        Key={'connectionId': connection_id}
    )
    
    # Update lobby count
    current_lobby_count = count_users_in_lobby()
    send_lobby_count_update(current_lobby_count)

    return {
        'statusCode': 200,
        'body': json.dumps('Disconnected successfully')
    }

def count_users_in_lobby():
    response = table.scan(
        FilterExpression=Attr('status').eq('inLobby')
    )
    return len(response['Items'])


