

from config.db import get_database 
from fastapi import APIRouter,Response,HTTPException, Query

import pandas as pd
from fastapi import HTTPException


import logging  # Consider using logging instead of print for production code

import asyncio
import httpx

import requests

Movies_Ratings=APIRouter()

db = get_database()
TMDb_API_KEY = 'c7e8a150ee653ee215908e1ba6d736cc'  # Replace this with your TMDb API key
CSV_FILE_PATH = 'dataset/ml-latest-small/movies.csv'  # Replace with the path to your CSV file

CSV_FILE_PATH_ratings='dataset/ml-latest-small/ratings.csv'

@Movies_Ratings.get('/Hello_MoviesAPIs')
async def Hello_MoviesPage():
    return 'Hello Movies Page'


def get_movies_collection():

    movies=db["movies"]  
    return movies


def get_ratings_collection():

    ratings=db["ratings"]  
    ratings.create_index([("ratings", 1)], unique=True)
    return ratings

ratingsCollection=get_ratings_collection()
moviesCollection=get_movies_collection()


from bson import ObjectId





def serializeDict2(entity):
    # Check if entity is None
    if entity is None:
        # Option 1: Return an empty dictionary if entity is None
        return {}
        # Option 2: Alternatively, raise an informative error
        # raise ValueError("serializeDict2 received None as input")

    # Convert ObjectId to string if "_id" field exists
    if "_id" in entity and isinstance(entity["_id"], ObjectId):
        entity["_id"] = str(entity["_id"])

    # Return a dictionary comprehension that handles '_id' separately
    return {
        **{i: str(entity[i]) for i in entity if i == '_id'},  # Handle '_id' field
        **{i: entity[i] for i in entity if i != '_id'}  # Handle other fields
    }

def serializeList2(entity) -> list:
    return [serializeDict2(a) for a in entity]












async def fetch_movie_poster_and_overview(title: str, df: pd.DataFrame) -> dict:
    if not title:
        raise ValueError("Missing movie title parameter")
    
    rectifiedTitle=get_title_before_special_char(title)


        # Search and delete movie from DataFrame here
    filtered_df = df[df['title'].str.contains(title, case=False, regex=False)]
    if not filtered_df.empty:
        movie_id = filtered_df.iloc[0]['movieId']

        movie_id_python = int(movie_id)
        df.drop(filtered_df.index[0], inplace=True)
  





    search_url = f'https://api.themoviedb.org/3/search/movie?api_key={TMDb_API_KEY}&query={rectifiedTitle}'
    
    async with httpx.AsyncClient() as client:
        search_response = await client.get(search_url)
        search_data = search_response.json()

    if 'results' in search_data and len(search_data['results']) > 0:
        first_result = search_data['results'][0]
        poster_path = first_result.get('poster_path')
        poster_url = f'https://image.tmdb.org/t/p/original{poster_path}' if poster_path else None
        overview = first_result.get('overview', None)
        # print(poster_url)

        
        return {
            'poster_url': poster_url,
            'movie_id':movie_id_python,
            'movieTitle':rectifiedTitle,
            'overview':overview
        }
    else:
        logging.error(f"Failed to fetch poster and overview for {title}")


### curl "http://127.0.0.1:8000/movie-details/?title=Inception"

@Movies_Ratings.get("/movie-details/")
async def movie_details(title: str = Query(..., description="The movie title to fetch details for")):
    try:
        details = await fetch_movie_poster_and_overview(title)
        return details
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))



from sklearn.preprocessing import MinMaxScaler

def preprocess_dataframe(df):


    # Step 1: Normalize numerical columns
    numerical_cols = df.select_dtypes(include=['int64', 'float64']).columns
    scaler = MinMaxScaler()
    df[numerical_cols] = scaler.fit_transform(df[numerical_cols])

    # Step 2: Eliminate rows with any null values
    df = df.dropna()

    # Step 3: Remove duplicate rows
    df = df.drop_duplicates()

    return df



def get_title_before_special_char(original_title: str) -> str:
    # Split the string at the first occurrence of ':' or '!'
    for special_char in [':', '!',"("]:
        if special_char in original_title:
            # Split the string and return the first part
            return original_title.split(special_char)[0].strip()
    # If neither ':' nor '!' is found, return the original string
    return original_title





@Movies_Ratings.get('/MoviesInsertion')
async def Insert_FOREX_Quotes_Creation_API():

    df = pd.read_csv(CSV_FILE_PATH)

    titles_list = df['title'].tolist()
    print("Titles list length",len(titles_list))


    batch_size = 90
    
    results = []

    finalTab=[]
    
    for i in range(0,len(titles_list) , batch_size):
        symbols_batch = titles_list[i:i + batch_size]
        awaitable_tasks = [fetch_movie_poster_and_overview(title,df) for title in symbols_batch]
        batch_results = await asyncio.gather(*awaitable_tasks)
        results.extend(batch_results)
        print("---------  await asyncio.gather(*awaitable_tasks) ")
        # print(batch_results)
        finalTab.append(batch_results)
    # Flatten the nested list into a single list using list comprehension
    movies_flat_final = [movie for sublist in finalTab for movie in sublist]
    print(movies_flat_final)
    serL=serializeList2(movies_flat_final)
    # print("--------- Final tab length ",len(finalTab))
    # print(finalTab)
    chunk_size=150
    for i in range(0, len(serL), chunk_size):
        toInsertArray= serL[i:i + chunk_size]
        moviesCollection.insert_many(toInsertArray)
    return {"message": finalTab}







#API to get all the sectors from the database
@Movies_Ratings.get('/AllMovies')
async def find_all_sectors():
    return serializeList2(get_movies_collection().find())








moviesDf = pd.read_csv(CSV_FILE_PATH)
ratingsDf = pd.read_csv(CSV_FILE_PATH_ratings)


print("Ratings Df ")
print(ratingsDf.head())

print("moviesDf Df ")
print(moviesDf.head())





# Pivot the DataFrame to get the user-item rating matrix
rating_matrix = ratingsDf.pivot(index='userId', columns='movieId', values='rating')

# Handle missing values by filling with 0
rating_matrix = rating_matrix.fillna(0)



rating_matrix.to_csv('dataset/ratings.csv', index=False)





import numpy as np
from scipy.linalg import svd

# Pivot the DataFrame to get the user-item rating matrix
rating_matrix = ratingsDf.pivot(index='userId', columns='movieId', values='rating')

# Handle missing values by filling with 0
rating_matrix = rating_matrix.fillna(0)



rating_matrix.to_csv('dataset/ratings.csv', index=False)


# Application de SVD
U, sigma, VT = svd(rating_matrix, full_matrices=False)

# Convertir sigma en une matrice diagonale
Sigma = np.diag(sigma)

# Nombre de caractéristiques à conserver
n_features = 3
U = U[:, :n_features]
Sigma = Sigma[:n_features, :n_features]
VT = VT[:n_features, :]

# Prédiction des évaluations (approximation de R)
R_pred = np.dot(np.dot(U, Sigma), VT)

print("Matrice des évaluations prédites :")
print(R_pred)



dfffff = pd.DataFrame(R_pred)

dfffff.to_csv('dataset/R_pred.csv', index=False)


