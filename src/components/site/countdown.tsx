"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calc(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown({ targetIso, label }: { targetIso: string; label?: string }) {
  const target = new Date(targetIso).getTime();
  const [time, setTime] = useState<TimeLeft>(() => calc(target));

  useEffect(() => {
    const id = setInterval(() => setTime(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const items = [
    { v: time.days, l: "Dias" },
    { v: time.hours, l: "Horas" },
    { v: time.minutes, l: "Min" },
    { v: time.seconds, l: "Seg" },
  ];

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {label && (
        <span className="text-[10px] uppercase tracking-[0.25em] text-neon-cyan/80 sm:text-xs sm:tracking-[0.3em]">
          {label}
        </span>
      )}
      <div className="grid w-full max-w-md grid-cols-4 items-stretch gap-1.5 sm:max-w-none sm:gap-3">
        {items.map((it, i) => (
          <div
            key={it.l}
            className="relative flex flex-col items-center justify-center rounded-lg neon-border-cyan/60 bg-card/70 px-1 py-2 backdrop-blur sm:rounded-xl sm:px-5 sm:py-4"
          >
            <span
              className="font-display text-2xl leading-none text-neon-cyan sm:text-4xl md:text-5xl"
              suppressHydrationWarning
            >
              {String(it.v).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[9px] uppercase tracking-widest text-muted-foreground sm:text-xs">
              {it.l}
            </span>
            {i < items.length - 1 && (
              <span className="absolute -right-[5px] top-1/2 hidden -translate-y-1/2 font-display text-2xl text-neon-pink/60 sm:block sm:text-3xl">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
