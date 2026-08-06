/* tslint:disable */
/* eslint-disable */

export class Parser {
    free(): void;
    [Symbol.dispose](): void;
    getDeprecationWarnings(): any[];
    load(config_json_path: string): void;
    loadConfigFromJson(config_json: string): void;
    constructor();
    parse(pdf_path: string): any;
    parseBytes(pdf_bytes: Uint8Array): any;
    parseLayout(layout_path: string): any;
    parseLayoutText(layout_text: string): any;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_parser_free: (a: number, b: number) => void;
    readonly parser_getDeprecationWarnings: (a: number) => [number, number];
    readonly parser_load: (a: number, b: number, c: number) => [number, number];
    readonly parser_loadConfigFromJson: (a: number, b: number, c: number) => [number, number];
    readonly parser_new: () => number;
    readonly parser_parse: (a: number, b: number, c: number) => [number, number, number];
    readonly parser_parseBytes: (a: number, b: number, c: number) => [number, number, number];
    readonly parser_parseLayout: (a: number, b: number, c: number) => [number, number, number];
    readonly parser_parseLayoutText: (a: number, b: number, c: number) => [number, number, number];
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_drop_slice: (a: number, b: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
