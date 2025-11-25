import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const GlassCard = ({ children, className, hoverEffect = false }) => {
  return (
    <div
      className={twMerge(
        clsx(
          "relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-500",
          hoverEffect && "hover:border-eko-neon/50 hover:bg-white/5 hover:scale-[1.01] group"
        ),
        className
      )}
    >
      {/* Noise/Grain overlay could go here */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {children}
    </div>
  );
};

export default GlassCard;