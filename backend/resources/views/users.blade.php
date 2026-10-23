<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elora | Usuários</title>

    
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
        max-width: 1000px;
        margin: auto;
    }

    h1, h2 {
        color: #344E41;
    }

    form, section {
        margin-bottom: 20px;
        padding: 20px;
        background: white;
        border-radius: 8px;
    }

    .campos {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }

    input, select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font: inherit;
    }

    button {
        margin: 8px 4px 0 0;
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        background: #344E41;
        color: white;
        cursor: pointer;
    }

    .excluir {
        background: #963F3F;
    }

    .cancelar {
        background: #777;
    }

    .tabela {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background: #F4F1ED;
        color: #344E41;
    }

    #mensagem {
        margin-top: 12px;
    }
</style>
</head>

<body>
<main>
    <h1>Elora — Usuários</h1>
    <p>Cadastro e gerenciamento de usuários.</p>

    <form id="usuarioForm">
        <h2 id="titulo">Cadastrar usuário</h2>
        <input type="hidden" id="usuarioId">

        <div class="campos">
            <input id="name" placeholder="Nome completo" required>
            <input id="email" type="email" placeholder="E-mail" required>
            <input id="password" type="password" minlength="8"
                   placeholder="Senha (mínimo 8 caracteres)">

            <input id="phone" type="tel" placeholder="Telefone">
            <input id="birth_date" type="date">
            <input id="cep" placeholder="CEP">
            <input id="street" placeholder="Rua / Avenida">
            <input id="number" placeholder="Número">
            <input id="complement" placeholder="Complemento (opcional)">
            <input id="neighborhood" placeholder="Bairro">
            <input id="city" placeholder="Cidade">
            <input id="state" placeholder="UF" maxlength="2">

            <select id="is_admin">
                <option value="0">Usuário comum</option>
                <option value="1">Administrador</option>
            </select>
        </div>

        <p id="dica">Informe uma senha com pelo menos 8 caracteres.</p>
        <button type="submit">Salvar usuário</button>
        <button type="button" class="cancelar" id="cancelar" hidden>
            Cancelar edição
        </button>
        <div id="mensagem" role="status"></div>
    </form>

    <section>
        <h2>Usuários cadastrados</h2>
        <div class="tabela">
            <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Telefone</th>
                            <th>Data de nascimento</th>
                            <th>CEP</th>
                            <th>Perfil</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                <tbody id="lista"></tbody>
            </table>
        </div>
    </section>
</main>

