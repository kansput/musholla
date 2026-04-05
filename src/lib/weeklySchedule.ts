// src/lib/weeklySchedule.ts

export interface ImamSchedule {
  utama: string;
  badal: string;
  muadzin: string;
}

export interface FridaySchedule {
  khatib: string;
  imam: string;
  muadzin: string;
 
}

export interface DaySchedule {
  subuh: ImamSchedule;
  dzuhur?: ImamSchedule; // Optional karena hari Jumat pakai jadwal khusus
  jumat?: FridaySchedule; // Khusus untuk jadwal shalat Jumat
  ashar: ImamSchedule;
  maghrib: ImamSchedule;
  isya: ImamSchedule;
}

export const weeklySchedule: Record<string, DaySchedule> = {
  Senin: {
    subuh: { utama: "Warta", badal: "Dewa Alfian", muadzin: "Warta" },
    dzuhur: { utama: "Warta", badal: "Dewa Alfian", muadzin: "Warta" },
    ashar: { utama: "Dewa Alfian", badal: "Warta", muadzin: "Warta" },
    maghrib: { utama: "Warta", badal: "Dewa Alfian", muadzin: "Warta" },
    isya: { utama: "Warta", badal: "Dewa Alfian", muadzin: "Warta" }
  },
  Selasa: {
    subuh: { utama: "Tedi Koswara", badal: "Warta", muadzin: "Warta" },
    dzuhur: { utama: "Warta", badal: "Dewa Alfian", muadzin: "Warta" },
    ashar: { utama: "Dewa Alfian", badal: "Warta", muadzin: "Warta" },
    maghrib: { utama: "Dewa Alfian", badal: "Warta", muadzin: "Warta" },
    isya: { utama: "Tedi Koswara", badal: "Warta", muadzin: "Warta" }
  },
  Rabu: {
    subuh: { utama: "Syakir Abdullah", badal: "Sulchan", muadzin: "Warta" },
    dzuhur: { utama: "Warta", badal: "Sulchan", muadzin: "Warta" },
    ashar: { utama: "Tedi Koswara", badal: "Sulchan", muadzin: "Warta" },
    maghrib: { utama: "Syakir Abdullah", badal: "Warta", muadzin: "Warta" },
    isya: { utama: "Syakir Abdullah", badal: "Warta", muadzin: "Warta" }
  },
  Kamis: {
    subuh: { utama: "Kanda Putra", badal: "Warta", muadzin: "Warta" },
    dzuhur: { utama: "Warta", badal: "Dewa Alfian", muadzin: "Warta" },
    ashar: { utama: "Dewa Alfian", badal: "Warta", muadzin: "Warta" },
    maghrib: { utama: "Warta", badal: "Dewa Alfian", muadzin: "Warta" },
    isya: { utama: "Warta", badal: "Dewa Alfian", muadzin: "Warta" }
  },
  Jumat: {
    subuh: { utama: "M.Syamsudin", badal: "Warta", muadzin: "Warta" },
    jumat: { khatib: "KHOTIB", imam: "IMAM", muadzin: "Muadzin Jumat" },
    ashar: { utama: "Dewa Alfian ", badal: "Warta", muadzin: "Warta" },
    maghrib: { utama: "M.Syamsudin", badal: "Warta", muadzin: "Warta" },
    isya: { utama: "M.Syamsudin", badal: "Warta", muadzin: "Warta" }
  },
  Sabtu: {
    subuh: { utama: "Sulchan", badal: "Warta", muadzin: "Warta" },
    dzuhur: { utama: "Warta", badal: "Dewa Alfian", muadzin: "Warta" },
    ashar: { utama: "Dewa Alfian", badal: "Warta", muadzin: "Warta" },
    maghrib: { utama: "Warta", badal: "Dewa Alfian", muadzin: "Warta" },
    isya: { utama: "Azan Saleh", badal: "Warta", muadzin: "Warta" }
  },
  Minggu: {
    subuh: { utama: "Syakir Abdullah", badal: "Syamsudin", muadzin: "Warta" },
    dzuhur: { utama: "Warta", badal: "Dewa Alfian", muadzin: "Warta" },
    ashar: { utama: "Dewa Alfian", badal: "Warta", muadzin: "Warta" },
    maghrib: { utama: "Warta", badal: "Dewa Alfian", muadzin: "Warta" },
    isya: { utama: "Galuh Yogaswara", badal: "Tedi Koswara", muadzin: "Warta" }
  }
};