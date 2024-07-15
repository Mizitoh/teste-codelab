import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertLoja1720889119589 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO loja (descricao) VALUES ('LOJA 1');
            INSERT INTO loja (descricao) VALUES ('LOJA 2');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            delete from loja;
        `);
  }
}
