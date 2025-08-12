# PDF出力機能について

クライアント一覧のPDF生成を非同期ジョブ（Laravel Queue）で実行し、進捗管理とダウンロードを行う機能を実装しています。

## 機能概要
-　クライアント一覧PDFはジョブとしてバックグラウンドで生成されます。
- ジョブの進捗状況をAPI経由で取得し、フロントのReactコンポーネントで表示します。
- 生成完了後、PDFファイルをダウンロードできます。

## 使い方
1. クライアント一覧画面にある「クライアント一覧PDF生成開始」ボタンを押すとPDF生成ジョブが開始されます。
2. 進捗状況が画面に表示され、完了するとダウンロードリンクが表示されます。
3. PDF生成はLaravelのキュー（databaseドライバ）を使って非同期処理されます。

## Laravel Queueの設定
- ```.env```ファイルの```QUEUE_CONNECTION=database```を設定してください。
- 以下コマンドでキューテーブルを作成し、マイグレーションを実行します。
```bash
php artisan queue:table
php artisan migrate
```
- ジョブワーカーを以下コマンドで起動します。
```bash
php artisan queue:work
```

## 主要関連ファイル
| ファイル名・場所                                        | 説明                       |
| ----------------------------------------------- | ------------------------ |
| `app/Jobs/GeneratePdfJob.php`                   | PDF生成を行うジョブクラス           |
| `app/Http/Controllers/Api/PdfJobController.php` | ジョブ開始・進捗取得用APIコントローラ     |
| `resources/views/pdf/clients.blade.php`         | PDF出力用Bladeテンプレート        |
| `resources/js/components/PdfDownload.jsx`       | ReactのPDFダウンロードUIコンポーネント |