<script>
    const form = document.getElementById('usuarioForm');
    const lista = document.getElementById('lista');
    const mensagem = document.getElementById('mensagem');
    let usuarios = [];

    async function requisicao(url, options = {}) {
        const resposta = await fetch(url, {
            ...options,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const dados = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
            const erro = dados.errors
                ? Object.values(dados.errors).flat().join(' ')
                : dados.message || 'Não foi possível concluir a operação.';
            throw new Error(erro);
        }

        return dados;
    }

    async function carregarUsuarios() {
        try {
            usuarios = await requisicao('/api/users');
            lista.replaceChildren();

            usuarios.forEach(usuario => {
                const linha = document.createElement('tr');

                [
                    usuario.id,
                    usuario.name,
                    usuario.email,
                    usuario.phone || '-',
                    usuario.birth_date
                        ? String(usuario.birth_date).substring(0, 10).split('-').reverse().join('/')
                        : '-',
                    usuario.cep || '-',
                    usuario.is_admin ? 'Administrador' : 'Usuário comum'
                ].forEach(valor => {
                    const td = document.createElement('td');
                    td.textContent = valor;
                    linha.appendChild(td);
                });
                const acoes = document.createElement('td');

                const editar = document.createElement('button');
                editar.textContent = 'Editar';
                editar.onclick = () => editarUsuario(usuario.id);

                const excluir = document.createElement('button');
                excluir.textContent = 'Excluir';
                excluir.className = 'excluir';
                excluir.onclick = () => excluirUsuario(usuario.id);

                acoes.append(editar, excluir);
                linha.appendChild(acoes);
                lista.appendChild(linha);
            });

            if (!usuarios.length) {
                lista.innerHTML =
                    '<tr><td colspan="8">Nenhum usuário cadastrado.</td></tr>';
            }
        } catch (erro) {
            mensagem.textContent = erro.message;
        }
    }

    function limparFormulario() {
        form.reset();

        document.getElementById('usuarioId').value = '';
        document.getElementById('titulo').textContent = 'Cadastrar usuário';
        document.getElementById('password').required = true;
        document.getElementById('dica').textContent =
            'Informe uma senha com pelo menos 8 caracteres.';
        document.getElementById('cancelar').hidden = true;
        document.getElementById('is_admin').value = '0';
    }

    function editarUsuario(id) {
        const usuario = usuarios.find(u => u.id === id);
        if (!usuario) return;

        document.getElementById('usuarioId').value = usuario.id;
        document.getElementById('name').value = usuario.name ?? '';
        document.getElementById('email').value = usuario.email ?? '';
        document.getElementById('password').value = '';

        document.getElementById('phone').value = usuario.phone ?? '';
        document.getElementById('birth_date').value =
            usuario.birth_date ? String(usuario.birth_date).substring(0, 10) : '';
        document.getElementById('cep').value = usuario.cep ?? '';
        document.getElementById('street').value = usuario.street ?? '';
        document.getElementById('number').value = usuario.number ?? '';
        document.getElementById('complement').value = usuario.complement ?? '';
        document.getElementById('neighborhood').value = usuario.neighborhood ?? '';
        document.getElementById('city').value = usuario.city ?? '';
        document.getElementById('state').value = usuario.state ?? '';
        document.getElementById('is_admin').value = usuario.is_admin ? '1' : '0';

        document.getElementById('password').required = false;
        document.getElementById('titulo').textContent = 'Editar usuário';
        document.getElementById('dica').textContent =
            'Deixe a senha em branco para manter a senha atual.';
        document.getElementById('cancelar').hidden = false;

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    form.addEventListener('submit', async event => {
        event.preventDefault();
        mensagem.textContent = 'Salvando...';

        const id = document.getElementById('usuarioId').value;

        const dados = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim() || null,
            birth_date: document.getElementById('birth_date').value || null,
            cep: document.getElementById('cep').value.trim() || null,
            street: document.getElementById('street').value.trim() || null,
            number: document.getElementById('number').value.trim() || null,
            complement: document.getElementById('complement').value.trim() || null,
            neighborhood: document.getElementById('neighborhood').value.trim() || null,
            city: document.getElementById('city').value.trim() || null,
            state: document.getElementById('state').value.trim().toUpperCase() || null
        };

        if (!id) {
            dados.is_admin = false;
        } else {
            dados.is_admin =
                document.getElementById('is_admin').value === '1';
        }

        const senha = document.getElementById('password').value;
        if (senha) dados.password = senha;

        try {
            await requisicao(id ? `/api/users/${id}` : '/api/users', {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(dados)
            });

            mensagem.textContent = id
                ? 'Usuário atualizado com sucesso!'
                : 'Usuário cadastrado com sucesso!';

            limparFormulario();
            await carregarUsuarios();
        } catch (erro) {
            mensagem.textContent = erro.message;
        }
    });

    async function excluirUsuario(id) {
        if (!confirm('Deseja realmente excluir este usuário?')) return;

        try {
            await requisicao(`/api/users/${id}`, { method: 'DELETE' });
            mensagem.textContent = 'Usuário excluído com sucesso!';
            await carregarUsuarios();
        } catch (erro) {
            mensagem.textContent = erro.message;
        }
    }

    document.getElementById('cancelar').addEventListener('click', limparFormulario);
    carregarUsuarios();
</script>
</body>
</html>
