<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function clients()
    {
        return $this->belongsToMany(Client::class, 'client_company_category', 'company_category_id', 'client_id');
    }

}
