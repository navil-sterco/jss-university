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
        Schema::create('faculties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('type_id')->constrained('types')->onDelete('cascade');
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->string('name');
            $table->string('slug');
            $table->string('email')->unique()->nullable();
            $table->string('profile')->nullable();
            $table->string('image')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->text('education')->nullable();
            $table->text('research')->nullable();
            $table->text('teaching')->nullable();
            $table->text('award')->nullable();
            $table->text('social_engagement')->nullable();
            $table->boolean('status')->default(1);
            $table->integer("display_order")->default(100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculties');
    }
};
