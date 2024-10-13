export const timeParser = (date) => {
    if(!date) return;

    const options = {hour: '2-digit', minute: '2-digit'}
    const parsedTime  = new Date(date).toLocaleTimeString([], options)
    
    return parsedTime 
}

export const dateParser = (date) => {
    if(!date) return;

    const parsedDate = new Date(date).toDateString()
    return parsedDate
    
}