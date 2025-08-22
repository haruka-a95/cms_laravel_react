<?php
namespace App\Services;

use League\Csv\Reader;
use Illuminate\Support\Facades\DB;
use App\Models\Client;
use App\Models\ClientCompanyCategory;
use App\Models\CompanyCategory;
use Exception;

class ClientImportService
{
    // 許容ヘッダーリスト
    private array $allowedHeaders = [
        'company_name',
        'company_category',
        'contact_person_id',
        'phone',
        'address',
        'status',
        'email',
    ];

    /**
     * CSVファイルを解析し、ヘッダーを検証
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @return array
     * @throws Exception
     */
    public function parseCsv($file): array
    {
        $csv = Reader::createFromPath($file->getRealPath(), 'r');
        $csv->setHeaderOffset(0); // 1行目をヘッダーに設定

        $headers = $csv->getHeader();

        //許容していないヘッダーがある場合、警告表示
        $extraHeaders = array_diff($headers, $this->allowedHeaders);
        $warnings = [];
        if (!empty($extraHeaders)) {
            $warnings[] = '未定義のヘッダーが含まれています: ' . implode(",", $extraHeaders);
        }

        $records = [];
        $errors = [];

        foreach ($csv->getRecords() as $idx => $record) {
            $rowNumber = $idx + 2;
            $records[] = $record;

            //社名がなければエラー
            if (empty(trim($record['company_name'] ?? ''))) {
                $errors[] = "{$rowNumber}行目の会社名が空です。";
            }
        }

        return [
            'warnings' => $warnings,
            'errors' => $errors,
            'records' => $records,
        ];
    }

    /**
     * CSVレコードをDBに登録
     *
     * @param array $records
     * @return array 登録件数とスキップ行
     * @throws Exception
     */
    public function import(array $records): array
    {
        if (empty($records)) {
            throw new Exception("CSVデータが空です");
        }

        $skipped = [];
        $insertedCount = 0;

        DB::transaction(function () use ($records, &$skipped, &$insertedCount) {
            foreach (array_chunk($records, 1000) as $chunk) {
                foreach ($chunk as $record) {
                    $company = trim($record['company_name'] ?? '');
                    if ($company === '') {
                        $skipped[] = $record;
                        continue;
                    }

                    // クライアント作成 or 更新
                    $client = Client::updateOrCreate(
                        ['company_name' => $company],
                        [
                            'email' => $record['email'] ?? null,
                            'contact_person_id' => $record['contact_person_id'] ?? null,
                            'phone' => $record['phone'] ?? null,
                            'address' => $record['address'] ?? null,
                            'status' => $record['status'] ?? null,
                        ]
                    );

                    $insertedCount++;

                    // カテゴリ登録（中間テーブル）
                    $categoryName = trim($record['company_category'] ?? '');
                    if ($categoryName !== '') {
                        $category = CompanyCategory::where('name', $categoryName)->first();
                        if (!$category) {
                            $skipped[] = $record; // カテゴリ未登録行はスキップ情報に追加
                            continue;
                        }

                        // 中間テーブルに登録（重複防止）
                        $client->categories()->syncWithoutDetaching([$category->id]);
                    }
                }
            }
        });

        return [
                'inserted_count' => $insertedCount,
                'skipped' => $skipped,
            ];
    }
}