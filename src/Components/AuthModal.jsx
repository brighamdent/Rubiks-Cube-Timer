import React, { useState } from "react";
import { Signup } from "./Signup";

export const AuthModal = () => {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };
  return (
    <div>
      <button onClick={toggleModal}>Auth</button>
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <div className="modal-wrapper">
              <button className="close-modal buttons" onClick={toggleModal}>
                X
              </button>
              <Signup />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
