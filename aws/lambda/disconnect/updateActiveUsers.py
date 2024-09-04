import boto3
import json

dynamodb = boto3.resource('dynamodb')
def send_lobby_count_update(count):
    apigw = boto3.client('apigatewaymanagementapi', 
                     endpoint_url="https://uebygl936h.execute-api.ap-southeast-2.amazonaws.com/production")
    
    # Fetch all connected clients
    connections = dynamodb.Table('WebSocketConnections').scan()['Items']
    
    # Send the count to each connected client
    for connection in connections:
        try:
            apigw.post_to_connection(
                ConnectionId=connection['connectionId'],
                Data=json.dumps({'type': 'lobbyCountUpdate', 'count': count})
            )
        except apigw.exceptions.GoneException:
            # Handle stale connections
            dynamodb.Table('WebSocketConnections').delete_item(Key={'connectionId': connection['connectionId']})
