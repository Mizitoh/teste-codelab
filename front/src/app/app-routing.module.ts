import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaProdutoComponent } from './consulta-produto/consulta-produto.component';
import { CadastroProdutoComponent } from './cadastro-produto/cadastro-produto.component';

const routes: Routes = [
  { path: '', component: ConsultaProdutoComponent },
  { path: 'cadastro', component: CadastroProdutoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
