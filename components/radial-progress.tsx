export const RadialProgress = ({
  w,
  h,
  strokeWidth,
  percentage,
  showPercentage,
}: {
  w: number;
  h: number;
  strokeWidth: number;
  percentage: number;
  showPercentage?: boolean;
}) => {
  // Guard: ensure w and strokeWidth are valid numbers > 0
  const radius = w > 0 ? w / 2 - strokeWidth : 0;
  const circumference = radius > 0 ? 2 * Math.PI * radius : 0;

  // Use a fallback to 0 if percentage is NaN (e.g., during initialization)
  const safePercentage = isNaN(percentage) ? 0 : percentage;
  const progress = circumference * (1 - safePercentage / 100);

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
            className="fill-none stroke-gray-200 dark:stroke-white/20"
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
          {showPercentage && `${percentage.toFixed(0)}%`}
        </span>
      </div>
    </div>
  );
};
