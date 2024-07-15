import { createProdutoDTO, IFindAllFilter, IFindAllOrder, Produto, ResponseData } from './../models/entidades';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, map, Observable } from 'rxjs';
import { urlApi } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  produto?: Produto;

  private readonly API = urlApi;

  constructor(private http: HttpClient) {}

  carregarProdutos(): Observable<ResponseData> {
    const endpoint = `${this.API}/produto/`;

    return this.http.get<ResponseData>(endpoint).pipe(
      map(response => response)
    );
  }

  carregarProdutosPaginados(page: number, size: number, order: IFindAllOrder, filters: IFindAllFilter[]): Observable<ResponseData> {
    const orderString = encodeURIComponent(JSON.stringify(order));
    const filterString = encodeURIComponent(JSON.stringify(filters));
    const endpoint = `${this.API}/produto/${page}/${size}/${orderString}?filter=${filterString}`;

    return this.http.get<ResponseData>(endpoint).pipe(
      map(response => response)
    );
  }

  carregarProdutosPrecoVenda(page: number, size: number, order: string, preco: number): Observable<ResponseData> {
    const endpoint = `${this.API}/produto/preco/${page}/${size}/${order}?precoVenda=${preco}`;
    return this.http.get<ResponseData>(endpoint).pipe(
      map(response => response)
    );
  }

  createProduto(dto: Partial<createProdutoDTO>) {
    console.log(dto);
    if (dto.id) {
       console.log('update');
      return this.update(dto);
    }
     console.log('create');
    return this.create(dto);
  }
  private create(dto: Partial<createProdutoDTO>) {
    return this.http.post<createProdutoDTO>(`${this.API}/produto`, dto).pipe(first());
  }
  private update(dto: Partial<createProdutoDTO>) {
    return this.http.patch<createProdutoDTO>(`${this.API}/produto/${dto.id}`, dto).pipe(first());
  }

  deleta(id: string) {
    return this.http.delete(`${this.API}/produto/${id}`).pipe(first());
  }

  set(produto: Produto) {
    this.produto = produto;
  }

  get(): Produto {
    return this.produto!;
  }
}
