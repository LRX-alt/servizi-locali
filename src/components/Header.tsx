'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { Menu, X, User, Building2, LogOut } from 'lucide-react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import LoginProfessionistaModal from './LoginProfessionistaModal';
import RegisterProfessionistaModal from './RegisterProfessionistaModal';
import AuthTypeSelector from './AuthTypeSelector';

export default function Header() {
  const {
    utente,
    professionistaLoggato,
    userType,
    isAuthenticated,
    logout
  } = useAppStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthTypeSelector, setShowAuthTypeSelector] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginProfessionistaModal, setShowLoginProfessionistaModal] = useState(false);
  const [showRegisterProfessionistaModal, setShowRegisterProfessionistaModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: unknown) {
      console.error('Logout error:', error);
    }
  };

  const handleAuthTypeSelect = (type: 'user' | 'professionista') => {
    setShowAuthTypeSelector(false);
    if (type === 'user') {
      setShowLoginModal(true);
    } else {
      setShowLoginProfessionistaModal(true);
    }
  };

  const handleSwitchToRegister = (type: 'user' | 'professionista') => {
    if (type === 'user') {
      setShowLoginModal(false);
      setShowRegisterModal(true);
    } else {
      setShowLoginProfessionistaModal(false);
      setShowRegisterProfessionistaModal(true);
    }
  };

  const handleSwitchToLogin = (type: 'user' | 'professionista') => {
    if (type === 'user') {
      setShowRegisterModal(false);
      setShowLoginModal(true);
    } else {
      setShowRegisterProfessionistaModal(false);
      setShowLoginProfessionistaModal(true);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Servizi Locali</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
                Home
              </Link>
              <Link href="/servizi-pubblici" className="text-gray-700 hover:text-gray-900 font-medium">
                Servizi Pubblici
              </Link>
              <Link href="/mappa" className="text-gray-700 hover:text-gray-900 font-medium">
                Mappa
              </Link>
              {isAuthenticated && (
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">
                  Dashboard
                </Link>
              )}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Ciao, {userType === 'utente' ? utente?.nome : professionistaLoggato?.nome}
                  </span>
                  <Link
                    href={userType === 'utente' ? '/profilo' : '/dashboard'}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    {userType === 'utente' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                    <span className="text-sm font-medium">Profilo</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthTypeSelector(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Accedi
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/servizi-pubblici"
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Servizi Pubblici
                </Link>
                <Link
                  href="/mappa"
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mappa
                </Link>
                {isAuthenticated && (
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
              </nav>

              <div className="mt-4 pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <span className="block px-3 py-2 text-sm text-gray-700">
                      Ciao, {userType === 'utente' ? utente?.nome : professionistaLoggato?.nome}
                    </span>
                    <Link
                      href={userType === 'utente' ? '/profilo' : '/dashboard'}
                      className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {userType === 'utente' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                      <span className="text-sm font-medium">Profilo</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-800 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowAuthTypeSelector(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Accedi
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <AuthTypeSelector
        isOpen={showAuthTypeSelector}
        onClose={() => setShowAuthTypeSelector(false)}
        onSelectUser={() => handleAuthTypeSelect('user')}
        onSelectProfessionista={() => handleAuthTypeSelect('professionista')}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => handleSwitchToRegister('user')}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => handleSwitchToLogin('user')}
      />

      <LoginProfessionistaModal
        isOpen={showLoginProfessionistaModal}
        onClose={() => setShowLoginProfessionistaModal(false)}
        onSwitchToRegister={() => handleSwitchToRegister('professionista')}
      />

      <RegisterProfessionistaModal
        isOpen={showRegisterProfessionistaModal}
        onClose={() => setShowRegisterProfessionistaModal(false)}
        onSwitchToLogin={() => handleSwitchToLogin('professionista')}
      />
    </>
  );
} 