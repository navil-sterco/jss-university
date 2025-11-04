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
        Schema::create('contact_infos', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('address');
            $table->string('email');
            $table->string('phone');
            $table->string('landline_direct');
            $table->string('landline_epbx');
            $table->string('direction_url');
            $table->string('facebook');
            $table->string('instagram');
            $table->string('x');
            $table->string('youtube');
            $table->string('copyright');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_infos');
    }
};
