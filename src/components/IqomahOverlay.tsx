import { useState, useEffect, useRef } from 'react';

interface IqomahOverlayProps {
  durationSeconds: number; // Menerima detik agar presisi
  isVisible: boolean;
  onFinish: () => void;
  prayerLabel: string;
  utama: string;
  badal: string;
  isFriday: boolean; // Tambahkan prop ini
}

export const IqomahOverlay = ({ 
  durationSeconds, 
  isVisible, 
  onFinish,
  prayerLabel,
  utama,
  badal,
  isFriday 
}: IqomahOverlayProps) => {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/beep.mp3');
    audioRef.current.load();
  }, []);

  useEffect(() => {
    if (isVisible) {
      setSecondsLeft(durationSeconds);
      hasPlayedRef.current = false;
    }
  }, [isVisible, durationSeconds]);

  useEffect(() => {
    if (!isVisible) return;
    if (secondsLeft <= 0) {
      onFinish();
      return;
    }
    // Bunyi bip saat 8 detik terakhir
    if (secondsLeft === 8 && !hasPlayedRef.current) {
      if (audioRef.current) {
        hasPlayedRef.current = true;
        audioRef.current.play().catch(err => console.error("Audio blocked", err));
      }
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isVisible, secondsLeft, onFinish]);

  if (!isVisible) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="fixed inset-0 z-[115] bg-[#1a204d] flex flex-col items-center justify-center text-white p-10 overflow-hidden">
      
      <h2 className="text-3xl font-bold tracking-[0.3em] text-[#FAED21] uppercase mb-2 opacity-90">
        Menuju Iqomah {prayerLabel}
      </h2>

      <div className="text-[16rem] md:text-[20rem] font-mono font-bold leading-[0.8] tabular-nums text-white drop-shadow-2xl mb-12">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-4">
        
        {/* Card Khotib / Imam Utama */}
        <div className="bg-white/10 rounded-[2rem] p-5 border border-[#FAED21]/40 backdrop-blur-md relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FAED21]" />
          <div className="pl-6 text-center">
            <p className="text-sm text-white/50 uppercase tracking-[0.2em] mb-1 font-semibold">
              {isFriday ? 'Khotib' : 'Imam'}
            </p>
            <p className="text-5xl font-bold text-white tracking-wide uppercase truncate leading-tight">
              {utama}
            </p>
          </div>
        </div>

        {/* Card Imam / Imam Badal */}
        <div className="bg-white/5 rounded-[1.5rem] p-4 border border-white/10 backdrop-blur-sm text-center">
          <p className="text-xs text-white/40 uppercase tracking-[0.1em] mb-1">
            {isFriday ? 'Imam Shalat' : 'Imam Badal'}
          </p>
          <p className="text-3xl font-semibold text-white/70 uppercase truncate">
            {badal}
          </p>
        </div>
      </div>
    </div>
  );
};