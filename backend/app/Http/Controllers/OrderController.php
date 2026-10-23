<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    // Lista os pedidos com os dados do cliente e a quantidade de itens.
    public function index()
    {
        $orders = Order::with('user')
            ->withCount('items')
            ->orderByDesc('id')
            ->get();

        return response()->json($orders);
    }

    // Cadastra um pedido com seus produtos.
    public function store(Request $request)
    {
        // Valida os dados recebidos.
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'distinct', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        // Garante que as operações do pedido sejam realizadas em conjunto.
        $order = DB::transaction(function () use ($validated) {
            $order = Order::create([
                'user_id' => $validated['user_id'],
                'status' => 'pendente',
                'total' => 0,
            ]);

            $total = 0;

            // Percorre os produtos adicionados ao pedido.
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $quantity = $item['quantity'];

                // Verifica se o produto está ativo e possui estoque suficiente.
                if (!$product->status) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'items' => "O produto {$product->name} está inativo."
                    ]);
                }

                if ($product->stock < $quantity) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'items' => "Estoque insuficiente para {$product->name}."
                    ]);
                }

                // Calcula o subtotal do produto.
                $unitPrice = (float) $product->price;
                $subtotal = round($unitPrice * $quantity, 2);

                // Registra o produto no pedido.
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                ]);

                // Atualiza o estoque e soma o valor ao total do pedido.
                $product->decrement('stock', $quantity);
                $total += $subtotal;
            }

            // Atualiza o valor total do pedido.
            $order->update(['total' => $total]);

            return $order;
        });

        // Retorna o pedido criado com os dados relacionados.
        return response()->json($order->load(['user', 'items.product']), 201);
    }

    // Exibe os detalhes de um pedido específico.
    public function show(Order $order)
    {
        return response()->json($order->load(['user', 'items.product']));
    }

    // Atualiza o status do pedido.
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                Rule::in(['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado']),
            ],
        ]);

        $order->update($validated);

        return response()->json($order->load(['user', 'items.product']));
    }

    // Impede a exclusão para preservar o histórico de pedidos.
    public function destroy(Order $order)
    {
        return response()->json([
            'message' => 'Para preservar o histórico, pedidos não podem ser excluídos.'
        ], 405);
    }
}
