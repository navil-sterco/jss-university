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
        Schema::table('departments', function (Blueprint $table) {
            // Program Count Section (matches School module)
            $table->string('department_title')->nullable()->after('hall_of_fame_url');
            $table->text('department_desc')->nullable()->after('department_title');
            $table->string('department_programs_count')->nullable()->after('department_desc');
            $table->string('department_programs_text')->nullable()->after('department_programs_count');
            $table->string('department_buttons')->nullable()->after('department_programs_text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropColumn([
                'department_title',
                'department_desc',
                'department_programs_count',
                'department_programs_text',
                'department_buttons',
            ]);
        });
    }
};
