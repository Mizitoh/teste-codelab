import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProdutoLoja } from '../../produtoloja/entities/produtoloja.entity';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';

@Entity('produto')
export class Produto {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'produto_pkey' })
  id: number;

  @Column({ length: 60, nullable: false })
  descricao: string;

  @Column({ type: 'numeric', precision: 13, scale: 3, nullable: true })
  custo: number;

  @OneToMany(() => ProdutoLoja, (produtoloja) => produtoloja.produto, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  produtoLoja: ProdutoLoja[];

  constructor(createProdutoDto: CreateProdutoDto | UpdateProdutoDto) {
    Object.assign(this, createProdutoDto);
  }
}
