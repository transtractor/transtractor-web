# The Transtractor (Web UI)

A Vite-based static web browser interface for the Transtractor PDF bank statement parser.

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Update WASM Engine

The parsing engine is precompiled in WASM and included in this repo as built artifacts.
To refresh the engine, clone transtractor-lib locally into vendor, build, and copy only the generated files.

```bash
mkdir -p vendor
rm -rf vendor/transtractor-lib
git clone https://github.com/transtractor/transtractor-lib.git vendor/transtractor-lib
npm run build:wasm
```

Only `src/wasm/pkg` should be committed from this process.
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
