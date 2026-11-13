import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { mensagemErroApi } from '../../core/api-error';

@Component({
  imports: [RouterLink],
  selector: 'app-cadastro-endereco',
  styleUrl: './cadastro-endereco.scss',
  templateUrl: './cadastro-endereco.html',
})
export class CadastroEndereco {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  readonly erro = signal('');

  readonly estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
    'SP', 'SE', 'TO'
  ];

  criarConta(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget;
    const cadastro = this.auth.cadastroPendente;
    if (!(form instanceof HTMLFormElement) || !cadastro) {
      void this.router.navigateByUrl('/cadastro');
      return;
    }
    const dados = new FormData(form);
    this.erro.set('');
    this.auth.register({
      ...cadastro,
      cep: String(dados.get('cep')),
      street: String(dados.get('rua')),
      city: String(dados.get('cidade')),
      state: String(dados.get('estado'))
    }).subscribe({
      next: () => {
        this.auth.cadastroPendente = null;
        void this.router.navigateByUrl('/');
      },
      error: (error: unknown) => this.erro.set(mensagemErroApi(error, 'Não foi possível criar sua conta.'))
    });
  }
}
