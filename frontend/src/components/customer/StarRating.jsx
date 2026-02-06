import React, { useState } from "react";

const StarRating = ({ shopId, initialRating = 0, reviewCount = 0, onRatingUpdate }) => {
  const [rating, setRating] = useState(Number(initialRating));
  const [hover, setHover] = useState(0);
  const [count, setCount] = useState(reviewCount);

  const handleClick = async (star) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to rate this shop.");
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/shops/${shopId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: star }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to rate shop.");
        return;
      }

      setRating(data.average_rating);
      setCount(data.total_ratings);

      if (onRatingUpdate) onRatingUpdate(data.average_rating, data.total_ratings);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting rating.");
    }
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => handleClick(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          style={{
            cursor: "pointer",
            fontSize: "1.6rem",
            color: i <= (hover || Math.round(rating)) ? "#FFD700" : "#ddd",
          }}
        >
          ★
        </span>
      ))}
      <span style={{ marginLeft: 8 }}>
        {rating.toFixed(1)} ({count})
      </span>
    </div>
  );
};

export default StarRating;
