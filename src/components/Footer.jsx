import React from 'react';

const Footer = () => {
  return (
    <footer
      className="w-full flex justify-center items-center"
      style={{
        height: 56,
        background: 'transparent',
        padding: 0,
      }}
    >
      <span
        className="font-normal text-xs leading-[1.21] text-[#DDDDDD] text-center"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.21,
          color: '#DDDDDD',
          // border: '1px solid rgba(106,106,106,0.5)',
          borderRadius: 4,
          padding: '4px 12px',
          background: 'transparent',
          width: 1618,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        © SHOICHI HASEGAWA 2025
      </span>
    </footer>
  );
};

export default Footer; 