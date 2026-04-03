import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { MapPin } from 'lucide-react';

interface HeaderProps {
  now: Date;
}

export const Header = ({ now }: HeaderProps) => {
  const [hijriDate, setHijriDate] = useState<string>('Memuat...');

  useEffect(() => {
    const fetchHijri = async () => {
      try {
        const dateStr = format(now, 'dd-MM-yyyy');
        const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${dateStr}`);
        const json = await response.json();

        if (json.code === 200) {
          const { day, month, year } = json.data.hijri;
          // Tips: Kamu bisa mapping month.en ke bahasa Indonesia jika ingin lebih rapi
          setHijriDate(`${day} ${month.en} ${year}`);
        }
      } catch (error) {
        console.error("Gagal ambil data Hijriah:", error);
        setHijriDate("Gagal memuat");
      }
    };

    fetchHijri();
  }, [now.toDateString()]);

  // LOGIKA CUSTOM HARI: Ganti "Minggu" jadi "Ahad"
  const dayName = format(now, 'EEEE', { locale: id }); // Hasil default: "Minggu"
  const formattedDate = format(now, 'dd MMMM yyyy', { locale: id });

  // now.getDay() === 0 artinya hari Minggu
  const displayedDay = now.getDay() === 0 ? 'Ahad' : dayName;

  return (
    <div className="flex justify-between items-center bg-white/5 backdrop-blur-3xl px-10 py-6 rounded-[40px] border border-white/10 shadow-2xl">
      <div className="flex items-center gap-10">
        <div className="relative w-64">
          <Image
            src="/logo-improve.png"
            alt="Logo Muhammadiyah"
            width={400}
            height={400}
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>

        <div className="flex flex-col border-l-2 border-white/20 pl-10 text-white">
          {/* Mengubah text-5xl menjadi text-8xl */}
          <h1 className="text-4xl font-bold tracking-tight leading-none mb-2">
             MUSHOLLA MUHAMMADIYAH AL-HUDA
          </h1>

          {/* Mengubah text-xl menjadi text-3xl */}
          <p className="text-3xl text-[#FAED21] tracking-[0.15em] uppercase flex items-center gap-3 font-semibold">
            PRM Rambutan  <br />PCM Utankayu 
          </p>
        </div>
      </div>

      <div className="text-right flex flex-col items-end text-white">
        {/* Jam Digital */}
        <div className="text-8xl font-mono font-bold leading-none tracking-tighter tabular-nums">
          {format(now, 'HH:mm:ss')}
        </div>

        <div className="mt-4 flex flex-col items-end gap-1">
          {/* Tanggal Masehi dengan logika Ahad */}
          <div className="text-3xl text-white font-medium uppercase tracking-[0.05em]">
            {displayedDay}, {formattedDate}
          </div>

          {/* Tanggal Hijriah */}
          <div className="text-3xl text-[#FAED21] font-bold flex items-center gap-2">
            {hijriDate} H
          </div>
        </div>
      </div>
    </div>
  );
};