from http import HTTPStatus
import json
from .utils import make_response, Message


def ping(event, context):
    return make_response(message=Message.ping)
    
def create_note(event, context):
    pass

def update_note(event, context):
    pass

def destroy_note(event, context):
    pass

def get_notes(event, context):
    pass