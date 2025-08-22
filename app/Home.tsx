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
  const [_width] = useWindowSize();

  const [svg, setSvg] = React.useState<string | null>(null);
  const [svg2, setSvg2] = React.useState<string | null>(null);
  const [bgColor, setBgColor] = React.useState<{ hex: string }>({ hex: "#4f8bf9" });
  const [bgMode, setBgMode] = React.useState<"solid" | "gradient">("solid");
  const [bgGradient, setBgGradient] = React.useState({ from: { hex: "#4f8bf9" }, to: { hex: "#5d94ff" }, angle: 45 });
  const [coverType, setCoverType] = React.useState("singlemiddleicon");
 const [generatedCoverSvg, setGeneratedCoverSvg] = React.useState("");
  const [sizePreset, setSizePreset] = React.useState("notion");
  const [canvasWidth, setCanvasWidth] = React.useState(1500);
  const [canvasHeight, setCanvasHeight] = React.useState(600);
  const [iconPatternSpacing, setIconPatternSpacing] = React.useState<number>(25);
  const [iconPatternSize, setIconPatternSize] = React.useState<number>(2);
  const [iconPatternRotation, setIconPatternRotation] = React.useState<number>(330);
  const [iconPatternShade, setIconPatternShade] = React.useState<number>(-25);
  const [selectedIconName, setSelectedIconName] = React.useState("rocket");
  const [selectedIconVersion, setSelectedIconVersion] = React.useState(1);
  const [selectedIconType, setSelectedIconType] = React.useState("materialicons");
 const [titleText, setTitleText] = React.useState("");
  const [titleColor, setTitleColor] = React.useState<{ hex: string }>({ hex: "#ffffff" });
  const [titleSize, setTitleSize] = React.useState(48);
  const [titleXAlign, setTitleXAlign] = React.useState<"left" | "center" | "right">("center");
  const [titleYPosition, setTitleYPosition] = React.useState(300);
  const [noiseEnabled, setNoiseEnabled] = React.useState(false);
  const [noiseOpacity, setNoiseOpacity] = React.useState(0.05);
  const [noiseScale, setNoiseScale] = React.useState(2);
  const [shapeEnabled, setShapeEnabled] = React.useState(false);
  const [shapeType, setShapeType] = React.useState("blob");
  const [shapeOpacity, setShapeOpacity] = React.useState(0.1);
  const [shapeRotation, setShapeRotation] = React.useState(0);
  const [shapeScale, setShapeScale] = React.useState(1);
  const [secondaryIconName, setSecondaryIconName] = React.useState("star");
  const [secondaryIconVersion, setSecondaryIconVersion] = React.useState(1);
  const [softShadowEnabled, setSoftShadowEnabled] = React.useState(false);
  const [softShadowBlur, setSoftShadowBlur] = React.useState(8);
  const [softShadowOffset, setSoftShadowOffset] = React.useState(4);
  const [borderEnabled, setBorderEnabled] = React.useState(false);
  const [borderWidth, setBorderWidth] = React.useState(2);
  const [borderRadius, setBorderRadius] = React.useState(8);
  const [borderColor, setBorderColor] = React.useState<{ hex: string }>({ hex: "#FFFFFF44" });
  const [glassEnabled, setGlassEnabled] = React.useState(false);
  const [glassOpacity, setGlassOpacity] = React.useState(0.1);
  const [glassRadius, setGlassRadius] = React.useState(8);
  const [palettePreset, setPalettePreset] = React.useState("custom");
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(['icon', 'background']));

  const iconColor = React.useMemo(() => {
    if (bgColor.hex && tinycolor(bgColor.hex).getBrightness() > 200) {
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
        .replaceAll("<path", `<path fill="${color}"`)
        .replaceAll("<rect", `<rect fill="${color}"`)
        .replaceAll("<circle", `<circle fill="${color}"`)
        .replaceAll("<polygon", `<polygon fill="${color}"`)
        .replaceAll(/stroke=".*?"/g, `stroke="${color}"`)
        .replace(new RegExp(/<(.*?)(fill="none")(.*?)>/), "")
        .replace(getRegFromString(`/(<(.*?)fill='${color}')(.*?)(fill="none")(.*?)(>)/`), "")
        .replaceAll("<g>", "")
        .replaceAll("</g>", "");
    };

    const cleanedSvg = (color: string) => cleanSvgFromRaw(svg, color);
    const cleanedSvg2 = (color: string) => cleanSvgFromRaw(svg2 || svg, color);

    const escapeXml = (unsafe: string) => {
      if (!unsafe) return "";
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    };

    const bgLayer = () => {
      if (bgMode === "gradient") {
        return `
        <defs>
          <linearGradient id="bggrad" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(${bgGradient.angle})">
            <stop offset="0%" stop-color="${bgGradient.from.hex}" />
            <stop offset="100%" stop-color="${bgGradient.to.hex}" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bggrad)"/>
        `;
      }
      return `<rect width="100%" height="100%" fill="${bgColor.hex}"/>`;
    };

    const noiseLayer = () => {
      if (!noiseEnabled) return "";
      return `
        <defs>
          <filter id="noisefx">
            <feTurbulence type="fractalNoise" baseFrequency="${noiseScale / 100}" numOctaves="2" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="${noiseOpacity}"/>
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#noisefx)" opacity="1" />
      `;
    };

    const softShadowDefs = () => {
      if (!softShadowEnabled) return "";
      return `
        <defs>
          <filter id="softshadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="${softShadowOffset}" dy="${softShadowOffset}" stdDeviation="${softShadowBlur}" flood-color="#000000" flood-opacity="0.35" />
          </filter>
        </defs>
      `;
    };

    const borderLayer = () => {
      if (!borderEnabled) return "";
      return `<rect x="0" y="0" width="100%" height="100%" rx="${borderRadius}" ry="${borderRadius}" fill="none" stroke="${borderColor.hex}" stroke-width="${borderWidth}" />`;
    };

    const glassLayer = () => {
      if (!glassEnabled) return "";
      const gx = canvasWidth * 0.1;
      const gy = canvasHeight * 0.2;
      const gw = canvasWidth * 0.8;
      const gh = canvasHeight * 0.6;
      return `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" rx="${glassRadius}" ry="${glassRadius}" fill="rgba(255,255,255,${glassOpacity})" />`;
    };

    const shapeLayer = () => {
      if (!shapeEnabled) return "";
      const midX = canvasWidth / 2;
      const midY = canvasHeight / 2;
      const fill = tinycolor(bgColor.hex || "#000000").lighten(10).setAlpha(shapeOpacity).toRgbString();
      const scale = shapeScale;
      if (shapeType === "circle") {
        const r = Math.max(canvasWidth, canvasHeight) * 0.35 * scale;
        return `<g transform="translate(${midX}, ${midY}) rotate(${shapeRotation})"><circle cx="0" cy="0" r="${r}" fill="${fill}"/></g>`;
      }
      if (shapeType === "stripe") {
        const w = canvasWidth * 0.8 * scale;
        const h = canvasHeight * 0.25 * scale;
        const rx = Math.min(w, h) * 0.2;
        return `<g transform="translate(${midX}, ${midY}) rotate(${shapeRotation})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/></g>`;
      }
      const w = canvasWidth * 0.9 * scale;
      const h = canvasHeight * 0.6 * scale;
      const p = `M ${-w / 2} 0 C ${-w / 2} ${-h / 2}, ${-w / 4} ${-h / 2}, 0 ${-h / 2} C ${w / 2} ${-h / 2}, ${w / 2} 0, ${w / 4} ${h / 4} C 0 ${h / 2}, ${-w / 4} ${h / 3}, ${-w / 2} 0 Z`;
      return `<g transform="translate(${midX}, ${midY}) rotate(${shapeRotation})"><path d="${p}" fill="${fill}"/></g>`;
    };

    const titleLayer = () => {
      if (!titleText) return "";
      const anchor = titleXAlign === "center" ? "middle" : titleXAlign === "left" ? "start" : "end";
      const x = titleXAlign === "center" ? canvasWidth / 2 : titleXAlign === "left" ? canvasWidth * 0.1 : canvasWidth * 0.9;
      return `
        <text x="${x}" y="${titleYPosition}" fill="${titleColor.hex}" font-size="${titleSize}"
          font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
          text-anchor="${anchor}" dominant-baseline="middle">${escapeXml(titleText)}</text>
      `;
    };

    const iconScale = Math.max(1, Math.round(canvasHeight / 60));
    const iconPx = 24 * iconScale;
    const iconX = Math.round((canvasWidth - iconPx) / 2);
    const iconY = Math.round((canvasHeight - iconPx) / 2);

    if (coverType == "iconpattern" && svg) {
      setGeneratedCoverSvg(
        `<svg version="1.1"
        baseProfile="full"
        width="${canvasWidth.toString()}" height="${canvasHeight.toString()}"
        viewBox="0 0 ${canvasWidth.toString()} ${canvasHeight.toString()}"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg">
        ${bgLayer()}
        <rect width="100%" height="100%" fill="url(#pattern)"/>
        ${shapeLayer()}
        ${noiseLayer()}
        ${borderLayer()}
        ${glassLayer()}
        <defs>
          <pattern id="pattern" x="0" y="0" width="${iconPatternSpacing.toString()}" height="${iconPatternSpacing.toString()}" patternTransform="rotate(${iconPatternRotation.toString()}) scale(${iconPatternSize.toString()})" patternUnits="userSpaceOnUse">
            <g transform="translate(${(iconPatternSpacing / 2).toString()}, ${(iconPatternSpacing / 2).toString()})">
              <g transform="scale(1) translate(-12, -12)">
                ${cleanedSvg(shadeColor(bgColor.hex.substring(1), iconPatternShade))}
              </g>
            </g>
          </pattern>
        </defs>
        ${titleLayer()}
      </svg>
      `
      );
    } else if (coverType == "singlemiddleicon" && svg) {
      setGeneratedCoverSvg(
        `<svg version="1.1"
          baseProfile="full"
          viewBox="0 0 ${canvasWidth.toString()} ${canvasHeight.toString()}"
          width="${canvasWidth.toString()}" height="${canvasHeight.toString()}"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg">
          ${bgLayer()}
          ${shapeLayer()}
          ${noiseLayer()}
          ${borderLayer()}
          ${glassLayer()}
          ${softShadowDefs()}
          <g transform="translate(${iconX.toString()}, ${iconY.toString()}) scale(${iconScale.toString()})" id="center_icon"${softShadowEnabled ? ' filter="url(#softshadow)"' : ''}>${cleanedSvg(iconColor)}</g>
          ${titleLayer()}
         </svg>`
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
    svg2,
  ]);

  const handleDownloadSvg = () => {
    const blob = new Blob([generatedCoverSvg]);
    if (!downloadHelper_a_tag.current) return;
    downloadHelper_a_tag.current.download = `covercon_${selectedIconName}_${coverType}.svg`;
    downloadHelper_a_tag.current.href = URL.createObjectURL(blob);
    downloadHelper_a_tag.current.click();
  };

  const handleDownloadPng = () => {
    SVGToImage({
      svg: generatedCoverSvg as string,
      mimetype: "image/png",
      width: canvasWidth * 2,
      height: canvasHeight * 2,
      quality: 1,
      outputFormat: "blob",
    })
      .then(function (blob: Blob) {
        if (!downloadHelper_a_tag.current) return;
        downloadHelper_a_tag.current.download = `covercon_${selectedIconName}_${coverType}_${canvasWidth}x${canvasHeight}.png`;
        downloadHelper_a_tag.current.href = URL.createObjectURL(blob);
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
      downloadHelper_a_tag.current.href = URL.createObjectURL(blob);
      downloadHelper_a_tag.current.click();
    } catch (_e) {
      alert("Server render failed");
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const SectionHeader = ({ title, id }: { title: string; id: string }) => (
    <div 
      className={styles.sectionHeader} 
      onClick={() => toggleSection(id)}
    >
      <div className={styles.sectionTitle}>
        <h3>{title}</h3>
      </div>
      <motion.span 
        className={styles.chevron}
        animate={{ rotate: expandedSections.has(id) ? 180 : 0 }}
        transition={{ duration: 0.1 }}
      >
        ▼
      </motion.span>
    </div>
  );

  const SliderControl = ({ 
    label, 
    value, 
    onChange, 
    min = 0, 
    max = 100, 
    step = 1,
    unit = "",
    onReset,
    resetValue
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    onReset?: () => void;
    resetValue?: number;
  }) => (
    <div className={styles.sliderControl}>
      <div className={styles.sliderLabel}>
        <span>{label}: {value}{unit}</span>
        {onReset && (
          <button 
            className={styles.resetBtn} 
            onClick={onReset}
            title={`Reset to ${resetValue}${unit}`}
          >
            ↺
          </button>
        )}
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className={styles.slider}
      />
    </div>
  );

  const ToggleControl = ({ 
    label, 
    enabled, 
    onChange
  }: {
    label: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
  }) => (
    <div className={styles.toggleControl}>
      <div className={styles.toggleLabel}>
        <span>{label}</span>
      </div>
      <label className={styles.switch}>
        <input 
          type="checkbox" 
          checked={enabled} 
          onChange={(e) => onChange(e.target.checked)} 
        />
        <span className={styles.slider}></span>
      </label>
    </div>
  );

  return (
    <div className={styles.container}>
      <a ref={downloadHelper_a_tag} style={{ display: "none" }} />
      
      <div className={styles.appLayout}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
          <div className={styles.sidebarHeader}>
            <button 
              className={styles.collapseBtn}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? '▶' : '◀'}
            </button>
            {!sidebarCollapsed && <span className={styles.sidebarTitle}>Design Controls</span>}
          </div>

          <div className={styles.sidebarContent}>
                        {/* Icon Section */}
            <div className={styles.section}>
              <SectionHeader title="Icon" id="icon" />
              <AnimatePresence>
                {expandedSections.has('icon') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className={styles.sectionContent}
                  >
                    <div className={styles.formGroup}>
                      <label>Icon Set</label>
                      <select 
                        value={selectedIconType} 
                        onChange={(e) => setSelectedIconType(e.target.value)}
                        className={styles.select}
                      >
                        <option value="materialicons">Material Icons</option>
                        <option value="materialiconsoutlined">Material Outlined</option>
                        <option value="local:lucide">Lucide (Local)</option>
                      </select>
                    </div>
                    
                    <div className={styles.iconSearchWrapper}>
                      <IconSearch
                        setSelectedIconName={setSelectedIconName}
                        setSelectedIconVersion={setSelectedIconVersion}
                        pack={selectedIconType.startsWith("local:") ? "lucide" : "google"}
                      />
                    </div>
                    
                    {/* Pattern Settings - Only shown when icon pattern is selected */}
                    {coverType === "iconpattern" && (
                      <div className={styles.patternSettings}>
                        <h4>Pattern Settings</h4>
                        <SliderControl
                          label="Spacing"
                          value={iconPatternSpacing}
                          onChange={setIconPatternSpacing}
                          min={20}
                          max={80}
                          onReset={() => setIconPatternSpacing(25)}
                          resetValue={25}
                        />
                        <SliderControl
                          label="Size"
                          value={iconPatternSize}
                          onChange={setIconPatternSize}
                          min={1}
                          max={30}
                          onReset={() => setIconPatternSize(2)}
                          resetValue={2}
                        />
                        <SliderControl
                          label="Rotation"
                          value={iconPatternRotation}
                          onChange={setIconPatternRotation}
                          min={0}
                          max={360}
                          unit="°"
                          onReset={() => setIconPatternRotation(330)}
                          resetValue={330}
                        />
                        <div className={styles.formGroup}>
                          <label>Icon Shade</label>
                          <select 
                            value={iconPatternShade}
                            onChange={(e) => setIconPatternShade(Number(e.target.value))}
                            className={styles.select}
                          >
                            <option value={-25}>Dark</option>
                            <option value={28}>Light</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Background Section */}
            <div className={styles.section}>
              <SectionHeader title="Background" id="background" />
              <AnimatePresence>
                {expandedSections.has('background') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className={styles.sectionContent}
                  >
                    <div className={styles.formGroup}>
                      <label>Preset</label>
                      <select
                        value={palettePreset}
                        onChange={(e) => {
                          const v = e.target.value;
                          setPalettePreset(v);
                          if (v === "custom") return;
                          const presets: Record<string, any> = {
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
                        className={styles.select}
                      >
                        <option value="custom">Custom</option>
                        <option value="ocean">Ocean</option>
                        <option value="sunset">Sunset</option>
                        <option value="mint">Mint</option>
                        <option value="grape">Grape</option>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Type</label>
                      <select 
                        value={bgMode} 
                        onChange={(e) => setBgMode(e.target.value as any)}
                        className={styles.select}
                      >
                        <option value="solid">Solid Color</option>
                        <option value="gradient">Gradient</option>
                      </select>
                    </div>

                    {bgMode === "solid" && (
                      <div className={styles.colorSection}>
                        <label>Background Color</label>
                        <div className={styles.colorPicker}>
                          <ChromePicker 
                            color={bgColor} 
                            onChangeComplete={(color) => setBgColor(color)} 
                          />
                        </div>
                        <div className={styles.quickColors}>
                          <label>Quick Colors</label>
                          <CirclePicker
                            color={bgColor}
                            onChangeComplete={(color) => setBgColor(color)}
                            colors={["#4f8bf9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#ec4899", "#64748b"]}
                          />
                        </div>
                      </div>
                    )}

                    {bgMode === "gradient" && (
                      <div className={styles.gradientSection}>
                        <div className={styles.gradientColors}>
                          <div className={styles.gradientColor}>
                            <label>From</label>
                            <ChromePicker 
                              color={bgGradient.from} 
                              onChangeComplete={(color) => setBgGradient((g) => ({ ...g, from: color }))} 
                            />
                          </div>
                          <div className={styles.gradientColor}>
                            <label>To</label>
                            <ChromePicker 
                              color={bgGradient.to} 
                              onChangeComplete={(color) => setBgGradient((g) => ({ ...g, to: color }))} 
                            />
                          </div>
                        </div>
                        <SliderControl
                          label="Angle"
                          value={bgGradient.angle}
                          onChange={(angle) => setBgGradient((g) => ({ ...g, angle }))}
                          min={0}
                          max={360}
                          unit="°"
                          onReset={() => setBgGradient((g) => ({ ...g, angle: 45 }))}
                          resetValue={45}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

                        {/* Pattern settings have been moved to the right panel */}
      </div>
        </aside>

                {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.previewLayout}>
            {/* Preview */}
            <div className={styles.previewWrapper}>
              <div className={styles.previewContainer}>
                <div className={styles.previewBox}>
                  <div className={styles.previewSvg} dangerouslySetInnerHTML={{ __html: generatedCoverSvg }} />
                </div>
                <div className={styles.previewInfo}>
                  <span className={styles.dimensions}>{canvasWidth} × {canvasHeight}</span>
                  <span className={styles.iconName}>{selectedIconName}</span>
                </div>
              </div>

              {/* Export Actions */}
              <div className={styles.exportActions}>
                <button className={styles.exportBtn} onClick={handleDownloadSvg}>
                  <span className={styles.exportIcon}>🎨</span>
                  <span>SVG</span>
                </button>
                <button className={styles.exportBtn} onClick={handleDownloadPng}>
                  <span className={styles.exportIcon}>🖼️</span>
                  <span>PNG</span>
                </button>
                <button className={styles.exportBtn} onClick={() => handleServerDownload("png")}>
                  <span className={styles.exportIcon}>⚡</span>
                  <span>HQ PNG</span>
                </button>
                <button className={styles.exportBtn} onClick={() => handleServerDownload("webp")}>
                  <span className={styles.exportIcon}>🌟</span>
                  <span>WebP</span>
                </button>
              </div>
            </div>

            {/* Right Controls Panel */}
            <div className={styles.quickControls}>
              <div className={styles.quickControlsHeader}>
                <h3>Controls</h3>
              </div>

              {/* Size & Type */}
              <div className={styles.quickSection}>
                <h4>Size & Type</h4>
                <div className={styles.formGroup}>
                  <label>Cover Type</label>
                  <select 
                    value={coverType} 
                    onChange={(e) => setCoverType(e.target.value)}
                    className={styles.select}
                  >
                    <option value="singlemiddleicon">Single Icon</option>
                    <option value="iconpattern">Icon Pattern</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Size Preset</label>
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
                    className={styles.select}
                  >
                    <option value="notion">Notion (1500×600)</option>
                    <option value="og">Open Graph (1200×630)</option>
                    <option value="twitter">Twitter (1200×675)</option>
                    <option value="hd">HD (1920×1080)</option>
                    <option value="square">Square (1500×1500)</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {sizePreset === "custom" && (
                  <div className={styles.customSize}>
                    <div className={styles.sizeInputs}>
                      <div className={styles.formGroup}>
                        <label>Width</label>
                        <input 
                          type="number" 
                          value={canvasWidth} 
                          min={300} 
                          onChange={(e) => setCanvasWidth(parseInt(e.target.value) || 0)} 
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Height</label>
                        <input 
                          type="number" 
                          value={canvasHeight} 
                          min={200} 
                          onChange={(e) => setCanvasHeight(parseInt(e.target.value) || 0)} 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pattern Settings - Only shown when icon pattern is selected */}
              {coverType === "iconpattern" && (
                <div className={styles.quickSection}>
                  <h4>Pattern Settings</h4>
                  <SliderControl
                    label="Spacing"
                    value={iconPatternSpacing}
                    onChange={setIconPatternSpacing}
                    min={20}
                    max={80}
                    onReset={() => setIconPatternSpacing(25)}
                    resetValue={25}
                  />
                  <SliderControl
                    label="Size"
                    value={iconPatternSize}
                    onChange={setIconPatternSize}
                    min={1}
                    max={30}
                    onReset={() => setIconPatternSize(2)}
                    resetValue={2}
                  />
                  <SliderControl
                    label="Rotation"
                    value={iconPatternRotation}
                    onChange={setIconPatternRotation}
                    min={0}
                    max={360}
                    unit="°"
                    onReset={() => setIconPatternRotation(330)}
                    resetValue={330}
                  />
                  <div className={styles.formGroup}>
                    <label>Icon Shade</label>
                    <select 
                      value={iconPatternShade}
                      onChange={(e) => setIconPatternShade(Number(e.target.value))}
                      className={styles.select}
                    >
                      <option value={-25}>Dark</option>
                      <option value={28}>Light</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Text Section */}

              {/* Text Section */}
              <div className={styles.quickSection}>
                <h4>Text</h4>
                <div className={styles.formGroup}>
                  <label>Title Text</label>
                  <input 
                    type="text" 
                    value={titleText} 
                    onChange={(e) => setTitleText(e.target.value)} 
                    placeholder="Enter your title"
                    className={styles.textInput}
                  />
                </div>

                {titleText && (
                  <div className={styles.textSettings}>
                    <div className={styles.formGroup}>
                      <label>Text Color</label>
                      <div className={styles.colorPicker}>
                        <ChromePicker 
                          color={titleColor} 
                          onChangeComplete={(c) => setTitleColor(c)} 
                        />
                      </div>
                    </div>

                    <SliderControl
                      label="Font Size"
                      value={titleSize}
                      onChange={setTitleSize}
                      min={12}
                      max={160}
                      unit="px"
                      onReset={() => setTitleSize(48)}
                      resetValue={48}
                    />

                    <SliderControl
                      label="Y Position"
                      value={titleYPosition}
                      onChange={setTitleYPosition}
                      min={0}
                      max={canvasHeight}
                      unit="px"
                      onReset={() => setTitleYPosition(300)}
                      resetValue={300}
                    />

                    <div className={styles.formGroup}>
                      <label>Alignment</label>
                      <select 
                        value={titleXAlign} 
                        onChange={(e) => setTitleXAlign(e.target.value as any)}
                        className={styles.select}
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Effects Section */}
              <div className={styles.quickSection}>
                <h4>Effects</h4>
                <div className={styles.effectsGrid}>
                  {/* Shape Overlay */}
                  <div className={styles.effectCard}>
                    <ToggleControl 
                      label="Shape Overlay" 
                      enabled={shapeEnabled} 
                      onChange={setShapeEnabled}
                    />
                    {shapeEnabled && (
                      <div className={styles.effectControls}>
                        <div className={styles.formGroup}>
                          <label>Shape Type</label>
                          <select 
                            value={shapeType} 
                            onChange={(e) => setShapeType(e.target.value)}
                            className={styles.select}
                          >
                            <option value="blob">Blob</option>
                            <option value="circle">Circle</option>
                            <option value="stripe">Stripe</option>
                          </select>
                        </div>
                        <SliderControl
                          label="Opacity"
                          value={Math.round(shapeOpacity * 100)}
                          onChange={(value) => setShapeOpacity(value / 100)}
                          min={0}
                          max={100}
                          unit="%"
                        />
                        <SliderControl
                          label="Rotation"
                          value={shapeRotation}
                          onChange={setShapeRotation}
                          min={0}
                          max={360}
                          unit="°"
                        />
                        <SliderControl
                          label="Scale"
                          value={Math.round(shapeScale * 100)}
                          onChange={(value) => setShapeScale(value / 100)}
                          min={50}
                          max={200}
                          unit="%"
                        />
                      </div>
                    )}
                  </div>

                  {/* Noise Texture */}
                  <div className={styles.effectCard}>
                    <ToggleControl 
                      label="Noise Texture" 
                      enabled={noiseEnabled} 
                      onChange={setNoiseEnabled}
                    />
                    {noiseEnabled && (
                      <div className={styles.effectControls}>
                        <SliderControl
                          label="Opacity"
                          value={Math.round(noiseOpacity * 100)}
                          onChange={(value) => setNoiseOpacity(value / 100)}
                          min={0}
                          max={50}
                          unit="%"
                        />
                        <SliderControl
                          label="Scale"
                          value={noiseScale}
                          onChange={setNoiseScale}
                          min={1}
                          max={10}
                          step={0.5}
                        />
                      </div>
                    )}
                  </div>

                  {/* Soft Shadow */}
                  <div className={styles.effectCard}>
                    <ToggleControl 
                      label="Soft Shadow" 
                      enabled={softShadowEnabled} 
                      onChange={setSoftShadowEnabled}
                    />
                    {softShadowEnabled && (
                      <div className={styles.effectControls}>
                        <SliderControl
                          label="Blur"
                          value={softShadowBlur}
                          onChange={setSoftShadowBlur}
                          min={0}
                          max={30}
                          unit="px"
                        />
                        <SliderControl
                          label="Offset"
                          value={softShadowOffset}
                          onChange={setSoftShadowOffset}
                          min={0}
                          max={30}
                          unit="px"
                        />
                      </div>
                    )}
                  </div>

                  {/* Border */}
                  <div className={styles.effectCard}>
                    <ToggleControl 
                      label="Border" 
                      enabled={borderEnabled} 
                      onChange={setBorderEnabled}
                    />
                    {borderEnabled && (
                      <div className={styles.effectControls}>
                        <SliderControl
                          label="Width"
                          value={borderWidth}
                          onChange={setBorderWidth}
                          min={1}
                          max={40}
                          unit="px"
                        />
                        <SliderControl
                          label="Radius"
                          value={borderRadius}
                          onChange={setBorderRadius}
                          min={0}
                          max={120}
                          unit="px"
                        />
                        <div className={styles.formGroup}>
                          <label>Border Color</label>
                          <div className={styles.colorPicker}>
                            <ChromePicker 
                              color={borderColor} 
                              onChangeComplete={(c) => setBorderColor(c)} 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Glass Panel */}
                  <div className={styles.effectCard}>
                    <ToggleControl 
                      label="Glass Panel" 
                      enabled={glassEnabled} 
                      onChange={setGlassEnabled}
                    />
                    {glassEnabled && (
                      <div className={styles.effectControls}>
                        <SliderControl
                          label="Opacity"
                          value={Math.round(glassOpacity * 100)}
                          onChange={(value) => setGlassOpacity(value / 100)}
                          min={0}
                          max={60}
                          unit="%"
                        />
                        <SliderControl
                          label="Radius"
                          value={glassRadius}
                          onChange={setGlassRadius}
                          min={0}
                          max={120}
                          unit="px"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}