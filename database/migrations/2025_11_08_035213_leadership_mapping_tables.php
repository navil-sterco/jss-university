<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leaderships_school', function (Blueprint $table) {
            $table->id();
            $table->foreignId('leadership_id')->constrained('leaderships')->onDelete('cascade');
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['leadership_id', 'school_id']);
        });

        Schema::create('leaderships_page', function (Blueprint $table) {
            $table->id();
            $table->foreignId('leadership_id')->constrained('leaderships')->onDelete('cascade');
            $table->foreignId('page_id')->constrained('pages')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['leadership_id', 'page_id']);
        });

        Schema::create('leaderships_department', function (Blueprint $table) {
            $table->id();
            $table->foreignId('leadership_id')->constrained('leaderships')->onDelete('cascade');
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['leadership_id', 'department_id']);
        });

        Schema::create('leaderships_courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('leadership_id')->constrained('leaderships')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['leadership_id', 'course_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leaderships_school');
        Schema::dropIfExists('leaderships_page');
        Schema::dropIfExists('leaderships_department');
        Schema::dropIfExists('leaderships_courses');
    }
};
