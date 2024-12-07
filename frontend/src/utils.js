import dayjs from 'dayjs';
export const getMealByTime = () => {
    const hour = dayjs().hour();
    
    if (hour >= 4 && hour < 11) return 'Breakfast';
    if (hour >= 11 && hour < 16) return 'Lunch';
    if (hour >= 16 && hour < 19) return 'Evening';
    return 'Dinner';
};