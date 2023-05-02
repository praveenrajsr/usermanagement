import './App.css';
import {Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import {AuthProvider} from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
          <Routes>
              <Route path='/' element={<PrivateRoute><Dashboard /></PrivateRoute>} exact/>
            <Route  path='/login' element={<LoginPage />} />
          </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
