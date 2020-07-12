terraform {
  backend "s3" {
    bucket = "nicholasmpaz-terraform"
    key    = "dolphin/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.region
}

module "db" {
  source = "./modules/db"
}