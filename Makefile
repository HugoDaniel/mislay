all: bundlejs examples

bundlejs: html/mislay.js html/node_modules/canvaskit-wasm/bin/canvaskit.js html/node_modules/canvaskit-wasm/bin/canvaskit.wasm
	@-mkdir -p html/build
	@cat html/node_modules/canvaskit-wasm/bin/canvaskit.js > html/build/bundle.js
	@cat html/mislay.js >> html/build/bundle.js
	@cp html/node_modules/canvaskit-wasm/bin/canvaskit.wasm html/build
	@echo "HTML: build created and available at ./html/build/"

examples:
	@ln -s html/build html/examples/01-minimal/mislay
	@echo "HTML: created build symlink in examples folders"

clean:
	@rm -rf html/build
	@rm html/examples/01-minimal/mislay

