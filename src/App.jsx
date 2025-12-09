import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Demo from './pages/Demo';
import Article from './pages/Article';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/article" element={<Article />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

