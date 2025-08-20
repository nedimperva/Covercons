"use client";
import React from "react";
import styles from "../styles/Home.module.css";
import tinycolor from "tinycolor2";
import { ChromePicker, CirclePicker } from "react-color";
import { motion, AnimatePresence } from "framer-motion";
import { shadeColor } from "../lib/shadeColor";
import useWindowSize from "../lib/winsizehook";
import { getRegFromString } from "../lib/getRegFromString";
import SVGToImage from "../lib/SVGToImage";
import IconSearch from "../components/IconSearch";

export default function Home() {
  const downloadHelper_a_tag = React.useRef<HTMLAnchorElement | null>(null);
  const [width] = useWindowSize();

  const [svg, setSvg] = React.useState<string | null>(null);
  const [svg2, setSvg2] = React.useState<string | null>(null);
  const [bgColor, setBgColor] = React.useState<{ hex: string }>({ hex: "#3A95FF" });
  const [bgMode, setBgMode] = React.useState<"solid" | "gradient">("solid");
  const [bgGradient, setBgGradient] = React.useState({ from: { hex: "#3A95FF" }, to: { hex: "#6EE7F9" }, angle: 45 });
  const [coverType, setCoverType] = React.useState("singlemiddleicon");
  const [generatedCoverSvg, setGeneratedCoverSvg] = React.useState("");
  const [sizePreset, setSizePreset] = React.useState("notion");
  const [canvasWidth, setCanvasWidth] = React.useState(1500);
  const [canvasHeight, setCanvasHeight] = React.useState(600);
  const [iconPatternSpacing, setIconPatternSpacing] = React.useState<any>(25);
  const [iconPatternSize, setIconPatternSize] = React.useState<any>(2);
  const [iconPatternRotation, setIconPatternRotation] = React.useState<any>(330);
  const [iconPatternShade, setIconPatternShade] = React.useState<any>(-25);
  const [showAdvancedSettings, setShowAdvancedSettings] = React.useState(false);
  const [selectedIconName, setSelectedIconName] = React.useState("rocket");
  const [selectedIconVersion, setSelectedIconVersion] = React.useState(1);
  const [selectedIconType, setSelectedIconType] = React.useState("materialicons");
  const [titleText, setTitleText] = React.useState("");
  const [titleColor, setTitleColor] = React.useState<{ hex: string }>({ hex: "#ffffff" });
  const [titleSize, setTitleSize] = React.useState(64);
  const [titleXAlign, setTitleXAlign] = React.useState<"left" | "center" | "right">("center");
  const [titleYPosition, setTitleYPosition] = React.useState(300);
  const [noiseEnabled, setNoiseEnabled] = React.useState(false);
  const [noiseOpacity, setNoiseOpacity] = React.useState(0.08);
  const [noiseScale, setNoiseScale] = React.useState(2.5);
  const [shapeEnabled, setShapeEnabled] = React.useState(false);
  const [shapeType, setShapeType] = React.useState("blob");
  const [shapeOpacity, setShapeOpacity] = React.useState(0.18);
  const [shapeRotation, setShapeRotation] = React.useState(0);
  const [shapeScale, setShapeScale] = React.useState(1.2);
  const [secondaryIconName, setSecondaryIconName] = React.useState("star");
  const [secondaryIconVersion, setSecondaryIconVersion] = React.useState(1);
  const [softShadowEnabled, setSoftShadowEnabled] = React.useState(false);
  const [softShadowBlur, setSoftShadowBlur] = React.useState(12);
  const [softShadowOffset, setSoftShadowOffset] = React.useState(8);
  const [borderEnabled, setBorderEnabled] = React.useState(false);
  const [borderWidth, setBorderWidth] = React.useState(8);
  const [borderRadius, setBorderRadius] = React.useState(24);
  const [borderColor, setBorderColor] = React.useState<{ hex: string }>({ hex: "#FFFFFF88" });
  const [glassEnabled, setGlassEnabled] = React.useState(false);
  const [glassOpacity, setGlassOpacity] = React.useState(0.15);
  const [glassRadius, setGlassRadius] = React.useState(24);
  const [palettePreset, setPalettePreset] = React.useState("custom");

  const iconColor = React.useMemo(() => {
    if (tinycolor(bgColor.hex).getBrightness() > 200) {
      const darkColour = shadeColor(bgColor.hex.substring(1), -50);
      return darkColour;
    } else return "#ffffffaf";
  }, [bgColor]);

  React.useEffect(() => {
    const run = async () => {
      try {
        if (selectedIconType.startsWith("local:")) {
          const pack = selectedIconType.split(":")[1];
          const res = await fetch(`/api/local-icons/svg?pack=${pack}&name=${encodeURIComponent(selectedIconName)}`);
          const b = await res.text();
          setSvg(b);
        } else {
          const res = await fetch(
            `/api/icon-svg?type=${encodeURIComponent(selectedIconType)}&name=${encodeURIComponent(
              selectedIconName
            )}&version=${selectedIconVersion}&size=24px`
          );
          const b = await res.text();
          setSvg(b);
        }
      } catch (err) {
        console.log(err);
      }
    };
    run();
  }, [selectedIconName, selectedIconVersion, selectedIconType]);

  React.useEffect(() => {
    if (!secondaryIconName) return;
    const run = async () => {
      try {
        if (selectedIconType.startsWith("local:")) {
          const pack = selectedIconType.split(":")[1];
          const res = await fetch(`/api/local-icons/svg?pack=${pack}&name=${encodeURIComponent(secondaryIconName)}`);
          const b = await res.text();
          setSvg2(b);
        } else {
          const res = await fetch(
            `/api/icon-svg?type=${encodeURIComponent(selectedIconType)}&name=${encodeURIComponent(
              secondaryIconName
            )}&version=${secondaryIconVersion}&size=24px`
          );
          const b = await res.text();
          setSvg2(b);
        }
      } catch (err) {
        console.log(err);
      }
    };
    run();
  }, [secondaryIconName, secondaryIconVersion, selectedIconType]);

  React.useEffect(() => {
    const cleanSvgFromRaw = (raw: string | null, color: string) => {
      if (!raw) return "";
      return raw
        .substring(raw.indexOf(">") + 1, raw.length - 6)
        .replaceAll('<rect fill="none" height="24" width="24"/>', "")
        .replaceAll("<path", `<path fill=\"${color}\"`)
        .replaceAll("<rect", `<rect fill=\"${color}\"`)
        .replaceAll("<circle", `<circle fill=\"${color}\"`)
        .replaceAll("<polygon", `<polygon fill=\"${color}\"`)
        .replaceAll(/stroke=\".*?\"/g, `stroke=\\\"${color}\\\"`)
        .replace(new RegExp(/<(.*?)(fill=\"none\")(.*?)>/), "")
        .replace(getRegFromString(`/(<(.*?)fill='${color}')(.*?)(fill=\"none\")(.*?)(>)/`), "")
        .replaceAll("<g>", "")
        .replaceAll("</g>", "");
    };

    const cleanedSvg = (color: string) => cleanSvgFromRaw(svg, color);
    const cleanedSvg2 = (color: string) => cleanSvgFromRaw(svg2 || svg, color);

    const escapeXml = (unsafe: string) =>
      unsafe
        ? unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
        : "";

    const bgLayer = () => {
      if (bgMode === "gradient") {
        return `
        <defs>
          <linearGradient id=\"bggrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\" gradientTransform=\"rotate(${bgGradient.angle})\">
            <stop offset=\"0%\" stop-color=\"${bgGradient.from.hex}\" />
            <stop offset=\"100%\" stop-color=\"${bgGradient.to.hex}\" />
          </linearGradient>
        </defs>
        <rect width=\"100%\" height=\"100%\" fill=\"url(#bggrad)\"/>
        `;
      }
      return `<rect width=\"100%\" height=\"100%\" fill=\"${bgColor.hex}\"/>`;
    };

    const noiseLayer = () => {
      if (!noiseEnabled) return "";
      return `
        <defs>
          <filter id=\"noisefx\">
            <feTurbulence type=\"fractalNoise\" baseFrequency=\"${noiseScale / 100}\" numOctaves=\"2\" stitchTiles=\"stitch\"/>
            <feColorMatrix type=\"saturate\" values=\"0\"/>
            <feComponentTransfer>
              <feFuncA type=\"linear\" slope=\"${noiseOpacity}\"/>
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width=\"100%\" height=\"100%\" filter=\"url(#noisefx)\" opacity=\"1\" />
      `;
    };

    const softShadowDefs = () => {
      if (!softShadowEnabled) return "";
      return `
        <defs>
          <filter id=\"softshadow\" x=\"-50%\" y=\"-50%\" width=\"200%\" height=\"200%\">\n            <feDropShadow dx=\"${softShadowOffset}\" dy=\"${softShadowOffset}\" stdDeviation=\"${softShadowBlur}\" flood-color=\"#000000\" flood-opacity=\"0.35\" />\n          </filter>
        </defs>
      `;
    };

    const borderLayer = () => {
      if (!borderEnabled) return "";
      return `<rect x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" rx=\"${borderRadius}\" ry=\"${borderRadius}\" fill=\"none\" stroke=\"${borderColor.hex}\" stroke-width=\"${borderWidth}\" />`;
    };

    const glassLayer = () => {
      if (!glassEnabled) return "";
      const gx = canvasWidth * 0.1;
      const gy = canvasHeight * 0.2;
      const gw = canvasWidth * 0.8;
      const gh = canvasHeight * 0.6;
      return `<rect x=\"${gx}\" y=\"${gy}\" width=\"${gw}\" height=\"${gh}\" rx=\"${glassRadius}\" ry=\"${glassRadius}\" fill=\"rgba(255,255,255,${glassOpacity})\" />`;
    };

    const shapeLayer = () => {
      if (!shapeEnabled) return "";
      const midX = canvasWidth / 2;
      const midY = canvasHeight / 2;
      const fill = tinycolor(bgColor.hex).lighten(10).setAlpha(shapeOpacity).toRgbString();
      const scale = shapeScale;
      if (shapeType === "circle") {
        const r = Math.max(canvasWidth, canvasHeight) * 0.35 * scale;
        return `<g transform=\"translate(${midX}, ${midY}) rotate(${shapeRotation})\"><circle cx=\"0\" cy=\"0\" r=\"${r}\" fill=\"${fill}\"/></g>`;
      }
      if (shapeType === "stripe") {
        const w = canvasWidth * 0.8 * scale;
        const h = canvasHeight * 0.25 * scale;
        const rx = Math.min(w, h) * 0.2;
        return `<g transform=\"translate(${midX}, ${midY}) rotate(${shapeRotation})\"><rect x=\"${-w / 2}\" y=\"${-h / 2}\" width=\"${w}\" height=\"${h}\" rx=\"${rx}\" fill=\"${fill}\"/></g>`;
      }
      const w = canvasWidth * 0.9 * scale;
      const h = canvasHeight * 0.6 * scale;
      const p = `M ${-w / 2} 0 C ${-w / 2} ${-h / 2}, ${-w / 4} ${-h / 2}, 0 ${-h / 2} C ${w / 2} ${-h / 2}, ${w / 2} 0, ${w / 4} ${h / 4} C 0 ${h / 2}, ${-w / 4} ${h / 3}, ${-w / 2} 0 Z`;
      return `<g transform=\"translate(${midX}, ${midY}) rotate(${shapeRotation})\"><path d=\"${p}\" fill=\"${fill}\"/></g>`;
    };

    const titleLayer = () => {
      if (!titleText) return "";
      const anchor = titleXAlign === "center" ? "middle" : titleXAlign === "left" ? "start" : "end";
      const x = titleXAlign === "center" ? canvasWidth / 2 : titleXAlign === "left" ? canvasWidth * 0.1 : canvasWidth * 0.9;
      return `
        <text x=\"${x}\" y=\"${titleYPosition}\" fill=\"${titleColor.hex}\" font-size=\"${titleSize}\"
          font-family=\"Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif\"
          text-anchor=\"${anchor}\" dominant-baseline=\"middle\">${escapeXml(titleText)}</text>
      `;
    };

    const iconScale = Math.max(1, Math.round(canvasHeight / 60));
    const iconPx = 24 * iconScale;
    const iconX = Math.round((canvasWidth - iconPx) / 2);
    const iconY = Math.round((canvasHeight - iconPx) / 2);

    if (coverType == "iconpattern" && svg) {
      setGeneratedCoverSvg(
        `<svg version=\"1.1\"
        baseProfile=\"full\" 
        width=\"${canvasWidth}\" height=\"${canvasHeight}\"\n        viewBox=\"0 0 ${canvasWidth} ${canvasHeight}\"\n        preserveAspectRatio=\"xMidYMid meet\"\n        xmlns=\"http://www.w3.org/2000/svg\">\n        ${bgLayer()}\n        <rect width=\"100%\" height=\"100%\" fill=\"url(#pattern)\"/>\n        ${shapeLayer()}\n        ${noiseLayer()}\n        ${borderLayer()}\n        ${glassLayer()}\n        <defs>\n          <pattern id=\"pattern\" x=\"0\" y=\"0\" width=\"${iconPatternSpacing}\" height=\"${iconPatternSpacing}\" patternTransform=\"rotate(${iconPatternRotation}) scale(${iconPatternSize})\" patternUnits=\"userSpaceOnUse\">\n            <g>\n              ${cleanedSvg(shadeColor(bgColor.hex.substring(1), parseInt(iconPatternShade)))}\n            </g>\n            <g transform=\"translate(12,12)\">\n              ${cleanedSvg2(shadeColor(bgColor.hex.substring(1), parseInt(iconPatternShade) + 15))}\n            </g>\n          </pattern>\n        </defs>\n        ${titleLayer()}\n      </svg>\n      `
      );
    } else if (coverType == "singlemiddleicon" && svg) {
      setGeneratedCoverSvg(
        `<svg version=\"1.1\"\n          baseProfile=\"full\"\n          viewBox=\"0 0 ${canvasWidth} ${canvasHeight}\"\n          width=\"${canvasWidth}\" height=\"${canvasHeight}\"\n          preserveAspectRatio=\"xMidYMid meet\"\n          xmlns=\"http://www.w3.org/2000/svg\">\n          ${bgLayer()}\n          ${shapeLayer()}\n          ${noiseLayer()}\n          ${borderLayer()}\n          ${glassLayer()}\n          ${softShadowDefs()}\n          <g transform=\"translate(${iconX}, ${iconY}) scale(${iconScale})\" id=\"center_icon\"${softShadowEnabled ? ' filter=\"url(#softshadow)\"' : ''}>${cleanedSvg(iconColor)}</g>\n          ${titleLayer()}\n         </svg>`
      );
    }
  }, [
    bgColor,
    bgMode,
    bgGradient,
    iconColor,
    coverType,
    svg,
    iconPatternSpacing,
    iconPatternSize,
    iconPatternRotation,
    iconPatternShade,
    canvasWidth,
    canvasHeight,
    titleText,
    titleColor,
    titleSize,
    titleXAlign,
    titleYPosition,
    noiseEnabled,
    noiseOpacity,
    noiseScale,
    shapeEnabled,
    shapeType,
    shapeOpacity,
    shapeRotation,
    shapeScale,
    softShadowEnabled,
    softShadowBlur,
    softShadowOffset,
    borderEnabled,
    borderWidth,
    borderRadius,
    borderColor,
    glassEnabled,
    glassOpacity,
    glassRadius,
  ]);

  const handleDownloadSvg = () => {
    const blob = new Blob([generatedCoverSvg]);
    if (!downloadHelper_a_tag.current) return;
    downloadHelper_a_tag.current.download = `covercon_${selectedIconName}_${coverType}.svg`;
    downloadHelper_a_tag.current.href = window.URL.createObjectURL(blob);
    downloadHelper_a_tag.current.click();
  };

  const handleDownloadPng = async () => {
    SVGToImage({
      svg: generatedCoverSvg as any,
      mimetype: "image/png",
      width: canvasWidth * 2,
      height: canvasHeight * 2,
      quality: 1,
      outputFormat: "blob",
    })
      .then(function (blob: any) {
        if (!downloadHelper_a_tag.current) return;
        downloadHelper_a_tag.current.download = `covercon_${selectedIconName}_${coverType}_${canvasWidth}x${canvasHeight}.png`;
        downloadHelper_a_tag.current.href = window.URL.createObjectURL(blob);
        downloadHelper_a_tag.current.click();
      })
      .catch(function (err) {
        alert(String(err));
      });
  };

  const handleServerDownload = async (format: "png" | "webp" | "jpeg" = "png") => {
    try {
      const resp = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ svg: generatedCoverSvg, width: canvasWidth * 2, height: canvasHeight * 2, format }),
      });
      if (!resp.ok) throw new Error("Render failed");
      const blob = await resp.blob();
      if (!downloadHelper_a_tag.current) return;
      downloadHelper_a_tag.current.download = `covercon_${selectedIconName}_${coverType}_${canvasWidth}x${canvasHeight}.${format}`;
      downloadHelper_a_tag.current.href = window.URL.createObjectURL(blob);
      downloadHelper_a_tag.current.click();
    } catch (e) {
      alert("Server render failed");
    }
  };

  return (
    <div>
      <a ref={downloadHelper_a_tag} style={{ display: "none" }} />
      <main className={styles.main}>
        <h1 className={styles.title}>
          <img src="/favicon.svg" /> Covercons
        </h1>
        <div className={styles.wrapper}>
          <div className={styles.modifierSettings}>
            <div className={styles.iconTypeSetting}>
              <h2>Icon Selection</h2>
              <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center", marginBottom: "var(--space-sm)" }}>
                <label style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Icon set</label>
                <select value={selectedIconType} onChange={(e) => setSelectedIconType(e.target.value)}>
                  <option value="materialicons">Material (Google)</option>
                  <option value="materialiconsoutlined">Material Outlined (Google)</option>
                  <option value="local:lucide">Local: Lucide (offline)</option>
                </select>
              </div>
              <IconSearch
                setSelectedIconName={setSelectedIconName}
                setSelectedIconVersion={setSelectedIconVersion}
                pack={selectedIconType.startsWith("local:") ? "lucide" : "google"}
              />
            </div>

            <div className={styles.iconTypeSetting}>
              <h2>Background</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm)", alignItems: "center", marginBottom: "var(--space-sm)" }}>
                <label style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Palette</label>
                <select
                  value={palettePreset}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPalettePreset(v);
                    if (v === "custom") return;
                    const presets: any = {
                      ocean: { mode: "gradient", from: "#3A95FF", to: "#6EE7F9", angle: 45 },
                      sunset: { mode: "gradient", from: "#FF7E5F", to: "#FEB47B", angle: 30 },
                      mint: { mode: "solid", color: "#10B981" },
                      grape: { mode: "gradient", from: "#7F00FF", to: "#E100FF", angle: 60 },
                      dark: { mode: "solid", color: "#1F2937" },
                      light: { mode: "solid", color: "#E5E7EB" },
                    };
                    const p = presets[v];
                    if (!p) return;
                    if (p.mode === "solid") {
                      setBgMode("solid");
                      setBgColor({ hex: p.color });
                    } else {
                      setBgMode("gradient");
                      setBgGradient({ from: { hex: p.from }, to: { hex: p.to }, angle: p.angle });
                    }
                  }}
                >
                  <option value="custom">Custom</option>
                  <option value="ocean">Ocean</option>
                  <option value="sunset">Sunset</option>
                  <option value="mint">Mint</option>
                  <option value="grape">Grape</option>
                  <option value="dark">Mono Dark</option>
                  <option value="light">Mono Light</option>
                </select>
                <label style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Type</label>
              <select value={bgMode} onChange={(e) => setBgMode(e.target.value as any)}>
                <option value="solid">Solid color</option>
                <option value="gradient">Linear gradient</option>
              </select>
              </div>
              {bgMode === "solid" && (
                <div className={styles.modifierSettings__colorSelect}>
                  <h2>Select background color</h2>
                  <ChromePicker color={bgColor as any} onChangeComplete={(color: any) => setBgColor(color)} />
                  <p className={styles.notionColours}>Notion Colours</p>
                  <CirclePicker
                    color={bgColor as any}
                    onChangeComplete={(color: any) => setBgColor(color)}
                    className={styles.circlePicker}
                    colors={["#9B9A97", "#64473A", "#D9730D", "#DFAB01", "#0F7B6C", "#0B6E99", "#6940A5", "#AD1A72", "#E03E3E"]}
                  />
                </div>
              )}
              {bgMode === "gradient" && (
                <div className={styles.modifierSettings__colorSelect}>
                  <h2>Gradient colors</h2>
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    <div>
                      <p style={{ color: "#ccc" }}>From</p>
                      <ChromePicker color={bgGradient.from as any} onChangeComplete={(color: any) => setBgGradient((g) => ({ ...g, from: color }))} />
                    </div>
                    <div>
                      <p style={{ color: "#ccc" }}>To</p>
                      <ChromePicker color={bgGradient.to as any} onChangeComplete={(color: any) => setBgGradient((g) => ({ ...g, to: color }))} />
                    </div>
                  </div>
                  <div className={styles.iconPatternSetting} style={{ marginTop: 10 }}>
                    <h2>Angle</h2>
                    <input type="range" min="0" max="360" value={bgGradient.angle} onChange={(e) => setBgGradient((g) => ({ ...g, angle: parseInt(e.target.value) }))} />
                  </div>
                </div>
              )}
            </div>

            <div className={styles.iconTypeSetting}>
              <h2>Cover Design & Size</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm)", alignItems: "center", marginBottom: "var(--space-sm)" }}>
                <label style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Type</label>
              <select value={coverType} onChange={(e) => { setCoverType(e.target.value); setShowAdvancedSettings(false); }}>
                <option value="singlemiddleicon">Single Icon</option>
                <option value="iconpattern">Icon Pattern</option>
              </select>
                <label style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Size</label>
                <select
                  value={sizePreset}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSizePreset(v);
                    if (v === "notion") { setCanvasWidth(1500); setCanvasHeight(600); }
                    else if (v === "og") { setCanvasWidth(1200); setCanvasHeight(630); }
                    else if (v === "twitter") { setCanvasWidth(1200); setCanvasHeight(675); }
                    else if (v === "hd") { setCanvasWidth(1920); setCanvasHeight(1080); }
                    else if (v === "square") { setCanvasWidth(1500); setCanvasHeight(1500); }
                  }}
                >
                  <option value="notion">Notion (1500x600)</option>
                  <option value="og">Open Graph (1200x630)</option>
                  <option value="twitter">Twitter (1200x675)</option>
                  <option value="hd">HD (1920x1080)</option>
                  <option value="square">Square (1500x1500)</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              {sizePreset === "custom" && (
                <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "center" }}>
                  <input type="number" value={canvasWidth} min={300} onChange={(e) => setCanvasWidth(parseInt(e.target.value) || 0)} placeholder="Width" style={{ width: 120, padding: "var(--space-sm)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-primary)" }} />
                  <input type="number" value={canvasHeight} min={200} onChange={(e) => setCanvasHeight(parseInt(e.target.value) || 0)} placeholder="Height" style={{ width: 120, padding: "var(--space-sm)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-primary)" }} />
                </div>
              )}
              <AnimatePresence>
                {coverType == "iconpattern" && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }} className={styles.advancedSettingsBtn}>
                    <p>Show Advanced Settings</p>
                    <label className="switch">
                      <input type="checkbox" defaultChecked={showAdvancedSettings} onChange={(e) => { setShowAdvancedSettings(e.target.checked); }} />
                      <span className="slider round"></span>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {coverType == "iconpattern" && showAdvancedSettings && (
                <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.2 } }, exit: { opacity: 0 } }} initial="hidden" animate="show" exit="exit">
                  <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className={styles.iconPatternSetting}>
                    <h2>Select Spacing between Icons</h2>
                    <div className={styles.iconPaternSettingDisplayValue}>
                      Spacing: {iconPatternSpacing}
                      <span className={styles.defaultChanger} onClick={() => setIconPatternSpacing(25)}>{"("}default 25{")"}</span>
                    </div>
                    <input type="range" name="icon_spacing" value={iconPatternSpacing} min="20" max="80" onChange={(e) => setIconPatternSpacing(e.target.value)} />
                  </motion.div>

                  <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className={styles.iconPatternSetting}>
                    <h2>Select Icons size in Pattern</h2>
                    <div className={styles.iconPaternSettingDisplayValue}>
                      Icon Size: {iconPatternSize} <span className={styles.defaultChanger} onClick={() => setIconPatternSize(2)}>{"("}default 2{")"}</span>
                    </div>
                    <input type="range" name="icon_size" value={iconPatternSize} min="1" max="30" onChange={(e) => setIconPatternSize(e.target.value)} />
                  </motion.div>

                  <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className={styles.iconPatternSetting}>
                    <h2>Select Rotation in Pattern</h2>
                    <div className={styles.iconPaternSettingDisplayValue}>
                      Rotation : {iconPatternRotation}
                      <span className={styles.defaultChanger} onClick={() => setIconPatternRotation(330)}>{"("}default 330{")"}</span>
                    </div>
                    <input type="range" name="icon_size" value={iconPatternRotation} min="0" max="360" onChange={(e) => setIconPatternRotation(e.target.value)} />
                  </motion.div>

                  <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className={styles.iconPatternSetting}>
                    <h2>Select icon shade in Pattern</h2>
                    <select onChange={(e) => setIconPatternShade(e.target.value)}>
                      <option value={-25}>Dark (default)</option>
                      <option value={28}>Light</option>
                    </select>
                  </motion.div>

                  <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className={styles.iconPatternSetting}>
                    <h2>Secondary icon (pattern)</h2>
                    <p style={{ color: "#9aa" }}>Optional: used to alternate in the pattern.</p>
                    <IconSearch
                      setSelectedIconName={setSecondaryIconName}
                      setSelectedIconVersion={setSecondaryIconVersion}
                      pack={selectedIconType.startsWith("local:") ? "lucide" : "google"}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>



            <div className={styles.iconTypeSetting}>
              <h2>Title Text (Optional)</h2>
              <input type="text" value={titleText} onChange={(e) => setTitleText(e.target.value)} placeholder="Enter title" style={{ width: "100%", padding: "var(--space-sm)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-primary)", marginBottom: "var(--space-md)" }} />
              {titleText && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-lg)", alignItems: "start" }}>
                  <div>
                    <p style={{ color: "var(--text-secondary)", margin: 0, marginBottom: "var(--space-sm)", fontSize: "0.875rem" }}>Text color</p>
                  <ChromePicker color={titleColor as any} onChangeComplete={(c: any) => setTitleColor(c)} />
                </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                    <div>
                      <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>Font size: {titleSize}px</p>
                  <input type="range" min="12" max="160" value={titleSize} onChange={(e) => setTitleSize(parseInt(e.target.value))} />
                    </div>
                    <div>
                      <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>Y position: {titleYPosition}px</p>
                  <input type="range" min="0" max={canvasHeight} value={titleYPosition} onChange={(e) => setTitleYPosition(parseInt(e.target.value))} />
                    </div>
                    <div>
                      <p style={{ color: "var(--text-secondary)", margin: 0, marginBottom: "var(--space-xs)", fontSize: "0.875rem" }}>Alignment</p>
                  <select value={titleXAlign} onChange={(e) => setTitleXAlign(e.target.value as any)}>
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
              </div>
              )}
            </div>

            <div className={styles.iconTypeSetting}>
              <h2>Effects & Overlays</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
                <label style={{ color: "var(--text-secondary)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                  <input type="checkbox" checked={shapeEnabled} onChange={(e) => setShapeEnabled(e.target.checked)} /> Shape overlay
                </label>
                <label style={{ color: "var(--text-secondary)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                  <input type="checkbox" checked={noiseEnabled} onChange={(e) => setNoiseEnabled(e.target.checked)} /> Noise texture
                </label>
                <label style={{ color: "var(--text-secondary)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                  <input type="checkbox" checked={softShadowEnabled} onChange={(e) => setSoftShadowEnabled(e.target.checked)} /> Soft shadow
                </label>
                <label style={{ color: "var(--text-secondary)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                  <input type="checkbox" checked={borderEnabled} onChange={(e) => setBorderEnabled(e.target.checked)} /> Border
                </label>
                <label style={{ color: "var(--text-secondary)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                  <input type="checkbox" checked={glassEnabled} onChange={(e) => setGlassEnabled(e.target.checked)} /> Glass panel
              </label>
              </div>
              {shapeEnabled && (
                <div className={styles.iconPatternSetting}>
                  <h2>Type</h2>
                  <select value={shapeType} onChange={(e) => setShapeType(e.target.value)}>
                    <option value="blob">Blob</option>
                    <option value="circle">Circle</option>
                    <option value="stripe">Rounded stripe</option>
                  </select>
                  <h2>Opacity: {Math.round(shapeOpacity * 100)}%</h2>
                  <input type="range" min="0" max="1" step="0.01" value={shapeOpacity} onChange={(e) => setShapeOpacity(parseFloat(e.target.value))} />
                  <h2>Rotation: {shapeRotation}°</h2>
                  <input type="range" min="0" max="360" value={shapeRotation} onChange={(e) => setShapeRotation(parseInt(e.target.value))} />
                  <h2>Scale: {shapeScale.toFixed(2)}x</h2>
                  <input type="range" min="0.5" max="2" step="0.05" value={shapeScale} onChange={(e) => setShapeScale(parseFloat(e.target.value))} />
                </div>
              )}
            </div>

              {noiseEnabled && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", padding: "var(--space-md)", background: "var(--accent-bg)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-sm)" }}>
                  <div>
                    <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>Noise Opacity: {Math.round(noiseOpacity * 100)}%</p>
                  <input type="range" min="0" max="0.5" step="0.01" value={noiseOpacity} onChange={(e) => setNoiseOpacity(parseFloat(e.target.value))} />
                  </div>
                  <div>
                    <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>Noise Scale: {noiseScale}</p>
                  <input type="range" min="1" max="10" step="0.5" value={noiseScale} onChange={(e) => setNoiseScale(parseFloat(e.target.value))} />
                  </div>
                </div>
              )}
              {softShadowEnabled && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", padding: "var(--space-md)", background: "var(--accent-bg)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-sm)" }}>
                  <div>
                    <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>Shadow Blur: {softShadowBlur}px</p>
                    <input type="range" min="0" max="30" value={softShadowBlur} onChange={(e) => setSoftShadowBlur(parseInt(e.target.value))} />
            </div>
                <div>
                    <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>Shadow Offset: {softShadowOffset}px</p>
                      <input type="range" min="0" max="30" value={softShadowOffset} onChange={(e) => setSoftShadowOffset(parseInt(e.target.value))} />
                    </div>
                </div>
              )}
              {borderEnabled && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-md)", padding: "var(--space-md)", background: "var(--accent-bg)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-sm)" }}>
                <div>
                    <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>Width: {borderWidth}px</p>
                      <input type="range" min="1" max="40" value={borderWidth} onChange={(e) => setBorderWidth(parseInt(e.target.value))} />
                  </div>
                  <div>
                    <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>Radius: {borderRadius}px</p>
                      <input type="range" min="0" max="120" value={borderRadius} onChange={(e) => setBorderRadius(parseInt(e.target.value))} />
                  </div>
                  <div>
                    <p style={{ color: "var(--text-secondary)", margin: 0, marginBottom: "var(--space-xs)", fontSize: "0.875rem" }}>Color</p>
                      <ChromePicker color={borderColor as any} onChangeComplete={(c: any) => setBorderColor(c)} />
                    </div>
                </div>
              )}
              {glassEnabled && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", padding: "var(--space-md)", background: "var(--accent-bg)", borderRadius: "var(--radius-md)" }}>
                <div>
                    <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>Opacity: {Math.round(glassOpacity * 100)}%</p>
                      <input type="range" min="0" max="0.6" step="0.01" value={glassOpacity} onChange={(e) => setGlassOpacity(parseFloat(e.target.value))} />
                  </div>
                  <div>
                    <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>Radius: {glassRadius}px</p>
                      <input type="range" min="0" max="120" value={glassRadius} onChange={(e) => setGlassRadius(parseInt(e.target.value))} />
                    </div>
                </div>
              )}
            </div>

          <div className={styles.previewSection}>
            <h2>Preview</h2>
            <div className={styles.previewBoxWrapper}>
              <div className={styles.previewBox}>
                <div className={styles.previewSvg} dangerouslySetInnerHTML={{ __html: generatedCoverSvg }} />
              </div>
            </div>
          </div>

          <div className={styles.actionsSection}>
            <h2>Download</h2>
            <div className={styles.downloadBtnWraper}>
              <button className={styles.downloadBtn} onClick={handleDownloadSvg}>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap'}}>
                  <img src="/assets/svg.svg" alt="download icon" width={20} /> Download SVG
                </span>
              </button>
              <button className={styles.downloadBtn} onClick={handleDownloadPng}>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap'}}>
                  <img src="/assets/image-logo.svg" alt="download icon" width={20} /> PNG
                </span>
              </button>
              <button className={styles.downloadBtn} onClick={() => handleServerDownload("png")}>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap'}}>
                  <img src="/assets/image-logo.svg" alt="download icon" width={20} /> Server PNG
                </span>
              </button>
              <button className={styles.downloadBtn} onClick={() => handleServerDownload("webp")}>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap'}}>
                  <img src="/assets/image-logo.svg" alt="download icon" width={20} /> WebP
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
