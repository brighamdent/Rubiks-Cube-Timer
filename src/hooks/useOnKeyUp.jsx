import {useEffect} from 'react'

export const useOnKeyUp = (handleStop,isRunning) => {
    useEffect(()=> {
        if (isRunning == true){
        const keyPressHandler = (event) => {
            //Prevent default is project specific. 
            event.preventDefault()
      
            if (event.key == ' '){ 
                handleStop(); 
            }
        }
      
        window.addEventListener('keydown', keyPressHandler)
      
      return () => {
        window.removeEventListener('keydown',keyPressHandler)
        
      }
        }
      
      },[handleStop,isRunning])
}
