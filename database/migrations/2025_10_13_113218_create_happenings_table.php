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
        Schema::create('happenings', function (Blueprint $table) {
            $table->id();
            $table->string('event_type');
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('alt_text')->nullable();
            $table->string('image')->nullable();
            $table->string('banner_images')->nullable();
            $table->string('pdf')->nullable();
            $table->string('pdf_title')->nullable();
            $table->string('video')->nullable();
            $table->date('event_date_from')->nullable();
            $table->date('event_date_to')->nullable();
            $table->text('short_description')->nullable();
            $table->text('description')->nullable();
            $table->integer('display_order')->nullable()->index();
            $table->integer('show_on_home')->default(false);
            $table->boolean('status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('happenings');
    }
};
