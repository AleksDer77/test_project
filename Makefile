up:
	@docker-compose up -d --build

down:
	@docker-compose down

c-i:
	@docker exec -it -u root php-fpm composer install

cp:
	@docker exec -it -u root php-fpm cp .env.example .env

key:
	@docker exec -it -u root php-fpm php artisan key:generate

cr-db:
	@docker exec -it -u root php-fpm touch database/database.sqlite
	@docker exec -it -u root php-fpm chmod -R 777 database/
	@docker exec -it -u root php-fpm chmod -R 666 database/database.sqlite

storage:
	@docker exec -it -u root php-fpm chmod -R 777 storage/logs/

migrate:
	@docker exec -it -u root php-fpm php artisan:migrate

init: c-i cp key cr-db storage migrate
