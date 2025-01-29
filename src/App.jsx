import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Deploy from './pages/Deploy.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deploy" element={<Deploy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
