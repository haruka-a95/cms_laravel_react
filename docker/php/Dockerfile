FROM php:8.1.14-apache

# php.iniをコピー
COPY ./php.ini /usr/local/etc/php/

# composer インストール (マルチステージビルド)
COPY --from=composer:2.5.1 /usr/bin/composer /usr/bin/composer

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    vim \
    zip \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    # PHPのPDO MySQLドライバをインストール
    && docker-php-ext-install pdo_mysql \
    # Apacheのmod_rewriteを有効化
    && a2enmod rewrite \
    # DocumentRootを変更
    && sed -i 's!/var/www/html!/var/www/root/public!g' /etc/apache2/sites-available/000-default.conf
