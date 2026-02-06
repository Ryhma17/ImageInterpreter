import { isSameDay } from "date-fns";
import type { UsageEvent, PieData } from "../types/GraphTypes";


export const getTodayHourlyPieData = (
  events: UsageEvent[]
): PieData[] => {

  const today = new Date();

  const ranges = {
    Night: 0,
    Morning: 0,
    Afternoon: 0,
    Evening: 0,
  };

  events.forEach(event => {
    const date = new Date(event.createdAt);

    if (!isSameDay(date, today)) return;

    const hour = date.getHours();

    if (hour < 6) ranges.Night++;
    else if (hour < 12) ranges.Morning++;
    else if (hour < 18) ranges.Afternoon++;
    else ranges.Evening++;
  });

  return [
    { value: ranges.Night, color: "#7C4DFF", text: "Night" },
    { value: ranges.Morning, color: "#29B6F6", text: "Morning" },
    { value: ranges.Afternoon, color: "#FFCA28", text: "Afternoon" },
    { value: ranges.Evening, color: "#FF7043", text: "Evening" },
  ].filter(item => item.value > 0);
};
