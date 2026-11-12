import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  readonly aviso = signal('');

  entrar(event: SubmitEvent): void {
    event.preventDefault();
    this.aviso.set('A autenticação ainda não está disponível nesta versão.');
  }
}
