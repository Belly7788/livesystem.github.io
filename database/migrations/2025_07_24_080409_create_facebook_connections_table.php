<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacebookConnectionsTable extends Migration
{
    public function up()
    {
        Schema::create('facebook_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Link to authenticated user
            $table->string('facebook_user_id')->unique(); // Facebook user ID
            $table->string('facebook_user_name'); // Facebook user name
            $table->text('access_token'); // Facebook access token
            $table->string('selected_page_id')->nullable(); // Selected page ID
            $table->string('selected_page_name')->nullable(); // Selected page name
            $table->string('selected_page_picture')->nullable(); // Page picture URL
            $table->text('page_access_token')->nullable(); // Page-specific access token
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('facebook_connections');
    }
}
