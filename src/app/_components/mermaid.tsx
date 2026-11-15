import React, { useEffect, useRef } from "react";

const DEFAULT_CONFIG = {
  startOnLoad: true,
  theme: "dark",
  logLevel: "fatal",
  securityLevel: "strict",
  arrowMarkerAbsolute: false,
  flowchart: {
    htmlLabels: true,
    curve: "linear",
  },
  sequence: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    mirrorActors: true,
    bottomMarginAdj: 1,
    useMaxWidth: true,
    rightAngles: false,
    showSequenceNumbers: false,
  },
  gantt: {
    titleTopMargin: 25,
    barHeight: 20,
    barGap: 4,
    topPadding: 50,
    leftPadding: 75,
    gridLineStartPadding: 35,
    fontSize: 11,
    fontFamily: '"Open-Sans", "sans-serif"',
    numberSectionStyles: 4,
    axisFormat: "%Y-%m-%d",
  },
};

const Mermaid = ({ chart, config }: { chart: string; config?: any }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    // Loaded on demand so posts without diagrams don't ship the mermaid bundle.
    import("mermaid").then(({ default: mermaid }) => {
      if (cancelled || !ref.current) return;
      mermaid.initialize({ ...DEFAULT_CONFIG, ...config, startOnLoad: false });
      mermaid.run({ nodes: [ref.current] });
    });
    return () => {
      cancelled = true;
    };
  }, [chart, config]);

  if (!chart) return null;
  return (
    <div ref={ref} className="mermaid">
      {chart}
    </div>
  );
};

export default Mermaid;
