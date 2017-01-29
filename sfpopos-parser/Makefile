.PHONY: clean lint lint-fix
clean:
	rm -f popos.json

lint:
	./node_modules/.bin/tslint src/**/*

lint-fix:
	./node_modules/.bin/tslint --fix src/**/*

popos.json: popos-detail.json
	node build/index.js

popos-detail.json:
	./scripts/get-popos-detail.sh > popos-detail.json
