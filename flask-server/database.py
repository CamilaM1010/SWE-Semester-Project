from pymongo import MongoClient 
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get MongoDB connection string from environment variable
CONNECTION_STRING = os.getenv("MONGO_URI")

def get_database(dbname):
    client = MongoClient(CONNECTION_STRING)
    return client[dbname]