from enum import Enum
from http import HTTPStatus
import json


class Message(Enum):
    default = ""
    ping = "ping"


def make_response(message=Message.default, data="", status_code=HTTPStatus.OK):
    body = {
        "message": message.value,
        "data": data
    }
    response = {
        "statusCode": status_code.value,
        "body": json.dumps(body)
    }
    return response
