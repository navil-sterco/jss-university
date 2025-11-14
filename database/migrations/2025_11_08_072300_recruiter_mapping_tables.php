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
        Schema::create('recruiters_department', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recruiter_id')->constrained('recruiters')->onDelete('cascade');
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['recruiter_id', 'department_id']);
        });

        Schema::create('recruiters_courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recruiter_id')->constrained('recruiters')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['recruiter_id', 'course_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recruiters_department');
        Schema::dropIfExists('recruiters_courses');
    }
};
