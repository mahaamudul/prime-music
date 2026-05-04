import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Premium from './pages/Premium';
import Library from './pages/Library';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/library" element={<Library />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
