import React from "react";

export interface AlertProps {
  className?: string;
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ className = "", children }) => {
  return <div className={`border rounded-lg p-4 ${className}`}>{children}</div>;
};

export interface AlertDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  className = "",
  children,
}) => {
  return <div className={`text-sm ${className}`}>{children}</div>;
};
