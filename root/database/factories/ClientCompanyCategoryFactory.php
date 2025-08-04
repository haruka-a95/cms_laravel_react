<?php

namespace Database\Factories;

use App\Models\ClientCompanyCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClientCompanyCategory>
 */
class ClientCompanyCategoryFactory extends Factory
{
    protected $model = ClientCompanyCategory::class;

    public function definition()
    {
        return [
            'client_id' => 1,
            'company_category_id' => 1,
        ];
    }
}
