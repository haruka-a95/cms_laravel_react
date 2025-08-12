<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>クライアント一覧</title>
    <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 4px; }
        /* dompdf日本語文字化け対策 */
        html, body, textarea {
            font-family: 'ipaexg', sans-serif;
        }
    </style>
</head>
<body>
    <h1>クライアント一覧</h1>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>会社名</th>
                <th>担当者番号</th>
                <th>電話番号</th>
                <th>メール</th>
                <th>住所</th>
                <th>ステータス</th>
            </tr>
        </thead>
        <tbody>
        @foreach ($clients as $client)
        <tr>
            <td>{{$client->id}}</td>
            <td>{{$client->company_name}}</td>
            <td>{{$client->contact_person_id}}</td>
            <td>{{$client->phone}}</td>
            <td>{{$client->email}}</td>
            <td>{{$client->address}}</td>
            <td>{{$client->status}}</td>
        </tr>
        @endforeach
</body>
</html>