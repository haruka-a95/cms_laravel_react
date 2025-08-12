<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\ClientStatus;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'contact_person_id',
        'phone',
        'email',
        'address',
        'status',
    ];

    // ステータスラベルをレスポンスに含める
    protected $appends = ['status_label'];

    public function persons()
    {
        return $this->hasMany(Person::class, 'client_id', 'id');
    }

    public function categories()
    {
        return $this->belongsToMany(CompanyCategory::class, 'client_company_category', 'client_id', 'company_category_id');
    }

    public function primaryPerson()
    {
        return $this->hasOne(Person::class)->where('is_primary', true);
    }

    //ステータス表示用
    public function getStatusLabelAttribute()
    {
        return ClientStatus::labels()[$this->status] ?? $this->status;
    }
}
