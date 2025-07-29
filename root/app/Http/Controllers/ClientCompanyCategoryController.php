<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ClientCompanyCategory;

class ClientCompanyCategoryController extends Controller
{
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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|integer|exists:clients,id',
            'company_category_id' => 'nullable|integer|exists:company_categories,id',
        ]);

        return ClientCompanyCategory::create($validated);
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
    public function update(Request $request, ClientCompanyCategory $clientCate)
    {
        $validated = $request->validate([
            'client_id' => 'required|integer|exists:clients,id',
            'company_category_id' => 'nullable|integer|exists:company_categories,id',
        ]);

        $clientCate->update($validated);
        return $clientCate;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(ClientCompanyCategory $clientCate)
    {
        $clientCate->delete();
        return response()->noContent();
    }
}
