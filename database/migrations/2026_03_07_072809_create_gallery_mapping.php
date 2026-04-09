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
        Schema::create('gallery_school', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gallery_id')->constrained('galleries')->onDelete('cascade');
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['gallery_id', 'school_id']);
        });

        Schema::create('gallery_page', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gallery_id')->constrained('galleries')->onDelete('cascade');
            $table->foreignId('page_id')->constrained('pages')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['gallery_id', 'page_id']);
        });

        Schema::create('gallery_department', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gallery_id')->constrained('galleries')->onDelete('cascade');
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['gallery_id', 'department_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery_school');
        Schema::dropIfExists('gallery_page');
        Schema::dropIfExists('gallery_department');
    }
};
