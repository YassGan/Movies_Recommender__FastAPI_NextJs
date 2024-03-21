// components/StarRating.tsx
'use client'
import React, { useState } from 'react';

// Ajout de onRatingSelected dans les props
const StarRating: React.FC<{ initialRating?: number; onRatingSelected: (rating: number) => void }> = ({
  initialRating = 0,
  onRatingSelected,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleRating = (ratingValue: number) => {
    setRating(ratingValue);
    onRatingSelected(ratingValue); // Appel de la fonction de rappel avec la nouvelle valeur
  };

  return (
    <div className="flex items-center">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;

        return (
          <label key={index}>
            <input
              className="hidden"
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleRating(ratingValue)}
            />
            <span
              className={`text-xl cursor-pointer ${
                ratingValue <= (hover || rating) ? 'text-yellow-500' : 'text-gray-300'
              }`}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
