import { startOfWeek, addDays, isSameDay, format } from "date-fns";
import type { BarData, UsageEvent } from "../types/GraphTypes";

const startOfDay = (date: Date) => {
    const day = new Date(date)
    day.setHours(0,0,0,0)
    return day
}

const getCurrentWeekUsage = (
    events: UsageEvent[]
): BarData[] => {
    
    const today = new Date()

    const weekStart = startOfDay(startOfWeek(today, {weekStartsOn: 1}))

    const daysOfTheWeek: Date[] = Array.from({length: 7}).map((_, i) => 
        startOfDay(addDays(weekStart, i))
    )

    return daysOfTheWeek.map(day => {
        const count = events.filter(event => {
            const eventDate = startOfDay(new Date(event.createdAt))
            return isSameDay(eventDate, day)
        }).length

        return {
            label: format(day, "EEE"),
            value: count,
            date: day
        }
    })
}

export {getCurrentWeekUsage}
