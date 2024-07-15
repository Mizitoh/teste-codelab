import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Produto } from '../../produto/entities/produto.entity';

@Entity('produtoloja')
@Unique('un_prodLoja', ['produto', 'idLoja'])
export class ProdutoLoja {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'produtoloja_pkey' })
  id: number;

  @Column({ nullable: false })
  idLoja: number;

  @Column({ type: 'numeric', precision: 13, scale: 3, nullable: false })
  precoVenda: number;

  @ManyToOne(() => Produto, (produto) => produto.id)
  @JoinColumn({
    name: 'idProduto',
    foreignKeyConstraintName: 'fk_idProduto',
  })
  produto: Produto;
}
