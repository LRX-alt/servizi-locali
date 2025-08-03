'use client';

import { useState } from 'react';
import { Search, Map, Users, Building2, User, Menu, X, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import LoginProfessionistaModal from './LoginProfessionistaModal';
import RegisterProfessionistaModal from './RegisterProfessionistaModal';
import AuthTypeSelector from './AuthTypeSelector';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthTypeSelector, setShowAuthTypeSelector] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginProfessionistaModal, setShowLoginProfessionistaModal] = useState(false);
  const [showRegisterProfessionistaModal, setShowRegisterProfessionistaModal] = useState(false);
  
  const { isAuthenticated, utente, professionistaLoggato, userType, logout } = useAppStore();

  const navItems = [
    { href: '/', label: 'Professionisti', icon: Users },
    { href: '/servizi-pubblici', label: 'Servizi Pubblici', icon: Building2 },
    { href: '/mappa', label: 'Mappa', icon: Map },
    { href: '/dashboard', label: 'Dashboard', icon: User },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogin = async (form: any) => {
    try {
      await useAppStore.getState().login(form);
      setShowLoginModal(false);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (form: any) => {
    try {
      await useAppStore.getState().register(form);
      setShowRegisterModal(false);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleLoginProfessionista = async (form: any) => {
    try {
      await useAppStore.getState().loginProfessionista(form);
      setShowLoginProfessionistaModal(false);
    } catch (error) {
      console.error('Login professionista failed:', error);
    }
  };

  const handleRegisterProfessionista = async (form: any) => {
    try {
      await useAppStore.getState().registerProfessionista(form);
      setShowRegisterProfessionistaModal(false);
    } catch (error) {
      console.error('Registration professionista failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleSwitchToRegisterProfessionista = () => {
    setShowLoginProfessionistaModal(false);
    setShowRegisterProfessionistaModal(true);
  };

  const handleSwitchToLoginProfessionista = () => {
    setShowRegisterProfessionistaModal(false);
    setShowLoginProfessionistaModal(true);
  };

  const handleSelectUser = () => {
    setShowAuthTypeSelector(false);
    setShowLoginModal(true);
  };

  const handleSelectProfessionista = () => {
    setShowAuthTypeSelector(false);
    setShowLoginProfessionistaModal(true);
  };

  const getDisplayName = () => {
    if (userType === 'utente' && utente) {
      return utente.nome;
    } else if (userType === 'professionista' && professionistaLoggato) {
      return `${professionistaLoggato.nome} (Prof.)`;
    }
    return '';
  };

  const getProfileLink = () => {
    if (userType === 'utente') {
      return '/profilo';
    } else if (userType === 'professionista') {
      return '/dashboard';
    }
    return '/profilo';
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SL</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Servizi Locali</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Auth Button */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href={getProfileLink()}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    <User className="w-4 h-4" />
                    <span>{getDisplayName()}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthTypeSelector(true)}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Accedi</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                
                {/* Mobile Auth */}
                <div className="pt-3 border-t border-gray-200">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <Link
                        href={getProfileLink()}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium bg-blue-100 text-blue-700"
                      >
                        <User className="w-5 h-5" />
                        <span>Profilo - {getDisplayName()}</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowAuthTypeSelector(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 w-full"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Accedi</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Type Selector */}
      <AuthTypeSelector
        isOpen={showAuthTypeSelector}
        onClose={() => setShowAuthTypeSelector(false)}
        onSelectUser={handleSelectUser}
        onSelectProfessionista={handleSelectProfessionista}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSwitchToRegister={handleSwitchToRegister}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />

      {/* Login Professionista Modal */}
      <LoginProfessionistaModal
        isOpen={showLoginProfessionistaModal}
        onClose={() => setShowLoginProfessionistaModal(false)}
        onLogin={handleLoginProfessionista}
        onSwitchToRegister={handleSwitchToRegisterProfessionista}
      />

      {/* Register Professionista Modal */}
      <RegisterProfessionistaModal
        isOpen={showRegisterProfessionistaModal}
        onClose={() => setShowRegisterProfessionistaModal(false)}
        onRegister={handleRegisterProfessionista}
        onSwitchToLogin={handleSwitchToLoginProfessionista}
      />
    </>
  );
} 