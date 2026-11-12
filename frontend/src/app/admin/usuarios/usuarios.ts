import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  readonly usuarios = signal<UsuarioAdmin[]>([
    { id: 1, nome: 'Ana Souza', email: 'ana.souza@example.com', telefone: '(11) 98765-4321', perfil: 'Cliente', status: 'Ativo' },
    { id: 2, nome: 'Marina Costa', email: 'marina.costa@example.com', telefone: '(21) 97654-3210', perfil: 'Cliente', status: 'Ativo' },
    { id: 3, nome: 'Camila Oliveira', email: 'camila.oliveira@example.com', telefone: '(31) 96543-2109', perfil: 'Cliente', status: 'Inativo' },
    { id: 4, nome: 'Lucas Ferreira', email: 'lucas.ferreira@example.com', telefone: '(41) 95432-1098', perfil: 'Cliente', status: 'Ativo' },
    { id: 5, nome: 'Equipe Elora', email: 'equipe@example.com', telefone: '(11) 3000-0000', perfil: 'Administrador', status: 'Ativo' }
  ]);
  readonly busca = signal('');
  readonly filtroAtivo = signal<'Todos' | StatusUsuario>('Todos');
  readonly filtros: ('Todos' | StatusUsuario)[] = ['Todos', 'Ativo', 'Inativo'];
  readonly editorAberto = signal(false);
  readonly usuarioEditando = signal<UsuarioAdmin | null>(null);
  readonly dados: DadosUsuario = {
    nome: '',
    email: '',
    telefone: '',
    perfil: 'Cliente'
  };

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
      perfil: 'Cliente'
    });
    this.editorAberto.set(true);
  }

  editarUsuario(usuario: UsuarioAdmin): void {
    this.usuarioEditando.set(usuario);
    Object.assign(this.dados, {
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      perfil: usuario.perfil
    });
    this.editorAberto.set(true);
  }

  salvarUsuario(): void {
    const atual = this.usuarioEditando();
    const dados = {
      nome: this.dados.nome.trim(),
      email: this.dados.email.trim(),
      telefone: this.dados.telefone.trim(),
      perfil: this.dados.perfil
    };

    if (atual) {
      this.usuarios.update((usuarios) =>
        usuarios.map((usuario) => usuario.id === atual.id ? { ...usuario, ...dados } : usuario)
      );
    } else {
      const id = Math.max(0, ...this.usuarios().map((usuario) => usuario.id)) + 1;
      this.usuarios.update((usuarios) => [...usuarios, { ...dados, id, status: 'Ativo' }]);
    }

    this.editorAberto.set(false);
  }

  alternarStatus(usuario: UsuarioAdmin): void {
    this.usuarios.update((usuarios) =>
      usuarios.map((atual) => atual.id === usuario.id
        ? { ...atual, status: atual.status === 'Ativo' ? 'Inativo' : 'Ativo' }
        : atual)
    );
  }

  removerUsuario(id: number): void {
    this.usuarios.update((usuarios) => usuarios.filter((usuario) => usuario.id !== id));
  }

  fecharEditor(): void {
    this.editorAberto.set(false);
  }
}
