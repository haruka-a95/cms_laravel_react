<?php

namespace Database\Factories;

use App\Models\ClientCompanyCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Client;
use App\Models\CompanyCategory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClientCompanyCategory>
 */
class ClientCompanyCategoryFactory extends Factory
{
    protected $model = ClientCompanyCategory::class;

    public function definition()
    {
        return [
            // Clientモデルのファクトリを呼び出し、自動作成＆IDをセット
            'client_id' => Client::factory(),

            // CompanyCategoryモデルのファクトリを呼び出し、セット
            'company_category_id' => CompanyCategory::factory(),
        ];
    }
}
