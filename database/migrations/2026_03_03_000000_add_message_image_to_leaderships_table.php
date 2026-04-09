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
        Schema::table('leaderships', function (Blueprint $table) {
            $table->string('message_image')->nullable()->after('video');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leaderships', function (Blueprint $table) {
            $table->dropColumn('message_image');
        });
    }
};
