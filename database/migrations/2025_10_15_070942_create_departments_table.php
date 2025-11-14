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
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            // Basic Info
            $table->string('name');
            $table->string('menu_name')->nullable();
            $table->string('name_short')->nullable();
            $table->string('academic_year')->nullable();
            $table->string('apply_now_link')->nullable();
            $table->string('brochure')->nullable();
            $table->json('useful_links')->nullable();
            $table->string('slug')->nullable()->unique();
            $table->integer('display_order')->default(100);
            $table->boolean('status')->default(1);

            // Tab 1: About Department
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->string('vision_title')->nullable();
            $table->text('vision_description')->nullable();
            $table->string('mission_title')->nullable();
            $table->json('mission_points')->nullable();
            $table->string('image')->nullable();
            $table->integer('tab_display_order')->default(100);

            // Tab 2: Dean/HOD Message
            $table->string('hod_title')->nullable();
            $table->string('hod_name')->nullable();
            $table->string('hod_designation')->nullable();
            $table->json('hod_messages')->nullable(); // Array stored as JSON
            $table->string('hod_image')->nullable();

            // Tab 3: Courses
            $table->string('courses_title')->nullable();
            $table->string('courses_subtitle')->nullable();
            $table->string('courses_image')->nullable();

            // Tab 4: Faculty
            $table->string('faculty_title')->nullable();
            $table->string('faculty_subtitle')->nullable();

            // Tab 5: Laboratories
            $table->string('lab_title')->nullable();
            $table->string('lab_subtitle')->nullable();
            $table->string('lab_description')->nullable();
            $table->string('lab_url')->nullable();

            // Tab 6: Happening
            $table->string('happening_title')->nullable();
            $table->string('happening_subtitle')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
