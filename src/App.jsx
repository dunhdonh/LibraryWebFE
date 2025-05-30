import Header from './component/Header'
import Footer from './component/Footer'
import Homepage from './page/Homepage'  
import Login from './page/Auth/Login'
import Register from './page/Auth/Register'
import ForgotPassword from './page/Auth/ForgotPassword.jsx'
import UserProfile from './page/UserProfile'
import AllBooks from './page/AllBook.jsx'
import BookDetail from './page/BookDetail.jsx'
import MyReserving from './page/MyReserving.jsx'
import AdminPage from './page/Admin/AdminPage.jsx'
import RequireAdmin from './component/RequireAdmin.jsx'
// import Settings from './component/Settings'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout, setUser } from './redux/userSlice.js'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        dispatch(logout());
      } else {
        dispatch(setUser(decodedToken));
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/books" element={<AllBooks />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/my-reserving" element={<MyReserving />} />
          <Route path="/manage" element={<RequireAdmin />}>
            <Route index element={<AdminPage />} />
            {/* Add more admin routes here */}
          </Route>
        </Routes>
        
      </main>
      <Footer />
    </div>
  )
}

export default App
