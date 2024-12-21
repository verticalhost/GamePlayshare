import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';
import AuthRequired from './components/AuthRequired';
import { Trophy, Upload as UploadIcon, Home as HomeIcon, User } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Upload', href: '/upload', icon: UploadIcon },
  { name: 'Challenges', href: '/challenges', icon: Trophy },
  { name: 'Profile', href: '/profile', icon: User },
];

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar navigation={navigation} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={
              <AuthRequired>
                <Upload />
              </AuthRequired>
            } />
            <Route path="/challenges" element={
              <AuthRequired>
                <Challenges />
              </AuthRequired>
            } />
            <Route path="/profile" element={
              <AuthRequired>
                <Profile />
              </AuthRequired>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;