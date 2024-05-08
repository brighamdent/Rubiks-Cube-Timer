import React, { useState, useEffect } from "react";
import "../modal.css";
import { useGetAverage } from "../hooks/useGetAverage";
import { timeFormatter } from "../hooks/useTimeFormatter";
export const Modal = ({ currSession, times, setTimes, time, index }) => {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleDnf = () => {
    const newState = times[currSession].map((t) => {
      if (t.id == time.id) {
        let value;
        if (time.dnf == false) {
          value = "DNF";
        } else {
          value = time.oldValue;
        }
        if (time.plusTwo == true) {
          return {
            ...t,
            time: value,
            plusTwo: !time.plusTwo,
            dnf: !time.dnf,
            oldValue: time.time - 200,
          };
        } else {
          return { ...t, time: value, dnf: !time.dnf, oldValue: time.time };
        }
      }
      return t;
    });

    setTimes(
      times.map((t) => {
        if (t == times[currSession]) {
          return newState;
        } else return t;
      }),
    );
  };

  const handlePlusTwo = () => {
    let value;
    if (time.dnf == true) {
      value = time.oldValue;
    } else value = time.time;
    let num;
    if (time.plusTwo == false) {
      num = 200;
    } else num = -200;
    const newState = times[currSession].map((t) => {
      if (t.id == time.id) {
        return {
          ...t,
          time: value + num,
          plusTwo: !time.plusTwo,
          dnf: false,
          oldValue: "DNF",
        };
      }
      return t;
    });

    setTimes(
      times.map((t) => {
        if (t == times[currSession]) {
          return newState;
        } else return t;
      }),
    );
  };

  const deleteHandler = (id) => {
    if (confirm("Are you sure you want to delete this time?")) {
      setTimes(
        times.map((session) => {
          if (session == times[currSession]) {
            return session.filter((t) => t.id !== id);
          } else return session;
        }),
      );
      setModal(!modal);
    }
  };

  return (
    <div className="">
      <div className="time-flex time-list-item" onClick={toggleModal}>
        <p className="flexbox-item" key={index}>
          {index + 1}.{" "}
        </p>
        <p className="flexbox-item"> {timeFormatter(time.time)} </p>
        <p className="flexbox-item">
          {useGetAverage(currSession, times, index, 5)}
        </p>
        <p className="flexbox-item">
          {useGetAverage(currSession, times, index, 12)}
        </p>
      </div>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <div className="modal-wrapper">
              <button className="close-modal buttons" onClick={toggleModal}>
                {" "}
                ❌
              </button>
              <div className="modal-title">
                <h1>
                  Solve # {index + 1}. | {timeFormatter(time.time)}{" "}
                </h1>
                <h1 className={time.dnf ? "" : "hide"}>
                  {" "}
                  ({timeFormatter(time.oldValue)})
                </h1>
              </div>
              <h2>Ao5: {useGetAverage(currSession, times, index, 5)}</h2>
              <h2>Ao12: {useGetAverage(currSession, times, index, 12)}</h2>
              <p className="modal-scramble">{time.scramble}</p>
              <div className="modifier-buttons">
                <button
                  className={
                    time.dnf ? "modifier-button active" : "modifier-button"
                  }
                  onClick={handleDnf}
                >
                  DNF
                </button>
                <button
                  className={
                    time.plusTwo ? "modifier-button active" : "modifier-button"
                  }
                  onClick={handlePlusTwo}
                >
                  +2
                </button>
                <button
                  className="modifier-button"
                  onClick={() => {
                    deleteHandler(time.id);
                  }}
                >
                  Delete Solve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
