import json
import time
from http import HTTPStatus
import uuid

import boto3
from boto3.dynamodb.conditions import Key, Attr

from src.utils import make_response, generate_unique_id
from src.db import *
from src.policies import *

dynamodb = boto3.resource('dynamodb')
stashable_table = dynamodb.Table('StashableTable')

user_prefix = "user"
stash_prefix = "stsh"
namespace_prefix = "nspc"
resource_prefix = "rsrc"


def create_stash(event, context):
    user_sub = event['requestContext']['authorizer']['claims']['sub']
    user_id = f"{user_prefix}-{user_sub}"
    stash_id = generate_unique_id(stashable_table, stash_prefix)
    name = json.loads(event['body']).get('name')
    now = str(int(time.time()))

    stash_item = {
        'pk': stash_id,
        'sk': stash_id,
        'name': name,
        'created_by': user_id,
        'created_at': now,
        'updated_at': now,
    }

    user_item = {
        'pk': user_id,
        'sk': stash_id,
        'name': name,
        'viewed_at': now,
        'created_at': now,
    }

    stashable_table.put_item(Item=stash_item)
    stashable_table.put_item(Item=user_item)

    return make_response(body={'stash': user_item})


def index_stashes(event, context):
    user_sub = event['requestContext']['authorizer']['claims']['sub']
    user_id = f"{user_prefix}-{user_sub}"

    response = stashable_table.query(
        KeyConditionExpression=Key('pk').eq(user_id)
        & Key('sk').begins_with(stash_prefix))

    stashes = response.get('Items')
    return make_response(body={'stashes': stashes})


def delete_stash(event, context):
    user_sub = event['requestContext']['authorizer']['claims']['sub']
    user_id = f"{user_prefix}-{user_sub}"
    stash_id = event['pathParameters']['stash_id']
    db_delete_stash(user_id, stash_id)
    return make_response()


def get_stash(event, context):
    user_sub = event['requestContext']['authorizer']['claims']['sub']
    user_id = f"{user_prefix}-{user_sub}"
    stash_id = event['pathParameters']['stash_id']

    if not user_has_stash(user_id, stash_id):
        return make_response(status_code=HTTPStatus.NOT_FOUND)

    # update viewed_at for the user item
    response = stashable_table.get_item(Key={'pk': user_id, 'sk': stash_id})
    item = response.get('Item')
    now = str(int(time.time()))
    item['viewed_at'] = now
    stashable_table.put_item(Item=item)

    # get the stash
    response = stashable_table.get_item(Key={'pk': stash_id, 'sk': stash_id})
    stash = response.get('Item')
    return make_response(body={'stash': stash})


def create_namespace(event, context):
    user_sub = event['requestContext']['authorizer']['claims']['sub']
    user_id = f"{user_prefix}-{user_sub}"
    stash_id = event['pathParameters']['stash_id']
    name = json.loads(event['body']).get('name')
    parent = json.loads(event['body']).get('parent')
    namespace_id = generate_unique_id(stashable_table, namespace_prefix)
    now = str(int(time.time()))

    if not user_has_stash(user_id, stash_id):
        return make_response(status_code=HTTPStatus.NOT_FOUND)

    namespace_item = {
        'pk': namespace_id,
        'sk': namespace_id,
        'name': name,
        'parent': parent,
        'created_by': user_id,
        'created_at': now,
        'updated_at': now,
    }

    stash_item = {
        'pk': stash_id,
        'sk': namespace_id,
        'name': name,
        'parent': parent,
    }

    stashable_table.put_item(Item=namespace_item)
    stashable_table.put_item(Item=stash_item)

    return make_response(body={'namespace': stash_item})


def index_namespaces(event, context):
    user_sub = event['requestContext']['authorizer']['claims']['sub']
    user_id = f"{user_prefix}-{user_sub}"
    stash_id = event['pathParameters']['stash_id']

    if not user_has_stash(user_id, stash_id):
        return make_response(status_code=HTTPStatus.NOT_FOUND)

    response = stashable_table.query(
        KeyConditionExpression=Key('pk').eq(stash_id)
        & Key('sk').begins_with(namespace_prefix))

    namespaces = response.get('Items')
    return make_response(body={'namespaces': namespaces})


def delete_namespace(event, context):
    user_sub = event['requestContext']['authorizer']['claims']['sub']
    user_id = f"{user_prefix}-{user_sub}"
    stash_id = event['pathParameters']['stash_id']
    namespace_id = event['pathParameters']['namespace_id']

    if not user_has_stash(user_id, stash_id):
        print('user doesnt have stash')
        return make_response(status_code=HTTPStatus.NOT_FOUND)

    if not stash_has_namespace(stash_id, namespace_id):
        print('stash doesnt have namespace')
        return make_response(status_code=HTTPStatus.NOT_FOUND)

    db_delete_namespace(stash_id, namespace_id)

    return make_response()


