import React from "react";

const ReelCard = ({ period, title, description, youtubeId }) => (
  <div className="w-[360px] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white overflow-hidden flex flex-col items-center">
    <div className="w-full h-[202px] bg-black">
      <iframe
        width="100%"
        height="202"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="block rounded-none w-full h-full"
      />
    </div>
    <div className="p-4 w-full">
      <div className="text-xs text-[#888] mb-1">{period}</div>
      <h2 className="text-xl font-bold text-[#222] mb-2 mt-0">{title}</h2>
      <p className="text-base text-[#555] m-0">{description}</p>
    </div>
  </div>
);

export default ReelCard;
