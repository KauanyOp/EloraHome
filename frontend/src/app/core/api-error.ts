import { HttpErrorResponse } from '@angular/common/http';

export function mensagemErroApi(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  const validationMessages = error.error?.errors;
  if (validationMessages && typeof validationMessages === 'object') {
    const firstMessage = Object.values(validationMessages as Record<string, unknown>)
      .flat()
      .find((message): message is string => typeof message === 'string');
    if (firstMessage) {
      return firstMessage;
    }
  }

  return typeof error.error?.message === 'string' ? error.error.message : fallback;
}
