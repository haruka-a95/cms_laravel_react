# Laravel + React + Docker フルスタックアプリケーション

バックエンドは **Laravel (PHP)**、フロントエンドは **React (Vite)** を使用しています。

---

## 技術スタック

| 種別         | 使用技術                     |
|--------------|------------------------------|
| バックエンド | Laravel 9+                   |
| フロントエンド | React (Vite, JSX対応)        |
| コンテナ     | Docker / Docker Compose      |
| パッケージ管理 | Composer / npm               |
| データベース | 任意（MySQL/PostgreSQLなど） |

---

## セットアップ手順

### 1. このリポジトリをクローン

```bash
git clone https://github.com/haruka-a95/cms_laravel_react.git
cd cms_laravel_react
```

### 2. ```.env```のコピー
```bash
cp .env.example .env
```
必要に応じて .env の DB や APP_PORT を調整してください。

### 3. Docker起動
```bash
docker-compose up -d --build
```

### 4. WebコンテナでLaravelのセットアップ
```bash
docker exec -it cms-web bash
composer install
# app keyを作成
php artisan key:generate
# マイグレーション実行
php artisan migrate
```

### 5. フロントエンド（Vite + React）を起動
別のターミナルで以下を実行：
```bash
docker exec -it cms-web bash
npm install
npm run dev
```

## アクセス
- Laravel: http://localhost:81
- Vite（React HMR）: 自動で http://localhost:5173 経由で連携されます

## ディレクトリ構成
```bash
├── app/
├── resources/
│ ├── js/ # Reactコンポーネント (app.jsxなど)
│ └── views/ # Bladeテンプレート
├── public/
├── docker-compose.yml
├── vite.config.js
├── .env
```
React は Laravel に統合されており、`resources/js/app.jsx` がエントリーポイントです。

## テスト
`php artisan test`

## その他
- [PDF出力機能について](cms_laravel_react/docs/PDF出力機能.md)
