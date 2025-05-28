import React from "react";
import { useState, useEffect } from "react";
import reactLogo from "../assets/react.svg";
import "./LogoSamples.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const LogoSamples = () => {
  const [users, setUsers] = useState([]);
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    // Get logo icons from flask API
    fetch(`${API_BASE_URL}/api/logo/logoIcons`)
      .then((response) => response.json())
      .then((data) => setIcons(data))
      .catch((error) => console.error("Error fetching flask icon:", error));
  }, []);
  return (
    <div className="flex flex-col justify-center logosamples-page">
      <div className="flex flex-row justify-center">
        <a href="https://vite.dev" target="_blank">
          <img src="vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>

        {icons?.map((icon) => {
          return (
            <a href={icon.url} target="_blank" key={icon.name}>
              <img
                src={icon.src}
                className={`logo ${icon.name}`}
                alt={icon.name}
              />
            </a>
          );
        })}
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          <p class="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-5xl font-extrabold text-transparent">
            Vite + React + FastAPI + TailWind
          </p>
        </h1>

        <p>
          <a class="underline decoration-sky-500/30">
            Edit <code>src/App.jsx</code>
          </a>
          and save to test
        </p>

        <p className="read-the-docs">Click on the above logos to learn more</p>
      </div>
    </div>
  );
};

export default LogoSamples;
