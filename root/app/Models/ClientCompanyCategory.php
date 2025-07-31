<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientCompanyCategory extends Model
{
    use HasFactory;

    protected $table = 'client_company_category';

    protected $fillable = [
        'client_id',
        'company_category_id',
    ];
}
