import React, {useState,useEffect} from 'react';
import '../modal.css'
import { useGetAverage } from '../hooks/useGetAverage';
import { timeFormatter } from '../hooks/useTimeFormatter';
export const Modal = ({times,setTimes,time,index,i,setI}) => {
    const [modal,setModal] = useState(false)
    const [plusTwo,setPlusTwo] = useState(false)
    const [dnf,setDnf] = useState(false)
    const [oldValue,setOldValue] = useState('DNF')
    const [rendered,setRendered] = useState(false)

    useEffect(()=> {
      
      const plusTwoData = JSON.parse(localStorage.getItem(`PlusTwo ${time.id}`))
      const dnfData = JSON.parse(localStorage.getItem(`DNF ${time.id}`))
      const oldValueData = JSON.parse(localStorage.getItem(`OldValue ${time.id}`))
      if(plusTwoData != null) setPlusTwo(plusTwoData)
      if(dnfData != null) setDnf(dnfData)
      if(oldValueData != null) setOldValue(oldValueData)
    },[])
   
    useEffect(()=> {
  
      if(rendered == true){
      localStorage.setItem(`PlusTwo ${time.id}`,JSON.stringify(plusTwo));
      localStorage.setItem(`DNF ${time.id}`,JSON.stringify(dnf));
      localStorage.setItem(`OldValue ${time.id}`,JSON.stringify(oldValue));
      
      }
      setRendered(true)
    },[plusTwo,dnf])


    const toggleModal = () => {
        setModal(!modal)
        
      } 

      const handleDnf = () => {
        if(plusTwo == true){
          handlePlusTwo()
          setOldValue(time.time-200)
        } else setOldValue(time.time)
        let value;
        if(dnf == false){
          value = 'DNF'
        } else{
          console.log('hi')
          value = oldValue
        }
        const newState = times.map(t =>{
          if(t.id == time.id){
            return{...t, time: value}

          }
          return t
        } )

        setTimes(newState)
        
        setDnf(!dnf)
      }
      
      const handlePlusTwo = () => {
        let value;
        if(dnf == true){
          handleDnf()
          value = oldValue
        } else value = time.time
        let num;
          if(plusTwo == false){
            num = 200
          } else num = -200
            const newState = times.map(t =>{
              if(t.id == time.id){
                return{...t, time: value + num}

              }
              return t
            } )

            setTimes(newState)
            setPlusTwo(!plusTwo)
          }

          const deleteHandler = (id) => {
            if(confirm('Are you sure you want to delete this time?')){
            localStorage.removeItem(`PlusTwo ${time.id}`);
            localStorage.removeItem(`DNF ${time.id}`);
            localStorage.removeItem(`OldValue ${time.id}`)
            setTimes(times.filter(time => time.id !== id ))
            setModal(!modal)
            ;
          }
          
            
          }

          
          
  return ( <div className=''>
    
          <div className='time-flex time-list-item' onClick={toggleModal} >  
            
            <p className='flexbox-item' key={index}>{index + 1}. </p><p className='flexbox-item' > {timeFormatter(time.time)} </p>
             <p className='flexbox-item' >{useGetAverage(times,index,5)}</p><p className='flexbox-item' >{useGetAverage(times,index,12)}</p>
          
             </div> 

    { modal && (
        <div className='modal'>
        <div onClick={toggleModal} className='overlay'></div>
    <div className='modal-content'>
        <div className='modal-wrapper'>
        <button className='close-modal buttons' onClick={toggleModal}>⨉</button>
        <div className='modal-title'>
        <h1>Solve # {index+1}. | {timeFormatter(time.time)} </h1>
        <h1 className={dnf ? '': 'hide'}> ({timeFormatter(oldValue)})</h1>
        </div>
        <h2>Ao5: {useGetAverage(times,index,5)}</h2>
        <h2>Ao12: {useGetAverage(times,index,12)}</h2>
        <p className='modal-scramble'>{time.scramble}</p>
        <div className='modifier-buttons'>
        <button className={dnf ? 'modifier-button active': 'modifier-button'} onClick={handleDnf}>DNF</button>
        <button className={plusTwo ? 'modifier-button active': 'modifier-button'} onClick={handlePlusTwo}>+2</button>
        <button className='modifier-button' onClick={() => {deleteHandler(time.id)}} >Delete Solve</button>
        </div>
        </div>
        </div> 
    
    </div>)
    }
    
    </div>
  )
}
