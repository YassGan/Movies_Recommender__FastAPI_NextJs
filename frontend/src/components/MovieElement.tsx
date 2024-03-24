// components/MovieElement.tsx
'use client'
import React from 'react';
import StarRating from './StarRating';

type MovieElementProps = {
  title: string;
  releaseYear: number;
  genre: string;
  tagline: string;
  imageUrl: string;
};

const MovieElement: React.FC<MovieElementProps> = ({
  title,
  releaseYear,
  genre,
  tagline,
  imageUrl,
  onRating, // Ajoutez cette ligne

}) => {


  return (
    <div className="  bg-[#18181b] text-white rounded-lg overflow-hidden shadow-lg pl-4 pr-4 pt-4 transition duration-200 ease-in-out transform hover:shadow-2xl hover:scale-105">
      <img className="w-full h-60 object-cover" src={imageUrl} alt={`${title} movie cover`} />
      <div className="p-4">
        <div className="font-bold text-xl mb-1">{title}</div>
        <div className="text-gray-400 text-sm mb-2">{releaseYear} • {genre}</div>
        {/* <p className="text-gray-400 text-base mb-2">{tagline}</p> */}
        <StarRating onRatingSelected={onRating} />
      </div>
    </div>
  );
};

export default MovieElement;
