from pymongo import MongoClient
from pymongo.database import Database



MONGO_CONNECTION_STRING = "mongodb+srv://recommenderaimovies:ylSZVXS2K7cQzvVC@cluster0.aqysibg.mongodb.net/Cluster0"

client = MongoClient(MONGO_CONNECTION_STRING, maxPoolSize=10)
#Using connection Pooling to reuse established connections instead of creating a new connection every time. This can significantly reduce connection overhead.
def get_database() -> Database:
    try:
        import time
        start_time = time.time()
        db = client.get_database()
        end_time = time.time()
        elapsed_time = end_time - start_time
        print("Successfully connected to the database. Elapsed time: %.2f seconds" % elapsed_time)
        return db
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        raise