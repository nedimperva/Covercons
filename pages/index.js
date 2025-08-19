import React from "react";
import Head from "next/head";
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
  // REF TO CREATE A TAG FOR DOWNLOAD SVG
  const downloadHelper_a_tag = React.useRef();

  // USED TO GET THE WINDOW SIZE
  const [width] = useWindowSize();

  // APPLICATION STATE
  const [svg, setSvg] = React.useState(null);
  const [svg2, setSvg2] = React.useState(null);
  const [bgColor, setBgColor] = React.useState({ hex: "#3A95FF" });
  const [bgMode, setBgMode] = React.useState("solid"); // solid | gradient
  const [bgGradient, setBgGradient] = React.useState({
    from: { hex: "#3A95FF" },
    to: { hex: "#6EE7F9" },
    angle: 45,
  });
  const [coverType, setCoverType] = React.useState("singlemiddleicon");
  const [generatedCoverSvg, setGeneratedCoverSvg] = React.useState("");
  const [sizePreset, setSizePreset] = React.useState("notion");
  const [canvasWidth, setCanvasWidth] = React.useState(1500);
  const [canvasHeight, setCanvasHeight] = React.useState(600);
  const [iconPatternSpacing, setIconPatternSpacing] = React.useState(25);
  const [iconPatternSize, setIconPatternSize] = React.useState(2);
  const [iconPatternRotation, setIconPatternRotation] = React.useState(330);
  const [iconPatternShade, setIconPatternShade] = React.useState(-25);
  const [showAdvancedSettings, setShowAdvancedSettings] = React.useState(false);
  const [selectedIconName, setSelectedIconName] = React.useState("rocket");
  const [selectedIconVersion, setSelectedIconVersion] = React.useState(1);
  const [selectedIconType, setSelectedIconType] =
    React.useState("materialicons");
  const [titleText, setTitleText] = React.useState("");
  const [titleColor, setTitleColor] = React.useState({ hex: "#ffffff" });
  const [titleSize, setTitleSize] = React.useState(64);
  const [titleXAlign, setTitleXAlign] = React.useState("center"); // left|center|right
  const [titleYPosition, setTitleYPosition] = React.useState(300);
  // overlays
  const [noiseEnabled, setNoiseEnabled] = React.useState(false);
  const [noiseOpacity, setNoiseOpacity] = React.useState(0.08);
  const [noiseScale, setNoiseScale] = React.useState(2.5);
  const [shapeEnabled, setShapeEnabled] = React.useState(false);
  const [shapeType, setShapeType] = React.useState("blob"); // blob | circle | stripe
  const [shapeOpacity, setShapeOpacity] = React.useState(0.18);
  const [shapeRotation, setShapeRotation] = React.useState(0);
  const [shapeScale, setShapeScale] = React.useState(1.2);
  const [secondaryIconName, setSecondaryIconName] = React.useState("star");
  const [secondaryIconVersion, setSecondaryIconVersion] = React.useState(1);
  // soft shadow + border + glass
  const [softShadowEnabled, setSoftShadowEnabled] = React.useState(false);
  const [softShadowBlur, setSoftShadowBlur] = React.useState(12);
  const [softShadowOffset, setSoftShadowOffset] = React.useState(8);
  const [borderEnabled, setBorderEnabled] = React.useState(false);
  const [borderWidth, setBorderWidth] = React.useState(8);
  const [borderRadius, setBorderRadius] = React.useState(24);
  const [borderColor, setBorderColor] = React.useState({ hex: "#FFFFFF88" });
  const [glassEnabled, setGlassEnabled] = React.useState(false);
  const [glassOpacity, setGlassOpacity] = React.useState(0.15);
  const [glassRadius, setGlassRadius] = React.useState(24);
  // palette presets
  const [palettePreset, setPalettePreset] = React.useState("custom");

  // STORES COLOR OF ICON FROM BACKGROUND COLOR
  const iconColor = React.useMemo(() => {
    if (tinycolor(bgColor.hex).getBrightness() > 200) {
      var darkColour = shadeColor(bgColor.hex.substring(1), -50);
      return darkColour;
    } else return "#ffffffaf";
  }, [bgColor]);

  // GET THE ICON FROM GOOGLE FONTS AND STORE IT IN SVG STATE
  React.useEffect(() => {
    fetch(
      `https://fonts.gstatic.com/s/i/${selectedIconType}/${selectedIconName}/v${selectedIconVersion}/24px.svg`
    )
      .then((res) => res.text())
      .then((b) => setSvg(b))
      .catch((err) => console.log(err));
  }, [selectedIconName, selectedIconVersion, selectedIconType]);

  // GET SECONDARY ICON (for multi-icon pattern)
  React.useEffect(() => {
    if (!secondaryIconName) return;
    fetch(
      `https://fonts.gstatic.com/s/i/${selectedIconType}/${secondaryIconName}/v${secondaryIconVersion}/24px.svg`
    )
      .then((res) => res.text())
      .then((b) => setSvg2(b))
      .catch((err) => console.log(err));
  }, [secondaryIconName, secondaryIconVersion, selectedIconType]);

  // GENERATE COMPLETE SVG WITH BACKGROUND FROM ICON
  React.useEffect(() => {
    // CLEAN THE FETCHED SVG (MOST OF THE ICON BUGS CAN BE SOLVED HERE)
    const cleanSvgFromRaw = (raw, color) => {
      if (!raw) return '';
      return raw
        .substring(raw.indexOf(">") + 1, raw.length - 6)
        .replaceAll('<rect fill="none" height="24" width="24"/>', "")
        .replaceAll("<path", `<path fill="${color}"`)
        .replaceAll("<rect", `<rect fill="${color}"`)
        .replaceAll("<circle", `<circle fill="${color}"`)
        .replaceAll("<polygon", `<polygon fill="${color}"`)
        .replace(new RegExp(/<(.*?)(fill="none")(.*?)>/), "")
        .replace(
          getRegFromString(
            `/(<(.*?)fill='${color}')(.*?)(fill="none")(.*?)(>)/`
          ),
          ""
        )
        .replaceAll("<g>", "")
        .replaceAll("</g>", "");
    };

    const cleanedSvg = (color) => cleanSvgFromRaw(svg, color);
    const cleanedSvg2 = (color) => cleanSvgFromRaw(svg2 || svg, color);

    const escapeXml = (unsafe) =>
      unsafe
        ? unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
        : "";

    // background layer
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
      const fill = tinycolor(bgColor.hex).lighten(10).setAlpha(shapeOpacity).toRgbString();
      const scale = shapeScale;
      if (shapeType === 'circle') {
        const r = Math.max(canvasWidth, canvasHeight) * 0.35 * scale;
        return `<g transform="translate(${midX}, ${midY}) rotate(${shapeRotation})"><circle cx="0" cy="0" r="${r}" fill="${fill}"/></g>`;
      }
      if (shapeType === 'stripe') {
        const w = canvasWidth * 0.8 * scale;
        const h = canvasHeight * 0.25 * scale;
        const rx = Math.min(w, h) * 0.2;
        return `<g transform="translate(${midX}, ${midY}) rotate(${shapeRotation})"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/></g>`;
      }
      // blob path (simple superellipse-like)
      const w = canvasWidth * 0.9 * scale;
      const h = canvasHeight * 0.6 * scale;
      const p = `M ${-w/2} 0 C ${-w/2} ${-h/2}, ${-w/4} ${-h/2}, 0 ${-h/2} C ${w/2} ${-h/2}, ${w/2} 0, ${w/4} ${h/4} C 0 ${h/2}, ${-w/4} ${h/3}, ${-w/2} 0 Z`;
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

    // compute icon center based on canvas size
    const iconScale = Math.max(1, Math.round(canvasHeight / 60));
    const iconPx = 24 * iconScale;
    const iconX = Math.round((canvasWidth - iconPx) / 2);
    const iconY = Math.round((canvasHeight - iconPx) / 2);

    // FOR COVER TYPE - ICON PATTERN
    if (coverType == "iconpattern" && svg) {
      setGeneratedCoverSvg(
        `<svg version="1.1" 
        baseProfile="full" 
        width="${canvasWidth}" height="${canvasHeight}"
        viewBox="0 0 ${canvasWidth} ${canvasHeight}"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg">
        ${bgLayer()}
        <rect width="100%" height="100%" fill="url(#pattern)"/>
        ${shapeLayer()}
        ${noiseLayer()}
        ${borderLayer()}
        ${glassLayer()}
        <defs>
          <pattern id="pattern" x="0" y="0" width="${iconPatternSpacing}" height="${iconPatternSpacing}" patternTransform="rotate(${iconPatternRotation}) scale(${iconPatternSize})" patternUnits="userSpaceOnUse">
            <g>
              ${cleanedSvg(
                shadeColor(
                  bgColor.hex.substring(1),
                  parseInt(iconPatternShade)
                )
              )}
            </g>
            <g transform="translate(12,12)">
              ${cleanedSvg2(
                shadeColor(
                  bgColor.hex.substring(1),
                  parseInt(iconPatternShade) + 15
                )
              )}
            </g>
          </pattern>
        </defs>
        ${titleLayer()}
      </svg>
      `
      );
    }

    // FOR COVER TYPE - SINGLE MIDDLE ICON
    else if (coverType == "singlemiddleicon" && svg) {
      // GENERATE COVER WITH BACKGROUND IMAGE WITH REPLACED SVG
      setGeneratedCoverSvg(
        `<svg version="1.1"
          baseProfile="full"
          viewBox="0 0 ${canvasWidth} ${canvasHeight}"
          width="${canvasWidth}" height="${canvasHeight}"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg">
          ${bgLayer()}
          ${shapeLayer()}
          ${noiseLayer()}
          ${borderLayer()}
          ${glassLayer()}
          ${softShadowDefs()}
          <g transform="translate(${iconX}, ${iconY}) scale(${iconScale})" id="center_icon"${softShadowEnabled ? ' filter="url(#softshadow)"' : ''}>${cleanedSvg(
            iconColor
          )}</g>
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
  ]);

  // WHEN DOWNLOAD SVG BUTTON IS CLICKED, CREATE A NEW BLOB AND DOWNLOAD IT
  const handleDownloadSvg = () => {
    let blob = new Blob([generatedCoverSvg]);
    downloadHelper_a_tag.current.download = `covercon_${selectedIconName}_${coverType}.svg`;
    downloadHelper_a_tag.current.href = window.URL.createObjectURL(blob);
    downloadHelper_a_tag.current.click();
  };

  // WHEN DOWNLOAD PNG BUTTON IS CLICKED, CREATE A NEW BLOB AND DOWNLOAD IT
  const handleDownloadPng = async () => {
    SVGToImage({
      svg: generatedCoverSvg,
      mimetype: "image/png",
      width: canvasWidth * 2,
      height: canvasHeight * 2,
      quality: 1,
      outputFormat: "blob",
    })
      .then(function (blob) {
        downloadHelper_a_tag.current.download = `covercon_${selectedIconName}_${coverType}_${canvasWidth}x${canvasHeight}.png`;
        downloadHelper_a_tag.current.href = window.URL.createObjectURL(blob);
        downloadHelper_a_tag.current.click();
      })
      .catch(function (err) {
        alert(err);
      });
  };

  // SERVER-SIDE RENDERED DOWNLOAD (PNG/WEBP)
  const handleServerDownload = async (format = 'png') => {
    try {
      const resp = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          svg: generatedCoverSvg,
          width: canvasWidth * 2,
          height: canvasHeight * 2,
          format,
        }),
      });
      if (!resp.ok) throw new Error('Render failed');
      const blob = await resp.blob();
      downloadHelper_a_tag.current.download = `covercon_${selectedIconName}_${coverType}_${canvasWidth}x${canvasHeight}.${format}`;
      downloadHelper_a_tag.current.href = window.URL.createObjectURL(blob);
      downloadHelper_a_tag.current.click();
    } catch (e) {
      alert('Server render failed');
    }
  };

  return (
    <>
      <Head>
        {/* <!-- HTML Meta Tags --> */}
        <title>Covercons</title>
        <meta name="description" content="Generate Beautiful Notion Covers" />
        <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
        <meta name="theme-color" content="#222222" />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://covercons.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Covercons" />
        <meta
          property="og:description"
          content="Generate beautiful cover images for Notion Pages, Blogs, and more"
        />
        <meta property="og:image" content="/og-image.png" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="covercons.vercel.app" />
        <meta property="twitter:url" content="https://covercons.vercel.app/" />
        <meta name="twitter:title" content="Covercons" />
        <meta
          name="twitter:description"
          content="Generate beautiful cover images for Notion Pages, Blogs, and more"
        />
        <meta name="twitter:image" content="/og-image.png" />
      </Head>

      <div className={styles.container}>
        {/* APP MARKUP STARTS FROM HERE */}
        <main className={styles.main}>
          {/* HEADER */}
          <h1 className={styles.title}>
            <img src="/favicon.svg" />
            Covercons
          </h1>

          {/* COVER PREVIEW ON TOP FOR SMALLER DEVICES */}
          {width < 790 && (
            <div className={styles.mobilePreviewBoxWrapper}>
              <div className={styles.mobilePreviewBox}>
                <div
                  className={styles.previewSvg}
                  dangerouslySetInnerHTML={{ __html: generatedCoverSvg }}
                />
              </div>
            </div>
          )}

          <div className={styles.wrapper}>
            {/* SETTINGS PANEL SELECTION */}
            <div className={styles.modifierSettings}>
              {/* STEP 1 : ASK USER TO SEARCH AND SELECT AN ICON */}
              <IconSearch
                setSelectedIconName={setSelectedIconName}
                setSelectedIconVersion={setSelectedIconVersion}
              />
              {/* STEP 2 : ASK USER TO SELECT ICON TYPE (outline/filled/two-shade) */}
              <div className={styles.iconTypeSetting}>
                <h2 htmlFor="icon_name">Select the icon type</h2>
                <select
                  type="text"
                  onChange={(e) => setSelectedIconType(e.target.value)}
                >
                  <option value="materialicons">Filled (default)</option>
                  <option value="materialiconstwotone">Two shade</option>
                  <option value="materialiconsoutlined">Outline</option>
                  <option value="materialiconsround">Rounded</option>
                </select>
              </div>
              {/* NEW: BACKGROUND MODE */}
              <div className={styles.iconTypeSetting}>
                <h2>Background</h2>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <label style={{ color: '#ccc' }}>Palette</label>
                  <select
                    value={palettePreset}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPalettePreset(v);
                      if (v === 'custom') return;
                      const presets = {
                        ocean: { mode: 'gradient', from: '#3A95FF', to: '#6EE7F9', angle: 45 },
                        sunset: { mode: 'gradient', from: '#FF7E5F', to: '#FEB47B', angle: 30 },
                        mint: { mode: 'solid', color: '#10B981' },
                        grape: { mode: 'gradient', from: '#7F00FF', to: '#E100FF', angle: 60 },
                        dark: { mode: 'solid', color: '#1F2937' },
                        light: { mode: 'solid', color: '#E5E7EB' },
                      } as const;
                      const p = (presets as any)[v];
                      if (!p) return;
                      if (p.mode === 'solid') {
                        setBgMode('solid');
                        setBgColor({ hex: p.color });
                      } else {
                        setBgMode('gradient');
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
                </div>
                <select
                  value={bgMode}
                  onChange={(e) => setBgMode(e.target.value)}
                >
                  <option value="solid">Solid color</option>
                  <option value="gradient">Linear gradient</option>
                </select>
                {bgMode === "solid" && (
                  <div className={styles.modifierSettings__colorSelect}>
                    <h2>Select background color</h2>
                    <ChromePicker
                      color={bgColor}
                      onChangeComplete={(color) => setBgColor(color)}
                    />
                    <p className={styles.notionColours}>Notion Colours</p>
                    <CirclePicker
                      color={bgColor}
                      onChangeComplete={(color) => setBgColor(color)}
                      className={styles.circlePicker}
                      colors={[
                        "#9B9A97",
                        "#64473A",
                        "#D9730D",
                        "#DFAB01",
                        "#0F7B6C",
                        "#0B6E99",
                        "#6940A5",
                        "#AD1A72",
                        "#E03E3E",
                      ]}
                    />
                  </div>
                )}
                {bgMode === "gradient" && (
                  <div className={styles.modifierSettings__colorSelect}>
                    <h2>Gradient colors</h2>
                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                      <div>
                        <p style={{ color: "#ccc" }}>From</p>
                        <ChromePicker
                          color={bgGradient.from}
                          onChangeComplete={(color) =>
                            setBgGradient((g) => ({ ...g, from: color }))
                          }
                        />
                      </div>
                      <div>
                        <p style={{ color: "#ccc" }}>To</p>
                        <ChromePicker
                          color={bgGradient.to}
                          onChangeComplete={(color) =>
                            setBgGradient((g) => ({ ...g, to: color }))
                          }
                        />
                      </div>
                    </div>
                    <div className={styles.iconPatternSetting} style={{ marginTop: 10 }}>
                      <h2>Angle</h2>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={bgGradient.angle}
                        onChange={(e) =>
                          setBgGradient((g) => ({ ...g, angle: parseInt(e.target.value) }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* STEP 3 : ASK USER TO SELECT THE COVER DESIGN TYPE */}
              <div className={styles.iconTypeSetting}>
                <h2 htmlFor="icon_name">Select the Cover Design</h2>
                <select
                  type="text"
                  value={coverType}
                  onChange={(e) => {
                    setCoverType(e.target.value);
                    setShowAdvancedSettings(false);
                  }}
                >
                  <option value="singlemiddleicon">Single Icon</option>
                  <option value="iconpattern">Icon Pattern</option>
                </select>

                {/* ADVANCED SETTINGS FOR ICON PATTERN*/}
                <AnimatePresence>
                  {coverType == "iconpattern" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ opacity: 0 }}
                      className={styles.advancedSettingsBtn}
                    >
                      <p>Show Advanced Settings</p>
                      <label className="switch">
                        <input
                          type="checkbox"
                          defaultChecked={showAdvancedSettings}
                          onChange={(e) => {
                            setShowAdvancedSettings(e.target.checked);
                          }}
                        />
                        <span class="slider round"></span>
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {coverType == "iconpattern" && showAdvancedSettings && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.2,
                        },
                      },
                      exit: {
                        opacity: 0,
                      },
                    }}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    {/* STEP 3.1 : SPACING BETWEEN ICONS */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1 },
                      }}
                      className={styles.iconPatternSetting}
                    >
                      <h2>Select Spacing between Icons</h2>
                      <div className={styles.iconPaternSettingDisplayValue}>
                        Spacing: {iconPatternSpacing}{" "}
                        <span
                          className={styles.defaultChanger}
                          onClick={() => setIconPatternSpacing(25)}
                        >
                          {"("}default 25{")"}
                        </span>
                      </div>
                      <input
                        type="range"
                        name="icon_spacing"
                        value={iconPatternSpacing}
                        min="20"
                        max="80"
                        onChange={(e) => setIconPatternSpacing(e.target.value)}
                      ></input>
                    </motion.div>
                    {/* STEP 3.2 : ICON SIZE IN PATTERN */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1 },
                      }}
                      className={styles.iconPatternSetting}
                    >
                      <h2>Select Icons size in Pattern</h2>
                      <div className={styles.iconPaternSettingDisplayValue}>
                        Icon Size: {iconPatternSize}{" "}
                        <span
                          className={styles.defaultChanger}
                          onClick={() => setIconPatternSize(2)}
                        >
                          {"("}default 2{")"}
                        </span>
                      </div>
                      <input
                        type="range"
                        name="icon_size"
                        value={iconPatternSize}
                        min="1"
                        max="30"
                        onChange={(e) => setIconPatternSize(e.target.value)}
                      ></input>
                    </motion.div>
                    {/* STEP 3.3 : PATTERN ROTATION */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1 },
                      }}
                      className={styles.iconPatternSetting}
                    >
                      <h2>Select Rotation in Pattern</h2>
                      <div className={styles.iconPaternSettingDisplayValue}>
                        Rotation : {iconPatternRotation}{" "}
                        <span
                          className={styles.defaultChanger}
                          onClick={() => setIconPatternRotation(330)}
                        >
                          {"("}default 330{")"}
                        </span>
                      </div>
                      <input
                        type="range"
                        name="icon_size"
                        value={iconPatternRotation}
                        min="0"
                        max="360"
                        onChange={(e) => setIconPatternRotation(e.target.value)}
                      ></input>
                    </motion.div>{" "}
                    {/* STEP 3.4 : ICON SHADE IN PATTER (dark / light) */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1 },
                      }}
                      className={styles.iconPatternSetting}
                    >
                      <h2>Select icon shade in Pattern</h2>
                      <select
                        type="text"
                        onChange={(e) => setIconPatternShade(e.target.value)}
                      >
                        <option value={-25}>Dark (default)</option>
                        <option value={28}>Light</option>
                      </select>
                    </motion.div>

                    {/* STEP 3.5 : SECONDARY ICON FOR PATTERN */}
                    <motion.div
                      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                      className={styles.iconPatternSetting}
                    >
                      <h2>Secondary icon (pattern)</h2>
                      <p style={{ color: '#9aa' }}>Optional: used to alternate in the pattern.</p>
                      <IconSearch
                        setSelectedIconName={setSecondaryIconName}
                        setSelectedIconVersion={setSecondaryIconVersion}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* NEW: SIZE PRESETS */}
              <div className={styles.iconTypeSetting}>
                <h2>Size</h2>
                <select
                  value={sizePreset}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSizePreset(v);
                    if (v === "notion") {
                      setCanvasWidth(1500);
                      setCanvasHeight(600);
                    } else if (v === "og") {
                      setCanvasWidth(1200);
                      setCanvasHeight(630);
                    } else if (v === "twitter") {
                      setCanvasWidth(1200);
                      setCanvasHeight(675);
                    } else if (v === "hd") {
                      setCanvasWidth(1920);
                      setCanvasHeight(1080);
                    } else if (v === "square") {
                      setCanvasWidth(1500);
                      setCanvasHeight(1500);
                    }
                  }}
                >
                  <option value="notion">Notion (1500x600)</option>
                  <option value="og">Open Graph (1200x630)</option>
                  <option value="twitter">Twitter (1200x675)</option>
                  <option value="hd">HD (1920x1080)</option>
                  <option value="square">Square (1500x1500)</option>
                  <option value="custom">Custom</option>
                </select>
                {sizePreset === "custom" && (
                  <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "center" }}>
                    <input
                      type="number"
                      value={canvasWidth}
                      min={300}
                      onChange={(e) => setCanvasWidth(parseInt(e.target.value) || 0)}
                      placeholder="Width"
                      style={{ width: 120, padding: 8, borderRadius: 8, border: "none", background: "#082032", color: "#ccc" }}
                    />
                    <input
                      type="number"
                      value={canvasHeight}
                      min={200}
                      onChange={(e) => setCanvasHeight(parseInt(e.target.value) || 0)}
                      placeholder="Height"
                      style={{ width: 120, padding: 8, borderRadius: 8, border: "none", background: "#082032", color: "#ccc" }}
                    />
                  </div>
                )}
              </div>

              {/* NEW: TEXT OVERLAY */}
              <div className={styles.iconTypeSetting}>
                <h2>Title text (optional)</h2>
                <input
                  type="text"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  placeholder="Enter title"
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "none", background: "#082032", color: "#ccc" }}
                />
                <div style={{ display: "flex", gap: 20, marginTop: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ minWidth: 220 }}>
                    <p style={{ color: "#ccc", margin: 0, marginBottom: 6 }}>Text color</p>
                    <ChromePicker
                      color={titleColor}
                      onChangeComplete={(c) => setTitleColor(c)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#ccc", margin: 0 }}>Font size: {titleSize}px</p>
                    <input
                      type="range"
                      min="12"
                      max="160"
                      value={titleSize}
                      onChange={(e) => setTitleSize(parseInt(e.target.value))}
                    />
                    <p style={{ color: "#ccc", margin: 0, marginTop: 10 }}>Y position: {titleYPosition}px</p>
                    <input
                      type="range"
                      min="0"
                      max={canvasHeight}
                      value={titleYPosition}
                      onChange={(e) => setTitleYPosition(parseInt(e.target.value))}
                    />
                    <p style={{ color: "#ccc", margin: 0, marginTop: 10 }}>Alignment</p>
                    <select value={titleXAlign} onChange={(e) => setTitleXAlign(e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* NEW: SHAPE OVERLAY */}
              <div className={styles.iconTypeSetting}>
                <h2>Shape overlay</h2>
                <label style={{ color: '#ccc' }}>
                  <input
                    type="checkbox"
                    checked={shapeEnabled}
                    onChange={(e) => setShapeEnabled(e.target.checked)}
                  />{' '}
                  Enable
                </label>
                {shapeEnabled && (
                  <div className={styles.iconPatternSetting}>
                    <h2>Type</h2>
                    <select value={shapeType} onChange={(e)=>setShapeType(e.target.value)}>
                      <option value="blob">Blob</option>
                      <option value="circle">Circle</option>
                      <option value="stripe">Rounded stripe</option>
                    </select>
                    <h2>Opacity: {Math.round(shapeOpacity*100)}%</h2>
                    <input type="range" min="0" max="1" step="0.01" value={shapeOpacity} onChange={(e)=>setShapeOpacity(parseFloat(e.target.value))} />
                    <h2>Rotation: {shapeRotation}°</h2>
                    <input type="range" min="0" max="360" value={shapeRotation} onChange={(e)=>setShapeRotation(parseInt(e.target.value))} />
                    <h2>Scale: {shapeScale.toFixed(2)}x</h2>
                    <input type="range" min="0.5" max="2" step="0.05" value={shapeScale} onChange={(e)=>setShapeScale(parseFloat(e.target.value))} />
                  </div>
                )}
              </div>

              {/* NEW: NOISE OVERLAY */}
              <div className={styles.iconTypeSetting}>
                <h2>Noise</h2>
                <label style={{ color: '#ccc' }}>
                  <input
                    type="checkbox"
                    checked={noiseEnabled}
                    onChange={(e) => setNoiseEnabled(e.target.checked)}
                  />{' '}
                  Enable
                </label>
                {noiseEnabled && (
                  <div className={styles.iconPatternSetting}>
                    <h2>Opacity: {Math.round(noiseOpacity*100)}%</h2>
                    <input type="range" min="0" max="0.5" step="0.01" value={noiseOpacity} onChange={(e)=>setNoiseOpacity(parseFloat(e.target.value))} />
                    <h2>Scale</h2>
                    <input type="range" min="1" max="10" step="0.5" value={noiseScale} onChange={(e)=>setNoiseScale(parseFloat(e.target.value))} />
                  </div>
                )}
              </div>
            </div>

            {/* COVER PREVIEW IN THE RIGHT SIDE FOR LARGE SCREENS */}
            <div className={styles.coverPreview}>
              <div className={styles.previewBox}>
                <h2>
                  <span className={styles.previewBoxTitle}>
                    🟢 Live Preview
                  </span>
                </h2>
                <div
                  className={styles.previewSvg}
                  dangerouslySetInnerHTML={{ __html: generatedCoverSvg }}
                />
              </div>

              {/* DOWNLOAD BUTTONS FOR COVER IMAGES */}
              <a ref={downloadHelper_a_tag}></a>
              <div className={styles.downloadBtnWraper}>
                <button
                  className={styles.downloadBtn}
                  onClick={handleDownloadSvg}
                >
                  <img
                    src="/assets/notion-logo.svg"
                    alt="download icon"
                    width={20}
                  />
                  Download SVG
                </button>
                <button
                  className={styles.downloadBtn}
                  onClick={handleDownloadPng}
                >
                  <img
                    src="/assets/image-logo.svg"
                    alt="download icon"
                    width={20}
                  />
                  Download PNG
                </button>
                <button
                  className={styles.downloadBtn}
                  onClick={() => handleServerDownload('png')}
                >
                  <img
                    src="/assets/image-logo.svg"
                    alt="download icon"
                    width={20}
                  />
                  Server PNG
                </button>
                <button
                  className={styles.downloadBtn}
                  onClick={() => handleServerDownload('webp')}
                >
                  <img
                    src="/assets/image-logo.svg"
                    alt="download icon"
                    width={20}
                  />
                  WebP
                </button>
              </div>
            </div>
          </div>

          {/* FOOTER AND CREDITS */}
          <footer className={styles.footer}>
            <p>
              Made By <a href="https://srujangurram.me"> Srujan</a>
            </p>
          </footer>
        </main>
      </div>
      {/* BUY ME A COFFEE WIDGET FOR DONATIONS */}
      <script
        data-name="BMC-Widget"
        data-cfasync="false"
        src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
        data-id="srujangurram"
        data-description="Support me on Buy me a coffee!"
        data-message="If you like this tool you can offer me a coffee 😋"
        data-color="#ff4c29"
        data-position="Right"
        data-x_margin="18"
        data-y_margin="18"
      ></script>
    </>
  );
}
