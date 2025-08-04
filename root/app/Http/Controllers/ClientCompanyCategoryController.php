<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientCompanyCategoryRequest;
use Illuminate\Http\Request;
use App\Models\ClientCompanyCategory;
use App\Services\ClientCompanyCategoryService;

class ClientCompanyCategoryController extends Controller
{
    protected $service;

    public function __construct(ClientCompanyCategoryService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return ClientCompanyCategory::paginate(30);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreClientCompanyCategoryRequest $request)
    {
        $created = $this->service->create($request->validated());
        return response()->json($created, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(ClientCompanyCategory $client_company_category)
    {
        return response()->json($client_company_category, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StoreClientCompanyCategoryRequest $request, ClientCompanyCategory $client_company_category)
    {
        $updated = $this->service->update($client_company_category, $request->validated());
        return response()->json($updated, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(ClientCompanyCategory $client_company_category)
    {
        $this->service->delete($client_company_category);
        return response()->noContent();
    }
}
