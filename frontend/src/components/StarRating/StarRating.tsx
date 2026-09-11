export function StarRating({ stars = 0 }: { stars?: number }) {
  return (
    <div className="star-rating" role="img" aria-label={`${stars} of 3 stars`}>
      {[1, 2, 3].map((star) => (
        <span
          key={star}
          className={star <= stars ? "star-on" : "star-off"}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}
