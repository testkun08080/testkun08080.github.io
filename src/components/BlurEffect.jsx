import React from 'react';

const BlurEffect = ({ children }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      background: 'rgba(255,255,255,0.3)',
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      {children}
    </div>
  );
};

export default BlurEffect; 