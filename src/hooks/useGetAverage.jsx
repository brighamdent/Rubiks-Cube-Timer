import { timeFormatter } from "./useTimeFormatter"

 export   const useGetAverage = (times,index,averageOf) => {
                let total = 0
                let worst = 0
                let best = Infinity
                if(index < averageOf-1){
                    return '--'
                }
                let i= 0;
                let dnfCount = 0; 
                while(i <= averageOf-1){
                    let currTime = times[index - i].time
                    
                    if (currTime == 'DNF'){
                        
                        dnfCount++
                        
                        if(dnfCount > 1){
                            return 'DNF'
                        }
                        
                    } else {
                    
                    
                total += currTime
                
                if(currTime >= worst){
                    
                    worst = currTime
                    
                }
                
                if(currTime <= best){
                    best = currTime
                    
                }
                    }
                    i++
                }
                if(dnfCount == 1){
                    worst = 0
                }
                
                total = total - best - worst
                return(timeFormatter(Math.round(total/(averageOf-2))))
                }