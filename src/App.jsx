import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PastBooks from './pages/PastBooks';
import Recommendations from './pages/Recommendations';
import NextUp from './pages/NextUp';
import './App.css';

function App() {
  return (
    <Router basename="/mystery-book-club">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/past-books" element={<PastBooks />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/next-up" element={<NextUp />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
