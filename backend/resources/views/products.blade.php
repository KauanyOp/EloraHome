<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elora | Produtos</title>
    
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

    form, .listagem {
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

    input, textarea, select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font: inherit;
    }

    .status {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .status input {
        width: auto;
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
        color: #344E41;
        background: #F4F1ED;
    }

    #mensagem {
        margin-top: 12px;
    }
</style>

</head>
<body>
<main>
    <h1>Elora — Produtos</h1>
    <p>Cadastro e gerenciamento de produtos da loja.</p>

    <form id="produtoForm">
        <h2 id="tituloForm">Cadastrar produto</h2>
        <input type="hidden" id="produtoId">

        <div class="campos">
            <select id="category_id" required>
                <option value="">Selecione uma categoria</option>
            </select>

            <input id="name" placeholder="Nome do produto" required>
            <input id="price" type="number" min="0" step="0.01"
                   placeholder="Preço (R$)" required>
            <input id="stock" type="number" min="0" step="1"
                   placeholder="Estoque" value="0" required>

            <input id="color" placeholder="Cor (opcional)">
            <input id="size" placeholder="Tamanho (opcional)">
            <input id="material" placeholder="Material (opcional)">
            <input id="image" placeholder="Nome ou caminho da imagem (opcional)">

            <textarea id="description" placeholder="Descrição do produto"
                      required></textarea>

            <label class="status">
                <input id="status" type="checkbox" checked>
                Produto ativo
            </label>
        </div>

        <button type="submit">Salvar produto</button>
        <button type="button" class="cancelar" id="cancelar"
                hidden>Cancelar edição</button>
        <div id="mensagem" role="status"></div>
    </form>

    <section class="listagem">
        <h2>Produtos cadastrados</h2>
        <div class="tabela">
            <table>
                <thead>
                <tr>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody id="listaProdutos"></tbody>
            </table>
        </div>
    </section>
</main>

<script>
    const form = document.getElementById('produtoForm');
    const lista = document.getElementById('listaProdutos');
    const categoriaSelect = document.getElementById('category_id');
    const mensagem = document.getElementById('mensagem');
    let produtos = [];

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
            const erros = dados.errors
                ? Object.values(dados.errors).flat().join(' ')
                : dados.message || 'Não foi possível concluir a operação.';
            throw new Error(erros);
        }

        return dados;
    }

    async function carregarCategorias() {
        const categorias = await requisicao('/api/categories');
        categoriaSelect.innerHTML =
            '<option value="">Selecione uma categoria</option>';

        categorias.filter(c => c.status).forEach(categoria => {
            const opcao = document.createElement('option');
            opcao.value = categoria.id;
            opcao.textContent = categoria.name;
            categoriaSelect.appendChild(opcao);
        });
    }

    async function carregarProdutos() {
        try {
            produtos = await requisicao('/api/products');
            lista.innerHTML = '';

            produtos.forEach(produto => {
                const linha = document.createElement('tr');
                const celulas = [
                    produto.name,
                    produto.category?.name || 'Sem categoria',
                    'R$ ' + Number(produto.price).toFixed(2).replace('.', ','),
                    produto.stock,
                    produto.status ? 'Ativo' : 'Inativo'
                ];

                celulas.forEach(texto => {
                    const td = document.createElement('td');
                    td.textContent = texto;
                    linha.appendChild(td);
                });

                const acoes = document.createElement('td');

                const editar = document.createElement('button');
                editar.textContent = 'Editar';
                editar.onclick = () => editarProduto(produto.id);

                const excluir = document.createElement('button');
                excluir.textContent = 'Excluir';
                excluir.className = 'excluir';
                excluir.onclick = () => excluirProduto(produto.id);

                acoes.append(editar, excluir);
                linha.appendChild(acoes);
                lista.appendChild(linha);
            });

            if (produtos.length === 0) {
                lista.innerHTML =
                    '<tr><td colspan="6">Nenhum produto cadastrado.</td></tr>';
            }
        } catch (erro) {
            mensagem.textContent = erro.message;
        }
    }

    function limparFormulario() {
        form.reset();
        document.getElementById('produtoId').value = '';
        document.getElementById('stock').value = 0;
        document.getElementById('status').checked = true;
        document.getElementById('tituloForm').textContent = 'Cadastrar produto';
        document.getElementById('cancelar').hidden = true;
    }

    function editarProduto(id) {
        const produto = produtos.find(p => p.id === id);
        if (!produto) return;

        document.getElementById('produtoId').value = produto.id;
        document.getElementById('category_id').value = produto.category_id;
        document.getElementById('name').value = produto.name;
        document.getElementById('description').value = produto.description;
        document.getElementById('price').value = produto.price;
        document.getElementById('stock').value = produto.stock;
        document.getElementById('color').value = produto.color || '';
        document.getElementById('size').value = produto.size || '';
        document.getElementById('material').value = produto.material || '';
        document.getElementById('image').value = produto.image || '';
        document.getElementById('status').checked = Boolean(produto.status);

        document.getElementById('tituloForm').textContent = 'Editar produto';
        document.getElementById('cancelar').hidden = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    form.addEventListener('submit', async event => {
        event.preventDefault();
        mensagem.textContent = 'Salvando...';

        const id = document.getElementById('produtoId').value;
        const dados = {
            category_id: Number(categoriaSelect.value),
            name: document.getElementById('name').value.trim(),
            description: document.getElementById('description').value.trim(),
            price: Number(document.getElementById('price').value),
            stock: Number(document.getElementById('stock').value),
            color: document.getElementById('color').value || null,
            size: document.getElementById('size').value || null,
            material: document.getElementById('material').value || null,
            image: document.getElementById('image').value || null,
            status: document.getElementById('status').checked
        };

        try {
            await requisicao(id ? `/api/products/${id}` : '/api/products', {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(dados)
            });

            mensagem.textContent = id
                ? 'Produto atualizado com sucesso!'
                : 'Produto cadastrado com sucesso!';

            limparFormulario();
            await carregarProdutos();
        } catch (erro) {
            mensagem.textContent = erro.message;
        }
    });

    async function excluirProduto(id) {
        if (!confirm('Deseja realmente excluir este produto?')) return;

        try {
            await requisicao(`/api/products/${id}`, { method: 'DELETE' });
            mensagem.textContent = 'Produto excluído com sucesso!';
            await carregarProdutos();
        } catch (erro) {
            mensagem.textContent = erro.message;
        }
    }

    document.getElementById('cancelar').addEventListener('click', limparFormulario);

    async function iniciar() {
        try {
            await carregarCategorias();
            await carregarProdutos();
        } catch (erro) {
            mensagem.textContent =
                'Erro ao carregar dados. Verifique se existem categorias ativas. ' +
                erro.message;
        }
    }

    iniciar();
</script>
</body>
</html>
