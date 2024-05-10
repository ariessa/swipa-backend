up:
	./scripts/up.sh

down:
	./scripts/down.sh

test:
	docker exec -it swipa-backend sh -c "npm run test"

test-coverage:
	docker exec -it swipa-backend sh -c "npm run test-coverage"
