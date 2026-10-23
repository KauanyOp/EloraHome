
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro - EloraHome</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #E6DFD6;
            color: #292323;
        }

        main {
            max-width: 400px;
            margin: 40px auto;
            padding: 25px;
            background: white;
            border-radius: 8px;
        }

        h1 {
            color: #344E41;
            text-align: center;
        }

        label {
            display: block;
            margin: 15px 0 5px;
        }

        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        button {
            width: 100%;
            margin-top: 20px;
            padding: 10px;
            border: none;
            border-radius: 5px;
            background: #344E41;
            color: white;
            cursor: pointer;
        }

        a {
            color: #344E41;
        }

        .erro {
            color: #B42318;
        }

        p {
            text-align: center;
        }
    </style>
</head>
<body>
    <main>
        <h1>Criar conta</h1>

        @if ($errors->any())
            <ul class="erro">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        @endif

        <form method="POST" action="/cadastro">
            @csrf

            <label for="name">Nome:</label>
            <input type="text" id="name" name="name"
                   value="{{ old('name') }}" required>

            <label for="email">E-mail:</label>
            <input type="email" id="email" name="email"
                   value="{{ old('email') }}" required>

            <label for="password">Senha:</label>
            <input type="password" id="password" name="password" required>

            <label for="password_confirmation">Confirme a senha:</label>
            <input type="password" id="password_confirmation"
                   name="password_confirmation" required>

            <button type="submit">Cadastrar</button>
        </form>

        <p>Já tem conta? <a href="/login">Entrar</a></p>
    </main>
</body>
</html>
