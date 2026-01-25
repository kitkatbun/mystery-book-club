import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <div className="home-welcome">
        <h1>Mystery Book Club</h1>
        <p className="subtitle">Where every page turns into an adventure</p>
        <p className="description">
          Welcome to our cozy corner of the literary world! We're a group of
          mystery enthusiasts who gather to discuss whodunits, cozies, and
          thrilling tales. Whether you prefer amateur sleuths, small-town
          mysteries, or classic detective stories, you've found your people.
        </p>
      </div>

      <div className="decorative-divider">&#128270;</div>

      <div className="home-nav-cards">
        <Link to="/past-books" className="nav-card">
          <div className="nav-card-icon">&#128218;</div>
          <h2>Past Books</h2>
          <p>Explore all the mysteries we've solved together</p>
        </Link>

        <Link to="/recommendations" className="nav-card">
          <div className="nav-card-icon">&#128161;</div>
          <h2>Recommendations</h2>
          <p>Discover what our members are excited to read next</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
