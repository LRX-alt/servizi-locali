'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { Menu, X, User, Building2, LogOut } from 'lucide-react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import LoginProfessionistaModal from './LoginProfessionistaModal';
import RegisterProfessionistaModal from './RegisterProfessionistaModal';
import AuthTypeSelector from './AuthTypeSelector';
import NotificationModal from './NotificationModal';

export default function Header() {
  const {
    utente,
    professionistaLoggato,
    userType,
    isAuthenticated,
    logout,
    isAdmin
  } = useAppStore();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthTypeSelector, setShowAuthTypeSelector] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginProfessionistaModal, setShowLoginProfessionistaModal] = useState(false);
  const [showRegisterProfessionistaModal, setShowRegisterProfessionistaModal] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [showLogoutNotice, setShowLogoutNotice] = useState(false);

  // Previeni errori di idratazione
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Apri selettore auth da query param ?login=1
  useEffect(() => {
    if (!hasMounted) return;
    const login = searchParams.get('login');
    if (login === '1' && !isAuthenticated) {
      setShowAuthTypeSelector(true);
      // pulizia query param
      const params = new URLSearchParams(searchParams);
      params.delete('login');
      router.replace(`?${params.toString()}`);
    }
  }, [hasMounted, searchParams, isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutNotice(true);
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
              {hasMounted && isAuthenticated && userType === 'professionista' && (
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">
                  Dashboard
                </Link>
              )}
              {/* Rimosso link Admin dalla nav centrale per evitare duplicazione */}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {hasMounted && isAuthenticated ? (
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
                  {hasMounted && isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
                    >
                      <span className="text-sm font-medium">Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              ) : hasMounted ? (
                <button
                  onClick={() => setShowAuthTypeSelector(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Accedi
                </button>
              ) : null}
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
                {hasMounted && isAuthenticated && userType === 'professionista' && (
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                {/* Admin nel menu mobile resta solo nell'area utente sotto */}
              </nav>

              <div className="mt-4 pt-4 border-t border-gray-200">
                {hasMounted && isAuthenticated ? (
                  <div className="space-y-2">
                    <span className="block px-3 py-2 text-sm text-gray-700">
                      Ciao, {userType === 'utente' ? utente?.nome : professionistaLoggato?.nome}
                    </span>
                    <Link href={userType === 'utente' ? '/profilo' : '/dashboard'} className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-800" onClick={() => setIsMenuOpen(false)}>
                      {userType === 'utente' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                      <span className="text-sm font-medium">Profilo</span>
                    </Link>
                    {hasMounted && isAdmin && (
                      <Link href="/admin" className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                        <span className="text-sm font-medium">Admin</span>
                      </Link>
                    )}
                    {hasMounted && isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-sm font-medium">Admin</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-800 w-full text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                ) : hasMounted ? (
                  <button
                    onClick={() => {
                      setShowAuthTypeSelector(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Accedi
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <NotificationModal
        isOpen={showLogoutNotice}
        onClose={() => setShowLogoutNotice(false)}
        title="Sei uscito"
        message="Logout effettuato con successo."
      />
      {/* Rimosso il pop-up di verifica email: reindirizzo direttamente alla pagina dedicata */}
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
        onLogin={async (form) => {
          try {
            await useAppStore.getState().login(form);
            setShowLoginModal(false);
          } catch (error) {
            console.error('Login failed:', error);
            throw error;
          }
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => handleSwitchToLogin('user')}
        onRegister={async (form) => {
          try {
            await useAppStore.getState().register(form);
            setShowRegisterModal(false);
            router.push('/verifica-email');
          } catch (error) {
            console.error('Registration failed:', error);
            throw error;
          }
        }}
      />

      <LoginProfessionistaModal
        isOpen={showLoginProfessionistaModal}
        onClose={() => setShowLoginProfessionistaModal(false)}
        onSwitchToRegister={() => handleSwitchToRegister('professionista')}
        onLogin={async (form) => {
          try {
            await useAppStore.getState().loginProfessionista(form);
            setShowLoginProfessionistaModal(false);
          } catch (error) {
            console.error('Login professionista failed:', error);
            throw error;
          }
        }}
      />

      <RegisterProfessionistaModal
        isOpen={showRegisterProfessionistaModal}
        onClose={() => setShowRegisterProfessionistaModal(false)}
        onSwitchToLogin={() => handleSwitchToLogin('professionista')}
        onRegister={async (form) => {
          try {
            await useAppStore.getState().registerProfessionista(form);
            setShowRegisterProfessionistaModal(false);
            router.push('/verifica-email');
          } catch (error) {
            console.error('Registration professionista failed:', error);
            throw error;
          }
        }}
      />
    </>
  );
} 