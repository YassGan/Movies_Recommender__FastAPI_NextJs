import React, { useState, useEffect } from 'react';
import MovieElement from './MovieElement'; // Adjust the import path as needed
import moviesData2 from './moviesData';
import Carousel from "./Carousel";
import  "./MoviesContainerStyle.css"
import axios from 'axios'; // Make sure to install axios or use fetch API


import Link from 'next/link'


const MoviesContainer = () => {
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [movieRatings, setMovieRatings] = useState([]);
  const [activeButton, setActiveButton] = useState('grid');
  const [moviesData, setMoviesData] = useState([]); // State to hold fetched movies
  const [isLoading, setIsLoading] = useState(true); // Loading state

  
  const [isPopupVisible, setIsPopupVisible] = useState(false);


  const [page, setPage] = useState(1); // Page state for pagination
  const x = 10; // Number of movies to fetch each time

  useEffect(() => {
    fetchMovies(x, page);
  }, [page]);

  const fetchMovies = async (x, page) => {
    setIsLoading(true);

    try {
      
      // Include x and page in the request URL
      const response = await axios.get(`http://127.0.0.1:8000/AllMovies_test?x=${x}&page=${page}`);
      console.log("response.data")
      console.log(response.data)
      setMoviesData(response.data)

      if (page === 1) {

        setMoviesData(response.data);
      } else {
        setMoviesData(response.data); // Append new movies to the existing list
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false); // Finish loading
    }
  };





  const handleLoadMoreMovies = () => {
    setPage(prevPage => prevPage + 1); // Increment the page counter to fetch the next set of movies
  };




  const handleRating = (title, rating) => {
    const updatedRatings = [...movieRatings];
    const movieIndex = updatedRatings.findIndex(movie => movie.title === title);

    if (movieIndex > -1) {
      updatedRatings[movieIndex].rating = rating;
    } else {
      updatedRatings.push({ title, rating });
    }

    setMovieRatings(updatedRatings);
      // Filter out the rated movie from the moviesData state
  const updatedMoviesData = moviesData.filter(movie => movie.movieTitle !== title);
  setMoviesData(updatedMoviesData);
  };





  const handleClosing =(title) =>{
    const updatedMoviesData = moviesData.filter(movie => movie.movieTitle !== title);
    setMoviesData(updatedMoviesData);

  }





  const recommendClicked = () => {
    console.log("Rated Movies:", movieRatings);
    // alert(movieRatings)
    localStorage.setItem('RateMoviesByClient', JSON.stringify(movieRatings));

  };



  return (
    <div  className="movies-container mb-40">

      

{isLoading ? (
        <div style={{ marginBottom: '400px' }}  className="flex justify-center items-center ">
  
  <h2>Loading Movies ...</h2>
  
    <div className="loader">   </div> {/* Loading spinner appears only when isLoading is true */}
        </div>
      ) : activeButton === 'grid' && (
      
        <Link href="/ReturnedMovies">

        <div 

        onMouseEnter={() => setIsPopupVisible(true)}
        onMouseLeave={() => setIsPopupVisible(false)} 
        
        onClick={recommendClicked} className="text-gray-400 hover:text-white px-3 py-2 cursor-pointer text-sm font-medium fixed top-0 right-0 m-4 p-2 rounded-lg z-50 mr-40">
          <h1>Recommended {movieRatings.length}</h1>
        </div>
        </Link>
      )}

{isPopupVisible && (
  <div style={{marginTop:"70px",marginLeft:"70px"}} className="rated-movies-popup absolute  top-0 left-0 bg-pink-400 text-black p-4 rounded-lg shadow-lg z-50 m-4">
  <h2>-- You did rate:</h2>
          <ul>
            {movieRatings.map((movie, index) => (
            <li key={index}>{`${movie.title} :  ${movie.rating} Stars`}</li>
            ))}
          </ul>
        </div>
      )}



      <div className='flex justify-center items-center mb-5'>
        <div className="border border-gray-700 pr-3 pl-3 pt-2 pb-2 rounded-lg flex space-x-4 bg-[#18181b]">
          <button
            onClick={() => setActiveButton('grid')}
            className={`flex justify-center items-center text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 ${activeButton === 'grid' ? 'bg-pink-500 hover:bg-pink-700' : 'bg-transparent hover:bg-gray-500'
              }`}
          >
            <img style={{ filter: 'invert(100%)' }} className='h-6 w-6 mr-3' src='/collage.png' />
            Grid
          </button>
          <button
            onClick={() => setActiveButton('slider')}
            className={`flex justify-center items-center text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 ${activeButton === 'slider' ? 'bg-green-500 hover:bg-green-700' : 'bg-transparent hover:bg-gray-500'
              }`}
          >
            <img style={{ filter: 'invert(100%)' }} className='h-6 w-6 mr-3' src='/slider.png' />
            Slider
          </button>
        </div>
      </div>




      {activeButton === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 transition duration-200 ease-in-out transform hover:shadow-2xl hover:scale-104">
          {moviesData.map((movie, index) => (
            
            <MovieElement
              key={index} // Using the index as the key
              title={movie.movieTitle}
              releaseYear={movie.releaseYear}
              genre={movie.genre}
              tagline={movie.tagline}
              imageUrl={movie.poster_url}
              onRating={(rating) => handleRating(movie.movieTitle, rating)}
              onClose={() => handleClosing(movie.movieTitle) }
              
              

            />
          ))}

        </div>




      ) : (
        <Carousel slides={moviesData} />
      )}

      <div className="flex justify-center mt-4">
        <button onClick={handleLoadMoreMovies} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Load More Movies
        </button>
      </div>
    </div>
  );
};

export default MoviesContainer;
