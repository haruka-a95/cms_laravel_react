<?php

namespace App\Jobs;

use App\Models\PdfJob;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Dompdf\Dompdf;
use Illuminate\Support\Facades\View;
use App\Models\Client;

class GeneratePdfJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $pdfJobId;

    public function __construct($pdfJobId)
    {
        $this->pdfJobId = $pdfJobId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try{
            $pdfJob = PdfJob::find($this->pdfJobId);
            if (!$pdfJob) return;

            $pdfJob->update(['status' => 'processing', 'progress' => 10]);

            //クライアント一覧を取得
            $clients = Client::with(['categories', 'persons'])->get();

            //DOMPDF インスタンス作成
            $dompdf = new Dompdf();

            // BladeビューでHTMLを生成
            $html = View::make('pdf.clients', compact('clients'))->render();

            $dompdf->loadHtml($html);

            $pdfJob->update(['progress' => 50]);

            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            $pdfJob->update(['progress' => 80]);

            // フォルダ作成（なければ）
            if (!file_exists(storage_path('app/public/pdf'))) {
                mkdir(storage_path('app/public/pdf'), 0777, true);
            }
            //ストレージ保存 (storage/app/public/pdf/）
            $fileName = 'report_' . $this->pdfJobId . '.pdf';
            $filePath = storage_path('app/public/pdf/' . $fileName);
            file_put_contents($filePath, $dompdf->output());

            $pdfJob->update([
                'status' => 'completed',
                'file_path' => 'storage/pdf/' . $fileName,
                'progress' => 100
            ]);
        } catch(\Exception $e) {
            \Log::error('PDF生成エラー: ' . $e->getMessage());
            if(isset($pdfJob)) {
                $pdfJob->update(['status' => 'failed']);
            }
        }
    }
}
