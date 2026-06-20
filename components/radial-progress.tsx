export const RadialProgress = ({
  w,
  h,
  strokeWidth,
  percentage,
}: {
  w: number;
  h: number;
  strokeWidth: number;
  percentage: number;
}) => {
  let radius = w / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (1 - percentage / 100);

  return (
    <div>
      <div
        className="relative flex items-center justify-center"
        style={{ width: w, height: h }}
      >
        <svg
          className="absolute w-full h-full -rotate-90"
          viewBox={`0 0 ${w} ${h}`}
        >
          <circle
            cx={w / 2}
            cy={h / 2}
            r={radius}
            className="fill-none stroke-gray-200 dark:stroke-gray-700"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={w / 2}
            cy={h / 2}
            r={radius}
            className="fill-none stroke-white transition-all duration-500"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
          />
        </svg>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};
