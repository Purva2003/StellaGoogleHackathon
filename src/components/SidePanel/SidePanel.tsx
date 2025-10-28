import React, { type ReactNode } from 'react';
import './SidePanel.css';

interface SidePanelProps {
  children: ReactNode;
}

const SidePanel: React.FC<SidePanelProps> = ({ children }) => {
  return (
    <div className="side-panel-wrapper">
      {/* Animated Background Effects */}
      <div className="side-panel-background">
        <div className="background-gradient-1"></div>
        <div className="background-gradient-2"></div>
        <div className="background-gradient-3"></div>
      </div>

      {/* Main Content Area with Glass Morphism */}
      <div className="side-panel-content glass-panel">
        {children}
      </div>

      {/* Decorative Elements */}
      <div className="side-panel-decorative">
        <div className="corner-accent top-left"></div>
        <div className="corner-accent top-right"></div>
        <div className="corner-accent bottom-left"></div>
        <div className="corner-accent bottom-right"></div>
      </div>
    </div>
  );
};

export default SidePanel;
