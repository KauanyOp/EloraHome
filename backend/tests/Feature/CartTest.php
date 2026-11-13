<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_manage_a_persistent_cart(): void
    {
        $user = User::factory()->create();
        $product = $this->createProduct(price: '19.90', stock: 5);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/cart')
            ->assertOk()
            ->assertJsonPath('items', [])
            ->assertJsonPath('total', '0.00');

        $this->postJson('/api/cart/items', [
            'product_id' => $product->id,
            'quantity' => 2,
        ])->assertOk()
            ->assertJsonPath('quantity', 2)
            ->assertJsonPath('items.0.unit_price', '19.90')
            ->assertJsonPath('items.0.subtotal', '39.80')
            ->assertJsonPath('total', '39.80');

        $this->postJson('/api/cart/items', [
            'product_id' => $product->id,
            'quantity' => 1,
        ])->assertOk()
            ->assertJsonPath('items.0.quantity', 3)
            ->assertJsonPath('total', '59.70');

        $this->patchJson("/api/cart/items/{$product->id}", [
            'quantity' => 4,
        ])->assertOk()
            ->assertJsonPath('items.0.quantity', 4)
            ->assertJsonPath('total', '79.60');

        $this->deleteJson("/api/cart/items/{$product->id}")
            ->assertOk()
            ->assertJsonPath('items', [])
            ->assertJsonPath('total', '0.00');
    }

    public function test_cart_rejects_inactive_products_and_quantities_above_stock(): void
    {
        $user = User::factory()->create();
        $activeProduct = $this->createProduct(stock: 2);
        $inactiveProduct = $this->createProduct(status: false);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/cart/items', [
                'product_id' => $activeProduct->id,
                'quantity' => 3,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('quantity');

        $this->postJson('/api/cart/items', [
            'product_id' => $inactiveProduct->id,
            'quantity' => 1,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('product_id');

        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_cart_endpoints_require_an_authenticated_user(): void
    {
        $this->getJson('/api/cart')->assertUnauthorized();
        $this->postJson('/api/cart/items', [
            'product_id' => 1,
            'quantity' => 1,
        ])->assertUnauthorized();
    }

    public function test_each_user_has_an_independent_cart(): void
    {
        $firstUser = User::factory()->create();
        $secondUser = User::factory()->create();
        $product = $this->createProduct();

        $this->actingAs($firstUser, 'sanctum')
            ->postJson('/api/cart/items', [
                'product_id' => $product->id,
                'quantity' => 2,
            ])->assertOk()
            ->assertJsonPath('quantity', 2);

        $this->actingAs($secondUser, 'sanctum')
            ->getJson('/api/cart')
            ->assertOk()
            ->assertJsonPath('items', [])
            ->assertJsonPath('total', '0.00');
    }

    public function test_clearing_a_cart_keeps_the_cart_but_removes_its_items(): void
    {
        $user = User::factory()->create();
        $product = $this->createProduct();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/cart/items', [
                'product_id' => $product->id,
                'quantity' => 1,
            ])->assertOk();

        $cartId = Cart::query()->where('user_id', $user->id)->value('id');

        $this->deleteJson('/api/cart')
            ->assertOk()
            ->assertJsonPath('id', $cartId)
            ->assertJsonPath('items', []);

        $this->assertDatabaseHas('carts', ['id' => $cartId, 'user_id' => $user->id]);
        $this->assertDatabaseCount('cart_items', 0);
    }

    private function createProduct(
        string $price = '10.00',
        int $stock = 10,
        bool $status = true
    ): Product {
        $category = Category::create([
            'name' => fake()->unique()->word(),
            'description' => 'Categoria de teste',
            'status' => true,
        ]);

        return Product::create([
            'category_id' => $category->id,
            'name' => fake()->unique()->words(2, true),
            'description' => 'Produto de teste',
            'price' => $price,
            'stock' => $stock,
            'status' => $status,
        ]);
    }
}
