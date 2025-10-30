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
        Schema::create('schools', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('menu_name')->nullable();
            $table->string('name_short')->nullable();
            $table->string('short_description')->nullable();
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->string('program_image')->nullable();
            $table->string('course_image')->nullable();
            $table->string('prospectus')->nullable();
            $table->string('alt_prospectus')->nullable();
            $table->string('icons')->nullable();
            $table->string('thumbnail_image')->nullable();
            $table->boolean('status')->default(1);
            $table->integer('display_order')->default(100);
            $table->string('academic_years')->nullable();
            $table->text('dean_message')->nullable();
            $table->text('mobile_contact')->nullable();
            $table->text('virtual_tour')->nullable();
            $table->integer('virtual_display_order')->default(100);

            // About School Section
            $table->string('about_school_title')->nullable();
            $table->string('about_school_subtitle')->nullable();
            $table->text('about_school_description')->nullable();
            $table->string('about_school_url')->nullable();
            $table->string('about_school_chancellor_img')->nullable();
            $table->string('about_school_chancellor_logo')->nullable();
            $table->string('about_school_logo_content')->nullable();
            $table->string('about_school_stats_number')->nullable();
            $table->string('about_school_stats_content')->nullable();
            $table->string('highlight_1_rank')->nullable();
            $table->string('highlight_1_text')->nullable();
            $table->string('highlight_1_source')->nullable();
            $table->string('button_1_text')->nullable();
            $table->string('button_1_url')->nullable();
            $table->string('button_2_text')->nullable();
            $table->string('button_2_url')->nullable();
            $table->string('button_3_text')->nullable();
            $table->string('button_3_url')->nullable();

            // Department Section
            $table->string('department_title')->nullable();
            $table->string('department_desc')->nullable();
            $table->string('department_programs_count')->nullable();
            $table->string('department_programs_text')->nullable();
            $table->string('department_button_1_text')->nullable();
            $table->string('department_button_1_url')->nullable();
            $table->string('department_button_2_text')->nullable();
            $table->string('department_button_2_url')->nullable();

            // Placement Section
            $table->string('placement_title')->nullable();
            $table->string('placement_subtitle')->nullable();
            $table->string('hall_of_fame_image')->nullable();
            $table->string('hall_of_fame_heading')->nullable();
            $table->string('hall_of_fame_url')->nullable();

            // Testimonial Section
            $table->string('testimonial_title')->nullable();
            $table->string('testimonial_subtitle')->nullable();

            // Happening Section
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
        Schema::dropIfExists('schools');
    }
};
