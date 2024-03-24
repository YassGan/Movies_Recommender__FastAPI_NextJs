import React, { useState } from 'react';
import MovieElement from './MovieElement'; // Adjust the import path as needed
import moviesData from './moviesData';
import Carousel from "./Carousel";

const MoviesContainer = () => {
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [movieRatings, setMovieRatings] = useState([]);
  const [activeButton, setActiveButton] = useState('grid');

  const handleRating = (title, rating) => {
    const updatedRatings = [...movieRatings];
    const movieIndex = updatedRatings.findIndex(movie => movie.title === title);

    if (movieIndex > -1) {
      updatedRatings[movieIndex].rating = rating;
    } else {
      updatedRatings.push({ title, rating });
    }

    setMovieRatings(updatedRatings);
  };

  const recommendClicked = () => {
    console.log("Rated Movies:", movieRatings);
    alert(movieRatings)

  };

  const filteredMovies = moviesData.filter(movie => {
    const movieRated = movieRatings.find(mr => mr.title === movie.title);
    return movie.releaseYear <= yearFilter && !movieRated;
  });

  return (
    <div className="movies-container mb-40">
      {activeButton === 'grid' && (
        <div onClick={recommendClicked} className="text-gray-400 hover:text-white px-3 py-2 cursor-pointer text-sm font-medium fixed top-0 right-0 m-4 p-2 rounded-lg z-50 mr-40">
          <h1>Recommended {movieRatings.length}</h1>
        </div>
      )}





<div className='flex justify-center items-center mb-5'>
        <div className="border border-gray-700 pr-3 pl-3 pt-2 pb-2 rounded-lg flex space-x-4 bg-[#18181b]">
          <button
            onClick={() => setActiveButton('grid')}
            className={`flex justify-center items-center text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 ${
              activeButton === 'grid' ? 'bg-pink-500 hover:bg-pink-700' : 'bg-transparent hover:bg-gray-500'
            }`}
          >
            <img style={{ filter: 'invert(100%)' }} className='h-6 w-6 mr-3' src='/collage.png'/>
            Grid
          </button>
          <button
            onClick={() => setActiveButton('slider')}
            className={`flex justify-center items-center text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 ${
              activeButton === 'slider' ? 'bg-green-500 hover:bg-green-700' : 'bg-transparent hover:bg-gray-500'
            }`}
          >
            <img style={{ filter: 'invert(100%)' }} className='h-6 w-6 mr-3' src='/slider.png'/>
            Slider
          </button>
        </div>
      </div>

      {activeButton === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 transition duration-200 ease-in-out transform hover:shadow-2xl hover:scale-104">
          {filteredMovies.map(movie => (
            <MovieElement
              key={movie.id}
              title={movie.title}
              releaseYear={movie.releaseYear}
              genre={movie.genre}
              tagline={movie.tagline}
              imageUrl={movie.imageUrl}
              onRating={(rating) => handleRating(movie.title, rating)}
            />
          ))}
        </div>
      ) : (
        <Carousel slides={moviesData} />
      )}

    </div>
  );
};

export default MoviesContainer;
