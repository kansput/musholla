"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { El_Messiri } from 'next/font/google';
import { getPrayerTimes } from '@/lib/prayerTimes';
import { weeklySchedule } from '@/lib/weeklySchedule';
import { isAfter } from 'date-fns';

// Components
import { BackgroundGradient } from '@/components/BackgroundGradient';
import { Header } from '@/components/Header';
import { PrayerCard } from '@/components/PrayerCard';
import { MarqueeFooter } from '@/components/MarqueeFooter';
import { AdzanOverlay } from '@/components/AdzanOverlay';
import { IqomahOverlay } from '@/components/IqomahOverlay';
import { ImamOverlay } from '@/components/ImamOverlay';

const elMessiri = El_Messiri({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-el-messiri',
});

type ActiveState =
  | { type: 'ADZAN'; data: { image: string; label: string } }
  | { type: 'IQOMAH'; data: { label: string; duration: number } }
  | { type: 'IMAM'; data: { label: string; utama: string; badal: string } }
  | { type: 'MAIN' };

export default function MushollaAlHuda() {
  const [now, setNow] = useState(new Date());
  const [audioEnabled, setAudioEnabled] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedAudio = useRef<string | null>(null);

  // Konfigurasi Durasi (ms)
  const DURASI_ADZAN = 225 * 1000;
  const DURASI_INFO_IMAM = 15 * 1000;

  // Data Sholat & Jadwal
  const prayerTimes = useMemo(() => getPrayerTimes(now), [now.toDateString()]);
  const dayName = useMemo(() =>
    ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][now.getDay()],
    [now.getDay()]
  );
  const todayData = (weeklySchedule as any)[dayName] || {};

  // Timer & Inisialisasi Audio
  useEffect(() => {
    audioRef.current = new Audio('/sounds/beep.mp3');
    // FIX: interval 500ms agar countdown lebih responsif dan tidak skip angka
    const timer = setInterval(() => setNow(new Date()), 500);
    return () => {
      clearInterval(timer);
      // FIX: cleanup audio untuk prevent memory leak
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // Logika Utama Overlay (Disederhanakan & Memoized)
  const activeState: ActiveState = useMemo(() => {
    const currentTime = now.getTime();
    const schedules = [
      { label: 'Subuh', time: prayerTimes.Subuh, img: '/subuh.png', iqomah: 14 },
      { label: 'Dzuhur', time: prayerTimes.Dzuhur, img: '/dzuhur.png', iqomah: 13 },
      { label: 'Ashar', time: prayerTimes.Ashar, img: '/ashar.png', iqomah: 10 },
      { label: 'Maghrib', time: prayerTimes.Maghrib, img: '/maghrib.png', iqomah: 10 },
      { label: 'Isya', time: prayerTimes.Isya, img: '/isya.png', iqomah: 10 },
    ];

    for (const s of schedules) {
      if (dayName === 'Jumat' && s.label === 'Dzuhur') continue;

      const pTime = s.time.getTime();
      const endAdzan = pTime + DURASI_ADZAN;
      const endIqomah = endAdzan + (s.iqomah * 60 * 1000);
      const endImam = endIqomah + DURASI_INFO_IMAM;

      if (currentTime >= pTime && currentTime < endAdzan) {
        return { type: 'ADZAN', data: { image: s.img, label: s.label } };
      }

      if (currentTime >= endAdzan && currentTime < endIqomah) {
        const remainingSeconds = Math.max(0, Math.floor((endIqomah - currentTime) / 1000));
        return { type: 'IQOMAH', data: { label: s.label, duration: remainingSeconds } };
      }

      if (currentTime >= endIqomah && currentTime < endImam) {
        const info = todayData[s.label.toLowerCase()] || {};
        return {
          type: 'IMAM',
          data: {
            label: s.label,
            utama: info.utama || 'Petugas',
            badal: info.badal || '-'
          }
        };
      }
    }
    return { type: 'MAIN' };
  }, [now, prayerTimes, dayName, todayData]);

  // Handler Audio
  // FIX: reset lastPlayedAudio hanya saat kembali ke MAIN (semua fase selesai)
  // agar audio tidak mungkin bunyi ulang di tengah fase IQOMAH/IMAM
  useEffect(() => {
    const stateLabel = activeState.type === 'ADZAN' ? activeState.data.label : null;

    if (stateLabel && audioEnabled && lastPlayedAudio.current !== stateLabel) {
      audioRef.current?.play().catch(() => { });
      lastPlayedAudio.current = stateLabel;
    }

    if (activeState.type === 'MAIN') {
      lastPlayedAudio.current = null;
    }
  }, [activeState.type, (activeState as any).data?.label, audioEnabled]);

  const unlockAudio = () => {
    if (!audioEnabled) {
      setAudioEnabled(true);
      audioRef.current?.play().then(() => {
        audioRef.current?.pause();
      }).catch(() => { });
    }
  };

  const renderOverlay = () => {
    switch (activeState.type) {
      case 'ADZAN':
        return <AdzanOverlay isVisible imagePath={activeState.data.image} />;
      case 'IQOMAH':
        const iqData = todayData[activeState.data.label.toLowerCase()] || {};
        return (
          <IqomahOverlay
            isVisible
            durationSeconds={activeState.data.duration}
            prayerLabel={activeState.data.label}
            utama={iqData.utama ?? 'Petugas'}
            badal={iqData.badal ?? '-'}
            isFriday={dayName === 'Jumat'}
            onFinish={() => { }}
          />
        );
      case 'IMAM':
        return (
          <ImamOverlay
            isVisible
            prayerLabel={activeState.data.label}
            utama={activeState.data.utama}
            badal={activeState.data.badal}
          />
        );
      default:
        return null;
    }
  };

  const displaySchedules = [
    { label: 'Subuh', time: prayerTimes.Subuh, ...todayData?.subuh },
    { label: 'Syuruq', time: prayerTimes.Terbit },
    { label: 'Dzuhur', time: prayerTimes.Dzuhur, ...todayData?.dzuhur },
    { label: 'Ashar', time: prayerTimes.Ashar, ...todayData?.ashar },
    { label: 'Maghrib', time: prayerTimes.Maghrib, ...todayData?.maghrib },
    { label: 'Isya', time: prayerTimes.Isya, ...todayData?.isya },
  ];

  const nextPrayer = displaySchedules.find((p) => isAfter(p.time, now));

  return (
    <main
      onClick={unlockAudio}
      className={`${elMessiri.variable} font-[family-name:var(--font-el-messiri)] 
                 h-screen w-full flex flex-col justify-between p-10 select-none 
                 overflow-hidden text-white relative bg-[#1a204d]`}
    >
      <BackgroundGradient />
      {renderOverlay()}

      <div className="relative z-10 flex flex-col h-full justify-between">
        <Header now={now} />

        <div className="grid grid-cols-6 gap-5 my-6 animate-in fade-in duration-700">
          {displaySchedules.map((item) => (
            <PrayerCard
              key={item.label}
              label={item.label}
              time={item.time}
              currentTime={now}
              isUpcoming={nextPrayer?.label === item.label}
              utama={item.utama}
              badal={item.badal}
              muadzin={item.muadzin}
            />
          ))}
        </div>

        <MarqueeFooter />
      </div>

      {/* Audio Status Indicator */}
      <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 opacity-30">
        <div className={`w-1.5 h-1.5 rounded-full ${audioEnabled ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">
          {audioEnabled ? 'Sound On' : 'Click Screen to Unlock Sound'}
        </span>
      </div>
    </main>
  );
}