<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $catalog = [
            ['Jogo de cama em algodão', 'Quarto', 279, 'jogo-de-cama.png', 'Cama arrumada com roupa clara'],
            ['Kit de talheres em aço', 'Cozinha', 89, 'Kit-talheres.jpg', 'Mesa posta com talheres'],
            ['Conjunto de Almofadas', 'Decoração', 179, 'Almofadas.jpg', '3 almofadas decorativas'],
            ['Jogo de cama Verde-Sálvia', 'Quarto', 49, 'Jogo-de-cama-verde.jpg', 'Jogo de cama verde sobre a cama'],
            ['Toalhas macias de banho', 'Banheiro', 119, 'Toalhas-banho.jpg', 'Toalhas de banho dobradas'],
            ['Cesto organizador', 'Organização', 99, 'Cesta-organizadora.jpg', 'Cesto organizador'],
            ['Jogo de xícaras', 'Cozinha', 79, 'Jogo-de-xicaras.jpg', 'Jogo de xícaras de porcelana'],
            ['Espelho redondo para banheiro', 'Banheiro', 189, 'Espelho-banheiro.jpg', 'Espelho redondo decorativo sobre bancada'],
            ['Cobertor azul', 'Quarto', 219, 'Coberta-azul.jpg', 'Cobertor azul sobre a cama'],
            ['Vasos decorativos', 'Decoração', 119, 'Vasos-decorativos.jpg', 'Vasos decorativos de cerâmica'],
            ['Quadros decorativos', 'Decoração', 149, 'Quadro-decorativos.jpg', 'Conjunto de quadros em molduras de madeira'],
            ['Tapetes para banho', 'Banheiro', 95, 'Tapetes-banheiro.jpg', 'Tapetes macios para banheiro'],
        ];

        $categoryIds = [];
        foreach (array_unique(array_column($catalog, 1)) as $name) {
            $categoryIds[$name] = Category::firstOrCreate(
                ['name' => $name],
                ['description' => "Produtos de {$name}", 'status' => true]
            )->id;
        }

        foreach ($catalog as [$name, $category, $price, $image, $description]) {
            Product::firstOrCreate(
                ['name' => $name],
                [
                    'category_id' => $categoryIds[$category],
                    'description' => $description,
                    'price' => $price,
                    'stock' => 10,
                    'image' => "/img/produtos/{$image}",
                    'status' => true,
                ]
            );
        }
    }
}
