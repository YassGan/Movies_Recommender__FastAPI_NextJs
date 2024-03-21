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
  const handleRatingSelected = (rating: number) => {
    console.log(`${title}: ${rating} étoile(s)`);
  };

  return (
    <div className="w-1/2 bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg p-4">
      <img className="w-full h-60 object-cover" src={imageUrl} alt={`${title} movie cover`} />
      <div className="p-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <div className="text-gray-400 text-sm mb-4">{releaseYear} • {genre}</div>
        <p className="text-gray-400 text-base mb-4">{tagline}</p>
        <StarRating onRatingSelected={onRating} />
      </div>
    </div>
  );
};

export default MovieElement;
