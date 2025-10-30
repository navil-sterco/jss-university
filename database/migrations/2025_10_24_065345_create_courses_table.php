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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained('departments')->cascadeOnDelete();
            $table->foreignId('program_id')->constrained('programs')->cascadeOnDelete();
            $table->string('name');
            $table->string('menu_name')->nullable();
            $table->string('name_short')->nullable();
            $table->string('slug')->unique();
            $table->integer('display_order')->default(100);
            $table->boolean('status')->default(1);

            // Basic Info
            $table->string('course_duration')->nullable();
            $table->string('annual_fees')->nullable();
            $table->string('academic_year')->nullable();

            // Eligibility
            $table->string('eligibility_criteria')->nullable();
            $table->string('eligibility_criteria_desc')->nullable();
            $table->json('eligibility_criteria_notices')->nullable();

            // Application
            $table->string('apply_now_link')->nullable();

            // Program Info
            $table->string('program_structure')->nullable();
            $table->string('scholarship')->nullable();

            // Program Outcomes
            $table->json('peos')->nullable();
            $table->json('pos')->nullable();
            $table->json('pso')->nullable();

            // Curriculum
            $table->string('curriculum_title')->nullable();
            $table->json('curriculum_desc')->nullable();
            $table->string('curriculum_image')->nullable();
            $table->string('curriculum_pdf')->nullable();

            // Fee Structure
            $table->string('fee_structure_title')->nullable();
            $table->string('fee_structure_short_description')->nullable();
            $table->string('course_total_fees')->nullable();
            $table->string('fee_structure_pdf')->nullable();
            $table->string('fee_structure_image')->nullable();

            // Career
            $table->json('career_opportunities')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
