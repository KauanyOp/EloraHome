import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { mensagemErroApi } from '../../core/api-error';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly erro = signal('');

  sair(): void {
    this.auth.logout().subscribe({
      next: () => void this.router.navigateByUrl('/login'),
      error: (error: unknown) => this.erro.set(mensagemErroApi(error, 'Não foi possível encerrar a sessão.'))
    });
  }
}
