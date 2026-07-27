import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-3xl bg-white p-5 shadow-[0_2px_16px_rgba(201,69,122,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}
