"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { IoMenu, IoClose, IoCarSport, IoCalendar, IoInformationCircle, IoCall, IoLogIn, IoLogOut, IoShield } from "react-icons/io5";
import LoginPopup from "./LoginPopup";
import RegisterPopup from "./RegisterPopup";
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, login } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLoginPopup = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  const toggleRegisterPopup = () => {
    setIsRegisterOpen(!isRegisterOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const handleLoginSuccess = (userData) => {
    login(userData);
    setIsLoginOpen(false);
  };

  const scrollToFooter = (e) => {
    e.preventDefault();
    const footer = document.querySelector(".footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
      footer.classList.add("highlight-section");
      setTimeout(() => {
        footer.classList.remove("highlight-section");
      }, 2000);
    }
  };

  const scrollToCalendar = (e) => {
    e.preventDefault();
    const calendar = document.querySelector(".calendar");
    if (calendar) {
      calendar.scrollIntoView({ behavior: "smooth" });
      calendar.classList.add("highlight-section");
      setTimeout(() => {
        calendar.classList.remove("highlight-section");
      }, 2000);
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          <Link href="/" className="logo">
            <span className="logo-icon"><IoCarSport /></span>
            <span className="logo-text">AutoWeb</span>
          </Link>
          
          <button className="menu-button" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <IoClose /> : <IoMenu />}
          </button>
          
          <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            <div className="nav-links-main">
              <Link href="/pakalpojumi" className="nav-item">
                <span className="nav-icon"><IoCarSport /></span>
                <span>Pakalpojumi</span>
              </Link>
              <Link href="/par-mums" className="nav-item">
                <span className="nav-icon"><IoInformationCircle /></span>
                <span>Par mums</span>
              </Link>
              <Link href="/kontakti" onClick={scrollToFooter} className="nav-item">
                <span className="nav-icon"><IoCall /></span>
                <span>Kontakti</span>
              </Link>
            </div>
            
            <div className="nav-links-action">
              <Link href="/rezervet" className="btn-primary" onClick={scrollToCalendar}>
                <span className="btn-icon"><IoCalendar /></span>
                <span>Rezervēt</span>
              </Link>
              
              {user?.role === 'admin' && (
                <Link href="/admin" className="btn-admin">
                  <span className="btn-icon"><IoShield /></span>
                  <span>Admin</span>
                </Link>
              )}
              
              {user ? (
                <button className="btn-secondary" onClick={handleLogout}>
                  <span className="btn-icon"><IoLogOut /></span>
                  <span>Izrakstīties</span>
                </button>
              ) : (
                <button className="btn-secondary" onClick={toggleLoginPopup}>
                  <span className="btn-icon"><IoLogIn /></span>
                  <span>Pieslēgties</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginPopup
        isOpen={isLoginOpen}
        onClose={toggleLoginPopup}
        onCreateAccountClick={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      <RegisterPopup 
        isOpen={isRegisterOpen} 
        onClose={toggleRegisterPopup} 
      />
    </>
  );
}
