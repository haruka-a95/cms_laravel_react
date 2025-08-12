<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Client;
use App\Models\CompanyCategory;
use App\Models\ClientCompanyCategory;

class ClientCompanyCategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_paginated_categories()
    {
        ClientCompanyCategory::factory()->count(3)->create();

        $response = $this->getJson('/api/client_company_categories');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data',
            'links',
            'current_page',
            'total',
            'per_page',
        ]);
    }

    public function test_store_creates_new_client_company_category()
    {
        $client = Client::factory()->create();
        $category = CompanyCategory::factory()->create();

        $payload = [
            'client_id' => $client->id,
            'company_category_id' => $category->id,
        ];

        $response = $this->postJson('/api/client_company_categories', $payload);

        $response->assertStatus(201);
        $response->assertJsonFragment($payload);
        $this->assertDatabaseHas('client_company_category', $payload);
    }

    public function test_store_fails_validation()
    {
        $response = $this->postJson('/api/client_company_categories', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['client_id']);
    }

    public function test_show_returns_specific_category()
    {
        $clientCategory = ClientCompanyCategory::factory()->create();

        $response = $this->getJson("/api/client_company_categories/{$clientCategory->id}");

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'id' => $clientCategory->id,
        ]);
    }

    public function test_update_modifies_client_company_category()
    {
        $clientCategory = ClientCompanyCategory::factory()->create();
        $newClient = Client::factory()->create();
        $newCategory = CompanyCategory::factory()->create();

        $payload = [
            'client_id' => $newClient->id,
            'company_category_id' => $newCategory->id,
        ];

        $response = $this->putJson("/api/client_company_categories/{$clientCategory->id}", $payload);

        $response->assertStatus(200);
        $response->assertJsonFragment($payload);
        $this->assertDatabaseHas('client_company_category', array_merge(['id' => $clientCategory->id], $payload));
    }

    public function test_delete_removes_client_company_category()
    {
        $clientCategory = ClientCompanyCategory::factory()->create();

        $response = $this->deleteJson("/api/client_company_categories/{$clientCategory->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('client_company_category', ['id' => $clientCategory->id]);
    }
}
