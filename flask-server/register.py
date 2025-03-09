import argparse
import getpass
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash

from models import User


def get_database(dbname):
    CONNECTION_STRING = "mongodb://localhost:27017/"
    client = MongoClient(CONNECTION_STRING)
    return client[dbname]


parser = argparse.ArgumentParser()
parser.add_argument('--username', type=str, help='User name')

args = parser.parse_args()

password = getpass.getpass(prompt="Password:", stream=None)

db = get_database("user_auth")
users_collection = db["users"]

try:
    found_user = User(users_collection, args.username)
    found_user.set_password(password)
except ValueError:
    User.create_user(users_collection, args.username, password)