import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Produtos } from './pages/produtos/produtos';
import { Produto } from './pages/produto/produto';
import { Login } from './pages/login/login';
import { Checkout } from './pages/checkout/checkout';
import { Pedido } from './pages/pedido/pedido';
import { Cadastro } from './pages/cadastro/cadastro';
import { CadastroEndereco } from './pages/cadastro-endereco/cadastro-endereco';
import { Carrinho } from './components/carrinho/carrinho';
import { Confirmacao } from './components/confirmacao/confirmacao';
import { Dashboard } from './admin/dashboard/dashboard';
import { Produtos as AdminProdutos } from './admin/produtos/produtos';
import { Pedidos } from './admin/pedidos/pedidos';
import { Usuarios } from './admin/usuarios/usuarios';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'produtos', component: Produtos },
  { path: 'produto/:id', component: Produto },
  { path: 'carrinho', component: Carrinho },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'cadastro-endereco', component: CadastroEndereco },
  { path: 'checkout', component: Checkout },
  { path: 'confirmacao', component: Confirmacao },
  { path: 'pedido', component: Pedido },
  { path: 'admin/dashboard', component: Dashboard },
  { path: 'admin/produtos', component: AdminProdutos },
  { path: 'admin/pedidos', component: Pedidos },
  { path: 'admin/usuarios', component: Usuarios },
  { path: '**', redirectTo: '' }
];