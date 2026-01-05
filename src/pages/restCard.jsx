import "../css/restCard.css";
function getPhotoUrl(photoReference) {
  if (!photoReference) return null;

  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${photoReference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
}
function RestaurantCard({ restaurant }) {
  const photoUrl = getPhotoUrl(restaurant.photos?.[0]?.photo_reference);

  return (
    <div className="restaurantCard">
      {photoUrl && (
        <img src={photoUrl} alt={restaurant.name} className="restaurantImg" />
      )}

      <div className="restaurantInfo">
        <h2>{restaurant.name}</h2>

        <p className="address">📍 {restaurant.formatted_address}</p>

        <div className="meta">
          ⭐ {restaurant.rating} ({restaurant.user_ratings_total})
          {restaurant.price_level && (
            <span> · 💰 {"$".repeat(restaurant.price_level)}</span>
          )}
          <span> - (Google)</span>
        </div>

        <div className="status">
          {restaurant.opening_hours?.open_now ? "🟢 Open now" : "🔴 Closed"}
        </div>

        <div className="RM">Go and Rate me!</div>
      </div>
    </div>
  );
}
export default RestaurantCard;
