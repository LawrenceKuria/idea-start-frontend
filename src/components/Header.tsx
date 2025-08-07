import { Link, useNavigate } from "@tanstack/react-router";
import { Lightbulb } from 'lucide-react'
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/api/auth";

const Header = () => {
  const navigate = useNavigate()
  const { user, setUser, setAccessToken } = useAuth()

  const handleLogout = async () => {
    try {
      await logoutUser()
      setAccessToken(null)
      setUser(null)
      navigate({ to:'/' })
    } catch (error: any) {
      console.log('Logout failed: ', error);
    }
  }
  
    return (
    <header className="bg-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link to="/" className="flex items-center">
          <Lightbulb className="w-8 h-8 text-yellow-400" />
          <span className="ml-2 text-2xl font-bold text-black">StartIt</span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link
            to="/ideas"
            className="text-gray-700 hover:text-black font-medium transition-colors"
          >
            Ideas
          </Link>
          { user && (
            <Link
              to="/ideas/new"
              className="
                inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium
                px-4 py-2 rounded-lg shadow transition"
            >
              + New Idea
            </Link>
          )}
          
        </nav>
        <div className="flex items-center space-x-2">
          {
            !user ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-700 font-medium transition px-3 py-2 leading-none">
                  Login
                </Link>
                <Link to="/register" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition px-4 py-2 rounded-md leading-none">
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="text-gray-700 font-medium px-2 hidden sm:block">
                  Welcome, {user.name}
                </span>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-900 font-medium transition px-3 py-2 leading-none cursor-pointer">
                  Logout
                </button>
              </>
            )
          }
          
        </div>
      </div>
    </header>
  )
}
 
export default Header;