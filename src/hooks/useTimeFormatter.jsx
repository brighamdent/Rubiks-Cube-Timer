export const timeFormatter = (time) => {
    if(time == 'DNF'){
        return 'DNF'
    }
    let timeFormatted;
    const hours = Math.floor(time / 360000);
  
    // Minutes calculation
    const minutes = Math.floor((time % 360000) / 6000);
  
    // Seconds calculation
    const seconds = Math.floor((time % 6000) / 100);
  
    const milliseconds = time % 100;
  if(minutes < 1){
    timeFormatted = `${seconds}.${milliseconds.toString().padStart(2, "0")}`
  } else if(hours < 1){
    timeFormatted = `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`}
  else{ timeFormatted = `${hours}:${minutes.toString().padStart(2, "0")}:
  ${seconds.toString().padStart(2, "0")}.
  ${milliseconds.toString().padStart(2, "0")}`}
  // .toString().padStart(2, "0")
  return(timeFormatted)
  
  }