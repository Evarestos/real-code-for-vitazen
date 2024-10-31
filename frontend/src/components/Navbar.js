import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Dumbbell, Book } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col h-screen">
          <Link to="/" className="font-bold text-xl text-green-600 py-4">
            AI Wellness
          </Link>
          
          <div className="flex flex-col space-y-2">
            <Link 
              to="/chat"
              className={`flex items-center space-x-2 px-4 py-3 rounded-md ${
                location.pathname === '/chat' ? 'bg-green-100 text-green-700' : 'text-gray-600'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Chat</span>
            </Link>
            
            <Link 
              to="/programs"
              className={`flex items-center space-x-2 px-4 py-3 rounded-md ${
                location.pathname === '/programs' ? 'bg-green-100 text-green-700' : 'text-gray-600'
              }`}
            >
              <Dumbbell className="h-5 w-5" />
              <span>Προγράμματα</span>
            </Link>
            
            <Link 
              to="/library"
              className={`flex items-center space-x-2 px-4 py-3 rounded-md ${
                location.pathname === '/library' ? 'bg-green-100 text-green-700' : 'text-gray-600'
              }`}
            >
              <Book className="h-5 w-5" />
              <span>Βιβλιοθήκη</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 