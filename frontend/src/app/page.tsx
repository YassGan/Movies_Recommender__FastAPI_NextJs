// pages/index.js ou pages/Home.js selon la structure de votre projet
'use client'

import React, { useState } from 'react';
import MovieElement from '../components/MovieElement'; // Ajustez le chemin selon votre structure

export default function Home() {
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
    console.log(updatedRatings);
  };

  return (
    <main className=" bg-[#000000] flex min-h-screen flex-col items-center justify-between p-24">
      <div> 
        <div className="container mx-auto px-2">
          <h1 className="text-5xl font-bold text-center">Movies Recommender</h1>
          <p className="text-xl text-center text-gray-400 mt-5">An AI movies recommender that </p>
          <p className="text-xl text-center text-gray-400 mt-1 mb-10">suggests movies that suits your preferences and interests. </p>
        </div>
        <div className="">
          <MovieElement
            title="Inception"
            releaseYear={2010}
            genre="Sci-Fi"
            tagline="Your mind is the scene of the crime."
            imageUrl="https://fr.web.img2.acsta.net/medias/nmedia/18/72/34/14/19476654.jpg"
            onRating={(rating) => handleRating("Inception", rating)}
          />

<MovieElement
            title="Inception2"
            releaseYear={2012}
            genre="Sci-Fi"
            tagline="Your mind is the scene of the crime.2"
            imageUrl="https://fr.web.img2.acsta.net/medias/nmedia/18/72/34/14/19476654.jpg"
            onRating={(rating) => handleRating("Inception2", rating)}
          />


          {/* Répétez pour d'autres films, en passant la fonction onRating appropriée */}
        </div>
      </div>
    </main>
  );
}
