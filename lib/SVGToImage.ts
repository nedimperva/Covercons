export type SvgToImageSettings = {
  svg: SVGElement | string | null;
  mimetype?: string;
  quality?: number;
  width?: number | "auto";
  height?: number | "auto";
  outputFormat?: "base64" | "blob";
};

export default function SVGToImage(settings: SvgToImageSettings) {
  let _settings = {
    svg: null,
    // Usually all SVG have transparency, so PNG is the way to go by default
    mimetype: "image/png",
    quality: 0.92,
    width: "auto",
    height: "auto",
    outputFormat: "base64",
  };

  // Override default settings
  for (const key in settings) {
    // @ts-ignore - dynamic override of default settings
    _settings[key] = (settings as any)[key];
  }

  return new Promise(function (resolve, reject) {
    let svgNode;

    // Create SVG Node if a plain string has been provided
    if (typeof _settings.svg == "string") {
      // Create a non-visible node to render the SVG string
      let SVGContainer = document.createElement("div");
      SVGContainer.style.display = "none";
      SVGContainer.innerHTML = _settings.svg;
      svgNode = SVGContainer.firstElementChild;
    } else {
      svgNode = _settings.svg;
    }

    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d")!;

    let svgXml = new XMLSerializer().serializeToString(svgNode);
    let svgBase64 = "data:image/svg+xml;base64," + btoa(svgXml);

    const image = new Image();

    image.onload = () => {
      let finalWidth: number = 0, finalHeight: number = 0;

      // Calculate width if set to auto and the height is specified (to preserve aspect ratio)
      if (_settings.width === "auto" && _settings.height !== "auto") {
        finalWidth = ((image as HTMLImageElement).width / (image as HTMLImageElement).height) * (Number(_settings.height) as number);
      // Use image original width
      } else if (_settings.width === "auto") {
        finalWidth = (image as HTMLImageElement).naturalWidth;
        // Use custom width
      } else {
        finalWidth = Number(_settings.width);
      }

      // Calculate height if set to auto and the width is specified (to preserve aspect ratio)
      if (_settings.height === "auto" && _settings.width !== "auto") {
        finalHeight = ((image as HTMLImageElement).height / (image as HTMLImageElement).width) * (Number(_settings.width) as number);
      // Use image original height
      } else if (_settings.height === "auto") {
        finalHeight = (image as HTMLImageElement).naturalHeight;
        // Use custom height
      } else {
        finalHeight = Number(_settings.height);
      }

      // Define the canvas intrinsic size
      canvas.width = finalWidth;
      canvas.height = finalHeight;

      // Render image in the canvas
      context.drawImage(image as HTMLImageElement, 0, 0, finalWidth, finalHeight);

      if (_settings.outputFormat == "blob") {
        // Fullfil and Return the Blob image
        canvas.toBlob(
          function (blob) {
            resolve(blob as any);
          },
          _settings.mimetype,
          _settings.quality
        );
      } else {
        // Fullfil and Return the Base64 image
        resolve(canvas.toDataURL(_settings.mimetype, _settings.quality) as any);
      }
    };

    // Load the SVG in Base64 to the image
    image.src = svgBase64;
  });
}
