export interface ResponseData {
  message: any;
  data: {
    produto: Produto[];
    total: number;
  };
}

export interface Produto {
  id: number;
  descricao: string;
  custo: string;
  produtoLoja: ProdutoLoja[];
}

export interface ProdutoLoja {
  id: number;
  idLoja: number;
  precoVenda: string;
}

export interface ResponseDataLoja {
  message: any;
  data: {
    id: number;
    descricao: string;
  }[];
}

export interface ProdutoLoja {
  id: number;
  idLoja: number;
  precoVenda: string;
}

export interface CreateProdutoLoja {
  idLoja: number;
  precoVenda: number;
}

export interface Loja {
  id: number;
  descricao: string;
}

export interface IFindAllOrder {
  column: string;
  sort: 'asc' | 'desc';
}

export interface IFindAllFilter {
  column: string;
  value: string | number | boolean;
}

export interface createProdutoDTO {
  id?: number;
  descricao: string;
  custo: number,
  produtoLoja: CreateProdutoLoja[]
}
