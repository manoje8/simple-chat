
const generateRobo = (seed) => `https://robohash.org/${seed}.png?set=set1?bgset:white`

const generateAvatar = () => {
    const avatar = [];

    for(let i=0; i<10;i++)
    {
        const result = generateRobo(Math.random().toString(36).substring(2))
        avatar.push(result)
    }

    return avatar
    
}

export default generateAvatar