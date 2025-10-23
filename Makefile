.PHONY: eslint types check build

eslint:
	npx eslint

types:
	npx vue-tsc --build

check: eslint types

build:
	npm run build
