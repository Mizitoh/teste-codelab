import { MigrationInterface, QueryRunner } from 'typeorm';

export class EstruturaBanco1720885614816 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            create table loja (
            id serial4 not null,
            descricao varchar(60) not null,
            constraint loja_pkey primary key (id));
        `);

    await queryRunner.query(`
        create table produto (
            id serial4 not null,
            descricao varchar(60) not null,
            custo numeric(13, 3),
            imagem bytea,
            constraint produto_pkey primary key (id));
            `);
    await queryRunner.query(`
            CREATE TABLE produtoloja (
            id serial4 NOT NULL,
            "idProduto" int4 NOT NULL,
            "idLoja" int4 NOT NULL,
            "precoVenda" numeric(13, 3),
            CONSTRAINT produtoloja_pkey PRIMARY KEY (id),
            CONSTRAINT fk_idProduto FOREIGN KEY ("idProduto") REFERENCES produto(id),
            CONSTRAINT fk_idLoja FOREIGN KEY ("idLoja") REFERENCES loja(id),
            CONSTRAINT un_prodLoja UNIQUE ("idLoja", "idProduto")
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        drop table produtoloja;

        drop table produto;

        drop table loja;
    `);
  }
}
