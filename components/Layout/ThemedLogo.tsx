"use client";

import { useTheme } from "@/theme/theme";

export default function ThemedLogo({ className = "", ...props }) {
  const { colors, colorMode } = useTheme();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 246.24 155.76"
      className={className}
      {...props}
    >
      <g>
        {/* Main Utah shape */}
        <path
          d="M.51,120.76c1.53-2.91,2.88-5.94,4.61-8.72,13.88-22.32,29.12-43.72,44.77-64.81,10.98-14.79,22.47-29.19,33.74-43.76.92-1.19,1.95-2.3,2.93-3.45.08,0,.16,0,.24,0,7.99,12.01,15.98,24.02,23.97,36.03,2.21,3.32,5.14,5.87,8.58,7.85,6.49,3.73,13,7.45,19.49,11.19,2.87,1.65,5.62,1.75,8.57,0,4.15-2.45,8.24-2.01,12.01,1.01,1.43,1.15,2.81,2.35,4.2,3.55,1.94,1.67,3.5,1.69,5.4-.01,4.37-3.91,8.69-7.88,13.09-11.75,2.71-2.38,3.66-2.27,5.72.71,8.21,11.87,16.28,23.85,24.58,35.65,7.43,10.56,15.7,20.44,25.19,29.25.15.14.36.25.41.42.29.9.55,1.81.81,2.71-.75-.23-1.58-.34-2.25-.71-10.57-5.84-21.11-11.71-32.38-17.97.23,1.21.17,2,.52,2.51,4.44,6.53,8.94,13.02,13.39,19.54.26.38.19.98.28,1.48-.54.05-1.22.33-1.61.11-9.91-5.55-19.78-11.15-29.66-16.75-.83-.47-1.65-.98-2.5-1.4-3.29-1.61-5.9-1.18-8.49,1.42-5.27,5.28-10.51,10.58-15.93,16.04-2.15-3.1-4.3-6.02-6.26-9.06-2.41-3.76-3.88-4.03-7.31-1.22-6.66,5.47-13.36,10.89-19.97,16.26-8.43-4.65-16.73-9.22-25.04-13.79-4.57-2.52-9.13-5.06-13.73-7.52-.54-.29-1.38-.35-1.97-.16-10.54,3.38-21.06,6.84-31.61,10.21-.61.19-1.51.09-2.06-.23-8.39-4.91-16.75-9.9-25.15-14.8-.47-.28-1.52-.18-1.94.17-7.88,6.44-15.7,12.94-23.55,19.42-.32.26-.75.38-1.13.57,0,0,.03.02.03.02Z"
          fill={colors.primary}
          className="transition-colors duration-300"
        />
        {/* Letters - using white in dark mode, secondary color in light mode */}
        <g
          fill={colorMode === "dark" ? "white" : colors.secondary}
          className="transition-colors duration-300"
        >
          {/* All the letter paths remain the same */}
          <path d="M65.94,129.84c.16.35.46.69.46,1.04.03,6.24.02,12.47.02,18.79-2.17.18-4.17.56-5.59-1.93-1.47-2.58-3.47-4.86-5.39-7.47v9.41h-5.08v-19.84c1.2,0,2.4,0,3.6,0,.33.36.7.7.99,1.09,2.1,2.9,4.18,5.81,6.45,8.96v-10.06c1.52,0,3.04,0,4.56,0Z" />
          <path d="M161.83,149.76h-4.82c0-2.23.05-4.42-.05-6.61-.02-.38-.67-1.01-1.07-1.04-1.54-.12-3.1-.05-4.76-.05v7.63h-5.1v-19.85c1.52,0,3.04,0,4.56,0,.16.39.45.77.46,1.16.05,2.07.02,4.14.02,6.24h6v-7.15h4.77v19.67Z" />
          <path d="M79.36,129.84c1.79,1.07,3.62,2.08,5.34,3.25.83.57.75,1.31-.17,1.95-.94.66-1.78,1.45-2.66,2.18-2.72-2.74-4.83-3.16-6.56-1.32-1.9,2.01-1.82,6.35.14,8.17,1.7,1.57,4.26,1.27,6.12-.84h-2.89v-3.84h7.34v10.32h-3.98c-.02-.41-.05-.83-.08-1.36-3.28,2.37-6.59,2.16-9.56-.27-3.42-2.8-4.11-6.69-3.22-10.77.84-3.84,3.23-6.44,7.29-7.26.09-.02.17-.14.25-.21.88,0,1.76,0,2.64,0Z" />
          <path d="M31.41,129.84c6.37,2.29,9.27,7.45,7.48,13.28-1.36,4.4-5.06,7.12-9.31,6.84-4.02-.26-7.51-3.66-8.24-8.01-.99-5.86,1.63-9.86,7.92-12.11h2.16ZM34.29,139.94c0-3.11-1.58-5.13-4.04-5.14-2.4-.01-4.07,2.1-4.07,5.15,0,3.06,1.63,5.11,4.08,5.12,2.44,0,4.03-2.02,4.04-5.13Z" />
          <path d="M110.53,129.84c.15.2.42.41.42.61-.09,4.29.15,8.63-.42,12.86-.63,4.69-3.8,6.89-8.34,6.65-3.95-.21-6.88-3.04-7.2-7.47-.31-4.2-.2-8.43-.28-12.65,1.52,0,3.04,0,4.56,0,.16.39.45.77.46,1.16.04,3.16,0,6.32.03,9.48.02,2.84,1.2,4.56,3.08,4.58,1.95.02,3.13-1.7,3.15-4.63.02-2.88-.01-5.77.01-8.65,0-.65.15-1.3.23-1.94,1.44,0,2.88,0,4.32,0Z" />
          <path d="M138.11,129.84c.17.23.43.44.51.7,1.86,6.36,3.7,12.72,5.58,19.23-1.59,0-3.08.16-4.5-.09-.46-.08-.99-1.18-1.07-1.86-.35-3.04-2.66-1.58-4.18-1.88-1.64-.33-1.44,1.12-1.56,1.91-.24,1.61-.97,2.19-2.59,1.94-.93-.14-1.91-.03-3.06-.03,1.11-3.86,2.21-7.62,3.27-11.38.8-2.84,1.55-5.69,2.32-8.54,1.76,0,3.52,0,5.27,0ZM135.73,135.51c-.62,2.6-1.09,4.62-1.6,6.73h3.12c-.47-2.1-.93-4.11-1.52-6.73Z" />
          <path d="M198.76,129.84c.17.23.43.44.51.7,1.86,6.36,3.7,12.72,5.58,19.23-1.59,0-3.08.16-4.5-.09-.46-.08-.99-1.18-1.07-1.86-.35-3.04-2.66-1.58-4.18-1.88-1.64-.33-1.44,1.12-1.56,1.91-.24,1.61-.97,2.19-2.59,1.94-.93-.14-1.91-.03-3.06-.03,1.11-3.86,2.21-7.62,3.27-11.38.8-2.84,1.55-5.69,2.32-8.54,1.76,0,3.52,0,5.27,0ZM197.92,142.26c-.49-2.15-.96-4.16-1.55-6.73-.61,2.59-1.09,4.62-1.58,6.73h3.13Z" />
          <path d="M243.6,130.32c-2.65,6.27-7.5,11.84-6.06,19.4h-5.26c1.57-7.41-3.27-12.92-5.72-19.16.24-.16.48-.45.72-.45,1.51-.03,3.02,0,4.54.02,1,2.54,2,5.08,3.15,8.01,1.13-3,2.12-5.64,3.11-8.28,1.64,0,3.28-.02,4.91.02.2,0,.4.3.6.45Z" />
          <path d="M219.86,129.84c.16.43.46.85.46,1.28.03,4.58.02,9.15.02,13.86h8.04v4.73h-13.08v-19.86c1.52,0,3.04,0,4.56,0Z" />
          <path d="M46.28,129.84c.16.35.46.69.46,1.04.03,6.24.02,12.47.02,18.8h-5.04v-19.84c1.52,0,3.04,0,4.56,0Z" />
          <path d="M211.23,129.84c.16.35.46.69.46,1.04.03,6.24.02,12.47.02,18.8h-5.04v-19.84c1.52,0,3.04,0,4.56,0Z" />
          <path d="M3.64,130.14c2.55-.03,5.09-.06,7.64-.09,5.38.42,8.62,4.51,8.34,10.53-.26,5.65-3.77,9.19-9.1,9.19-2.23,0-4.47,0-6.88,0v-19.63ZM8.71,134.89v10.07c4.06.29,5.9-1.33,5.88-5.12-.01-3.71-1.82-5.25-5.88-4.95Z" />
          <path d="M171.72,130.14c2.55-.03,5.09-.06,7.64-.09,5.38.42,8.62,4.51,8.34,10.53-.26,5.65-3.77,9.19-9.1,9.19-2.23,0-4.47,0-6.88,0v-19.63ZM176.76,145c4.25.13,6.09-1.61,5.9-5.44-.18-3.6-2.04-5.08-5.9-4.63v10.07Z" />
          <path d="M112.95,130.11h15.07v4.71h-4.94v14.87h-4.96v-14.78h-5.17v-4.79Z" />
        </g>
      </g>
    </svg>
  );
}