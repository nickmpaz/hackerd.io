import boto3
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('StashableTable')
user_prefix = "user"
stash_prefix = "stsh"
namespace_prefix = "nspc"
resource_prefix = "rsrc"


def db_delete_resource(stash_id, resource_id):
    table.delete_item(Key={'pk': stash_id, 'sk': resource_id})
    table.delete_item(Key={'pk': resource_id, 'sk': resource_id})


def db_delete_namespace(stash_id, namespace_id):

    children_of_namespace = _children_of_namespace(stash_id, namespace_id)
    for namespace in children_of_namespace:
        db_delete_namespace(stash_id, namespace['sk'])

    resources_in_namespace = _resources_in_namespace(stash_id, namespace_id)
    for resource in resources_in_namespace:
        db_delete_resource(stash_id, resource['sk'])

    table.delete_item(Key={'pk': stash_id, 'sk': namespace_id})
    table.delete_item(Key={'pk': namespace_id, 'sk': namespace_id})


def db_delete_stash(user_id, stash_id):
    namespaces_in_stash_without_parents = _namespaces_in_stash_without_parents(
        stash_id)

    for namespace in namespaces_in_stash_without_parents:
        db_delete_namespace(stash_id, namespace['sk'])

    response = table.query(KeyConditionExpression=Key('pk').eq(stash_id)
                           & Key('sk').begins_with(resource_prefix))
    resources_not_in_namespace = response.get('Items')
    for resource in resources_not_in_namespace:
        db_delete_resource(stash_id, resource['sk'])

    table.delete_item(Key={'pk': user_id, 'sk': stash_id})
    table.delete_item(Key={'pk': stash_id, 'sk': stash_id})


def _resources_in_namespace(stash_id, namespace_id):
    response = table.query(KeyConditionExpression=Key('pk').eq(stash_id)
                           & Key('sk').begins_with(resource_prefix),
                           FilterExpression=Attr('namespace').eq(namespace_id))
    resources_in_namespace = response.get('Items')
    return resources_in_namespace


def _children_of_namespace(stash_id, namespace_id):
    response = table.query(KeyConditionExpression=Key('pk').eq(stash_id)
                           & Key('sk').begins_with(namespace_prefix),
                           FilterExpression=Attr('parent').eq(namespace_id))
    children_of_namespace = response.get('Items', [])
    return children_of_namespace


def _namespaces_in_stash_without_parents(stash_id):
    response = table.query(KeyConditionExpression=Key('pk').eq(stash_id)
                           & Key('sk').begins_with(namespace_prefix),
                           FilterExpression=Attr('parent').eq(None))
    namespaces_in_stash_without_parents = response.get('Items', [])
    return namespaces_in_stash_without_parents