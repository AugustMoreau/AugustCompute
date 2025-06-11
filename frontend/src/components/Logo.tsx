import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', color = 'currentColor' }) => {
  const dimensions = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 },
  };

  const { width, height } = dimensions[size];

  return (
    <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ minWidth: width, minHeight: height }}
      >
        <path
          d="M12 2L4 6V18L12 22L20 18V6L12 2Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M12 22V16"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 6L12 10L4 6"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 2V10"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="13" r="2" fill={color} />
      </svg>
      <span className="font-semibold text-lg ml-2" style={{ color }}>AugustCompute</span>
    </div>
  );
};

export default Logo; 