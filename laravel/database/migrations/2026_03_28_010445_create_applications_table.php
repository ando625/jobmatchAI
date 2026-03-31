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
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('job_posting_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['applying', 'screening', 'interview', 'offered', 'rejected'])->default('applying');
            //⬆️ 選考ステータス　　--応募中/書類選考/面接/内定/不採用--
            $table->integer('match_score')->nullable();
            $table->text('match_reason')->nullable();
            $table->text('company_ai_comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
