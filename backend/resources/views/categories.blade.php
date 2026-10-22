
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elora | Categorias</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Poppins, sans-serif;
            background-color: #E6DFD6;
            color: #292323;
        }

        header {
            background-color: #344E41;
            color: white;
            padding: 20px 40px;
        }

        header h1 {
            margin: 0;
            font-size: 26px;
        }

        header p {
            margin-bottom: 0;
        }

        main {
            max-width: 1000px;
            margin: 35px auto;
            padding: 0 20px;
        }

        section {
            background-color: white;
            padding: 25px;
            margin-bottom: 25px;
            border-radius: 8px;
        }

        h2 {
            margin-top: 0;
            color: #344E41;
        }

        label {
            display: block;
            margin: 15px 0 6px;
        }

        input, textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #d5cccc;
            border-radius: 5px;
            font: inherit;
        }

        button {
            margin: 5px 4px 5px 0;
            padding: 10px 18px;
            border: none;
            border-radius: 5px;
            background-color: #344E41;
            color: white;
            cursor: pointer;
        }

        button:hover {
            opacity: 0.85;
        }

        .btn-cancelar {
            background-color: #777;
        }

        .btn-excluir {
            background-color: #963D3D;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 12px;
            border-bottom: 1px solid #eee5e5;
            text-align: left;
        }

        th {
            background-color: #f4eeee;
        }

        #mensagem {
            margin-bottom: 15px;
        }

        .sucesso {
            color: #267044;
        }

        .erro {
            color: #b42318;
        }

        .status {
            font-weight: bold;
        }

        .tabela-container {
            overflow-x: auto;
        }
    </style>
</head>

