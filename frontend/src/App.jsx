import QuizPage from './pages/QuizPage'
import LoginUser from './pages/LoginUser'
import SnD from './pages/SnD';
import AdminOption from './pages/AdminOption';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import Renderer from './components/Renderer'
import AddQs from './components/AddQs';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <BrowserRouter>
    <Renderer />
    <Routes>
      <Route path='/quiz/*' element={<QuizPage />} />
      <Route path='/add' element={<AddQs />} />
      <Route path='/admin' element={<AdminOption />} />
      <Route path='/admin-login' element={<AdminLogin />} />
      <Route path='/' element={<LoginUser />} />
      <Route path="/SnD/*" element={<SnD />} />
      <Route path="*" element={<LoginUser />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;
