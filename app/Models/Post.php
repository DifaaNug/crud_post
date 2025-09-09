<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    //Code Data Array Tabel
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'content',
        'picture',
        'status', // Menambahkan status (draft/published)
    ];
}
