<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FacebookConnection extends Model
{
    protected $fillable = [
        'user_id',
        'facebook_user_id',
        'facebook_user_name',
        'access_token',
        'selected_page_id',
        'selected_page_name',
        'selected_page_picture',
        'page_access_token',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