<body>
    <header>
        <h1>Elora</h1>
        <p>Painel administrativo</p>
    </header>

    <main>
        <section>
            <h2 id="titulo-formulario">Cadastrar categoria</h2>

            <div id="mensagem" role="status" aria-live="polite"></div>

            <form id="form-categoria">
                <label for="name">Nome da categoria</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Ex.: Sala de estar"
                    maxlength="255"
                    required
                >

                <label for="description">Descrição</label>
                <textarea
                    id="description"
                    name="description"
                    rows="3"
                    placeholder="Descreva a categoria"
                ></textarea>

                <label>
                    <input
                        type="checkbox"
                        id="status"
                        checked
                        style="width: auto;"
                    >
                    Categoria ativa
                </label>

                <button type="submit" id="btn-salvar">
                    Cadastrar categoria
                </button>

                <button
                    type="button"
                    id="btn-cancelar"
                    class="btn-cancelar"
                    hidden
                >
                    Cancelar edição
                </button>
            </form>
        </section>

        <section>
            <h2>Categorias cadastradas</h2>

            <div class="tabela-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody id="lista-categorias">
                        <tr>
                            <td colspan="5">Carregando categorias...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </main>

    <script>
        const API_URL = '/api/categories';

        const formulario = document.getElementById('form-categoria');
        const campoNome = document.getElementById('name');
        const campoDescricao = document.getElementById('description');
        const campoStatus = document.getElementById('status');
        const listaCategorias = document.getElementById('lista-categorias');
        const mensagem = document.getElementById('mensagem');
        const tituloFormulario = document.getElementById('titulo-formulario');
        const btnSalvar = document.getElementById('btn-salvar');
        const btnCancelar = document.getElementById('btn-cancelar');

        let categoriaEditando = null;

        function mostrarMensagem(texto, tipo) {
            mensagem.textContent = texto;
            mensagem.className = tipo;
        }

        async function requisicao(url, metodo = 'GET', dados = null) {
            const opcoes = {
                method: metodo,
                headers: {
                    'Accept': 'application/json'
                }
            };

            if (dados !== null) {
                opcoes.headers['Content-Type'] = 'application/json';
                opcoes.body = JSON.stringify(dados);
            }

            const resposta = await fetch(url, opcoes);

            const resultado = await resposta.json();

            if (!resposta.ok) {
                const erros = resultado.errors
                    ? Object.values(resultado.errors).flat().join(' ')
                    : resultado.message;

                throw new Error(erros || 'Não foi possível concluir a operação.');
            }

            return resultado;
        }

        async function carregarCategorias() {
            try {
                const categorias = await requisicao(API_URL);

                listaCategorias.replaceChildren();

                if (categorias.length === 0) {
                    const linha = document.createElement('tr');
                    const celula = document.createElement('td');

                    celula.colSpan = 5;
                    celula.textContent = 'Nenhuma categoria cadastrada.';

                    linha.appendChild(celula);
                    listaCategorias.appendChild(linha);
                    return;
                }

                categorias.forEach(categoria => {
                    const linha = document.createElement('tr');

                    const valores = [
                        categoria.id,
                        categoria.name,
                        categoria.description || '-',
                        categoria.status ? 'Ativa' : 'Inativa'
                    ];

                    valores.forEach((valor, indice) => {
                        const celula = document.createElement('td');
                        celula.textContent = valor;

                        if (indice === 3) {
                            celula.className = 'status';
                        }

                        linha.appendChild(celula);
                    });

                    const celulaAcoes = document.createElement('td');

                    const btnEditar = document.createElement('button');
                    btnEditar.textContent = 'Editar';
                    btnEditar.type = 'button';
                    btnEditar.addEventListener('click', () => editarCategoria(categoria));

                    const btnExcluir = document.createElement('button');
                    btnExcluir.textContent = 'Excluir';
                    btnExcluir.type = 'button';
                    btnExcluir.className = 'btn-excluir';
                    btnExcluir.addEventListener('click', () => excluirCategoria(categoria));

                    celulaAcoes.append(btnEditar, btnExcluir);
                    linha.appendChild(celulaAcoes);

                    listaCategorias.appendChild(linha);
                });
            } catch (erro) {
                mostrarMensagem(erro.message, 'erro');

                listaCategorias.replaceChildren();

                const linha = document.createElement('tr');
                const celula = document.createElement('td');

                celula.colSpan = 5;
                celula.textContent = 'Não foi possível carregar as categorias.';

                linha.appendChild(celula);
                listaCategorias.appendChild(linha);
            }
        }

        formulario.addEventListener('submit', async function(evento) {
            evento.preventDefault();

            const dados = {
                name: campoNome.value.trim(),
                description: campoDescricao.value.trim() || null,
                status: campoStatus.checked
            };

            try {
                if (categoriaEditando !== null) {
                    await requisicao(
                        `${API_URL}/${categoriaEditando}`,
                        'PUT',
                        dados
                    );

                    mostrarMensagem('Categoria atualizada com sucesso!', 'sucesso');
                } else {
                    await requisicao(API_URL, 'POST', dados);

                    mostrarMensagem('Categoria cadastrada com sucesso!', 'sucesso');
                }

                limparFormulario();
                await carregarCategorias();
            } catch (erro) {
                mostrarMensagem(erro.message, 'erro');
            }
        });

        function editarCategoria(categoria) {
            categoriaEditando = categoria.id;

            campoNome.value = categoria.name;
            campoDescricao.value = categoria.description || '';
            campoStatus.checked = Boolean(categoria.status);

            tituloFormulario.textContent = 'Editar categoria';
            btnSalvar.textContent = 'Salvar alterações';
            btnCancelar.hidden = false;

            mostrarMensagem('Editando a categoria #' + categoria.id, 'sucesso');

            formulario.scrollIntoView({ behavior: 'smooth' });
            campoNome.focus();
        }

        async function excluirCategoria(categoria) {
            const confirmar = confirm(
                `Deseja excluir a categoria "${categoria.name}"?`
            );

            if (!confirmar) {
                return;
            }

            try {
                await requisicao(`${API_URL}/${categoria.id}`, 'DELETE');

                if (categoriaEditando === categoria.id) {
                    limparFormulario();
                }

                mostrarMensagem('Categoria excluída com sucesso!', 'sucesso');

                await carregarCategorias();
            } catch (erro) {
                mostrarMensagem(erro.message, 'erro');
            }
        }

        function limparFormulario() {
            formulario.reset();
            categoriaEditando = null;

            tituloFormulario.textContent = 'Cadastrar categoria';
            btnSalvar.textContent = 'Cadastrar categoria';
            btnCancelar.hidden = true;
        }

        btnCancelar.addEventListener('click', limparFormulario);

        carregarCategorias();
    </script>
</body>
</html>
