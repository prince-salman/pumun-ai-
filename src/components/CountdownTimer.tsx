import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';

interface CountdownTimerProps {
  initialSeconds?: number;
}

export default function CountdownTimer({ initialSeconds = 90 }: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | number | null>(null);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current as number);
            setIsRunning(false);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current as number);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current as number);
    };
  }, [isRunning]);

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      // AudioContext not allowed or not supported
    }
  };

  const toggleRun = () => setIsRunning(!isRunning);

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const progress = ((initialSeconds - secondsLeft) / initialSeconds) * 100;

  // Determine color scheme based on remaining time
  let colorBadge = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let barColor = 'bg-emerald-600';
  if (secondsLeft <= 10) {
    colorBadge = 'text-rose-700 bg-rose-50 border-rose-300 animate-pulse';
    barColor = 'bg-rose-500';
  } else if (secondsLeft <= 25) {
    colorBadge = 'text-amber-700 bg-amber-50 border-amber-200';
    barColor = 'bg-amber-500';
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Timer Sidang</span>
          {secondsLeft === 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
              <Bell className="w-3 h-3" /> WAKTU HABIS
            </span>
          )}
        </div>
        <div className={`px-2.5 py-0.5 rounded-lg border font-mono font-bold text-lg ${colorBadge}`}>
          {formattedTime}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${barColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-end gap-1.5 pt-1">
        <button
          onClick={toggleRun}
          className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
            isRunning 
              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200'
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
          }`}
          title={isRunning ? "Jeda Timer" : "Mulai Timer"}
        >
          {isRunning ? <><Pause className="w-3.5 h-3.5" /> Jeda</> : <><Play className="w-3.5 h-3.5" /> Mulai Bicara</>}
        </button>

        <button
          onClick={reset}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          title="Reset Waktu"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
