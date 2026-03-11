"use client";

import { motion } from "framer-motion";
import {
  Network,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import {
  pageNavigationPlugin,
  RenderGoToPageProps,
  RenderNumberOfPagesProps,
} from "@react-pdf-viewer/page-navigation";
import {
  zoomPlugin,
  RenderZoomInProps,
  RenderZoomOutProps,
  ZoomPopoverProps,
} from "@react-pdf-viewer/zoom";
import {
  fullScreenPlugin,
  RenderEnterFullScreenProps,
} from "@react-pdf-viewer/full-screen";
import { printPlugin, RenderPrintProps } from "@react-pdf-viewer/print";
import { getFilePlugin, RenderDownloadProps } from "@react-pdf-viewer/get-file";

// CSS imports
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/full-screen/lib/styles/index.css";
import "@react-pdf-viewer/print/lib/styles/index.css";

const PDF_FILE = "/organisational-chart.pdf";

export default function OrganisationChartPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  /* ── Plugins ── */
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const zoomPluginInstance = zoomPlugin();
  const fullScreenPluginInstance = fullScreenPlugin();
  const printPluginInstance = printPlugin();
  const getFilePluginInstance = getFilePlugin({
    fileNameGenerator: () => "TRITC-Organisation-Chart.pdf",
  });

  const toolbarPluginInstance = toolbarPlugin();

  // Extract render props components with proper typing
  const {
    CurrentPageInput,
    GoToFirstPage,
    GoToLastPage,
    GoToNextPage,
    GoToPreviousPage,
    NumberOfPages,
  } = pageNavigationPluginInstance;

  const {
    ZoomIn: ZoomInBtn,
    ZoomOut: ZoomOutBtn,
    ZoomPopover,
  } = zoomPluginInstance;

  const { EnterFullScreen } = fullScreenPluginInstance;
  const { Print } = printPluginInstance;
  const { Download: DownloadButton } = getFilePluginInstance;

  return (
    <div className="min-h-screen bg-[#f8f7fc] font-body">
      {/* ── Hero Banner ── */}
      <div className="bg-[#1077A6] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#f4c430 1px, transparent 1px), linear-gradient(90deg, #f4c430 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-[#f4c430]/8 to-transparent pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[#f4c430]/5 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-[#f4c430]/15 flex items-center justify-center">
                <Network className="w-3.5 h-3.5 text-[#f4c430]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[.18em] text-[#f4c430]">
                About / Organisation
              </span>
            </div>
            <h1 className="font-display font-bold text-white text-[clamp(26px,4vw,44px)] leading-tight tracking-tight mb-3">
              Organisation Chart
            </h1>
            <div className="w-14 h-[3px] rounded-full bg-[#f4c430] mb-4" />
            <p className="text-white/65 text-[15px] max-w-xl leading-relaxed">
              Official organisational structure of the Tribal Research Institute
              &amp; Training Centre, Government of Sikkim.
            </p>

            {/* Action pills */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <a
                href={PDF_FILE}
                download="TRITC-Organisation-Chart.pdf"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold border border-white/20 text-white/80 hover:bg-[#f4c430] hover:text-[#1a1550] hover:border-[#f4c430] transition-all duration-200"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </a>
              <a
                href={PDF_FILE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold border border-white/20 text-white/80 hover:bg-white/10 transition-all duration-200"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open in New Tab
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── PDF Viewer ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6 flex-wrap gap-4"
        >
          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border"
              style={{ background: "#1077A615", borderColor: "#1077A630" }}
            >
              <Network className="w-5 h-5 text-[#1077A6]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-[#1a1550] text-[20px] leading-tight">
                Official Organisation Chart
              </h2>
              <div
                className="w-8 h-[3px] rounded-full mt-1.5"
                style={{ background: "#f4c430" }}
              />
              <p className="text-[#1a1550]/50 text-[13px] mt-1">
                Tribal Research Institute &amp; Training Centre, Sikkim
              </p>
            </div>
          </div>
        </motion.div>

        {/* PDF Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-2xl border border-[#1077A6]/10 shadow-lg overflow-hidden"
        >
          {/* Custom toolbar bar */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-[#1077A6]/8"
            style={{ background: "#1077A6" }}
          >
            {/* Left: page navigation */}
            <div className="flex items-center gap-1">
              <GoToFirstPage>
                {(props: RenderGoToPageProps) => (
                  <button
                    onClick={props.onClick}
                    disabled={props.isDisabled}
                    className="w-8 h-8 rounded flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                    title="First page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <ChevronLeft className="w-3.5 h-3.5 -ml-2" />
                  </button>
                )}
              </GoToFirstPage>
              <GoToPreviousPage>
                {(props: RenderGoToPageProps) => (
                  <button
                    onClick={props.onClick}
                    disabled={props.isDisabled}
                    className="w-8 h-8 rounded flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
              </GoToPreviousPage>

              <div className="flex items-center gap-1.5 mx-1">
                <CurrentPageInput />
                <span className="text-white/50 text-[12px]">/</span>
                <NumberOfPages>
                  {(props: RenderNumberOfPagesProps) => (
                    <span className="text-white/70 text-[12px] font-medium">
                      {props.numberOfPages}
                    </span>
                  )}
                </NumberOfPages>
              </div>

              <GoToNextPage>
                {(props: RenderGoToPageProps) => (
                  <button
                    onClick={props.onClick}
                    disabled={props.isDisabled}
                    className="w-8 h-8 rounded flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                    title="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </GoToNextPage>
              <GoToLastPage>
                {(props: RenderGoToPageProps) => (
                  <button
                    onClick={props.onClick}
                    disabled={props.isDisabled}
                    className="w-8 h-8 rounded flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                    title="Last page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                    <ChevronRight className="w-3.5 h-3.5 -ml-2" />
                  </button>
                )}
              </GoToLastPage>
            </div>

            {/* Centre: label */}
            <div className="hidden sm:block">
              <span className="text-white/60 text-[12px] font-medium tracking-wide uppercase">
                Organisation Chart — TRITC Sikkim
              </span>
            </div>

            {/* Right: zoom + tools */}
            <div className="flex items-center gap-1">
              <ZoomOutBtn>
                {(props: RenderZoomOutProps) => (
                  <button
                    onClick={props.onClick}
                    className="w-8 h-8 rounded flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white transition-all duration-150"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                )}
              </ZoomOutBtn>

              <ZoomPopover />

              <ZoomInBtn>
                {(props: RenderZoomInProps) => (
                  <button
                    onClick={props.onClick}
                    className="w-8 h-8 rounded flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white transition-all duration-150"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                )}
              </ZoomInBtn>

              <div className="w-px h-5 bg-white/15 mx-1" />

              <EnterFullScreen>
                {(props: RenderEnterFullScreenProps) => (
                  <button
                    onClick={props.onClick}
                    className="w-8 h-8 rounded flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white transition-all duration-150"
                    title="Full screen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </EnterFullScreen>

              <Print>
                {(props: RenderPrintProps) => (
                  <button
                    onClick={props.onClick}
                    className="w-8 h-8 rounded flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white transition-all duration-150"
                    title="Print"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                  </button>
                )}
              </Print>

              <DownloadButton>
                {(props: RenderDownloadProps) => (
                  <button
                    onClick={props.onClick}
                    className="w-8 h-8 rounded flex items-center justify-center text-white/70 hover:bg-[#f4c430] hover:text-[#1a1550] transition-all duration-150"
                    title="Download PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                )}
              </DownloadButton>
            </div>
          </div>

          {/* PDF render area */}
          <div className="w-full" style={{ height: "82vh", minHeight: 520 }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer
                fileUrl={PDF_FILE}
                plugins={[
                  pageNavigationPluginInstance,
                  zoomPluginInstance,
                  fullScreenPluginInstance,
                  printPluginInstance,
                  getFilePluginInstance,
                  toolbarPluginInstance,
                ]}
                defaultScale={SpecialZoomLevel.PageWidth}
                onDocumentLoad={(e) => {
                  setTotalPages(e.doc.numPages);
                  setIsLoaded(true);
                }}
                onPageChange={(e) => setCurrentPage(e.currentPage)}
                renderLoader={(loader: any) => {
                  const percentage = loader?.percentage ?? 0;
                  return (
                    <div className="flex flex-col items-center justify-center h-full gap-4 bg-[#f8f7fc]">
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-[#1077A6]/20" />
                        <div className="absolute inset-0 rounded-full border-4 border-[#1077A6] border-t-transparent animate-spin" />
                      </div>
                      <div className="text-center">
                        <p className="font-display font-bold text-[#1a1550] text-[15px]">
                          Loading Document
                        </p>
                        <p className="text-[#1a1550]/40 text-[13px] mt-1">
                          {Math.round(percentage)}% complete
                        </p>
                      </div>
                      {/* Progress bar */}
                      <div className="w-48 h-1.5 bg-[#1077A6]/15 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1077A6] rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                }}
                renderError={() => (
                  <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: "#1077A610" }}
                    >
                      <Network className="w-6 h-6 text-[#1077A6]" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-[#1a1550] text-[16px] mb-1">
                        Unable to load PDF
                      </p>
                      <p className="text-[#1a1550]/50 text-[13px] leading-relaxed max-w-xs">
                        The document could not be displayed. Please try
                        downloading it directly.
                      </p>
                    </div>
                    <a
                      href={PDF_FILE}
                      download="TRITC-Organisation-Chart.pdf"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all duration-200"
                      style={{ background: "#1077A6" }}
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  </div>
                )}
              />
            </Worker>
          </div>

          {/* Footer bar */}
          <div className="px-5 py-3 border-t border-[#1077A6]/8 flex items-center justify-between bg-[#f8f7fc]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f4c430]" />
              <span className="text-[12px] text-[#1a1550]/50 font-medium">
                Government of Sikkim — Social Welfare Department
              </span>
            </div>
            {isLoaded && (
              <span className="text-[12px] text-[#1077A6] font-semibold">
                {totalPages} page{totalPages !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </motion.div>

        {/* Help note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 flex flex-wrap items-center justify-center gap-6 text-[12px] text-[#1a1550]/40"
        >
          <span className="flex items-center gap-1.5">
            <ZoomIn className="w-3.5 h-3.5" />
            Scroll to zoom
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5" />
            Click fullscreen for best viewing
          </span>
          <span className="flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Download for offline use
          </span>
        </motion.div>
      </div>
    </div>
  );
}
