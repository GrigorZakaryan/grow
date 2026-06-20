"use client";

export default function Tests() {
  let percentage = 25;
  let width = 100;
  let height = 100;
  let stroke = 10;
  let radius = width / 2 - stroke;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (1 - percentage / 100);

  return (
    <div>
      <div
        className="relative flex items-center justify-center"
        style={{ width: width, height: height }}
      >
        <svg
          className="absolute w-full h-full -rotate-90"
          viewBox={`0 0 ${width} ${height}`}
        >
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            className="fill-none stroke-gray-200 dark:stroke-gray-700"
            strokeWidth={stroke}
          />
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            className="fill-none stroke-white transition-all duration-500"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
          />
        </svg>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
