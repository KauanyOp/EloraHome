import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-cadastro-endereco',
  styleUrl: './cadastro-endereco.scss',
  templateUrl: './cadastro-endereco.html',
})
export class CadastroEndereco {
  private readonly router = inject(Router);

  readonly estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
    'SP', 'SE', 'TO'
  ];

  criarConta(event: SubmitEvent): void {
    event.preventDefault();
    void this.router.navigateByUrl('/login?cadastro=concluido');
  }
}
