<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add indexes to posts table for better search and filter performance
        Schema::table('posts', function (Blueprint $table) {
            $table->index('status', 'posts_status_index');
            $table->index('created_at', 'posts_created_at_index');
            $table->index(['status', 'created_at'], 'posts_status_created_at_index');
            $table->fullText(['title', 'content'], 'posts_title_content_fulltext');
        });

        // Add indexes to products table for better search and filter performance
        Schema::table('products', function (Blueprint $table) {
            $table->index('category', 'products_category_index');
            $table->index('price', 'products_price_index');
            $table->index('stock', 'products_stock_index');
            $table->index('created_at', 'products_created_at_index');
            $table->index(['category', 'price'], 'products_category_price_index');
            $table->index(['stock', 'price'], 'products_stock_price_index');
            $table->fullText(['name', 'description'], 'products_name_description_fulltext');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove indexes from posts table
        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex('posts_status_index');
            $table->dropIndex('posts_created_at_index');
            $table->dropIndex('posts_status_created_at_index');
            $table->dropFullText('posts_title_content_fulltext');
        });

        // Remove indexes from products table
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_category_index');
            $table->dropIndex('products_price_index');
            $table->dropIndex('products_stock_index');
            $table->dropIndex('products_created_at_index');
            $table->dropIndex('products_category_price_index');
            $table->dropIndex('products_stock_price_index');
            $table->dropFullText('products_name_description_fulltext');
        });
    }
};
