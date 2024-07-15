import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IFindAllFilter, IFindAllOrder, Produto, ProdutoLoja, ResponseData } from '../models/entidades';
import { ProdutoService } from '../services/produto.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consulta-produto',
  templateUrl: './consulta-produto.component.html',
  styleUrls: ['./consulta-produto.component.css']
})
export class ConsultaProdutoComponent {

  dataSource = new MatTableDataSource<Produto>();
  displayedColumns: string[] = ['id', 'descricao', 'custo', 'precoVenda', 'acoes'];
  produtos: Produto[] = [];
  totalElements: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  order: IFindAllOrder = { column: 'id', sort: 'asc' };
  filters: IFindAllFilter[] = [];
  dadosProduto!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private produtoService: ProdutoService,
    private route: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarProdutosPaginados();
  }

  initForm() {
    this.dadosProduto = this.formBuilder.group({
      codigo: [''],
      descricao: [''],
      custo: [''],
      precoVenda: [''],
    });
  }

  carregarProdutosPaginados() {
    this.produtoService.carregarProdutosPaginados(this.pageIndex + 1, this.pageSize, this.order, this.filters)
      .subscribe((response: ResponseData) => {
        this.produtos = response.data.produto || [];
        this.totalElements = response.data.total;
        this.dataSource.data = this.produtos;
      });
  }

  carregarProdutoPrecoVenda(preco: number) {
    if (this.produtos && (this.dadosProduto.get('descricao')?.value != '' || this.dadosProduto.get('custo')?.value != '')) {
      this.dataSource.data = this.produtos.filter(produto =>
        produto.produtoLoja.some(produtoLoja => parseFloat(produtoLoja.precoVenda) === preco))
        return;
    }
    this.pageIndex = 0;
    this.pageSize = 10;
    this.produtoService.carregarProdutosPrecoVenda(this.pageIndex + 1, this.pageSize, 'id', preco)
      .subscribe((response: any) => {
        this.totalElements = response.data.length;
        this.dataSource.data = response.data || [];
      });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.carregarProdutosPaginados();
  }

  aplicarFiltro() {
    const descricao = this.dadosProduto.get('descricao')?.value;
    const codigo = this.dadosProduto.get('codigo')?.value;
    const custo = this.dadosProduto.get('custo')?.value;
    const precoVenda = this.dadosProduto.get('precoVenda')?.value;
    if (descricao) {
      this.filters.push({ column: 'descricao', value: descricao });
    }
    if (codigo) {
      this.filters.push({ column: 'id', value: parseInt(codigo) });
    }
    if (custo) {
      this.filters.push({ column: 'custo', value: parseFloat(custo) });
    }
    if (precoVenda) {
      this.carregarProdutoPrecoVenda(parseFloat(precoVenda))
      return;
    }
    this.carregarProdutosPaginados();
    this.filters = []
  }

  editaProduto(produto: Produto) {
    if(produto){
      this.produtoService.set(produto);
      this.route.navigateByUrl("cadastro")
    }
  }

  deletaProduto(produto: Produto) {
    this.produtoService.deleta(produto.id.toString()).subscribe({
      next: (value) => {
        console.log(value);
      },
      error: (error) => {
      console.log(error);
      }
    });
    this.carregarProdutosPaginados();
  }

    cadastra() {
      console.log('aqui')
      const produtoVazio: Produto = {
        id: 0,
        descricao: '',
        custo: '',
        produtoLoja: []
      };
  this.produtoService.set(produtoVazio)
  this.route.navigateByUrl('cadastro')
  }
}
