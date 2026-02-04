import { addDays, format, isSameDay, startOfDay, startOfWeek } from "date-fns";
import type { BarData, UsageEvent } from "../types/GraphTypes";

export const getCurrentWeekUsage = (events: UsageEvent[]): BarData[] => {
  const today = new Date();

  const weekStart = startOfDay(startOfWeek(today, { weekStartsOn: 1 }));

  const daysOfWeek = Array.from({ length: 7 }).map((_, i) =>
    startOfDay(addDays(weekStart, i))
  );

  return daysOfWeek.map((day) => {
    const count = events.filter((event) => {
      const eventDate = startOfDay(new Date(event.createdAt));
      return isSameDay(eventDate, day);
    }).length;

    return {
      label: format(day, "EEE"),
      value: count,
    };
  });
};
