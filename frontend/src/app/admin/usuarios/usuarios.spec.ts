import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Usuarios } from './usuarios';

describe('Usuarios', () => {
  let component: Usuarios;
  let fixture: ComponentFixture<Usuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Usuarios],
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

  it('creates, edits, deactivates, and removes a user locally', () => {
    component.novoUsuario();
    Object.assign(component.dados, {
      nome: 'Joana Lima',
      email: 'joana@example.com',
      telefone: '(11) 90000-0000',
      perfil: 'Cliente'
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
