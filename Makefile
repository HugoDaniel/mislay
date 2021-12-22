all: bundlejs examples

bundlejs: html/mislay.js html/node_modules/canvaskit-wasm/bin/canvaskit.js html/node_modules/canvaskit-wasm/bin/canvaskit.wasm
	@-mkdir -p html/build
	@cat html/node_modules/canvaskit-wasm/bin/canvaskit.js > html/build/bundle.js
	@cat html/mislay.js >> html/build/bundle.js
	@cp html/node_modules/canvaskit-wasm/bin/canvaskit.wasm html/build
	@echo "HTML: build created and available at ./html/build/"

examples:
	@ln -s ../../build html/examples/01-minimal/mislay
	@echo "HTML: created build symlink in examples folders"

serve:
	@mkdir -p .logs
	@touch .logs/error.log
	@echo "" > .logs/error.log
	@echo "Listening at localhost:42000"
	@echo "Error log at ./logs/error.log"
	@nginx -c $(shell pwd)/etc/dev.nginx.conf -p $(shell pwd)

watch:
	find html/mislay.js | entr -s 'make bundlejs'

clean:
	@rm -rf html/build
	@rm -rf .logs
	@rm html/examples/01-minimal/mislay

