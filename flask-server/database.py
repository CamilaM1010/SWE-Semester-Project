from pymongo import MongoClient 

def get_database(dbname):
    # Get MongoDB connection string from environment variable
    CONNECTION_STRING = "mongodb+srv://aydinoznil:2fMUpD87WDNctc@cluster0.6p2s0.mongodb.net/"
    client = MongoClient(CONNECTION_STRING)
    return client[dbname]