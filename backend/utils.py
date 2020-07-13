from http import HTTPStatus
import json


def make_response(body={}, status_code=HTTPStatus.OK):
    response = {
        "statusCode": status_code.value,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            # 'Access-Control-Allow-Credentials': 'true',
        },
        "body": json.dumps(body)
    }
    return response
