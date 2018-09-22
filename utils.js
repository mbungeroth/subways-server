const convertTime = epoch => new Date(epoch * 1000).toLocaleTimeString();
const currentEpochTime = () => Math.floor(Date.now() / 1000);
const untilArrival = arrivalTime => {
  const minutesUntil = Math.floor((arrivalTime - currentEpochTime()) / 60);
  if (minutesUntil <= 0) {
    return "Arriving Now"
  } else if (minutesUntil === 1) {
    return "1 Minute";
  } else {
    return `${minutesUntil} Minutes`
  }
};
const cleanText = text => {
  return (
    text
      .replace(/  +/g, ' ')
      .replace(/(&nbsp;)/g, '')
      .replace(/\r/g,"")
      .split(/\n/)
      .reduce((arr, current) => {
        if (current.match(/[a-z]/i)) {
          arr.push(current.trim());
          return arr;
        } else {
          return arr;
        }
      }, [])
  )
}

// const getFeedId = stationId => {
//   const shuttleB = ['S01', 'S03', 'S04']
//   const one = ['1', '2', '3', '4', '5', '6', '9'];
//   const twentySix = ['A', 'C', 'E', 'H', 'S'];
//   const sixteen = ['N', 'R', 'Q', 'W'];
//   const twentyOne = ['B', 'D', 'F', 'M'];
//   const two = ['L'];
//   // const
//   return;
// }

module.exports = {
  convertTime,
  currentEpochTime,
  untilArrival,
  cleanText,
}
