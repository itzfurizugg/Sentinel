# Sentinel Backend

REST API sistem absensi siswa — NestJS + PostgreSQL + TypeORM.

## Setup

```bash
cp .env.example .env
# Edit .env sesuai kebutuhan

docker compose up -d        # jalankan PostgreSQL
npm install
npm run migration:run       # buat tabel students + attendances
npm run seed                # isi data siswa contoh
npm run start:dev           # development (watch mode)
```

## Struktur Folder

```
src/
  students/
    student.entity.ts
    student.dto.ts
    students.service.ts
    students.controller.ts
    students.module.ts
  attendance/
    attendance.entity.ts
    attendance.dto.ts
    attendance.service.ts
    attendance.controller.ts
    attendance.module.ts
  database/
    migrations/
      1728950000000-InitSchema.ts
    seed.ts
  common/
    filters/all-exceptions.filter.ts
    interceptors/response.interceptor.ts
  app.module.ts
  main.ts
data-source.ts
docker-compose.yml
.env.example
```

## Endpoints

### Students

| Method | Path | Deskripsi |
|--------|------|-----------|
| POST | `/students` | Tambah siswa |
| GET | `/students?kelas=XII+IPA+1&page=1&limit=20` | Daftar siswa |
| GET | `/students/:nis` | Detail siswa |
| PATCH | `/students/:nis` | Update siswa |
| DELETE | `/students/:nis` | Hapus siswa |

### Attendance

| Method | Path | Deskripsi |
|--------|------|-----------|
| POST | `/attendance/scan` | Scan kartu (masuk/pulang) |
| GET | `/attendance?kelas=XII+IPA+1&from=2026-10-01&to=2026-10-31` | Rekap absensi |
| GET | `/attendance/student/:nis?from=2026-10-01&to=2026-10-31` | Rekap per siswa |

Swagger docs: `http://localhost:3000/docs`

## Contoh Request

### Scan kartu (ESP32)

```bash
curl -s -X POST http://localhost:3000/attendance/scan \
  -H "Content-Type: application/json" \
  -d '{"nis":"2324001"}'
```

Response masuk:
```json
{
  "success": true,
  "data": {
    "status": "masuk",
    "nama": "Budi Santoso",
    "nis": "2324001",
    "kelas": "XII IPA 1",
    "waktu": "2026-10-15T02:30:00.000Z"
  }
}
```

Response scan kedua (pulang):
```json
{
  "success": true,
  "data": {
    "status": "pulang",
    "nama": "Budi Santoso",
    "nis": "2324001",
    "kelas": "XII IPA 1",
    "waktu": "2026-10-15T09:00:00.000Z"
  }
}
```

Response scan ketiga (sudah lengkap):
```json
{
  "success": true,
  "data": {
    "status": "lengkap",
    "nama": "Budi Santoso",
    "nis": "2324001",
    "kelas": "XII IPA 1",
    "waktu": null
  }
}
```

### Rekap absensi

```bash
curl "http://localhost:3000/attendance?kelas=XII+IPA+1&from=2026-10-01&to=2026-10-31&page=1&limit=20"
```

```bash
curl "http://localhost:3000/attendance/student/2324001?from=2026-10-01&to=2026-10-31"
```

## Environment Variables

| Variable | Default | Keterangan |
|----------|---------|------------|
| `DB_HOST` | localhost | Host PostgreSQL |
| `DB_PORT` | 5433 | Port (docker-compose pakai 5433) |
| `DB_USERNAME` | sentinel | User DB |
| `DB_PASSWORD` | sentinel123 | Password DB |
| `DB_DATABASE` | sentinel | Nama database |
| `PORT` | 3000 | Port server |

## Timezone

Tanggal ditentukan dalam Asia/Jakarta (UTC+7). Timestamp disimpan dalam UTC di database.
