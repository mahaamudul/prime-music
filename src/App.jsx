import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Playlist from './pages/Playlist';
import Premium from './pages/Premium';
import Library from './pages/Library';

function App() {
  return (
    <Router>
      <MusicPlayerProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlist/:id" element={<Playlist />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/library" element={<Library />} />
          </Routes>
        </Layout>
      </MusicPlayerProvider>
    </Router>
  );
}

export default App;
