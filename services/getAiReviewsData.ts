import type { PieData } from "../types/GraphTypes";

interface HistoryCursor {
    rating?: number;
}

export const getAiReviewsPieData = (
    items: HistoryCursor[]
): PieData[] => {
    const counts = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    };

    items.forEach((item) => {
        if (item.rating && item.rating >= 1 && item.rating <= 5) {
            counts[item.rating as keyof typeof counts]++;
        }
    });

    const config = [
        { rating: 1, emoji: '😡', color: '#FF5252', text: 'Terrible' },
        { rating: 2, emoji: '🙁', color: '#FF7043', text: 'Bad' },
        { rating: 3, emoji: '😐', color: '#FFCA28', text: 'Neutral' },
        { rating: 4, emoji: '🙂', color: '#9CCC65', text: 'Good' },
        { rating: 5, emoji: '🤩', color: '#66BB6A', text: 'Excellent' },
    ];

    return config
        .map((cfg) => ({
            value: counts[cfg.rating as keyof typeof counts],
            color: cfg.color,
            text: cfg.emoji,
        }))
        .filter((item) => item.value > 0);
};
