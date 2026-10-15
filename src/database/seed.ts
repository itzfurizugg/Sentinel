import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5433', 10),
  username: process.env.DB_USERNAME ?? 'sentinel',
  password: process.env.DB_PASSWORD ?? 'sentinel123',
  database: process.env.DB_DATABASE ?? 'sentinel',
});

const students = [
  { nis: '2324001', nama_lengkap: 'Budi Santoso', kelas: 'XII IPA 1' },
  { nis: '2324002', nama_lengkap: 'Siti Rahayu', kelas: 'XII IPA 1' },
  { nis: '2324003', nama_lengkap: 'Ahmad Fauzi', kelas: 'XII IPA 2' },
  { nis: '2324004', nama_lengkap: 'Dewi Lestari', kelas: 'XII IPA 2' },
  { nis: '2324005', nama_lengkap: 'Rizky Pratama', kelas: 'XII IPS 1' },
  { nis: '2324006', nama_lengkap: 'Nurul Hidayah', kelas: 'XII IPS 1' },
  { nis: '2324007', nama_lengkap: 'Fajar Ramadan', kelas: 'XII IPS 2' },
  { nis: '2324008', nama_lengkap: 'Indah Permata', kelas: 'XII IPS 2' },
  { nis: '2324009', nama_lengkap: 'Hendra Wijaya', kelas: 'XI IPA 1' },
  { nis: '2324010', nama_lengkap: 'Putri Anggraeni', kelas: 'XI IPA 1' },
];

async function seed() {
  await ds.initialize();
  for (const s of students) {
    await ds.query(
      `INSERT INTO students (nis, nama_lengkap, kelas)
       VALUES ($1, $2, $3)
       ON CONFLICT (nis) DO UPDATE
         SET nama_lengkap = EXCLUDED.nama_lengkap,
             kelas        = EXCLUDED.kelas,
             updated_at   = now()`,
      [s.nis, s.nama_lengkap, s.kelas],
    );
  }
  console.log(`Seeded ${students.length} students.`);
  await ds.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
