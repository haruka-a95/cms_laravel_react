<?php

namespace App\Services;

use App\Models\ClientCompanyCategory;

class ClientCompanyCategoryService
{
    public function create(array $data): ClientCompanyCategory
    {
        return ClientCompanyCategory::create($data);
    }

    public function update(ClientCompanyCategory $model, array $data): ClientCompanyCategory
    {
        $model->update($data);
        return $model;
    }

    public function delete(ClientCompanyCategory $model): bool
    {
        return $model->delete();
    }
}
