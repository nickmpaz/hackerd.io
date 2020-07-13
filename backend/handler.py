from http import HTTPStatus
import json

from auth import verify_jwt
from utils import make_response


def ping(event, context):
    return make_response(body="ping")

def ping_auth(event, context):
    # # verify claims
    # claims = verify_jwt(event, context)
    # if not claims: 
    #     return make_response(status_code=HTTPStatus.FORBIDDEN)
    return make_response(body="ping")

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

