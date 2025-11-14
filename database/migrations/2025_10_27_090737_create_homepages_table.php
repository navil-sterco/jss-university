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
        Schema::create('homepages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('menu_name')->nullable();

            // About Section
            $table->string('about_title')->nullable();
            $table->string('about_subtitle')->nullable();
            $table->text('about_description')->nullable();
            $table->string('about_url')->nullable();
            $table->string('about_chancellor_img')->nullable();
            $table->string('about_chancellor_title')->nullable();
            $table->string('about_chancellor_name')->nullable();
            $table->string('about_chancellor_video_url')->nullable();
            $table->json('highlights')->nullable();
            $table->json('buttons')->nullable();
            $table->json('logo_content')->nullable();

            // Facilities
            $table->string('facilities_heading')->nullable();
            $table->string('facilities_subheading')->nullable();
            $table->json('facilities')->nullable();

            // Department Section
            $table->string('department_title')->nullable();
            $table->string('department_subtitle')->nullable();
            $table->string('programs_title')->nullable();
            $table->string('department_programs_count')->nullable();
            $table->string('department_programs_text')->nullable();
            $table->string('department_button_1_text')->nullable();
            $table->string('department_button_1_url')->nullable();
            $table->string('department_academic_year')->nullable();
            $table->string('department_academic_year_desc')->nullable();

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
        Schema::dropIfExists('homepages');
    }
};
