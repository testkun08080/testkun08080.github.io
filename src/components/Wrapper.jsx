import React from 'react';

const Wrapper = ({ children, style = {} }) => (
  <div
    className="wrapper"
    style={{
      width: '100%',
      maxWidth: 1225,
      margin: '0 auto',
      padding: '60px 30px',
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {children}
  </div>
);

export default Wrapper; 