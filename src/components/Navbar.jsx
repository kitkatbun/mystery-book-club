import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <NavLink to="/" className="navbar-logo">
          Mystery Book Club
        </NavLink>
        <ul className="navbar-links">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/past-books">
              Past Books
            </NavLink>
          </li>
          <li>
            <NavLink to="/recommendations">
              Recommendations
            </NavLink>
          </li>
          <li>
            <NavLink to="/next-up">
              Next Up
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
