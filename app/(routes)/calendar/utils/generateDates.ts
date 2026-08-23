"use client";

export const generateDates = () => {
  const date = new Date();

  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = day === 0 ? -6 : 1 - day;

  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() + diff);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const current = new Date(startOfWeek);
    current.setDate(startOfWeek.getDate() + i);
    return current;
  });

  return dates.map((d) => d.toLocaleDateString("en-CA"));
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
