<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('happening_school', function (Blueprint $table) {
            $table->id();
            $table->foreignId('happening_id')->constrained('happenings')->onDelete('cascade');
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['happening_id', 'school_id']);
        });

        Schema::create('happening_page', function (Blueprint $table) {
            $table->id();
            $table->foreignId('happening_id')->constrained('happenings')->onDelete('cascade');
            $table->foreignId('page_id')->constrained('pages')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['happening_id', 'page_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('happening_page');
        Schema::dropIfExists('happening_school');
    }
};

