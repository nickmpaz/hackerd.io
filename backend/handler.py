from http import HTTPStatus
import json

from .auth import verify_jwt
from .utils import make_response, Message


def ping(event, context):
    return make_response(message=Message.ping)

def ping_auth(event, context):
    pass

def get_notes(event, context):
    pass

def create_note(event, context):
    pass

def get_note(event, context):
    pass

def update_note(event, context):
    pass

def destroy_note(event, context):
    pass

