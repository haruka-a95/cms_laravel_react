<?php

use App\Http\Controllers\ClientCompanyCategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ClientController;
use App\Http\Controllers\CompanyCategoryController;
use App\Http\Controllers\PersonController;
use App\Models\ClientCompanyCategory;
use App\Http\Controllers\Api\PdfJobController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//ログイン
// Route::middleware('auth:sanctum')->group(function() {
//     Route::apiResource('clients', ClientController::class);
//     Route::apiResource('company_categories', CompanyCategoryController::class);
// });

Route::apiResource('clients', ClientController::class);
Route::apiResource('company_categories', CompanyCategoryController::class);
Route::apiResource('client_company_categories', ClientCompanyCategoryController::class);
Route::apiResource('persons', PersonController::class);

//PDF生成関連
Route::post('/pdf-job-start', [PdfJobController::class, 'start']);
Route::get('/pdf-job/progress/{id}', [PdfJobController::class, 'progress']);

//CSVインポートして登録
Route::prefix('clients/import')->group(function(){
    //CSVプレビュー
    Route::post('preview', [ClientController::class, 'preview']);
    //CSV登録
    Route::post('/register', [ClientController::class, 'importConfirmed']);
});