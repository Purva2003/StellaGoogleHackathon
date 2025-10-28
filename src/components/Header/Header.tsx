import React from 'react';
import './Header.css';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = "Stella AI Assistant",
  subtitle = "Your intelligent search companion"
}) => {
  return (
    <header className="header-container">
      <div className="header-content">
        {/* Logo on the left */}
        <div className="header-logo">
          <img src="/stella-logo.png" alt="Stella AI Logo" className="logo-image" />
        </div>

        <div className="header-text">
          <h1 className="header-title glow-text">{title}</h1>
          {subtitle && (
            <p className="header-subtitle">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Animated Accent Line */}
      <div className="header-accent-line-container">
        <div className="animated-accent-line"></div>
      </div>
    </header>
  );
};

export default Header;
