<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\GeneratePdfJob;
use App\Models\PdfJob;
use Illuminate\Http\Request;

class PdfJobController extends Controller
{
    // PDF生成ジョブ開始
    public function start()
    {
        $pdfJob = PdfJob::create(['status' => 'pending', 'progress' => 0]);

        GeneratePdfJob::dispatch($pdfJob->id);

        return response()->json(['job_id' => $pdfJob->id]);
    }

    // ジョブ進捗取得
    public function progress($id)
    {
        $pdfJob = PdfJob::find($id);
        if (!$pdfJob) {
            return response()->json(['error' => 'ジョブが見つかりません'], 404);
        }

        return response()->json([
            'status' => $pdfJob->status,
            'progress' => $pdfJob->progress,
            'file_url' => $pdfJob->file_path ? asset($pdfJob->file_path) : null,
        ]);
    }
}