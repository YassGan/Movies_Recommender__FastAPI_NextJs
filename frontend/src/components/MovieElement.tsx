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
  onRating, 
  onClose 

}) => {


  return (
    <div className="group bg-[#18181b] text-white rounded-lg overflow-hidden shadow-lg pl-4 pr-4 pt-4 transition duration-200 ease-in-out transform hover:shadow-2xl hover:scale-105 relative">
<button 
  onClick={() => onClose(title)}
  className="absolute top-0 left-0 mt-4 ml-4 bg-red-500 text-white font-semibold px-4 py-2 rounded shadow hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
>
  &times;
</button>

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
