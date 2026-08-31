"use client";

export const generateDates = () => {
  const today = new Date();

  const daysBefore = 90;
  const daysAfter = 90;

  const dates = Array.from({ length: daysBefore + daysAfter + 1 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - daysBefore + i);

    return date.toLocaleDateString("en-CA");
  });

  return dates;
};

export const generateTime = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  const timeArr = [];

  for (let i = 0; i < 24; i++) {
    const time = new Date(date);
    time.setHours(time.getHours() + i);

    timeArr.push(time);
  }

  return timeArr;
};
