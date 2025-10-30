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
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['placement', 'alumuni', 'student'])->default('student');
            $table->string('slug');
            $table->string('alt_text')->nullable();
            $table->string('image')->nullable();
            $table->string('video_url')->nullable();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->string('designation')->nullable();
            $table->string('location')->nullable();
            $table->string('company')->nullable();
            $table->integer('status')->default(true);
            $table->integer('show_on_home')->default(false);
            $table->integer('display_order')->default(100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
