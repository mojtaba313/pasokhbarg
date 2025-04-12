import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

const GlowImageBox = ({ children, className }: Props) => {
  return (
    <div className={`gap-6 place-content-center ${className}`}>
      <div className="w-full h-full relative rounded-lg overflow-hidden">
        <div className="absolute scale-[5] w-full h-full">
          <div className="absolute inset-0 rounded-lg border-6 border-transparent animate-spin-slow bg-gradient-conic"></div>
        </div>
        <div className="m-3">{children}</div>
      </div>
    </div>
  );
};

export default GlowImageBox;
