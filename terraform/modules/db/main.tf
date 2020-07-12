resource "aws_dynamodb_table" "dolphin_notes_table" {
  name             = "dolphin_notes_table"
  hash_key         = "user_id"
  range_key        = "note_id"
  billing_mode     = "PAY_PER_REQUEST"

  attribute {
    name = "user_id"
    type = "S"
  }

  attribute {
    name = "note_id"
    type = "S"
  }

}