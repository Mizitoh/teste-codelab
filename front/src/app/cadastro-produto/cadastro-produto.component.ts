import { LojaService } from './../services/loja.service';
import { Component } from '@angular/core';
import { createProdutoDTO, Loja, ResponseDataLoja } from '../models/entidades';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProdutoService } from '../services/produto.service';

@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.component.html',
  styleUrls: ['./cadastro-produto.component.css']
})
export class CadastroProdutoComponent {

  lojas: Loja[] = [];
  lojaSelecionada: Loja | undefined;
  inputPreco: string | undefined;
  precosLojas: { idLoja: number, descricao: string, precoVenda: number }[] = [];
  createProdutoDto?: createProdutoDTO;
  produtoForm!: FormGroup;

  constructor(private lojaService: LojaService,
    private formBuilder: FormBuilder,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    this.carregarLojas();
    this.initForm();
  }

  initForm() {
    this.produtoForm = this.formBuilder.group({
      codigo: [''],
      descricao: ['', Validators.required],
      custo: ['', Validators.required],
      idLoja: [''],
      precoVenda: ['']
    });
  }


  carregarLojas() {
    this.lojaService.carregarLojas()
      .subscribe((response: ResponseDataLoja) => {
        this.lojas = response.data || [];
        const produto = this.produtoService.get();
        if (produto) {
          this.createProdutoDto = Object.assign(produto)
          this.produtoForm = this.formBuilder.group({
            codigo: produto.id,
            descricao: produto.descricao,
            custo: produto.custo
          });
          for (let index = 0; index < produto.produtoLoja.length; index++) {
            const idLoja = produto.produtoLoja[index].idLoja;
            const descricaoLoja = this.lojas.find(loja => loja.id === idLoja)!.descricao;
            this.precosLojas.push({
              idLoja,
              descricao: descricaoLoja,
              precoVenda: parseFloat(produto.produtoLoja[index].precoVenda)
            });
          }
        }
      });
  }

  adicionaPrecoLoja() {
    if (this.lojaSelecionada && this.inputPreco !== undefined) {
      this.precosLojas.push({
        idLoja: this.lojaSelecionada.id,
        descricao: this.lojaSelecionada.descricao,
        precoVenda: parseFloat(this.inputPreco)
      });

      this.lojas = this.lojas.filter(loja => loja.id !== this.lojaSelecionada!.id);

      this.lojaSelecionada = undefined;
      this.inputPreco = undefined;
    }
  }

  salvarProduto() {
    const produtoLoja = this.precosLojas.map(({ descricao, ...rest }) => rest);
    const id = this.produtoForm.get('codigo')?.value
    this.createProdutoDto = {
      descricao: this.produtoForm.get('descricao')?.value,
      custo: parseFloat(this.produtoForm.get('custo')?.value),
      produtoLoja: produtoLoja
    };
    if (id) {
      this.createProdutoDto = {
        id,
        descricao: this.produtoForm.get('descricao')?.value,
        custo: parseFloat(this.produtoForm.get('custo')?.value),
        produtoLoja: produtoLoja
      };
    }
    console.log(this.createProdutoDto)

    this.produtoService.createProduto(this.createProdutoDto).subscribe({
      next: (value) => {
        console.log(value);
      },
      error: (error) => {
      console.log(error);
      }
    })
  }

  //incompleto
  editaPrecoLoja(precoLoja: { idLoja: number, descricao: string, precoVenda: number } ) {
    const lojaEncontrada = this.lojas.find(loja => loja.id === precoLoja.idLoja);
    this.precosLojas = this.precosLojas.filter(item => item.idLoja !== precoLoja.idLoja);
  if (lojaEncontrada) {
    this.precosLojas
    this.lojaSelecionada = lojaEncontrada;
    this.inputPreco = precoLoja.precoVenda.toString();
    console.log(this.lojaSelecionada);
    } else {
      console.error(`Loja com id ${precoLoja.idLoja} não encontrada.`);
    }
  }
}
