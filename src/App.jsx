import { useState,useEffect } from 'react'
import './App.css'
import { useOnKeyPress } from './hooks/useOnKeyPress'
import {useOnKeyUp} from './hooks/useOnKeyUp'
import { useGetAverage } from './hooks/useGetAverage'
import { timeFormatter } from './hooks/useTimeFormatter'
import { Modal } from './Components/Modal'
import {v4 as uuidv4} from 'uuid';
import { randomScrambleForEvent } from "https://cdn.cubing.net/js/cubing/scramble"


function App() {
  const [time,setTime] = useState(0)
  const [times,setTimes] = useState([])
  const [prevTime,setPrevTime] = useState(0)
  const [isRunning,setIsRunning] = useState(false)
  const [greenbar,setGreenbar] = useState(false)
  const [event,setEvent] = useState('333')
  const [currScramble,setCurrScramble] = useState('')
  const [startTime,setStartTime] = useState()
  const [redbar,setRedbar] = useState(false)
  const [scrambleSize,setScrambleSize] = useState('scramble')
  const [prevScramble,setPrevScramble] = useState()
  const [nextScramble,setNextScramble] = useState()
  const [lockTime,setLockTime] = useState(0)
  const [isLocked,setIsLocked] = useState(false)
  const [isStopped,setIsStopped] = useState(false)
  

  useEffect(()=> {
    console.log(localStorage)
    const timesData = JSON.parse(localStorage.getItem('times'))
    
    if(timesData != null) setTimes(timesData)
   
  },[])
 
  useEffect(()=> {

    if(i >= 1){
    localStorage.setItem('times',JSON.stringify(times));
    
    }
    setI(true)
  },[times])
  
  
  useEffect(() => {
    let intervalId;
     if(isRunning){ 
     intervalId = setInterval(()=> setTime(Number(((new Date().valueOf())- startTime).toString().slice(0,-1))),1);
     }
     return () => clearInterval(intervalId);
              
    },[isRunning,time])


const handleStart = () => {
  setIsRunning(true) 
  setStartTime(new Date().valueOf())
}

const handleStop = () => {
  setIsRunning(false) 
  setTimes([...times,{id: uuidv4(), time:time, scramble:currScramble, dnf:false, plusTwo: false, oldValue: 'DNF'}])
    setPrevTime(time)
  setTime(0)
  setGreenbar(false) 
  setRedbar(true)
  setLockTime(0)
  setIsStopped(true)
}

const deleteTimesHandler = () => {
  if(confirm('Are you sure you want to delete all times from this session?')){

  
  setTimes([])
  setTime(0)
  setPrevTime(0)
  setIsRunning(false)
  localStorage.clear()
  }
}

// HandleStart keybind
useOnKeyPress(handleStart, ' ',greenbar)
useOnKeyUp(handleStop,isRunning)

                 
useEffect(()=> {
  if (isRunning == false && isStopped == false){
  const keyPressHandler = (event) => {
      //Prevent default is project specific. 
      event.preventDefault()
     
      if (event.key == ' '){ 
        
        setRedbar(true)
        setIsLocked(true)
        
      }
  }
  
  window.addEventListener('keydown', keyPressHandler)

return () => {
  window.removeEventListener('keydown',keyPressHandler)
  setIsLocked(false)
  }
}
},[isRunning,greenbar,lockTime,isStopped])


useEffect(()=> {
  if (redbar == true){
  const keyPressHandler = (event) => {
      //Prevent default is project specific. 
      event.preventDefault()
     
      if (event.key == ' '){ 
        
        setRedbar(false)
        setLockTime(0)
        
      }
  }
  
  window.addEventListener('keyup', keyPressHandler)

return () => {
  window.removeEventListener('keyup',keyPressHandler)
  }   
}
},[isRunning,redbar,lockTime])


useEffect(()=> {
  if (isStopped == true){
    
  const keyPressHandler = (event) => {
      //Prevent default is project specific. 
      event.preventDefault()
     
      if (event.key == ' '){ 
        setIsStopped(false)
        setRedbar(false)
        
        
      }
  }
  
  window.addEventListener('keyup', keyPressHandler)

return () => {
  window.removeEventListener('keyup',keyPressHandler)
  }
}
},[isStopped])


useEffect(() => {
  if(isLocked == true){
    
  const interval = setInterval(setLockTime(lockTime + 1), 1);
  if(lockTime >= 1){
    setGreenbar(true)
    } 
  return () => clearInterval(interval);
}
}, [isLocked]);


const useScrambler = async () => {
  setPrevScramble(currScramble)
  if (currScramble === prevScramble){
    setCurrScramble(nextScramble)
  } else{
  const newScramble = (await randomScrambleForEvent(event)).toString();
  setCurrScramble(newScramble); 
  setNextScramble(newScramble)
  }
  };


  useEffect(() => {
  
   
   useScrambler()
   
   

},[prevTime,event])


useEffect(() => {
  const el = document.getElementById('times-container');

if (el) {
  el.scrollTop = el.scrollHeight;
}},[times])


const handleChange = (event) => {
     setEvent(event.target.value)
     setCurrScramble(nextScramble)
}


useEffect(() => {
  if(currScramble.length >= 175){
    setScrambleSize('scramble small')
   } else{
    setScrambleSize('scramble')
   }
},[currScramble])

const handleLast = () => {
  if(prevScramble){
    setCurrScramble(prevScramble)
    setPrevScramble()
  }
}


  return (
   
    <div>
      <div className={isRunning || greenbar ? 'hide':'top-container'}>
        <h2>TIMER</h2>
        <button className={prevScramble ? 'scramble-buttons' : 'scramble-buttons last'} onClick={handleLast}>Last</button>
         <h1 className= {scrambleSize} >{currScramble}</h1> 
         <button className='scramble-buttons' onClick={useScrambler}>Next</button>
         <select  className='event' value={event} onChange={handleChange} >
          <option value='333' >3x3</option>
          <option value='222'>2x2</option>
          <option value='444'>4x4</option>
          <option value='555'>5x5</option>
          <option value='666'>6x6</option>
          <option value='777'>7x7</option>
          <option value='sq1'>Square-1</option>
          <option value='skewb'>Skewb</option>
          <option value='minx'>Megaminx</option>
          <option value='pyram'>Pyraminx</option>
          <option value='clock'>Clock</option>
         </select>
         </div>
         <div>{isRunning || greenbar ? <div className={isRunning ? 'time-running': 'time-running green'}>{timeFormatter(time)}</div>: 
         <div className= {greenbar ? 'time green'  : redbar ? 'time red' :   'time'}>{timeFormatter(prevTime)}</div>}</div>
         <div className={isRunning || greenbar ? 'hide':'block-container'}>
         <h1 className='center-average' >Ao5: {useGetAverage(times,times.length - 1,5)}</h1> 
         <h1 className='center-average12' >Ao12: {useGetAverage(times,times.length - 1,12)}</h1> 
         <div className='outer-container'>
          <span>TIMES | </span>
          <button className='buttons' onClick={deleteTimesHandler}>❌</button>
          <div className='time-flex '>
              <p>#</p>
              <p>Time</p>
              <p>Ao5</p>
              <p>Ao12</p>
              </div>
          <div id= 'times-container'className='times-container'>
            
          {times && times.map((time,index) =>
          
          <Modal times={times} setTimes={setTimes} time={time} index={index} i={i} setI={setI}></Modal>
          )} 
          {times.length > 2 && <p>Running Average: {useGetAverage(times,times.length-1,times.length)}</p>}
          </div>
          </div>
          </div>
    </div>
    
  )
}

export default App
