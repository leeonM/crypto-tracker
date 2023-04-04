import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar';
import{ Home} from './pages/home';
import {Auth} from './pages/auth';
import {SavedCrypto} from './pages/saved-crypto';

function App() {
  return (
    <div className="w-full justify-between 
    items-center">
    <Router>
    <Navbar />
       <Routes>
       <Route path="/" element={<Home/>}/>
       <Route path="/auth" element={<Auth/>}/>
       <Route path="/saved-crypto" element={<SavedCrypto/>}/>
       </Routes>
    </Router>
    </div>
  );
}

export default App;
