<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $table = 'books';

    protected $fillable = [
        'user_id',
        'shopify_product_id',
        'no_of_pages',
        'author',
        'wholesale_price'
    ];
}
