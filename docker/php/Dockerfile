FROM php:8.3-fpm

# Устанавливаем необходимые пакеты
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    unzip \
    && docker-php-ext-install pdo pdo_sqlite

# Устанавливаем Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Копируем проект внутрь контейнера
COPY ./ /var/www/html

# Настраиваем права доступа
RUN chown -R www-data:www-data /var/www/html

EXPOSE 9000
CMD ["php-fpm"]
