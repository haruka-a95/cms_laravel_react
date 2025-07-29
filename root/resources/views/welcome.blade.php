<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <title>My CMS</title>
    @viteReactRefresh
      @vite(['resources/css/app.css', 'resources/js/app.jsx',])
</head>
<body>
    <div id="app"></div>
</body>
</html>
