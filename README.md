# WebAssembly demo

## Basic Rust — "hello world!"

1. Create new bin project: `cargo new hello`
2. `cd hello`
3. Build: `cargo build`
4. Run: `./target/debug/hello`
5. `ls -la ./target/debug/hello`
6. `file ./target/debug/hello`

## Compile to Wasm — "hello world!"

1. Build for Wasm: `cargo build --target wasm32-unknown-unknown`
2. `ls -la ./target/wasm32-unknown-unknown/debug/hello.wasm`
3. `file ./target/wasm32-unknown-unknown/debug/hello.wasm`
4. `wasmer ./target/wasm32-unknown-unknown/debug/hello.wasm` — OhOh!

## Compile with WASI — "hello world!"

1. Build for WASI: `cargo build --target wasm32-wasi`
2. `wasmer ./target/wasm32-wasi/debug/hello.wasm`
3. `wasmtime ./target/wasm32-wasi/debug/hello.wasm`
4. `wasm3 ./target/wasm32-wasi/debug/hello.wasm`
5. `wasmedge ./target/wasm32-wasi/debug/hello.wasm`

## Wasm "add" function

1. Create new lib project: `cargo new --lib add`
2. Test: `cargo test`
3. Add `add` function:

   ```rust
   #[no_mangle]
   pub extern "C" fn add(a: i32, b: i32) -> i32 {
     a + b
   }
   ```

4. To Cargo.toml:

   ```toml
   [lib]
   crate-type = ["cdylib"]
   ```

5. Build: `cargo build --target wasm32-unknown-unknown`
6. Run: `wasm3 --func add ./target/wasm32-unknown-unknown/debug/add.wasm 2 3`
7. Or: `wasmer ./target/wasm32-unknown-unknown/debug/add.wasm -i add 2 3`

## WebAssembly Text (wat)

1. `mkdir wat; cd wat`
2. Empty module (`add.wat`):

   ```wat
   (module)
   ```

3. Basic add function:

   ```wat
   (module
     (func (export "add") (param $a i32) (param $b i32) (result i32)
       local.get $a
       local.get $b
       i32.add
     )
   )
   ```

4. Run: `wasmer add.wat -i add 2 3`
5. Convert to binary: `wat2wasm add.wat`
6. Run wasm: `wasmer add.wasm -i add 2 3`
7. Dump: `wasm-objdump -x add.wasm`
8. Convert back to text: `wasm2wat -o add2.wat add.wasm`

   ```wat
   (module
     (type (;0;) (func (param i32 i32) (result i32)))
     (func (;0;) (type 0) (param i32 i32) (result i32)
       local.get 0
       local.get 1
       i32.add)
     (export "add" (func 0))
   )
   ```

## Run add in browser

1. Add a web page (`index.html`):

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="utf-8" />
       <title>Hello</title>
     </head>
     <body>
       <script>
         (async () => {
           var obj = await WebAssembly.instantiateStreaming(
             fetch("./add.wasm")
           );
           alert(obj.instance.exports.add(3, 2));
         })();
       </script>
     </body>
   </html>
   ```

2. Run: `python3 -m http.server 10000`

## `wasm-bindgen` and `wasm-pack`

1. create lib project: `cargo new --lib hello-js`
2. `cd hello-js`
3. in `Cargo.toml`:

   ```toml
   [dependencies]
   wasm-bindgen = "0.2.78"

   [lib]
   crate-type = ["cdylib"]
   ```

4. lib.js:

   ```rust
   use wasm_bindgen::prelude::*;

   #[wasm_bindgen]
   extern "C" {
     fn alert(s: &str);
   }

   #[wasm_bindgen]
   pub fn hello(to: &str, from: &str) {
     alert(&format!("hello to {to} — from {from}"));
   }
   ```

5. build: `wasm-pack build --target web`
6. add some html:

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="utf-8" />
       <title>Hello</title>
     </head>
     <body>
       <script src="./index.js" type="module"></script>
     </body>
   </html>
   ```

7. add some JS:

   ```js
   import init, { hello } from "./pkg/hello_js.js";

   await init();

   hello("We Create!", "JavaScript in the browser");
   ```
