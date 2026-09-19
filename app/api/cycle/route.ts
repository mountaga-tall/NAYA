import {
  getCurrentCycleDay,
  getEstimatedFertileWindow,
  getEstimatedOvulationDate,
  getNextPeriodDate,
} from "@/lib/cycleMath";

export async function GET() {
  const cycleStartDate = new Date("2026-08-01T00:00:00");
  const cycleLength = 28;

  const today = new Date();

  const nextPeriodDate = getNextPeriodDate(
    cycleStartDate,
    cycleLength
  );

  const ovulationDate =
    getEstimatedOvulationDate(nextPeriodDate);

  const fertileWindow =
    getEstimatedFertileWindow(ovulationDate);

  const currentCycleDay =
    getCurrentCycleDay(
      cycleStartDate,
      today
    );

  let status = "Phase estimée";

  if (
    today >= fertileWindow.start &&
    today <= fertileWindow.end
  ) {
    status = "Période fertile estimée";
  } else if (
    today >= cycleStartDate &&
    today < nextPeriodDate
  ) {
    status = "Cycle en cours";
  }

  return Response.json({
    cycleStartDate,
    cycleLength,
    currentCycleDay,
    nextPeriodDate,
    ovulationDate,
    fertileWindow,
    status,
    disclaimer:
      "Les dates affichées sont des estimations et ne constituent pas une méthode contraceptive ni un diagnostic médical.",
  });
}
