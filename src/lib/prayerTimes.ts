// src/lib/prayerTimes.ts
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

export const getPrayerTimes = (date: Date) => {
    // Koordinat Matraman
    const coordinates = new Coordinates(-6.2018, 106.8688);

    const params = CalculationMethod.Singapore();
    params.fajrAngle = 18;
    params.ishaAngle = 18;

    params.adjustments.fajr = 1;
    params.adjustments.sunrise = -3;
    params.adjustments.dhuhr = 0;
    params.adjustments.asr = 1;
    params.adjustments.maghrib = 3;
    params.adjustments.isha = 2;



    const prayerTimes = new PrayerTimes(coordinates, date, params);

    // --- LOGIKA TESTING ---
    // Kita buat objek Date baru berdasarkan tanggal yang sedang berjalan
    const fajrtest = new Date(date);
    // Set ke jam 19, menit 08, detik 00
    fajrtest.setHours(23, 59, 0, 0);
    // ----------------------

    return {
        Subuh: prayerTimes.fajr,
        Terbit: prayerTimes.sunrise,
        Dzuhur: prayerTimes.dhuhr,
        Ashar: prayerTimes.asr, // prayerTimes.asr,  --- LOGIKA TESTING ---
        Maghrib: prayerTimes.maghrib,
        Isya: prayerTimes.isha,
    };
};