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
namespaces_table = dynamodb.Table('dolphin_namespaces_table')


def _make_response(body={}, status_code=HTTPStatus.OK):
    response = {
        "statusCode": status_code.value,
        'headers': {
            'Access-Control-Allow-Origin': '*',
        },
        "body": json.dumps(body)
    }
    return response


def _generate_unique_id(table, unique_attr):
    unique_id = uuid.uuid4().hex
    for i in range(100):
        response = table.scan(FilterExpression=Attr(unique_attr).eq(unique_id))
        items = response['Items']
        if len(items) == 0:
            return unique_id
        unique_id = uuid.uuid4().hex
    raise Exception("Couldn't generate a unique id")


def _get_namespace_children_ids(namespaces, namespace_id):

    direct_namespace_children_ids = [
        namespace.get('namespace_id') for namespace in namespaces
        if namespace.get('parent') == namespace_id
    ]

    all_namespace_children_ids = []
    for namespace_child_id in direct_namespace_children_ids:
        all_namespace_children_ids += _get_namespace_children_ids(
            namespaces, namespace_child_id)

    return [namespace_id] + all_namespace_children_ids


### PING


def ping(event, context):
    return _make_response(body="ping")


def ping_auth(event, context):
    claims = event['requestContext']['authorizer']['claims']['sub']
    return _make_response(body=claims)


### RESOURCES


def get_resources(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']

    response = resources_table.query(
        KeyConditionExpression=Key('user_id').eq(user_id))
    resources = response['Items']
    return _make_response(body={'resources': resources})


def get_resource(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    resource_id = event['pathParameters']['resource_id']

    response = resources_table.get_item(Key={
        'user_id': user_id,
        'resource_id': resource_id
    })
    resource = response.get('Item')

    if resource is None:
        return _make_response(status_code=HTTPStatus.NOT_FOUND)

    return _make_response(body={'resource': resource})


def create_resource(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    resource_id = _generate_unique_id(resources_table, 'resource_id')
    resource_type = json.loads(event['body']).get('type', 'note')
    namespace = json.loads(event['body']).get('namespace')
    resource = {
        'user_id': user_id,
        'resource_id': resource_id,
        'type': resource_type,
        'title': "",
        'tags': [],
        'content': "",
        'created_at': str(int(time.time())),
        'updated_at': str(int(time.time())),
        'namespace': namespace
    }

    # create the resource
    resources_table.put_item(Item=resource)
    return _make_response(body={"resource": resource})


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
    return _make_response(body={'resource': resource})


def delete_resource(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    resource_id = event['pathParameters']['resource_id']
    resources_table.delete_item(Key={
        'user_id': user_id,
        'resource_id': resource_id
    })
    return _make_response()


### NAMESPACES


def get_namespaces(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    response = namespaces_table.query(
        KeyConditionExpression=Key('user_id').eq(user_id))
    namespaces = response['Items']
    return _make_response(body={'namespaces': namespaces})


def create_namespace(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    namespace_id = _generate_unique_id(namespaces_table, 'namespace_id')
    parent = json.loads(event['body']).get('parent')
    name = json.loads(event['body']).get('name')

    namespace = {
        'user_id': user_id,
        'namespace_id': namespace_id,
        'parent': parent,
        'name': name
    }

    # create the resource
    namespaces_table.put_item(Item=namespace)
    return _make_response(body={'namespace': namespace})


def delete_namespace(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    namespace_id = event['pathParameters']['namespace_id']

    response = namespaces_table.query(
        KeyConditionExpression=Key('user_id').eq(user_id))
    namespaces = response['Items']

    namespace_children_ids = _get_namespace_children_ids(
        namespaces, namespace_id)

    for curr_namespace_id in namespace_children_ids:
        # delete namespace
        namespaces_table.delete_item(Key={
            'user_id': user_id,
            'namespace_id': curr_namespace_id
        })
        # delete resources that have that namespace 
        response = resources_table.scan(
            FilterExpression=Attr('namespace').eq(curr_namespace_id))
        resources = response['Items']
        for resource in resources:
            resources_table.delete_item(
                Key={
                    'user_id': user_id,
                    'resource_id': resource.get('resource_id')
                })

    return get_namespaces(event, context)


# def update_namespace(event, context):
#     user_id = event['requestContext']['authorizer']['claims']['sub']
#     namespace_id = event['pathParameters']['namespace_id']
#     namespace = json.loads(event['body']).get('namespace')

#     # make sure that user_id in namespace matches claims
#     if namespace.get('user_id') != user_id:
#         return _make_response(status_code=HTTPStatus.FORBIDDEN)

#     namespaces_table.put_item(Item=namespace)
#     return _make_response(body={'namespace': namespace})