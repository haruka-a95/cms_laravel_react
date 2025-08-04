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
        return $this->service->create($request->validated());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(ClientCompanyCategory $clientCate)
    {
        return $clientCate;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StoreClientCompanyCategoryRequest $request, ClientCompanyCategory $clientCate)
    {
        $updated = $this->service->update($clientCate, $request->validated());
        return $updated;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(ClientCompanyCategory $clientCate)
    {
        $this->service->delete($clientCate);
        return response()->noContent();
    }
}
