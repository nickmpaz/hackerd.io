from http import HTTPStatus
import json
from .utils import make_response, Message


def ping(event, context):
    return make_response(message=Message.ping)
    