up:
	./scripts/up.sh

down:
	./scripts/down.sh

tests:
	docker exec -it swipa-backend sh -c "npm run test"

tests-coverage:
	docker exec -it swipa-backend sh -c "npm run test-coverage"
