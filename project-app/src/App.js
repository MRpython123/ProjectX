import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your pages/components here
import MainPage from './MainPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Register all your pages/components here */}
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
