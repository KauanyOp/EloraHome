import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, type CadastroPayload } from '../../core/auth.service';

@Component({
  imports: [RouterLink],
  selector: 'app-cadastro',
  styleUrl: './cadastro.scss',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  avancar(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }
    const dados = new FormData(form);
    this.auth.cadastroPendente = {
      name: String(dados.get('nome')),
      birth_date: String(dados.get('nascimento')),
      phone: String(dados.get('telefone')),
      email: String(dados.get('email')),
      password: String(dados.get('senha')),
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: ''
    } satisfies CadastroPayload;
    void this.router.navigateByUrl('/cadastro-endereco');
  }
}
