import json
from http import HTTPStatus
import uuid

import boto3
from boto3.dynamodb.conditions import Key, Attr

def make_response(body={}, status_code=HTTPStatus.OK):
    response = {
        "statusCode": status_code.value,
        'headers': {
            'Access-Control-Allow-Origin': '*',
        },
        "body": json.dumps(body)
    }
    return response

def generate_unique_id(table, id_prefix):
    for i in range(100):
        unique_id = f"{id_prefix}-{str(uuid.uuid4().hex)}"
        response = table.get_item(Key={'pk': unique_id, 'sk': unique_id})
        item = response.get("Item")
        if item is None:
            return unique_id

    raise Exception("Couldn't generate a unique id")