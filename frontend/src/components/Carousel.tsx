import React, { useState } from 'react';
import './Carousel.css'; // Adjust path to your Carousel CSS file
import MovieElement from './MovieElement'; // adjust the import path as needed

const Carousel = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [movieRatings, setMovieRatings] = useState([]);

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
    // Log the rated movies to the console
    console.log("Rated Movies:", movieRatings);
    alert(movieRatings)
  };

  const goToPrevious = () => {
    const newIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex + 1 === slides.length ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const filteredSlides = slides.filter(slide =>
    !movieRatings.some(ratedMovie => ratedMovie.title === slide.title)
  );

  const displayedSlides = [];
  for (let i = 0; i < Math.min(6, filteredSlides.length); i++) {
    displayedSlides.push(filteredSlides[(currentIndex + i) % filteredSlides.length]);
  }

  return (
    <div className="carousel-container flex justify-center items-center mb-40">
        <div onClick={recommendClicked} className="text-gray-400 hover:text-white px-3 py-2 cursor-pointer text-sm font-medium fixed top-0 right-0 m-4 p-2 rounded-lg z-50 mr-40">
        <h1>Recommended {movieRatings.length}</h1>
      </div>



      <div className="carousel-wrapper flex justify-between items-center w-full">
        <button onClick={goToPrevious} className="left-arrow bg-white text-black border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md hover:bg-gray-200 transition-colors duration-300 mx-2">
          &lt;
        </button>
        <div className="carousel-content-wrapper flex overflow-hidden">
          <div className="carousel-content flex transition-transform duration-500">
            {displayedSlides.map((slide, index) => (
              <div className="carousel-item flex-shrink-0 w-full flex justify-center" key={index}>
             <MovieElement
              key={slide.id}
              title={slide.title}
              releaseYear={slide.releaseYear}
              genre={slide.genre}
              tagline={slide.tagline}
              imageUrl={slide.imageUrl}
              onRating={(rating) => handleRating(slide.title, rating)}
            />
              </div>
            ))}
          </div>
        </div>
        <button onClick={goToNext} className="right-arrow bg-white text-black border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md hover:bg-gray-200 transition-colors duration-300 mx-2">
          &gt;
        </button>
      </div>


    </div>
  );
};

export default Carousel;
