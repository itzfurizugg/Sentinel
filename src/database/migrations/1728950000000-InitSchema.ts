import type { MigrationInterface } from 'typeorm/migration/MigrationInterface.js';
import type { QueryRunner } from 'typeorm/query-runner/QueryRunner.js';

export class InitSchema1728950000000 implements MigrationInterface {
  name = 'InitSchema1728950000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "students" (
        "nis"           VARCHAR(20)   NOT NULL,
        "nama_lengkap"  VARCHAR(100)  NOT NULL,
        "kelas"         VARCHAR(20)   NOT NULL,
        "created_at"    TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMPTZ   NOT NULL DEFAULT now(),
        CONSTRAINT "PK_students" PRIMARY KEY ("nis")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "attendances" (
        "id"          UUID          NOT NULL DEFAULT gen_random_uuid(),
        "nis"         VARCHAR(20)   NOT NULL,
        "tanggal"     DATE          NOT NULL,
        "jam_masuk"   TIMESTAMPTZ,
        "jam_pulang"  TIMESTAMPTZ,
        CONSTRAINT "PK_attendances" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_attendances_nis_tanggal" UNIQUE ("nis", "tanggal"),
        CONSTRAINT "FK_attendances_students" FOREIGN KEY ("nis")
          REFERENCES "students" ("nis") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_attendances_nis_tanggal" ON "attendances" ("nis", "tanggal")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_students_kelas" ON "students" ("kelas")
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_attendances_nis_tanggal"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_students_kelas"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "attendances"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "students"`);
  }
}
