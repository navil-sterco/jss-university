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
        Schema::create('leaderships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('type_id')->constrained('types')->onDelete('cascade');
            $table->string('name');
            $table->string('slug');
            $table->text('short_description');
            $table->json('description')->nullable();
            $table->text('biography')->nullable();
            $table->string('banner_image')->nullable();
            $table->string('image')->nullable();
            $table->string('video')->nullable();
            $table->json('message')->nullable();
            $table->boolean('status')->default(1);
            $table->integer("display_order")->default(100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leaderships');
    }
};
