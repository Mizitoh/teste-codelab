import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('loja')
export class Loja {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'loja_pkey' })
  id: number;

  @Column({ length: 60, nullable: false })
  descricao: string;
}
