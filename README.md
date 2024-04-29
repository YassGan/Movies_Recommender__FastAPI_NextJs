# Movies_Recommender__FastAPI_NextJs


**Subject:** Programming Paradigms  
**Teacher:** Mrs. Lassoued Imen  
**Author:** GANA Yassine MR1  
**Date:** March 26, 2024

---

## 1. Project Composition

- General description of the project
- Description of the chosen dataset
- Description of the SVD machine learning algorithm used.
- Description of the frontend part
- Description of the backend part and how the SVD algorithm was applied

---

## 2. General Description of the Project

The project is an application that recommends movies using AI based on user evaluations. First, the user will have an interface containing movies, they will rate some movies, and based on their choices, we will introduce them to a machine learning algorithm in the backend that will find correlations between the movies and provide the movies closest to these preferences. The movies will be displayed on another page. The more choices the user makes, the closer the results will be to their tastes.

---

## 3. Dataset Choice

The dataset used was from this [link](https://grouplens.org/datasets/movielens/), it is a .csv file containing lines with the movie id, the user id who made the rating, and the rating.

---

## 4. Description of the SVD (Singular Value Decomposition) Machine Learning Algorithm Used

The SVD algorithm is used to make predictions starting from a matrix R. Initially, the matrix R looks something like this, with the columns representing movies and the rows representing user ratings. We can visualize that some values are missing, and the algorithm will serve to predict these values.

By applying SVD to the matrix R, this algorithm will decompose it into 3 matrices: the U matrix, the Sigma matrix, and the Vt matrix. The final matrix will be the product of these 3 matrices.

In our example, it will look something like this. An initial matrix: with the missing values represented by 0.

A return matrix: with the missing values that were represented by 0 now represented by predicted values.

---

## 5. Description of the Frontend Interface

This is the home page.

The user can choose the type of movie display, either grid or slider.

Then the user starts rating movies, these ratings are stored in a list that will be sent to the backend once the evaluation is complete. The user can, of course, ignore a movie if they want and they can load more movies by clicking the "load more movies" button.

Once the user has finished evaluating the movies, they click the "recommend" button to be redirected to another page that will display the movie recommendations.

The algorithm takes a little time to process the data entered by the user.

Once the processing is finished, the algorithm displays the recommended movies.

---

## 6. Description of the Backend Part and the Application of the SVD Algorithm in the Project

The CSV file we worked with has this form.

Before anything else, it is necessary to preprocess this file with this function that performs data normalization, null data removal, and redundant data elimination.

Then we have the `ratingProcessfirstApproach(ratingsDf)` function, it receives a matrix and transposes it to have a movie, user form like this.

And for each user, if they haven’t rated a movie, we associate the value 0 for later prediction.

Once we have the matrix in the desired form, we apply the SVD algorithm to this matrix.

Once we have applied the SVD algorithm, we have the evaluated matrix.

In the previous section, we explained how the prediction logic works. The following paragraph will show how the matrix to be processed by the prediction function is constructed.

We have the function `def MatrixAfterNewRatingAddedToEvaluate(ratedMoviesList)`:

This function takes as parameters a list of objects representing the movies that were evaluated by the user in the frontend, from which we will know their preferences. The logic of this function is as follows: we create a new list, initially all its cells are null, and we go through each cell. If we are in the cell corresponding to an evaluated movie, we assign the evaluation value to this cell. Once this process is complete, we transform this list into a dataframe and add this dataframe to the initial matrix. The resulting matrix is used in the previous prediction function.

The last function is the `movieIdsRatingsToReturn` function. In this function, we pass the predicted matrix as a parameter, and it returns the ids of the movies evaluated by the user. With these movie ids, we make a call to the database and display the recommended movies in the frontend.

---

## 7. Conclusion

This movie recommendation system project based on the Singular Value Decomposition (SVD) algorithm implemented a complete application combining aspects of machine learning, backend development with Python/FastAPI, and frontend development with React/Next.js.

For a better understanding, you may read this documentation with figures: https://drive.google.com/file/d/1hgZPTKOVXIS-eTN7XV5EI0-zPtG75syL/view?usp=sharing
