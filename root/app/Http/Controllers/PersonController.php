<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Person;

class PersonController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Person::with('client')->paginate(30);
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
        'email' => 'nullable|email',
        'phone' => ['nullable', 'regex:/^\+?[0-9\- ]{7,15}$/'],
        'client_id' => 'nullable|exists:clients,id',
        'department' => 'nullable|string|max:255',
        'is_primary' => 'boolean',
        ]);

        // is_primary = trueの場合、同じclient_idの他担当者のis_primaryをfalseに更新
        if (!empty($validated['is_primary']) && $validated['is_primary']) {
            Person::where('client_id', $validated['client_id'])
                ->update(['is_primary' => false]);
        }

        $person = Person::create($validated);

        return response()->json([
            'message' => '新規担当者を登録',
            'data' => $person,
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Person $person)
    {
        return $person->load('client');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Person $person)
    {
        $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'nullable|email',
        'phone' => ['nullable', 'regex:/^\+?[0-9\- ]{7,15}$/'],
        'client_id' => 'required|exists:clients,id',
        'department'=> 'nullable|string|max:255',
        'is_primary' => 'boolean',
        ]);

        // 主担当が選ばれた場合、他の担当者を解除
        if (!empty($validated['is_primary']) && $validated['is_primary']) {
            Person::where('client_id', $validated['client_id'])
                ->where('id', '!=', $person->id)
                ->update(['is_primary' => false]);
        }

        $person->update($validated);

        return response()->json([
            'message' => '担当者情報を更新しました。',
            'data' => $person
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Person $person)
    {
        $person->delete();

        return response()->json([
            'message' => '担当者を削除しました。'
        ], 200);
    }
}
