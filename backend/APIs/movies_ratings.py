

from config.db import get_database 
from fastapi import APIRouter,Response,HTTPException, Query

import pandas as pd
from fastapi import HTTPException


from typing import Optional

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


##Databases creation

def get_movies_test_collection():
    movies=db["moviesTest"]  
    return movies




def get_movies_collection():
    movies=db["movies"]  
    return movies

def get_ratings_collection():
    ratings=db["ratings"]  
    ratings.create_index([("ratings", 1)], unique=True)
    return ratings

ratingsCollection=get_ratings_collection()
moviesCollection=get_movies_collection()
moviesCollectionTest=get_movies_test_collection()


##Serialization functionalities
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





import re

def extract_year(title):
    match = re.search(r'\((\d{4})\)', title)
    if match:
        return match.group(1)  # Returns the year
    else:
        return 'Year not found'  # Or handle the case where no year is found



def extract_first_genre(genre_string):
    genres = genre_string.split('|')
    return genres[0] if genres else 'Genre not found'





async def fetch_movie_poster_and_overview(title: str, df: pd.DataFrame) -> dict:
    if not title:
        raise ValueError("Missing movie title parameter")
    
    releasingYear=extract_year(title)
    
    rectifiedTitle=get_title_before_special_char(title)


        # Search and delete movie from DataFrame here
    filtered_df = df[df['title'].str.contains(title, case=False, regex=False)]
    if not filtered_df.empty:
        movie_id = filtered_df.iloc[0]['movieId']
        movie_genre = filtered_df.iloc[0]['genres']

        rectifiedGenre=extract_first_genre(movie_genre)


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
            'overview':overview,
            'genre':rectifiedGenre,
            'releaseYear':releasingYear
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



#Special function that trims a string and removes special caracters
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
    

    ###for i in range(0,len(titles_list) , batch_size):

    for i in range(0,150 , batch_size):
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














@Movies_Ratings.get('/MoviesTestInsertion')
async def Insert_FOREX_Quotes_Creation_API():

    df = pd.read_csv(CSV_FILE_PATH)

    titles_list = df['title'].tolist()
    print("Titles list length",len(titles_list))


    batch_size = 90
    
    results = []

    finalTab=[]
    
    for i in range(0,100 , batch_size):
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
    moviesCollectionTest.insert_many(movies_flat_final)

    return {"message": finalTab}





#API to get all the sectors from the database
@Movies_Ratings.get('/AllMovies')
async def find_all_sectors():
    return serializeList2(get_movies_collection().find())






## all movies in chunks 
## http://127.0.0.1:8000/AllMovies?page=1&limit=20
@Movies_Ratings.get('/AllMovies_test')
async def find_all_movies(x: int, page: Optional[int] = Query(1, alias="page")):
    skip = (page - 1) * x
    
    # Fetch the movies using skip and limit for pagination
    movies = get_movies_collection().find().skip(skip).limit(x)
    
    return serializeList2(movies)










moviesDf = pd.read_csv(CSV_FILE_PATH)
ratingsDf = pd.read_csv(CSV_FILE_PATH_ratings)




import numpy as np
from scipy.linalg import svd

# print("moviesDf Df ")
# print(moviesDf.head())

# print("Ratings Df ")
# print(ratingsDf.head())




def ratingProcess_firstApproach(ratingsDf):
    def adjust_value(x):
        if round(x) == 0:
            random_value = np.random.uniform(1, 5)
            return round(random_value)
        else:
            return x  # or any other operation for non-zero values
# Apply the function across the entire DataFrame



    # Pivot the DataFrame to get the user-item rating matrix
    rating_matrix_pivoted = ratingsDf.pivot(index='userId', columns='movieId', values='rating')

    # Handle missing values by filling with 0
    rating_matrix_pivoted = rating_matrix_pivoted.fillna(0)


    print("rating matrix pivoted Df ")
    print(rating_matrix_pivoted.head())




    # Application de SVD
    U, sigma, VT = svd(rating_matrix_pivoted, full_matrices=False)

    # Convertir sigma en une matrice diagonale
    Sigma = np.diag(sigma)

    # Nombre de caractéristiques à conserver
    n_features = 14
    U = U[:, :n_features]
    Sigma = Sigma[:n_features, :n_features]
    VT = VT[:n_features, :]

    # Prédiction des évaluations (approximation de R)
    R_pred = np.dot(np.dot(U, Sigma), VT)

    print("Matrice des évaluations prédites :")
    dfPredicted = pd.DataFrame(R_pred)

    dfPredicted[dfPredicted < 0] = dfPredicted[dfPredicted < 0] * -1

    dfPredicted = dfPredicted.applymap(adjust_value)



    dfPredictionToUse = rating_matrix_pivoted.applymap(adjust_value)
    print(dfPredictionToUse.head(10))



    dfPredicted.to_csv('dataset/matrice_prédiction.csv', index=False)
    rating_matrix_pivoted.to_csv('dataset/ratingsPivoted.csv', index=False)

    return dfPredicted


# ratingProcess_firstApproach(ratingsDf)
    



ratedMoviesList=[
    {
        "title": "Grumpier Old Men",
        "rating": 3
    },
    {
        "title": "Tom and Huck",
        "rating": 4
    },
    {
        "title": "Sabrina",
        "rating": 4
    }
]


