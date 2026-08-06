# The Transtractor Web Interface

A Vite-based static web browser interface for the Transtractor PDF bank statement parser. This app implements the WASM bindings from the [Transtractor Library](https://github.com/transtractor/transtractor-lib) to parse PDF banks statements completely inside a web browser.

Deploy this app yourself or visit [www.transtractor.net](https://www.transtractor.net/) to see it deployed on Vercel.

## Local Deployment & Self Hosting

### Installation

Install the dependencies:

```bash
npm install
```

### Update WASM Engine

*Note: This step is done as part of repo maintenance and should not be needed unless you are developing the app.*

The parsing engine is precompiled in WASM and included in this repo as built artifacts.
To refresh the engine, clone transtractor-lib locally into vendor, build, and copy only the generated files.

```bash
mkdir -p vendor
rm -rf vendor/transtractor-lib
git clone https://github.com/transtractor/transtractor-lib.git vendor/transtractor-lib
npm run build:wasm
```

Only `src/wasm/pkg` is committed from this process.
The `vendor` folder is local-only and should stay untracked.

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```
