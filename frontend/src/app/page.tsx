// pages/index.js ou pages/Home.js selon la structure de votre projet
'use client'

import React, { useState } from 'react';
import MovieElement from '../components/MovieElement'; // Ajustez le chemin selon votre structure

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";





import MoviesContainer from '../components/MoviesContainer'; // Adjust the import path as needed


export default function Home() {




  return (
    <main className=" bg-[#000000] flex min-h-screen flex-col items-center justify-between pt-10 px-24">
      <div> 



        <div className="container mx-auto px-2">

          <h1 className="text-5xl font-bold text-center mt-20">Movies Recommender</h1>
          <div className=" text-gray-400 hover:text-white px-3 py-2 cursor-pointer text-sm font-medium fixed top-0 right-0 m-4 p-2 rounded-lg z-50 mr-40">
</div>

          <p className="text-xl text-center text-gray-400 mt-5">An AI movies recommender that </p>
          <p className="text-xl text-center text-gray-400 mt-1 mb-10">suggests movies that suits your preferences and interests. </p>
        </div>
        <div className="">
          
  <MoviesContainer/>




          {/* Répétez pour d'autres films, en passant la fonction onRating appropriée */}
        </div>
      </div>
    </main>
  );
}
