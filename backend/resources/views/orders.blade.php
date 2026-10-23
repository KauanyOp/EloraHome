
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedidos - EloraHome</title>

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

    h1 {
        color: #344E41;
    }

    p {
        color: #555;
    }

    table {
        width: 100%;
        margin-top: 20px;
        border-collapse: collapse;
        background: white;
        border-radius: 8px;
        overflow: hidden;
    }

    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background: #344E41;
        color: white;
    }

    .status {
        color: #8a6d3b;
        font-weight: bold;
    }
</style>
</head>
<body>

    <h1>Pedidos</h1>
    <p>Área administrativa do EloraHome</p>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Quantidade de itens</th>
                <th>Total</th>
                <th>Status</th>
                <th>Data do pedido</th>
            </tr>
        </thead>

        <tbody>
            {{-- Exibe uma mensagem caso ainda não existam pedidos. --}}
            <tr>
                <td colspan="6">Nenhum pedido cadastrado.</td>
            </tr>
        </tbody>
    </table>

</body>
</html>
