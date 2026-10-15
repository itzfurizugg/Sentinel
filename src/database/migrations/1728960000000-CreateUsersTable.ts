import type { MigrationInterface } from 'typeorm/migration/MigrationInterface.js';
import type { QueryRunner } from 'typeorm/query-runner/QueryRunner.js';

export class CreateUsersTable1728960000000 implements MigrationInterface {
  name = 'CreateUsersTable1728960000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('admin', 'user')
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"          UUID                NOT NULL DEFAULT gen_random_uuid(),
        "email"       VARCHAR(150)        NOT NULL,
        "password"    VARCHAR(255)        NOT NULL,
        "role"        "user_role_enum"    NOT NULL DEFAULT 'user',
        "nis"         VARCHAR(20),
        "created_at"  TIMESTAMPTZ         NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMPTZ         NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_users_nis" UNIQUE ("nis"),
        CONSTRAINT "FK_users_students" FOREIGN KEY ("nis")
          REFERENCES "students" ("nis") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users_role" ON "users" ("role")
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_role"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum"`);
  }
}
