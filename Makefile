up:
	@docker-compose up -d --build

down:
	@docker-compose down

c-i:
	@docker exec -i php-fpm copmoser install

cp:
	@docker exec -i php-fpm cp .env.example .env

key:
	@docker exec -i php-fpm php artisan key:generate

cr-db:
	@docker exec -i php-fpm touch database/database.sqlite && chmod -R 777 database/

storage:
	@docker exec -i php-fpm chmod -R 777 storage/logs/

migrate:
	@docker exec -i php-fpm php artisan:migrate

init: up c-i cp key cr-db storage migrate
