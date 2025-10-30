// src/components/StatCard.tsx
import React from 'react';

type StatCardProps = {
  title: string;
  value: string | number;
  details: React.ReactNode;
  bgColor?: string;
};

const StatCard = ({ title, value, details, bgColor = 'bg-orange-50' }: StatCardProps) => {
  return (
    <div className={`${bgColor} p-6 rounded-2xl border-2 transition-all hover:shadow-lg`}>
      <p className="text-sm font-medium text-gray-600 mb-3">{title}</p>
      <p className="text-5xl font-bold text-gray-900 mb-3">{value}</p>
      <div className="text-sm font-medium">{details}</div>
    </div>
  );
};

export default StatCard;