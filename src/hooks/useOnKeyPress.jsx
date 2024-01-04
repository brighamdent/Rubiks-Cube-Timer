import {useEffect} from 'react'

export const useOnKeyPress = (callback,targetKey,greenbar) => {
  
    
   

  useEffect(()=> {
    if (greenbar == true){
        const keyPressHandler = (event) => {
            //Prevent default is project specific. 
            event.preventDefault()

            if (event.key == targetKey){ 
                callback(); 
            }
        }
        
        
        
    window.addEventListener('keyup', keyPressHandler)

    return () => {
        window.removeEventListener('keyup',keyPressHandler)
    
    }
    
}
  },[greenbar])
 
}
