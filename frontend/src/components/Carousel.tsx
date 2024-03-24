import React, { useState, useEffect } from 'react';
import './Carousel.css';
import MovieElement from './MovieElement';

const Carousel = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [movieRatings, setMovieRatings] = useState([]);
  const [slidesArray, setSlidesArray] = useState([]);

  const [isPopupVisible, setIsPopupVisible] = useState(false);



  // Use useEffect to update slidesArray only when slides prop changes
  useEffect(() => {
    setSlidesArray(slides);
  }, [slides]); // Dependency array ensures effect runs only when slides changes




  const handleClosing = (title) => {
    console.log("Closing button is clicked")
    const updatedSlides = slidesArray.filter(movie => movie.movieTitle !== title);
    setSlidesArray(updatedSlides); // Update slidesArray to reflect the removal
  }



  const handleRating = (title, rating) => {
    // Update ratings
    const updatedRatings = [...movieRatings];
    const movieIndex = updatedRatings.findIndex(movie => movie.title === title);
    if (movieIndex > -1) {
      updatedRatings[movieIndex].rating = rating;
    } else {
      updatedRatings.push({ title, rating });
    }
    setMovieRatings(updatedRatings);

    // Filter out the rated movie
    const updatedSlides = slidesArray.filter(movie => movie.movieTitle !== title);
    setSlidesArray(updatedSlides); // Update slidesArray to reflect the removal
  };

  const recommendClicked = () => {
    console.log("Rated Movies:", movieRatings);
    alert(movieRatings);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex - 1 < 0 ? slidesArray.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex + 1 === slidesArray.length ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };



  const numberOfSlidesToShow = 8;
  let startIdx = currentIndex;
  let endIdx = startIdx + numberOfSlidesToShow;
  // Adjust if the end index goes beyond the length of slidesArray
  if (endIdx > slidesArray.length) {
    endIdx = slidesArray.length;
  };



  return (
    <div
      className="carousel-container flex justify-center items-center mb-5">
      <div onMouseEnter={() => setIsPopupVisible(true)}
        onMouseLeave={() => setIsPopupVisible(false)} onClick={recommendClicked} className="text-gray-400 hover:text-white px-3 py-2 cursor-pointer text-sm font-medium fixed top-0 right-0 m-4 p-2 rounded-lg z-50 mr-40">
        <h1   >Recommended {movieRatings.length}</h1>
      </div>



      <div className="carousel-wrapper flex justify-between items-center w-full">
        <button onClick={goToPrevious} className="left-arrow bg-white text-black border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md hover:bg-gray-200 transition-colors duration-300 mx-2">
          &lt;
        </button>
        <div className="carousel-content-wrapper flex overflow-hidden">
          <div className="carousel-content flex transition-transform duration-500">
            {slidesArray
              .slice(startIdx, endIdx) // Use dynamic start and end indices based on currentIndex
              .map((slide, index) => (
                <div className="carousel-item flex-shrink-0 w-full flex justify-center" key={index}>
                  <MovieElement
                    title={slide.movieTitle}
                    releaseYear={slide.releaseYear}
                    genre={slide.genre}
                    tagline={slide.tagline}
                    imageUrl={slide.poster_url}
                    onRating={(rating) => handleRating(slide.movieTitle, rating)}
                    onClose={() => handleClosing(slide.movieTitle)}

                  />
                </div>
              ))}
          </div>
        </div>
        <button onClick={goToNext} className="right-arrow bg-white text-black border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md hover:bg-gray-200 transition-colors duration-300 mx-2">
          &gt;
        </button>
      </div>

      {isPopupVisible && (
  <div className="rated-movies-popup absolute top-0 left-0 bg-green-300 text-black p-4 rounded-lg shadow-lg z-50 m-4">
  <h2>-- You did rate:</h2>
          <ul>
            {movieRatings.map((movie, index) => (
            <li key={index}>{`${movie.title} :  ${movie.rating} Stars`}</li>
            ))}
          </ul>
        </div>
      )}



    </div>
  );
};

export default Carousel;
