test:
	@mocha test/index.js -R spec

test-browser: browserify-tests
	@open test/browser/index.html

browserify-tests:
	@browserify test/index.js > test/browser/index.js

lint:
	@gulp lint

build:
	@gulp build

publish:
	@gulp build && npm publish .

.PHONY: test
