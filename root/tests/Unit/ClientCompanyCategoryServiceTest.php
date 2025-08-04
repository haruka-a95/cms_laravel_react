<?php

namespace Tests\Unit;

use App\Models\Client;
use App\Models\ClientCompanyCategory;
use App\Models\CompanyCategory;
use App\Services\ClientCompanyCategoryService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientCompanyCategoryServiceTest extends TestCase
{
    use RefreshDatabase;

    protected ClientCompanyCategoryService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ClientCompanyCategoryService();
    }

    /** @test */
    public function it_can_create_a_client_company_category()
    {
        $client = Client::factory()->create();
        $companyCategory = CompanyCategory::factory()->create();

        $data = [
            'client_id' => $client->id,
            'company_category_id' => $companyCategory->id,
        ];

        $category = $this->service->create($data);

        $this->assertInstanceOf(ClientCompanyCategory::class, $category);
        $this->assertDatabaseHas('client_company_category', $data);
    }

    /** @test */
    public function it_can_update_a_client_company_category()
    {
        // 関連モデルを作成
        $client = Client::factory()->create();
        $category = CompanyCategory::factory()->create();

        // ClientCompanyCategory作成（リレーション整合のため）
        $clientCompanyCategory = ClientCompanyCategory::factory()->create([
            'client_id' => $client->id,
            'company_category_id' => $category->id,
        ]);

        // 更新用の別のクライアントとカテゴリを作成
        $newClient = Client::factory()->create();
        $newCategory = CompanyCategory::factory()->create();


        $updateData = [
            'client_id' => $newClient->id,
            'company_category_id' => $newCategory->id,
        ];

        $updated = $this->service->update($clientCompanyCategory, $updateData);

        $this->assertEquals($newClient->id, $updated->client_id);
        $this->assertEquals($newCategory->id, $updated->company_category_id);
        $this->assertDatabaseHas('client_company_category', $updateData);
    }

    /** @test */
    public function it_can_delete_a_client_company_category()
    {
        // 関連モデルを作成
        $client = Client::factory()->create();
        $category = CompanyCategory::factory()->create();

        // ClientCompanyCategoryも先に作成（リレーション整合のため）
        $clientCompanyCategory = ClientCompanyCategory::factory()->create([
            'client_id' => $client->id,
            'company_category_id' => $category->id,
        ]);

        $result = $this->service->delete($clientCompanyCategory);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('client_company_category', [
            'id' => $clientCompanyCategory->id,
        ]);
    }
}
