<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('clients', function (Blueprint $table) {
            // 既存の外部キー制約があれば削除
            $table->dropForeign('clients_contact_person_id_foreign');

            // 外部キー追加
            $table->foreign('contact_person_id')->references('id')->on('persons')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropForeign(['contact_person_id']);
        });
    }

};
