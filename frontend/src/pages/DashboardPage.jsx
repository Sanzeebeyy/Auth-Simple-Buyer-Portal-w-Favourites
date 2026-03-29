import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

// dummy database for properties
const PROPERTIES = [
  { id: 1, title: 'Modern Studio', location: 'Patan, Lalitpur', price: 'Rs.40,000/mo', type: 'Studio', beds: 0, baths: 1 },
  { id: 2, title: 'Cozy 2 Bed Apartment', location: 'Patan, Lalitpur', price: 'Rs.31,000/mo', type: 'Apartment', beds: 2, baths: 1 },
  { id: 3, title: 'Spacious Family Home', location: 'Lagankhel, Lalitpur', price: 'Rs.48,000/mo', type: 'House', beds: 4, baths: 2 },
  { id: 4, title: 'Luxury Flat', location: 'Jawalakhel, Lalitpur', price: 'Rs.85,000/mo', type: 'Flat', beds: 3, baths: 3 },
  { id: 5, title: 'Modern Apartment', location: 'Bharatpur, Chitwan', price: 'Rs.50,000/mo', type: 'Apartment', beds: 3, baths: 2 },
  { id: 6, title: 'Sunny 1 Bed Room', location: 'Hakim Chowk, Chitwan', price: 'Rs.15,000/mo', type: 'Room', beds: 1, baths: 1 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [actionId, setActionId] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFavourites = useCallback(async () => {
    try {
      const res = await api.get('/favorites/show_favorite');
      setFavouriteIds(new Set(res.data.map((f) => f.property_id)));
    } catch {

    }
  }, []);

  useEffect(() => {
    fetchFavourites();
  }, [fetchFavourites]);

  const toggleFavourite = async (propertyId) => {
    setActionId(propertyId);
    const isFav = favouriteIds.has(propertyId);
    try {
      if (isFav) {
        await api.delete(`/favorites/remove_favorite/${propertyId}`);
        setFavouriteIds((prev) => {
          const next = new Set(prev);
          next.delete(propertyId);
          return next;
        });
        showToast('Removed from favourites.');
      } else {
        await api.post(`/favorites/favorite/${propertyId}`);
        setFavouriteIds((prev) => new Set(prev).add(propertyId));
        showToast('Added to favourites!');
      }
    } catch (err) {
      const detail = err?.response?.data?.detail;
      showToast(detail || 'Something went wrong.', 'error');
    } finally {
      setActionId(null);
    }
  };

  const myFavourites = PROPERTIES.filter((p) => favouriteIds.has(p.id));
  const allListings = PROPERTIES.filter((p) => !favouriteIds.has(p.id));

  return (
    <div className="dashboard">
      
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
      )}

      
      <header className="dash-header">
        <div>
          <h1 className="dash-title">Hello, {user?.name}</h1>
          <p className="dash-meta">{user?.email} | buyer</p>
        </div>
        <div className="dash-stat">
          <span className="stat-num">{favouriteIds.size}</span>
          <span className="stat-label">Saved</span>
        </div>
      </header>

      
      <section className="section">
        <h2 className="section-title">My Favourites</h2>
        {myFavourites.length === 0 ? (
          <p className="empty-state">No favourites yet. Like a property below to save it here.</p>
        ) : (
          <div className="property-grid">
            {myFavourites.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                isFav={true}
                loading={actionId === p.id}
                onToggle={() => toggleFavourite(p.id)}
              />
            ))}
          </div>
        )}
      </section>

      
      <section className="section">
        <h2 className="section-title">All Listings</h2>
        {allListings.length === 0 ? (
          <p className="empty-state">You&apos;ve saved every listing nice taste!</p>
        ) : (
          <div className="property-grid">
            {allListings.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                isFav={false}
                loading={actionId === p.id}
                onToggle={() => toggleFavourite(p.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PropertyCard({ property, isFav, loading, onToggle }) {
  return (
    <div className={`property-card ${isFav ? 'property-card--fav' : ''}`}>
      <div className="property-badge">{property.type}</div>
      <h3 className="property-title">{property.title}</h3>
      <p className="property-location">{property.location}</p>
      <div className="property-meta">
        {property.beds > 0 && <span>{property.beds} bd</span>}
        <span>{property.baths} ba</span>
      </div>
      <div className="property-footer">
        <span className="property-price">{property.price}</span>
        <button
          className={`btn-heart ${isFav ? 'btn-heart--active' : ''}`}
          onClick={onToggle}
          disabled={loading}
          aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
        >
          {loading ? '...' : isFav ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}
