export const dateParser = (date) => {
    if(!date) return;

    const options = {hour: '2-digit', minute: '2-digit'}
    const parsedTime  = new Date(date).toLocaleTimeString([], options)
    
    return parsedTime 
}