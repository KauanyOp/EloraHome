<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('shipping_name')->nullable();
            $table->string('shipping_email')->nullable();
            $table->string('shipping_phone', 20)->nullable();
            $table->string('shipping_cep', 9)->nullable();
            $table->string('shipping_street')->nullable();
            $table->string('shipping_number', 20)->nullable();
            $table->string('shipping_complement')->nullable();
            $table->string('shipping_neighborhood')->nullable();
            $table->string('shipping_city')->nullable();
            $table->string('shipping_state', 2)->nullable();
            $table->string('payment_method', 20)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'shipping_name', 'shipping_email', 'shipping_phone', 'shipping_cep',
                'shipping_street', 'shipping_number', 'shipping_complement',
                'shipping_neighborhood', 'shipping_city', 'shipping_state', 'payment_method',
            ]);
        });
    }
};