def create_resource(event, context):
    user_sub = event['requestContext']['authorizer']['claims']['sub']
    user_id = f"{user_prefix}-{user_sub}"
    stash_id = event['pathParameters']['stash_id']
    name = json.loads(event['body']).get('name')
    type_ = json.loads(event['body']).get('type', 'note')
    namespace = json.loads(event['body']).get('namespace')
    resource_id = generate_unique_id(stashable_table, resource_prefix)
    now = str(int(time.time()))

    if not user_has_stash(user_id, stash_id):
        return make_response(status_code=HTTPStatus.NOT_FOUND)

    resource_item = {
        'pk': resource_id,
        'sk': resource_id,
        'name': name,
        'namespace': namespace,
        'type': type_,
        'tags': [],
        'content': "",
        'created_by': user_id,
        'created_at': now,
        'updated_at': now,
    }

    stash_item = {
        'pk': stash_id,
        'sk': resource_id,
        'name': name,
        'namespace': namespace,
        'type': type_,
        'tags': [],
        'viewed_at': now
    }

    stashable_table.put_item(Item=resource_item)
    stashable_table.put_item(Item=stash_item)

    return make_response(body={'resource': stash_item})


def index_resources(event, context):
    user_sub = event['requestContext']['authorizer']['claims']['sub']
    user_id = f"{user_prefix}-{user_sub}"
    stash_id = event['pathParameters']['stash_id']

    if not user_has_stash(user_id, stash_id):
        return make_response(status_code=HTTPStatus.NOT_FOUND)

    response = stashable_table.query(
        KeyConditionExpression=Key('pk').eq(stash_id)
        & Key('sk').begins_with(resource_prefix))

    resources = response.get('Items')

    return make_response(body={'resources': resources})


def delete_resource(event, context):
    user_sub = event['requestContext']['authorizer']['claims']['sub']
    user_id = f"{user_prefix}-{user_sub}"
    stash_id = event['pathParameters']['stash_id']
    resource_id = event['pathParameters']['resource_id']

    if not user_has_stash(user_id, stash_id):
        return make_response(status_code=HTTPStatus.NOT_FOUND)

    if not stash_has_resource(stash_id, resource_id):
        return make_response(status_code=HTTPStatus.NOT_FOUND)

    db_delete_resource(stash_id, resource_id)

    return make_response()


def update_resource(event, context):
    user_sub = event['requestContext']['authorizer']['claims']['sub']
    user_id = f"{user_prefix}-{user_sub}"
    stash_id = event['pathParameters']['stash_id']
    resource_id = event['pathParameters']['resource_id']

    if not user_has_stash(user_id, stash_id):
        return make_response(status_code=HTTPStatus.NOT_FOUND)

    if not stash_has_resource(stash_id, resource_id):
        return make_response(status_code=HTTPStatus.NOT_FOUND)

    name = json.loads(event['body']).get('name')
    tags = json.loads(event['body']).get('tags')
    content = json.loads(event['body']).get('content')
    language = json.loads(event['body']).get('language')

    # update the resource item
    response = stashable_table.get_item(Key={
        'pk': resource_id,
        'sk': resource_id
    })
    resource_item = response.get('Item')
    resource_item['name'] = name
    resource_item['tags'] = tags
    resource_item['content'] = content
    if language:
        resource_item['language'] = language
    stashable_table.put_item(Item=resource_item)

    # update the stash item
    response = stashable_table.get_item(Key={
        'pk': stash_id,
        'sk': resource_id
    })
    stash_item = response.get('Item')
    stash_item['name'] = name
    stash_item['tags'] = tags
    stashable_table.put_item(Item=stash_item)

    return make_response()


def get_resource(event, context):
    user_sub = event['requestContext']['authorizer']['claims']['sub']
    user_id = f"{user_prefix}-{user_sub}"
    stash_id = event['pathParameters']['stash_id']
    resource_id = event['pathParameters']['resource_id']

    if not user_has_stash(user_id, stash_id):
        return make_response(status_code=HTTPStatus.NOT_FOUND)

    if not stash_has_resource(stash_id, resource_id):
        return make_response(status_code=HTTPStatus.NOT_FOUND)

    # get the resource and return
    response = stashable_table.get_item(Key={
        'pk': resource_id,
        'sk': resource_id
    })
    resource = response.get('Item')

    return make_response(body={'resource': resource})
