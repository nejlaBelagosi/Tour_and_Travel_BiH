import React, { useState, useEffect } from 'react';

export default function ReviewForm({ reservationId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Provjera logovanja
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    // Provjerite status logovanja (zamijenite ovo stvarnim provjerama)
    const loggedIn = true; // Provjerite da li je korisnik logovan
    setIsLoggedIn(loggedIn);

    // Provjerite status rezervacije i endDate
    fetch(`http://localhost:5278/api/Reservation/${reservationId}`)
      .then(response => response.json())
      .then(data => {
        const endDate = new Date(data.endDate);
        const today = new Date();
        if (data.reservationStatus === 'zavrseno' && endDate < today) {
          setCanSubmit(true);
        }
      });
  }, [reservationId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Morate biti logovani da biste dodali recenziju.");
      return;
    }

    const review = {
      rating,
      reviewComment: comment,
      reservationId,
      postDate: new Date().toISOString().split('T')[0]
    };

    fetch('http://localhost:5278/api/Review/PostReview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(review)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Neuspješno slanje recenzije.');
        }
      })
      .then(data => {
        onReviewSubmitted();
        alert("Recenzija je uspješno dodana.");
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Neuspješno slanje recenzije. Provjerite status rezervacije.");
      });
  };

  if (!isLoggedIn) {
    return <div>Morate biti logovani da biste dodali recenziju.</div>;
  }

  if (!canSubmit) {
    return <div>Ne možete dodati recenziju dok vaša tura ne završi.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Ocjena:
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Komentar:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Dodaj recenziju</button>
    </form>
  );
}
