import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="landing">
      <div className="landing-bg"></div>
      <section className="hero">
        {/* <div className="hero-badge">Buyer Portal</div> */}
        <h1 className="hero-title">Find your next<br />home, simplified.</h1>
        <p className="hero-sub">
          Browse properties, save your favourites, and manage your search all in one place.
        </p>
        <div className="hero-actions">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">Get started</Link>
              <Link to="/login" className="btn btn-outline btn-lg">Sign in</Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
