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
        Schema::create('hamburgers', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('url')->nullable();
            $table->enum('type', ['custom', 'school', 'department', 'page'])->default('custom');
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('section_title')->nullable();
            $table->string('section_subtitle')->nullable();
            $table->string('link')->nullable();
            $table->string('section_title_second')->nullable();
            $table->string('section_subtitle_second')->nullable();
            $table->string('section_image_first')->nullable();
            $table->string('section_heading_first')->nullable();
            $table->string('section_subheading_first')->nullable();
            $table->string('section_image_second')->nullable();
            $table->string('section_heading_second')->nullable();
            $table->string('section_subheading_second')->nullable();
            $table->string('section_video_url')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->foreign('parent_id')->references('id')->on('headers')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hamburgers');
    }
};
