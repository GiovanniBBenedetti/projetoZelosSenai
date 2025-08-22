'use client';
import React from 'react';

const LogoutUser = () => {
  return (
    <>
      <button className="noselect">
        <span className="text">Logout</span>
        <span className="icon">
          <i className="bi bi-box-arrow-right"></i>
        </span>
      </button>

      <style jsx>{`
        button {
          width: 150px;
          height: 50px;
          cursor: pointer;
          display: flex;
          align-items: center;
          background: red;
          border: none;
          border-radius: 5px;
          box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
          background: var(--branco);
        }

        button,
        button span {
          transition: 200ms;
        }

        button .text {
          transform: translateX(35px);
          color: var(--vermelho);
          font-weight: bold;
        }

        button .icon {
          position: absolute;
          transform: translateX(110px);
          height: 40px;
          width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        button svg {
          width: 15px;
          fill: #eee;
        }

        button:hover .text {
          color: transparent;
        }

        button:hover .icon {
          width: 150px;
          border-left: none;
          transform: translateX(0);
        }

        button:focus {
          outline: none;
        }

        button:active .icon svg {
          transform: scale(0.8);
        }
      `}</style>
    </>
  );
};

export default LogoutUser;
