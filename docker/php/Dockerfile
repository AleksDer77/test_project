FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    unzip \
    && docker-php-ext-install pdo pdo_sqlite

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY ./ /var/www/html

EXPOSE 9000
CMD ["php-fpm"]
