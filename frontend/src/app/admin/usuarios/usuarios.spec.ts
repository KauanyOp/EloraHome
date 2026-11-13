import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Usuarios } from './usuarios';
import { StoreApiService } from '../../core/store-api.service';

const users = [
  { id: 1, name: 'Ana Souza', email: 'ana.souza@example.com', phone: '(11) 98765-4321', birth_date: null, cep: null, street: null, number: null, complement: null, neighborhood: null, city: null, state: null, is_admin: false, is_active: true },
  { id: 2, name: 'Camila Oliveira', email: 'camila@example.com', phone: '(31) 96543-2109', birth_date: null, cep: null, street: null, number: null, complement: null, neighborhood: null, city: null, state: null, is_admin: false, is_active: false }
];

describe('Usuarios', () => {
  let component: Usuarios;
  let fixture: ComponentFixture<Usuarios>;

  beforeEach(async () => {
    const api = {
      listUsers: () => of(users),
      createUser: (user: { name: string; email: string; phone: string; password: string; is_admin: boolean }) => of({
        ...users[0],
        id: 3,
        name: user.name,
        email: user.email,
        phone: user.phone,
        is_admin: user.is_admin,
        is_active: true
      }),
      updateUser: (id: number, patch: Record<string, unknown>) => {
        const user = users.find((item) => item.id === id) ?? {
          ...users[0],
          id,
          name: 'Joana Lima',
          email: 'joana@example.com',
          phone: '(11) 90000-0000'
        };
        return of({ ...user, ...patch });
      },
      deleteUser: () => of(undefined)
    };
    await TestBed.configureTestingModule({
      imports: [Usuarios],
      providers: [{ provide: StoreApiService, useValue: api }],
    }).compileComponents();

    fixture = TestBed.createComponent(Usuarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters users by name or email and by status', () => {
    component.busca.set('ANA.SOUZA');
    expect(component.usuariosFiltrados).toHaveLength(1);
    expect(component.usuariosFiltrados[0].nome).toBe('Ana Souza');

    component.busca.set('');
    component.filtroAtivo.set('Inativo');
    expect(component.usuariosFiltrados.length).toBeGreaterThan(0);
    expect(component.usuariosFiltrados.every((usuario) => usuario.status === 'Inativo')).toBe(true);
  });

  it('creates, edits, deactivates, and removes users through the API service', () => {
    component.novoUsuario();
    Object.assign(component.dados, {
      nome: 'Joana Lima',
      email: 'joana@example.com',
      telefone: '(11) 90000-0000',
      perfil: 'Cliente',
      senha: 'senha-segura-123'
    });
    component.salvarUsuario();

    const novoUsuario = component.usuarios().find((usuario) => usuario.email === 'joana@example.com');
    expect(novoUsuario).toBeTruthy();
    expect(component.editorAberto()).toBe(false);

    component.editarUsuario(novoUsuario!);
    component.dados.nome = 'Joana Martins';
    component.salvarUsuario();
    expect(component.usuarios().find((usuario) => usuario.id === novoUsuario!.id)?.nome).toBe('Joana Martins');

    const usuarioAtualizado = component.usuarios().find((usuario) => usuario.id === novoUsuario!.id)!;
    component.alternarStatus(usuarioAtualizado);
    expect(component.usuarios().find((usuario) => usuario.id === novoUsuario!.id)?.status).toBe('Inativo');

    component.removerUsuario(novoUsuario!.id);
    expect(component.usuarios().some((usuario) => usuario.id === novoUsuario!.id)).toBe(false);
  });
});
