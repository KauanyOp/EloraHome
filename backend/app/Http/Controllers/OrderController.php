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

    public function mine(Request $request)
    {
        return response()->json(
            Order::with(['user', 'items.product'])
                ->where('user_id', $request->user()->id)
                ->orderByDesc('id')
                ->get()
        );
    }

    // Cadastra um pedido com seus produtos.
    public function store(Request $request)
    {
        // Valida os dados recebidos.
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'distinct', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'shipping_name' => ['required', 'string', 'max:255'],
            'shipping_email' => ['required', 'email', 'max:255'],
            'shipping_phone' => ['required', 'string', 'max:20'],
            'shipping_cep' => ['required', 'string', 'max:9'],
            'shipping_street' => ['required', 'string', 'max:255'],
            'shipping_number' => ['nullable', 'string', 'max:20'],
            'shipping_complement' => ['nullable', 'string', 'max:255'],
            'shipping_neighborhood' => ['nullable', 'string', 'max:255'],
            'shipping_city' => ['required', 'string', 'max:255'],
            'shipping_state' => ['required', 'string', 'size:2'],
            'payment_method' => ['required', 'string', Rule::in(['cartao', 'pix'])],
        ]);

        // Garante que as operações do pedido sejam realizadas em conjunto.
        $order = DB::transaction(function () use ($validated, $request) {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => 'pendente',
                'total' => 0,
                ...collect($validated)->except('items')->all(),
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
        abort_unless(
            $order->user_id === request()->user()->id || request()->user()->is_admin,
            403
        );

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

        return response()->json($order->load(['user', 'items.product'])->loadCount('items'));
    }

    // Impede a exclusão para preservar o histórico de pedidos.
    public function destroy(Order $order)
    {
        return response()->json([
            'message' => 'Para preservar o histórico, pedidos não podem ser excluídos.'
        ], 405);
    }
}
