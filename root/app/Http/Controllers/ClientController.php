<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\ClientCompanyCategory;
use Illuminate\Support\Facades\DB;
use App\Enums\ClientStatus;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Client::with(['categories', 'persons'])->paginate(30);;
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
        'company_name' => 'required|string|max:255',
        'contact_person_id' => 'nullable|integer|exists:persons,id',
        'phone' => ['nullable', 'regex:/^\+?[0-9\- ]{7,15}$/'],
        'email' => 'nullable|email',
        'address' => 'nullable|string|max:255',
        'company_category_ids' => 'array',
        'company_category_ids.*' => 'exists:company_categories,id',
        'status' => 'required|in:' . implode(',',  ClientStatus::all()),
        ]);

        DB::beginTransaction();
        try{
            // クライアント作成
            $client = Client::create([
                'company_name'      => $validated['company_name'],
                'phone'             => $validated['phone'] ?? null,
                'email'             => $validated['email'] ?? null,
                'address'           => $validated['address'] ?? null,
                'contact_person_id' => $validated['contact_person_id'] ?? null,
                'status'            => $validated['status'],
            ]);

            //中間テーブルにカテゴリ関連付け
            if (!empty($validated['company_category_ids'])) {
                $client->categories()->sync($validated['company_category_ids']);
            } else {
                $client->categories()->sync([]);
            }

            DB::commit();

            // ステータスラベルフィールドをモデルに付与
            $client->status_label = $client->status_label;

            return response()->json([
                'message' => 'クライアントを追加しました。',
                'data' => $client->load(['persons', 'categories']),
            ], 201);
        } catch (\Exception $e){
            DB::rollBack();
            return response()->json([
                'message' => '登録中のエラー',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $client = Client::with(['categories', 'persons'])->findOrFail($id);
        return response()->json($client);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'contact_person_id' => 'nullable|integer|exists:persons,id',
            'phone' => ['nullable', 'regex:/^\+?[0-9\- ]{7,15}$/'],
            'email' => 'nullable|email',
            'address' => 'nullable|string|max:255',
            'company_category_ids' => 'array',
            'company_category_ids.*' => 'exists:company_categories,id',
            'status' => 'required|in:' . implode(',', ClientStatus::all()),
        ]);

        DB::beginTransaction();
        try{
            $client->update([
                'company_name'      => $validated['company_name'],
                'phone'             => $validated['phone'] ?? null,
                'email'             => $validated['email'] ?? null,
                'address'           => $validated['address'] ?? null,
                'contact_person_id' => $validated['contact_person_id'] ?? null,
                'status'            => $validated['status'],
            ]);

            //中間テーブルの更新
            $client->categories()->sync($validated['company_category_ids'] ?? []);

            DB::commit();

            // ステータスラベルフィールドを単一モデルに付与
            $client->status_label = $client->status_label;

            return response()->json([
                'message' => 'クライアントを編集しました。',
                'data' => $client->load(['persons', 'categories']),
            ], 200);

        } catch (\Exception $e){
            DB::rollBack();

            return response()->json([
                'message' => '更新中のエラー',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Client $client)
    {
        $client->delete();
        return response()->noContent();
    }
}
