

  import React, { useState } from 'react';
  import './SideBar.css'; // Import the CSS file for styling

  interface SideChatbarProps {
    isOpen: boolean;
    onOpen: () => void;
  }
  

  export default function SideBar({ isOpen, onOpen }:  SideChatbarProps) {
    return (
      <div className={`chatbar ${isOpen ? 'open' : ''}`}>
        <button className="toggle-button" onClick={isOpen ? onClose : onOpen}>
          {isOpen ? 'Close' : 'Chat'}
        </button>
        <div className="chatbar-content">
          <h2>Chat Window</h2>
          <p>Start your conversation here!</p>
          {/* Additional chat logic goes here */}
        </div>
      </div>
    );
  };
  
  