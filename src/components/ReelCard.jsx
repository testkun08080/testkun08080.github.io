import React from 'react';

const ReelCard = ({ period, title, description, youtubeId }) => (
  <div style={{ width: 360, borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ width: '100%', height: 202, background: '#000' }}>
      <iframe
        width="100%"
        height="202"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ display: 'block', borderRadius: '0', width: '100%', height: '100%' }}
      />
    </div>
    <div style={{ padding: 16, width: '100%' }}>
      <div className="text-xs text-[#888] mb-1">{period}</div>
      <h2 className="text-xl font-bold text-[#222] mb-2 mt-0">{title}</h2>
      <p className="text-base text-[#555] m-0">{description}</p>
    </div>
  </div>
);

export default ReelCard; 