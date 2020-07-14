import json
import logging
import uuid
import time
from http import HTTPStatus

import boto3
from boto3.dynamodb.conditions import Key, Attr

logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.DEBUG)
dynamodb = boto3.resource('dynamodb')
notes_table = dynamodb.Table('dolphin_notes_table')

def _make_response(body={}, status_code=HTTPStatus.OK):
    response = {
        "statusCode": status_code.value,
        'headers': {
            'Access-Control-Allow-Origin': '*',
        },
        "body": json.dumps(body)
    }
    return response


def _generate_note_id():
    note_id = uuid.uuid4().hex
    # limit tries to 100
    for i in range(100):
        response = notes_table.scan(
            FilterExpression=Attr('note_id').eq(note_id)
        )
        items = response['Items']
        if len(items) == 0:
            return note_id

        note_id = uuid.uuid4().hex

    # FIXME write a more detailed exception
    raise Exception


def ping(event, context):
    return _make_response(body="ping")


def ping_auth(event, context):
    claims = event['requestContext']['authorizer']['claims']['sub']
    return _make_response(body=claims)


def get_notes(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']

    response = notes_table.query(
        KeyConditionExpression=Key('user_id').eq(user_id)
    )
    notes = response['Items']
    print(notes)
    return _make_response(body={'notes': notes})



def create_note(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    note_id = _generate_note_id()
    # create the note
    notes_table.put_item(
        Item={
            'user_id': user_id,
            'note_id': note_id,
            'title': "Untitled",
            'tags': [],
            'document': "There's nothing here yet.",
            'created_at': str(int(time.time())),
            'updated_at': str(int(time.time()))
        }
    )
    return _make_response(body={"note_id": note_id})


def get_note(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    note_id = event['pathParameters']['note_id']

    response = notes_table.get_item(
        Key={
            'user_id': user_id,
            'note_id': note_id
        }
    )
    note = response.get('Item')

    if note is None:
        return _make_response(status_code=HTTPStatus.NOT_FOUND)

    return _make_response(body={'note': note})


def update_note(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    note_id = event['pathParameters']['note_id']
    note = json.loads(event['body']).get('note')
    updated_at = str(int(time.time()))
    note['updated_at'] = updated_at

    # make sure that user_id in note matches claims
    if note.get('user_id') != user_id:
        return _make_response(status_code=HTTPStatus.FORBIDDEN)

    notes_table.put_item(Item=note)
    return _make_response(body={'updated_at': updated_at})

def delete_note(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    note_id = event['pathParameters']['note_id']
    notes_table.delete_item(
        Key={
            'user_id': user_id,
            'note_id': note_id
        }
    )
    return _make_response()
