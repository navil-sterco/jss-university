<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facts_and_figures_school', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facts_and_figures_id')->constrained('facts_and_figures')->onDelete('cascade');
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['facts_and_figures_id', 'school_id']);
        });

        Schema::create('facts_and_figures_page', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facts_and_figures_id')->constrained('facts_and_figures')->onDelete('cascade');
            $table->foreignId('page_id')->constrained('pages')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['facts_and_figures_id', 'page_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facts_and_figures_page');
        Schema::dropIfExists('facts_and_figures_school');
    }
};
