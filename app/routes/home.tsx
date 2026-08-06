import type { Route } from "./+types/home";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import parsePDF from "../../src/parsePDF";
import { loadParserConfigFromJson } from "../../src/wasm/transtractorWasm";
import { TransactionsData } from "../../src/types";

const LOAD_PDFS_TOOLTIP_LINK = "https://transtractor-lib.readthedocs.io/en/latest/supported_statements.html";

const LOAD_PDFS_TOOLTIP_CONTENT = (
  <>
    PDF files are extracted inside your browser and never leave your device. See{" "}
    <a
      href={LOAD_PDFS_TOOLTIP_LINK}
      target="_blank"
      rel="noreferrer"
      className="text-sky-300 underline underline-offset-2 hover:text-sky-200"
    >
      this guide
    </a> for a list of supported banks statements.
  </>
);

const LOAD_CONFIG_TOOLTIP_LINK = "https://transtractor-lib.readthedocs.io/en/latest/configuration.html";

const LOAD_CONFIG_TOOLTIP_CONTENT = (
  <>
    If your banks statements are not supported, you may load your own extraction rules as JSON files.
    See{" "}
    <a
      href={LOAD_CONFIG_TOOLTIP_LINK}
      target="_blank"
      rel="noreferrer"
      className="text-sky-300 underline underline-offset-2 hover:text-sky-200"
    >
      this guide
    </a> for detailed instructions on how to create these files.
    .
  </>
);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "The Transtractor UI" },
    { name: "description", content: "Extract transaction data from your PDF bank statements" },
  ];
}

