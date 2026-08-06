type WasmTransaction = {
  date: number;
  index: number;
  description: string;
  amount: number;
  balance: number;
};

export type WasmStatementData = {
  key: string;
  account_number: string;
  start_date: number;
  opening_balance: number;
  closing_balance: number;
  transactions: WasmTransaction[];
};

type WasmParser = {
  parseBytes(pdfBytes: Uint8Array): unknown;
  loadConfigFromJson(configJson: string): void;
};

type WasmModule = {
  default: () => Promise<void>;
  Parser: new () => WasmParser;
};

let parserPromise: Promise<WasmParser> | null = null;
const WASM_BUNDLE_PATH = "./pkg/transtractor.js";

async function getParser(): Promise<WasmParser> {
  if (typeof window === "undefined") {
    throw new Error("Transtractor WASM parser can only run in browser context");
  }

  if (!parserPromise) {
    parserPromise = (async () => {
      try {
        const wasmModule =
          (await import("./pkg/transtractor.js")) as unknown as WasmModule;
        await wasmModule.default();
        return new wasmModule.Parser();
      } catch (error) {
        parserPromise = null;
        throw new Error(
          `Could not load Transtractor WASM bundle at ${WASM_BUNDLE_PATH}.`,
        );
      }
    })();
  }

  return parserPromise;
}

export async function parsePdfBytesWithWasm(
  pdfBytes: Uint8Array,
): Promise<WasmStatementData> {
  const parser = await getParser();
  return parser.parseBytes(pdfBytes) as WasmStatementData;
}

export async function loadParserConfigFromJson(
  configJson: string,
): Promise<void> {
  const parser = await getParser();
  parser.loadConfigFromJson(configJson);
}
