import { useState, useEffect } from "react";
import "./App.css";
import { useOnKeyPress } from "./hooks/useOnKeyPress";
import { useOnKeyUp } from "./hooks/useOnKeyUp";
import { useGetAverage } from "./hooks/useGetAverage";
import { timeFormatter } from "./hooks/useTimeFormatter";
import { Modal } from "./Components/Modal";
import { v4 as uuidv4 } from "uuid";
import { randomScrambleForEvent } from "https://cdn.cubing.net/js/cubing/scramble";
import logo from "./assets/cube-quick.png";

function App() {
  const [time, setTime] = useState(0);
  const [times, setTimes] = useState([[], [], []]);
  const [currSession, setCurrSession] = useState(0);
  const [prevTime, setPrevTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [greenbar, setGreenbar] = useState(false);
  const [events, setEvents] = useState(["333", "333", "333"]);
  const [currScramble, setCurrScramble] = useState("");
  const [startTime, setStartTime] = useState();
  const [redbar, setRedbar] = useState(false);
  const [scrambleSize, setScrambleSize] = useState("scramble");
  const [prevScramble, setPrevScramble] = useState();
  const [nextScramble, setNextScramble] = useState();
  const [lockTime, setLockTime] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [i, setI] = useState(false);

  useEffect(() => {
    const timesData = JSON.parse(localStorage.getItem("times"));
    const sessionData = JSON.parse(localStorage.getItem("session"));
    const eventsData = JSON.parse(localStorage.getItem("events"));

    if (timesData != null) setTimes(timesData);
    if (sessionData != null) setCurrSession(sessionData);
    if (eventsData != null) setEvents(eventsData);
  }, []);

  useEffect(() => {
    if (i == true) {
      localStorage.setItem("times", JSON.stringify(times));
      localStorage.setItem("session", JSON.stringify(currSession));
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [times, currSession, events]);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(
        () =>
          setTime(
            Number((new Date().valueOf() - startTime).toString().slice(0, -1)),
          ),
        1,
      );
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  //handles start

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(new Date().valueOf());
  };

  const handleStop = () => {
    setIsRunning(false);
    const newTimes = times.map((t, index) => {
      if (index == currSession) {
        return [
          ...times[index],
          {
            id: uuidv4(),
            time: time,
            scramble: currScramble,
            dnf: false,
            plusTwo: false,
            oldValue: "DNF",
          },
        ];
      } else {
        return t;
      }
    });
    setTimes(newTimes);
    setPrevTime(time);
    setTime(0);
    setGreenbar(false);
    setRedbar(true);
    setLockTime(0);
    setIsStopped(true);
  };

  const deleteTimesHandler = () => {
    if (
      confirm("Are you sure you want to delete all times from this session?")
    ) {
      setTimes(
        times.map((t) => {
          if (t == times[currSession]) {
            return [];
          } else return t;
        }),
      );

      setTime(0);

      setIsRunning(false);
    }
  };

  // HandleStart keybind
  useOnKeyPress(handleStart, " ", greenbar);
  useOnKeyUp(handleStop, isRunning);

  useEffect(() => {
    if (isRunning == false && isStopped == false) {
      const keyPressHandler = (event) => {
        //Prevent default is project specific.
        event.preventDefault();

        if (event.key == " ") {
          setRedbar(true);
          setIsLocked(true);
        }
      };

      window.addEventListener("keydown", keyPressHandler);

      return () => {
        window.removeEventListener("keydown", keyPressHandler);
        setIsLocked(false);
      };
    }
  }, [isRunning, greenbar, lockTime, isStopped]);

  useEffect(() => {
    if (redbar == true) {
      const keyPressHandler = (event) => {
        //Prevent default is project specific.
        event.preventDefault();

        if (event.key == " ") {
          setRedbar(false);
          setLockTime(0);
        }
      };

      window.addEventListener("keyup", keyPressHandler);

      return () => {
        window.removeEventListener("keyup", keyPressHandler);
      };
    }
  }, [isRunning, redbar, lockTime]);

  useEffect(() => {
    if (isStopped == true) {
      const keyPressHandler = (event) => {
        //Prevent default is project specific.
        event.preventDefault();

        if (event.key == " ") {
          setIsStopped(false);
          setRedbar(false);
        }
      };

      window.addEventListener("keyup", keyPressHandler);

      return () => {
        window.removeEventListener("keyup", keyPressHandler);
      };
    }
  }, [isStopped]);

  useEffect(() => {
    if (isLocked == true) {
      const interval = setInterval(setLockTime(lockTime + 1), 1);
      if (lockTime >= 1) {
        setGreenbar(true);
      }
      return () => clearInterval(interval);
    }
  }, [isLocked]);

  const useScrambler = async () => {
    setPrevScramble(currScramble);
    if (currScramble === prevScramble) {
      setCurrScramble(nextScramble);
    } else {
      const newScramble = (
        await randomScrambleForEvent(events[currSession])
      ).toString();
      setCurrScramble(newScramble);
      setNextScramble(newScramble);
    }
  };

  useEffect(() => {
    if (i == true) {
      useScrambler();
    }
  }, [prevTime, events[currSession], i]);

  useEffect(() => {
    const el = document.getElementById("times-container");

    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [times[currSession].length, currSession]);

  const handleChange = (e) => {
    setEvents(
      events.map((event, index) => {
        if (index == currSession) {
          return e.target.value;
        } else return event;
      }),
    );
    setCurrScramble(nextScramble);
  };

  useEffect(() => {
    if (currScramble.length >= 175) {
      setScrambleSize("scramble small");
    } else {
      setScrambleSize("scramble");
    }
    setI(true);
  }, [currScramble]);

  const handleLast = () => {
    if (prevScramble) {
      setCurrScramble(prevScramble);
      setPrevScramble();
    }
  };

  const handleSession = (e) => {
    if (e.target.value == "new") {
      setTimes([...times, []]);
      setEvents([...events, "333"]);
      setCurrSession(times.length);
    } else if (e.target.value == "delete") {
      if (confirm("Are you sure you want to delete this session?")) {
        console.log(currSession);
        setTimes(times.filter((t) => t !== times[currSession]));
        setEvents(events.filter((e, index) => index != currSession));
        if (currSession == times.length - 1) {
          setCurrSession(currSession - 1);
        }
      }
    } else {
      setCurrSession(e.target.value);
    }
  };

  return (
    <div className="vertical-flex">
      <div className="small-bar">
        <div className={isRunning || greenbar ? "hide" : "top-container"}>
          <img className="logo" src={logo}></img>
          <div className="scramble-container">
            <button
              className={
                prevScramble ? "scramble-buttons" : "scramble-buttons last"
              }
              onClick={handleLast}
            >
              Last
            </button>
            <h1 className={scrambleSize}>{currScramble}</h1>
            <button className="scramble-buttons" onClick={useScrambler}>
              Next
            </button>
          </div>
          <select
            className="event"
            value={events[currSession]}
            onChange={handleChange}
          >
            <option value="333">3x3</option>
            <option value="222">2x2</option>
            <option value="444">4x4</option>
            <option value="555">5x5</option>
            <option value="666">6x6</option>
            <option value="777">7x7</option>
            <option value="sq1">Square-1</option>
            <option value="skewb">Skewb</option>
            <option value="minx">Megaminx</option>
            <option value="pyram">Pyraminx</option>
            <option value="clock">Clock</option>
          </select>
        </div>
        <div className={isRunning || greenbar ? "hide" : "scramble-flex"}>
          <button
            className={
              prevScramble ? "scramble-buttons" : "scramble-buttons last"
            }
            onClick={handleLast}
          >
            Last
          </button>
          <h1 className={scrambleSize}>{currScramble}</h1>
          <button className="scramble-buttons" onClick={useScrambler}>
            Next
          </button>
        </div>
      </div>
      <div>
        {isRunning || greenbar ? (
          <div
            className={isRunning ? "time-running" : "time-running green"}
            onTouchStart={handleStop}
          >
            <p>{timeFormatter(time)}</p>
          </div>
        ) : (
          <div
            className={greenbar ? "time green" : redbar ? "time red" : "time"}
            onTouchStart={handleStart}
          >
            {timeFormatter(prevTime)}
          </div>
        )}
      </div>
      <div className={isRunning || greenbar ? "hide" : "outer-container"}>
        <div>
          <span>Session | </span>
          <select
            className="sessions"
            value={currSession}
            onChange={handleSession}
          >
            {times.map((t, index) => (
              <option value={index}>{index + 1}</option>
            ))}
            <option value="new">New</option>
            <option value="delete">Delete</option>
          </select>
          <button className="buttons" onClick={deleteTimesHandler}>
            ❌
          </button>
        </div>
        <div className="time-flex ">
          <p>#</p>
          <p>Time</p>
          <p>Ao5</p>
          <p>Ao12</p>
        </div>
        <div id="times-container" className="times-container">
          {times[currSession] &&
            times[currSession].map((time, index) => (
              <Modal
                key={time.id}
                currSession={currSession}
                times={times}
                setTimes={setTimes}
                time={time}
                index={index}
              ></Modal>
            ))}
        </div>
        <div className="running-average-container">
          {times[currSession].length > 2 ? (
            <p className="running-average">
              Running Average:{" "}
              {useGetAverage(
                currSession,
                times,
                times[currSession].length - 1,
                times[currSession].length,
              )}
            </p>
          ) : (
            <p>Running Average: --</p>
          )}
        </div>
      </div>
      <div className={isRunning || greenbar ? "hide" : "averages-container"}>
        <h1 className="center-average">
          Ao5:{" "}
          {useGetAverage(currSession, times, times[currSession].length - 1, 5)}
        </h1>
        <h1 className="center-average12">
          Ao12:{" "}
          {useGetAverage(currSession, times, times[currSession].length - 1, 12)}
        </h1>
      </div>

      {/* <button onClick={localStorage.clear()}>Clear cache</button> */}
    </div>
  );
}

export default App;
