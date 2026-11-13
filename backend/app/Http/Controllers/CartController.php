<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CartController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($this->cartResponse($this->getCart($request->user())));
    }

    public function addItem(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cart = DB::transaction(function () use ($request, $validated) {
            $cart = $this->getCart($request->user(), lock: true);
            $product = Product::query()->findOrFail($validated['product_id']);
            $item = $cart->items()->where('product_id', $product->id)->first();
            $quantity = ($item?->quantity ?? 0) + $validated['quantity'];

            $this->validateProductAndStock($product, $quantity);

            $cart->items()->updateOrCreate(
                ['product_id' => $product->id],
                ['quantity' => $quantity]
            );

            return $cart;
        });

        return response()->json($this->cartResponse($cart));
    }

    public function updateItem(Request $request, Product $product)
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cart = DB::transaction(function () use ($request, $product, $validated) {
            $cart = $this->getCart($request->user(), lock: true);
            $item = $cart->items()->where('product_id', $product->id)->firstOrFail();

            $this->validateProductAndStock($product, $validated['quantity']);

            $item->update(['quantity' => $validated['quantity']]);

            return $cart;
        });

        return response()->json($this->cartResponse($cart));
    }

    public function removeItem(Request $request, Product $product)
    {
        $cart = $this->getCart($request->user());
        $cart->items()->where('product_id', $product->id)->firstOrFail()->delete();

        return response()->json($this->cartResponse($cart));
    }

    public function clear(Request $request)
    {
        $cart = $this->getCart($request->user());
        $cart->items()->delete();

        return response()->json($this->cartResponse($cart));
    }

    private function getCart(User $user, bool $lock = false): Cart
    {
        $query = $user->cart();

        if ($lock) {
            $query->lockForUpdate();
        }

        return $query->firstOrCreate([]);
    }

    private function validateProductAndStock(Product $product, int $quantity): void
    {
        if (!$product->status) {
            throw ValidationException::withMessages([
                'product_id' => ["O produto {$product->name} está inativo."],
            ]);
        }

        if ($product->stock < $quantity) {
            throw ValidationException::withMessages([
                'quantity' => ["Estoque insuficiente para {$product->name}."],
            ]);
        }
    }

    private function cartResponse(Cart $cart): array
    {
        $cart->load('items.product');
        $totalCents = 0;
        $quantity = 0;

        $items = $cart->items->map(function (CartItem $item) use (&$totalCents, &$quantity) {
            $unitPriceCents = (int) round((float) $item->product->price * 100);
            $subtotalCents = $unitPriceCents * $item->quantity;
            $totalCents += $subtotalCents;
            $quantity += $item->quantity;

            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'unit_price' => number_format($unitPriceCents / 100, 2, '.', ''),
                'subtotal' => number_format($subtotalCents / 100, 2, '.', ''),
                'product' => $item->product,
            ];
        });

        return [
            'id' => $cart->id,
            'user_id' => $cart->user_id,
            'items' => $items,
            'quantity' => $quantity,
            'total' => number_format($totalCents / 100, 2, '.', ''),
        ];
    }
}
