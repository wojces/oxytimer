
export function countPressureToUse(pressureIN, pressureOnArrival) {
  // Pw = Pd-Pz-50
  //zwracam cisnienie do wykorzystania (z rezerwą 50 bar)
  if (!pressureIN || !pressureOnArrival) {
    return;
  }
  const pressureUsedToReach = pressureIN - pressureOnArrival;
  return pressureOnArrival - pressureUsedToReach - 50;
}

export function countTimeToUse(pressureToUse, avgPressureUse) {
  // tw = Pw / Ps
  //zwracam czas czas do wykorzystania w minutach
  if (!pressureToUse || !avgPressureUse) {
    return;
  }
  return pressureToUse / avgPressureUse;
}

export function countRetreatTime(timeOnArrival, timeToUse) {
  // Gk = Gd + tw
  //zwracam godzinę odwrotu
  if (!timeOnArrival || !timeToUse) {
    return;
  }
  return timeOnArrival + timeToUse
}

export function countRetreatPressure(pressureOnArrival, pressureIN) {
  // Pk = Pd - Pw
  //zwracam ciśnienie odwrotu
  const pressureToUse = countPressureToUse(pressureIN, pressureOnArrival)
  if (!pressureOnArrival || !pressureToUse) {
    return;
  }
  return pressureOnArrival - pressureToUse;
}



