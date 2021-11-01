<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Book\BookController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
})->middleware(['verify.shopify'])->name('home');

Route::group(['middleware'=>['verify.shopify'],'prefix'=>"books"],function (){
    Route::get('/list',[BookController::class,'index']);
    Route::get('/edit/{id}',[BookController::class,'edit']);
    Route::get('/show/{id}',[BookController::class,'show']);
    Route::post('/store',[BookController::class,'store']);
    Route::post('/update',[BookController::class,'update']);
});
