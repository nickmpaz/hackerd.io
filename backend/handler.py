import json
import logging
import uuid
import time
from http import HTTPStatus

import boto3
from boto3.dynamodb.conditions import Key, Attr

logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.DEBUG)
dynamodb = boto3.resource('dynamodb')
resources_table = dynamodb.Table('dolphin_resources_table')

def _make_response(body={}, status_code=HTTPStatus.OK):
    response = {
        "statusCode": status_code.value,
        'headers': {
            'Access-Control-Allow-Origin': '*',
        },
        "body": json.dumps(body)
    }
    return response


def _generate_resource_id():
    resource_id = uuid.uuid4().hex
    # limit tries to 100
    for i in range(100):
        response = resources_table.scan(
            FilterExpression=Attr('resource_id').eq(resource_id)
        )
        items = response['Items']
        if len(items) == 0:
            return resource_id

        resource_id = uuid.uuid4().hex

    # FIXME write a more detailed exception
    raise Exception



def ping(event, context):
    return _make_response(body="ping")


def ping_auth(event, context):
    claims = event['requestContext']['authorizer']['claims']['sub']
    return _make_response(body=claims)


def get_resources(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']

    response = resources_table.query(
        KeyConditionExpression=Key('user_id').eq(user_id)
    )
    resources = response['Items']
    print(resources)
    return _make_response(body={'resources': resources})



def create_resource(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    resource_id = _generate_resource_id()
    resource_type = json.loads(event['body']).get('resource_type', 'markdown')

    # create the resource
    resources_table.put_item(
        Item={
            'user_id': user_id,
            'resource_id': resource_id,
            'type': resource_type,
            'title': "Untitled",
            'tags': [],
            'document': "There's nothing here yet.",
            'created_at': str(int(time.time())),
            'updated_at': str(int(time.time()))
        }
    )
    return _make_response(body={"resource_id": resource_id})


def get_resource(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    resource_id = event['pathParameters']['resource_id']

    response = resources_table.get_item(
        Key={
            'user_id': user_id,
            'resource_id': resource_id
        }
    )
    resource = response.get('Item')

    if resource is None:
        return _make_response(status_code=HTTPStatus.NOT_FOUND)

    return _make_response(body={'resource': resource})


def update_resource(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    resource_id = event['pathParameters']['resource_id']
    resource = json.loads(event['body']).get('resource')
    updated_at = str(int(time.time()))
    resource['updated_at'] = updated_at

    # make sure that user_id in resource matches claims
    if resource.get('user_id') != user_id:
        return _make_response(status_code=HTTPStatus.FORBIDDEN)

    resources_table.put_item(Item=resource)
    return _make_response(body={'updated_at': updated_at})

def delete_resource(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    resource_id = event['pathParameters']['resource_id']
    resources_table.delete_item(
        Key={
            'user_id': user_id,
            'resource_id': resource_id
        }
    )
    return _make_response()