def Matrix_after_newRatingAdded_to_evaluate(ratedMoviesList):
  
  ### Les nouvelles données sont ajoutées à la fin de la matrice 
    ratingsDf = pd.read_csv(CSV_FILE_PATH_ratings)
    moviesDf = pd.read_csv(CSV_FILE_PATH)


    # print("-- Movies with id dataframe")
    # print(moviesDf)

    initialRatingsDf=ratingsDf
    # print("---- Initial ratings df ")
    # print(initialRatingsDf.head())

        # Pivot the DataFrame to get the user-item rating matrix
    rating_matrix_pivoted = ratingsDf.pivot(index='userId', columns='movieId', values='rating')

    # Handle missing values by filling with 0
    rating_matrix_pivoted = rating_matrix_pivoted.fillna(0)


    # print("-- rating matrix pivoted Df ")
    # print(rating_matrix_pivoted.head())


        # Convert the list of rated movies to a DataFrame
    rated_movies_df = pd.DataFrame(ratedMoviesList)

    # To match the titles correctly, let's strip out the year from the `movies_df` titles
    moviesDf['clean_title'] = moviesDf['title'].str.replace(r" \(\d+\)", "", regex=True)

    # Merge the two DataFrames on the cleaned title
    merged_df = pd.merge(rated_movies_df, moviesDf, left_on='title', right_on='clean_title', how='inner')

    # Select the relevant columns and convert to a list of dictionaries
    combined_info_list = merged_df[['title_x', 'rating', 'movieId', 'genres']].to_dict('records')
    # print("-- The combined list")
    # print(combined_info_list)

    # print("The combined list in a shape of a dataframe ")
    # print(merged_df)

    # Utilisation de .shape pour obtenir le nombre de colonnes
    nb_lignes, nb_colonnes = rating_matrix_pivoted.shape

    # print("--- Nombre colonnes de la matrice d'évaluations ",nb_colonnes)
    # print("--- Nombre nb_lignes de la matrice d'évaluations ",nb_lignes)

    newLine = [0] * nb_colonnes

    for i in range(nb_colonnes):
        found = False  # This flag will check if we found a matching movieId
        for j in range(len(ratedMoviesList)):
            # Check if the current column matches any movieId in combined_info_list
            if (i+1 == combined_info_list[j]['movieId']):
                newLine[i] = combined_info_list[j]['rating']  # Assign the rating, not the movieId
                found = True  # Update the flag since we found a match
                break  # Exit the inner loop once a match is found
        if not found:
            # If no matching movieId was found, ensure this index is set to 0
            # This line could actually be omitted, as the list is already initialized with zeros
            newLine[i] = 0

    # print("New line:")
    # print(newLine)

    newLineDf_row = pd.DataFrame([newLine], columns=rating_matrix_pivoted.columns)

    # Détermine le nouvel userId
    new_userId = rating_matrix_pivoted.index.max() + 1

    # Ajoute la nouvelle ligne au DataFrame rating_matrix_pivoted
    # Utilise loc pour ajouter la nouvelle ligne avec le nouvel index
    rating_matrix_pivoted.loc[new_userId] = newLineDf_row.iloc[0]

    nb_lignes, nb_colonnes = rating_matrix_pivoted.shape

    # print("Après l'ajout du nouvel utilisateur :")
    # print("--- Nombre de colonnes de la matrice d'évaluations :", nb_colonnes)
    # print("--- Nombre de lignes de la matrice d'évaluations :", nb_lignes)

    movies_ids_ratings_to_return(rating_matrix_pivoted)   

    return rating_matrix_pivoted 







def movies_ids_ratings_to_return(matrixDf):
    derniere_ligne = matrixDf.iloc[-1]
    # print("-- derniere ligne ")
    # print(derniere_ligne)

    s_triee = derniere_ligne.sort_values(ascending=False)

    # print("Series triée en ordre décroissant :")
    # print(s_triee)

    ids_tries = s_triee.index

    # print("IDs des éléments triés :")
    # print(ids_tries.tolist())


    df = derniere_ligne.reset_index()
    df.columns = ['movieId', 'rating']

    # Étape 2: Trier le DataFrame par rating en ordre décroissant
    df_sorted = df.sort_values(by='rating', ascending=False)

    # Étape 3: Convertir le DataFrame trié en une liste d'objets
    liste_objets_tries = df_sorted.to_dict('records')

    # print("Liste d'objets triée par rating, avec movieId et rating :")
    # print(liste_objets_tries[:4])
    return liste_objets_tries



def recommended_movies_to_return_fromDB(movies_numb,ids_ratings_list):
    print("--- def recommended_movies_to_return_fromDB(movies_numb,ids_ratings_list):")


    if len(ids_ratings_list)>movies_numb:
        ids_ratings_list=ids_ratings_list[:movies_numb]
    

    recommended_movies=[]
    for item in ids_ratings_list:
        movie_id = item['movieId']
        print("Movie id ",movie_id)
        
        movie_document = moviesCollection.find_one({'movie_id': movie_id})

        if movie_document:
        # Assuming the movie document has a 'title' field
            recommended_movies.append(movie_document)
            
            # Stop if we have collected the desired number of movies
            if len(recommended_movies) >= movies_numb:
                break
    return recommended_movies

  



df=Matrix_after_newRatingAdded_to_evaluate(ratedMoviesList)    

print("recommended movies")
print(recommended_movies_to_return_fromDB(5,movies_ids_ratings_to_return(df)))

