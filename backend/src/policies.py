import boto3
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('StashableTable')
user_prefix = "user"
stash_prefix = "stsh"
namespace_prefix = "nspc"
resource_prefix = "rsrc"


def user_has_stash(user_id, stash_id):
    response = table.get_item(Key={'pk': user_id, 'sk': stash_id})
    item = response.get('Item')
    return item is not None


def stash_has_resource(stash_id, resource_id):
    response = table.get_item(Key={
        'pk': stash_id,
        'sk': resource_id
    })
    item = response.get('Item')
    return item is not None

def stash_has_namespace(stash_id, namespace_id):
    response = table.get_item(Key={
        'pk': stash_id,
        'sk': namespace_id
    })
    item = response.get('Item')
    return item is not None
