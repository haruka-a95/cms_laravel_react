<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CompanyCategory;
use Exception;

class CompanyCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $categories = CompanyCategory::paginate(30);
        return response()->json($categories);
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
            'name' => 'required|string|max:255',
        ]);

        try {
            $companyCategory = CompanyCategory::create($validated);
            return response()->json([
                'message' => '新規カテゴリを追加しました。',
                'data' => $companyCategory,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => '処理中にエラーが発生しました。',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(CompanyCategory $companyCategory)
    {
        return $companyCategory;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, CompanyCategory $companyCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        try {
            $companyCategory->update($validated);
            return response()->json([
                'message' => 'カテゴリを編集しました。',
                'data' => $companyCategory,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => '処理中にエラーが発生しました。',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(CompanyCategory $companyCategory)
    {
        try {
            $companyCategory->delete();
            return response()->json([
                'message' => 'カテゴリを削除しました。',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => '削除に失敗しました。',
            ], 500);
        }
    }

}
