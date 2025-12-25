'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthDialog from './AuthDialog';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  // Function to get user's initials for avatar
  const getUserInitials = () => {
    if (!user || !user.email) return '?';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 bg-white/80 backdrop-blur-md shadow-soft' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-display font-bold text-family-deep-blue">
              Family<span className="text-family-accent">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            <Link href="/About" className={`nav-link ${isActive('/About') ? 'active' : ''}`}>
              About
            </Link>
            <Link href="/Models" className={`nav-link ${isActive('/Models') ? 'active' : ''}`}>
              Family Models
            </Link>
            <Link href="/Donation" className={`nav-link ${isActive('/Donation') ? 'active' : ''}`}>
              Donate
            </Link>
            <Link href="/Adoption" className={`nav-link ${isActive('/Adoption') ? 'active' : ''}`}>
              Adopt
            </Link>
            <Link href="/Community" className={`nav-link ${isActive('/Community') ? 'active' : ''}`}>
              Community
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative w-10 h-10 rounded-full">
                    <Avatar>
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthDialog 
                triggerButtonClassName="btn-primary"
                triggerButtonText="Login / Sign Up"
              />
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-family-deep-blue" />
            ) : (
              <Menu className="w-6 h-6 text-family-deep-blue" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pt-5 pb-6 mt-3 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`text-lg py-2 ${
                  isActive('/') ? 'text-family-deep-blue font-medium' : 'text-family-text-light'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/About"
                className={`text-lg py-2 ${
                  isActive('/about') ? 'text-family-deep-blue font-medium' : 'text-family-text-light'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/Models"
                className={`text-lg py-2 ${
                  isActive('/models') ? 'text-family-deep-blue font-medium' : 'text-family-text-light'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Family Models
              </Link>
              <Link
                href="/Donation"
                className={`text-lg py-2 ${
                  isActive('/Donation') ? 'text-family-deep-blue font-medium' : 'text-family-text-light'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Donate
              </Link>
              <Link
                href="/Adoption"
                className={`text-lg py-2 ${
                  isActive('/Adoption') ? 'text-family-deep-blue font-medium' : 'text-family-text-light'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Adopt
              </Link>
              
              {user ? (
                <Button 
                  variant="destructive"
                  className="mt-4"
                  onClick={handleSignOut}
                >
                  Log Out
                </Button>
              ) : (
                <AuthDialog 
                  triggerButtonClassName="w-full btn-primary text-center mt-4"
                  triggerButtonText="Login / Sign Up"
                />
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
