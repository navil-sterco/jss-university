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
        Schema::table('courses', function (Blueprint $table) {
            $table->string('banner')->nullable();
            $table->string('eligibility_marks')->nullable();
            $table->string('eligibility_desc')->nullable();

            // Overview
            $table->string('overview_title')->nullable();
            $table->string('overview_desc')->nullable();
            $table->string('overview_image')->nullable();

            // Career
            $table->string('career_title')->nullable();
            $table->string('career_subtitle')->nullable();
            $table->string('career_desc')->nullable();
            $table->string('career_image')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            //
        });
    }
};
