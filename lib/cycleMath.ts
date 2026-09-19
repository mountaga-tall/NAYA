const DAY_IN_MS = 24 * 60 * 60 * 1000;

function toUtcDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    )
  );
}

export function addDays(date: Date, days: number): Date {
  const result = toUtcDate(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/**
 * Estimation de la prochaine période
 * à partir du premier jour du dernier cycle.
 */
export function getNextPeriodDate(
  cycleStartDate: Date,
  cycleLength: number
): Date {
  return addDays(cycleStartDate, cycleLength);
}

/**
 * Estimation de l'ovulation.
 *
 * Cette valeur est une estimation de produit et ne doit pas
 * être utilisée comme méthode contraceptive.
 */
export function getEstimatedOvulationDate(
  nextPeriodDate: Date
): Date {
  return addDays(nextPeriodDate, -14);
}

/**
 * Fenêtre de fertilité estimée autour de l'ovulation.
 *
 * Il s'agit d'une estimation uniquement.
 */
export function getEstimatedFertileWindow(
  ovulationDate: Date
): {
  start: Date;
  end: Date;
} {
  return {
    start: addDays(ovulationDate, -5),
    end: addDays(ovulationDate, 1),
  };
}

/**
 * Retourne le jour actuel du cycle.
 *
 * Exemple :
 * premier jour des règles = Jour 1
 * lendemain = Jour 2
 */
export function getCurrentCycleDay(
  cycleStartDate: Date,
  currentDate: Date = new Date()
): number {
  const start = toUtcDate(cycleStartDate);
  const current = toUtcDate(currentDate);

  const difference = current.getTime() - start.getTime();

  return Math.floor(difference / DAY_IN_MS) + 1;
}

export function isDateBetween(
  date: Date,
  start: Date,
  end: Date
): boolean {
  const current = toUtcDate(date).getTime();
  const startTime = toUtcDate(start).getTime();
  const endTime = toUtcDate(end).getTime();

  return current >= startTime && current <= endTime;
}
