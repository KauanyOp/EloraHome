import { Routes } from '@angular/router';

import { Loja } from './layouts/loja/loja';
import { Autenticacao } from './layouts/autenticacao/autenticacao';
import { Admin } from './layouts/admin/admin';

import { Home } from './pages/home/home';
import { Produtos } from './pages/produtos/produtos';
import { Produto } from './pages/produto/produto';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { CadastroEndereco } from './pages/cadastro-endereco/cadastro-endereco';
import { Checkout } from './pages/checkout/checkout';
import { Pedido } from './pages/pedido/pedido';

import { Carrinho } from './components/carrinho/carrinho';

import { Dashboard } from './admin/dashboard/dashboard';
import { Produtos as AdminProdutos } from './admin/produtos/produtos';
import { Pedidos } from './admin/pedidos/pedidos';
import { Usuarios } from './admin/usuarios/usuarios';

export const routes: Routes = [

  {
    path: '',
    component: Loja,
    children: [
      { path: '', component: Home },
      { path: 'produtos', component: Produtos },
      { path: 'produto/:id', component: Produto },
      { path: 'carrinho', component: Carrinho },
      { path: 'checkout', component: Checkout },
      { path: 'confirmacao', redirectTo: 'checkout', pathMatch: 'full' },
      { path: 'pedido', component: Pedido }
    ]
  },

  {
    path: '',
    component: Autenticacao,
    children: [
      { path: 'login', component: Login },
      { path: 'cadastro', component: Cadastro },
      { path: 'cadastro-endereco', component: CadastroEndereco }
    ]
  },

  {
    path: 'admin',
    component: Admin,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'produtos', component: AdminProdutos },
      { path: 'pedidos', component: Pedidos },
      { path: 'usuarios', component: Usuarios }
    ]
  },

  { path: '**', redirectTo: '' }

];
