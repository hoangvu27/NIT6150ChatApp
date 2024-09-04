import boto3
import json

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('ChatConnections')
    response = table.scan()
    items = response['Items']
    
    user_list = [item['ConnectionId'] for item in items]
    
    return {
        'statusCode': 200,
        'body': json.dumps({'users': user_list})
    }