export default function Home() {
  const [data, setData] = useState(() => new TransactionsData());
  const [logs, setLogs] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [parseProgress, setParseProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const configInputRef = useRef<HTMLInputElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  function toSnapshot(source: TransactionsData): TransactionsData {
    const snapshot = new TransactionsData();
    snapshot.transactions = [...source.transactions];
    snapshot.accountNumbers = new Set(source.accountNumbers);
    snapshot.existing = new Set(source.existing);
    return snapshot;
  }

  async function handleLoadFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    setIsParsing(true);
    setParseProgress({ current: 1, total: files.length });
    for (const [index, file] of files.entries()) {
      setParseProgress({ current: index + 1, total: files.length });
      try {
        const parsedTransactions = await parsePDF(file);
        let addedCount = 0;
        for (const transaction of parsedTransactions) {
          if (data.addTransaction(transaction)) {
            addedCount += 1;
          }
        }

        setLogs((prev) => [
          ...prev,
          `Extracted ${addedCount} transaction${addedCount === 1 ? "" : "s"} from ${file.name}`,
        ]);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setLogs((prev) => [...prev, `Error parsing ${file.name}: ${message}`]);
      }

      // Trigger re-render to reflect counts as each file completes.
      setData(toSnapshot(data));
    }

    setIsParsing(false);
    setParseProgress(null);
    event.target.value = "";
  }

  async function handleLoadConfigFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    setIsLoadingConfig(true);
    for (const file of files) {
      try {
        const rawConfig = await file.text();
        const parsedConfig = JSON.parse(rawConfig);
        await loadParserConfigFromJson(JSON.stringify(parsedConfig));
        setLogs((prev) => [...prev, `Loaded parser config from ${file.name}`]);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setLogs((prev) => [...prev, `Error loading config ${file.name}: ${message}`]);
      }
    }

    setIsLoadingConfig(false);
    event.target.value = "";
  }

  function handleExportCSV() {
    data.sortTransactions();
    data.exportToCSV();
  }

  function handleClearData() {
    setData(new TransactionsData());
    setLogs([]);
    setParseProgress(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (configInputRef.current) {
      configInputRef.current.value = "";
    }
  }

  const canExport = data.transactions.length > 0;
  const isBusy = isParsing || isLoadingConfig;

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-4xl font-semibold text-slate-900">
          Transtractor Web Interface
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Use your web browser to extract transaction data from all your PDF bank statements
          into a single CSV file.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500"># Transactions</p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">
              {data.transactions.length}
            </p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500"># Accounts</p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">
              {data.accountNumbers.size}
            </p>
          </article>
        </div>

        <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="pdf-upload">
              Load PDFs
            </label>
            <span className="group relative inline-flex">
              <button
                type="button"
                aria-label="More information about loading PDFs"
                className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-600"
              >
                ?
              </button>
              <span className="absolute left-1/2 top-full z-10 mt-2 hidden w-72 -translate-x-1/2 rounded-md bg-slate-900 px-3 py-2 text-xs leading-5 text-slate-100 shadow-lg group-hover:block group-focus-within:block">
                {LOAD_PDFS_TOOLTIP_CONTENT}
              </span>
            </span>
          </div>
          <input
            ref={inputRef}
            id="pdf-upload"
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleLoadFiles}
            disabled={isBusy}
            className="mt-2 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          />
          {isParsing && parseProgress ? (
            <p className="mt-2 text-sm font-medium text-slate-700">
              Extracting file {parseProgress.current} of {parseProgress.total}
            </p>
          ) : null}
        </div>

        <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="config-upload">
              Load custom parser config (optional)
            </label>
            <span className="group relative inline-flex">
              <button
                type="button"
                aria-label="More information about custom parser config files"
                className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-600"
              >
                ?
              </button>
              <span className="absolute left-1/2 top-full z-10 mt-2 hidden w-72 -translate-x-1/2 rounded-md bg-slate-900 px-3 py-2 text-xs leading-5 text-slate-100 shadow-lg group-hover:block group-focus-within:block">
                {LOAD_CONFIG_TOOLTIP_CONTENT}
              </span>
            </span>
          </div>
          <input
            ref={configInputRef}
            id="config-upload"
            type="file"
            multiple
            accept="application/json,.json"
            onChange={handleLoadConfigFiles}
            disabled={isBusy}
            className="mt-2 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={!canExport || isBusy}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            Export to CSV
          </button>
          <button
            type="button"
            onClick={handleClearData}
            disabled={isBusy}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear Data
          </button>
        </div>

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Console
          </h2>
          <div
            ref={consoleRef}
            className="mt-2 h-52 overflow-y-auto rounded-md border border-slate-200 bg-slate-950 p-3 font-mono text-sm text-slate-100"
          >
            {logs.length === 0 ? (
              <p className="text-slate-400">No logs yet.</p>
            ) : (
              logs.map((line, index) => {
                const isError = line.startsWith("Error ");
                return (
                  <p
                    key={`${line}-${index}`}
                    className={`break-all leading-6 ${isError ? "text-red-400" : "text-slate-100"}`}
                  >
                    {line}
                  </p>
                );
              })
            )}
          </div>
        </section>

        <footer className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-600">
          <p>
            The Transtractor is an open-source PDF bank statement parser. Follow this project on{" "}
            <a
              href="https://github.com/transtractor/transtractor-lib"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-slate-800 underline underline-offset-2 hover:text-slate-900"
            >
              GitHub
            </a>
            ,{" "}
            <a
              href="https://transtractor-lib.readthedocs.io/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-slate-800 underline underline-offset-2 hover:text-slate-900"
            >
              Read the Docs
            </a>
            , and{" "}
            <a
              href="https://pypi.org/project/transtractor/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-slate-800 underline underline-offset-2 hover:text-slate-900"
            >
              PyPI
            </a>
            . You may self-host the Transtractor from the{" "}
            <a
              href="https://github.com/transtractor/transtractor-web"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-slate-800 underline underline-offset-2 hover:text-slate-900"
            >
              source code
            </a>. Copyright © 2026 Daniel Weber.
          </p>
        </footer>
      </section>
    </main>
  );
}
