<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banners_department', function (Blueprint $table) {
            $table->id();
            $table->foreignId('banner_id')->constrained('banners')->onDelete('cascade');
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['banner_id', 'department_id']);
        });

        Schema::create('banners_courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('banner_id')->constrained('banners')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['banner_id', 'course_id']);
        });

        Schema::create('testimonials_department', function (Blueprint $table) {
            $table->id();
            $table->foreignId('testimonial_id')->constrained('testimonials')->onDelete('cascade');
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['testimonial_id', 'department_id']);
        });

        Schema::create('testimonials_courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('testimonial_id')->constrained('testimonials')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['testimonial_id', 'course_id']);
        });

        Schema::create('happenings_department', function (Blueprint $table) {
            $table->id();
            $table->foreignId('happening_id')->constrained('happenings')->onDelete('cascade');
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['happening_id', 'department_id']);
        });

        Schema::create('happenings_courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('happening_id')->constrained('happenings')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['happening_id', 'course_id']);
        });
        
        Schema::create('facts_department', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facts_id')->constrained('facts_and_figures')->onDelete('cascade');
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['facts_id', 'department_id']);
        });

        Schema::create('facts_courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facts_id')->constrained('facts_and_figures')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['facts_id', 'course_id']);
        });

        Schema::create('faqs_department', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faq_id')->constrained('faqs')->onDelete('cascade');
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['faq_id', 'department_id']);
        });

        Schema::create('faqs_courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faq_id')->constrained('faqs')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['faq_id', 'course_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banners_department');
        Schema::dropIfExists('banners_courses');
        Schema::dropIfExists('testimonials_department');
        Schema::dropIfExists('testimonials_courses');
        Schema::dropIfExists('happenings_department');
        Schema::dropIfExists('happenings_courses');
        Schema::dropIfExists('facts_department');
        Schema::dropIfExists('facts_courses');
        Schema::dropIfExists('faqs_department');
        Schema::dropIfExists('faqs_courses');
    }
};
