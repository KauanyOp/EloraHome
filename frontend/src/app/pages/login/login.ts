import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { mensagemErroApi } from '../../core/api-error';

@Component({
  imports: [RouterLink],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly aviso = signal('');

  entrar(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }
    const dados = new FormData(form);
    this.aviso.set('');
    this.auth.login(String(dados.get('email')), String(dados.get('senha'))).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('redirect');
        const destination = this.auth.isAdmin()
          ? '/admin/dashboard'
          : returnUrl?.startsWith('/') ? returnUrl : '/produtos';
        void this.router.navigateByUrl(destination);
      },
      error: (error: unknown) => this.aviso.set(mensagemErroApi(error, 'Não foi possível entrar. Verifique seus dados.'))
    });
  }
}
