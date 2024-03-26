// pages/index.js ou pages/Home.js selon la structure de votre projet
'use client'

import React, { useState, useEffect } from 'react';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import '../../components/MoviesContainerStyle.css'







export default function Home() {

  const [returnedMoviesList, setReturedMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state



  useEffect(() => {
    // Retrieve the stored list from localStorage
    const storedList = localStorage.getItem('RateMoviesByClient');

    // Ensuring storedList exists before parsing
    if (storedList) {
      setReturedMoviesList(JSON.parse(storedList));
      console.log("Rated movies that we will work in the recommandation")
      console.log(storedList)

    }

    // Define an async function within the useEffect
    const fetchRecommendedMovies = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/movies_recommendation_dynamic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: storedList
        });

        if (response.ok) {
          const recommendedMovies = await response.json();
          console.log("Recommended Movies:", recommendedMovies);

          setReturedMoviesList(recommendedMovies)


        } else {
          console.error("Failed to fetch recommended movies:", response.statusText);
        }
      } catch (error) {
        // Handle fetch errors here
        console.error("Error fetching recommended movies:", error);
      } finally {
        setIsLoading(false); // Finish loading

      }
    };

    // Invoke the async function
    fetchRecommendedMovies();
  }, []); // Ensure this effect is only run once on component mount




  return (
    <main className="bg-[#000000] flex min-h-screen flex-col items-center justify-between pt-10 px-24">
      <div className="container mx-auto px-2">
        <h1 className="text-5xl font-bold text-center mt-20 mb-10">Movies Recommender</h1>
      </div>
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center" style={{ marginTop: "-550px" }}>
            <div>
              <div className='flex justify-center items-center pt-5'>
                <div>Loading...</div>
                <div className="loader"></div>
              </div>
              <div>
                <p className="text-xl text-center text-gray-400 mt-10">We are treating your request, it might take a minute</p>
                <p className="text-xl text-center text-gray-400">or more, the AI algorithm is treating over 9000 movie in our database</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {returnedMoviesList.length > 0 && (
              <div className="text-center my-8">
                <p className="text-xl text-white">Here are the returned movies that might suit your prefernces:</p>
              </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {returnedMoviesList.map((movie) => (
                <div key={movie._id} className="flex flex-row items-center bg-[#18181b] rounded-lg overflow-hidden shadow-lg mb-4 pl-4 pr-4">
                  <img src={movie.poster_url} alt={movie.movieTitle} className="w-32 h-auto object-cover" />
                  <div className="p-6 flex-grow">
                    <h2 className="font-semibold text-xl">{movie.movieTitle} <span className="text-gray-400">({movie.releaseYear})</span></h2>
                    <p className="text-gray-400 mb-2">{movie.genre}</p>
                    <p className="text-gray-300 text-sm">{movie.overview.slice(0, 150)}{movie.overview.length > 150 ? "..." : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
  
}