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
        Schema::create('programs_school', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained('programs')->onDelete('cascade');
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['program_id', 'school_id']);
        });

        Schema::create('programs_page', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained('programs')->onDelete('cascade');
            $table->foreignId('page_id')->constrained('pages')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['program_id', 'page_id']);
        });

        Schema::create('programs_department', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained('programs')->onDelete('cascade');
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['program_id', 'department_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programs_school');
        Schema::dropIfExists('programs_page');
        Schema::dropIfExists('programs_department');
    }
};
