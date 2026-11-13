import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreApiService } from '../../core/store-api.service';
import type { ApiUser } from '../../core/api.models';
import { mensagemErroApi } from '../../core/api-error';

type StatusUsuario = 'Ativo' | 'Inativo';
type PerfilUsuario = 'Cliente' | 'Administrador';

interface UsuarioAdmin {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: PerfilUsuario;
  status: StatusUsuario;
}

interface DadosUsuario {
  nome: string;
  email: string;
  telefone: string;
  perfil: PerfilUsuario;
  senha: string;
}

function normalizarBusca(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

@Component({
  imports: [FormsModule],
  selector: 'app-usuarios',
  styleUrl: './usuarios.scss',
  templateUrl: './usuarios.html',
})
export class Usuarios {
  private readonly api = inject(StoreApiService);
  readonly usuarios = signal<UsuarioAdmin[]>([]);
  readonly erro = signal('');
  readonly busca = signal('');
  readonly filtroAtivo = signal<'Todos' | StatusUsuario>('Todos');
  readonly filtros: ('Todos' | StatusUsuario)[] = ['Todos', 'Ativo', 'Inativo'];
  readonly editorAberto = signal(false);
  readonly usuarioEditando = signal<UsuarioAdmin | null>(null);
  readonly dados: DadosUsuario = {
    nome: '',
    email: '',
    telefone: '',
    perfil: 'Cliente',
    senha: ''
  };

  constructor() {
    this.api.listUsers().subscribe({
      next: (users) => this.usuarios.set(users.map((user) => this.toAdminUser(user))),
      error: (error: unknown) => this.erro.set(mensagemErroApi(error, 'Não foi possível carregar os usuários.'))
    });
  }

  get usuariosFiltrados(): UsuarioAdmin[] {
    const busca = normalizarBusca(this.busca().trim());

    return this.usuarios().filter((usuario) => {
      const combinaFiltro = this.filtroAtivo() === 'Todos' || usuario.status === this.filtroAtivo();
      const camposBusca = normalizarBusca(
        `${usuario.nome} ${usuario.email} ${usuario.telefone} ${usuario.perfil}`
      );

      return combinaFiltro && (!busca || camposBusca.includes(busca));
    });
  }

  atualizarBusca(event: Event): void {
    this.busca.set((event.target as HTMLInputElement).value);
  }

  novoUsuario(): void {
    this.usuarioEditando.set(null);
    Object.assign(this.dados, {
      nome: '',
      email: '',
      telefone: '',
      perfil: 'Cliente',
      senha: ''
    });
    this.editorAberto.set(true);
  }

  editarUsuario(usuario: UsuarioAdmin): void {
    this.usuarioEditando.set(usuario);
    Object.assign(this.dados, {
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      perfil: usuario.perfil,
      senha: ''
    });
    this.editorAberto.set(true);
  }

  salvarUsuario(): void {
    const atual = this.usuarioEditando();
    const dados = {
      nome: this.dados.nome.trim(),
      email: this.dados.email.trim(),
      telefone: this.dados.telefone.trim(),
      perfil: this.dados.perfil,
      senha: this.dados.senha
    };

    if (atual) {
      this.api.updateUser(atual.id, {
        name: dados.nome,
        email: dados.email,
        phone: dados.telefone,
        is_admin: dados.perfil === 'Administrador'
      }).subscribe({
        next: (user) => {
          this.replaceUser(user);
          this.editorAberto.set(false);
          this.erro.set('');
        },
        error: (error: unknown) => this.erro.set(mensagemErroApi(error, 'Não foi possível salvar o usuário.'))
      });
    } else {
      this.api.createUser({
        name: dados.nome,
        email: dados.email,
        phone: dados.telefone,
        password: dados.senha,
        is_admin: dados.perfil === 'Administrador'
      }).subscribe({
        next: (user) => {
          this.usuarios.update((users) => [...users, this.toAdminUser(user)]);
          this.editorAberto.set(false);
          this.erro.set('');
        },
        error: (error: unknown) => this.erro.set(mensagemErroApi(error, 'Não foi possível cadastrar o usuário.'))
      });
    }
  }

  alternarStatus(usuario: UsuarioAdmin): void {
    this.api.updateUser(usuario.id, { is_active: usuario.status !== 'Ativo' }).subscribe({
      next: (user) => this.replaceUser(user),
      error: (error: unknown) => this.erro.set(mensagemErroApi(error, 'Não foi possível alterar o status do usuário.'))
    });
  }

  removerUsuario(id: number): void {
    this.api.deleteUser(id).subscribe({
      next: () => this.usuarios.update((users) => users.filter((user) => user.id !== id)),
      error: (error: unknown) => this.erro.set(mensagemErroApi(error, 'Não foi possível excluir o usuário.'))
    });
  }

  fecharEditor(): void {
    this.editorAberto.set(false);
  }

  private replaceUser(user: ApiUser): void {
    this.usuarios.update((users) => users.map((item) => item.id === user.id ? this.toAdminUser(user) : item));
  }

  private toAdminUser(user: ApiUser): UsuarioAdmin {
    return {
      id: user.id,
      nome: user.name,
      email: user.email,
      telefone: user.phone ?? '',
      perfil: user.is_admin ? 'Administrador' : 'Cliente',
      status: user.is_active ? 'Ativo' : 'Inativo'
    };
  }
}
