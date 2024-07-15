export class FindProdutoPrecoDto {
  id: number;
  descricao: string;
  custo: number;
  produtoLoja: {
    id: number;
    idLoja: number;
    precoVenda: string;
  }[];
}
