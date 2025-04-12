import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { usePreset } from '@/hooks/weightContext';
import { Rule } from '@/hooks/dataContext';

interface RatingStarsProps {
  rule?: Rule;
}

export default function RatingStars({ rule }: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(0);
  const { preset } = usePreset();

  const submitRating = useMutation({
    mutationFn: async (rating: number) => {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: rule?.id,
          user: 'anonymous',
          rating,
          preset,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }
      return response.json();
    },
  });

  const handleClick = (selectedRating: number) => {
    setRating(selectedRating);
    submitRating.mutate(selectedRating);
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={(hoverRating || rating) >= star ? faStarSolid : faStarRegular}
          className="cursor-pointer text-yellow-400"
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleClick(star)}
        />
      ))}
    </div>
  );
}
