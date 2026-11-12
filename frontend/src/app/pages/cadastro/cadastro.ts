import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-cadastro',
  styleUrl: './cadastro.scss',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  private readonly router = inject(Router);

  avancar(event: SubmitEvent): void {
    event.preventDefault();
    void this.router.navigateByUrl('/cadastro-endereco');
  }
}
