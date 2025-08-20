import React, { useState, useEffect } from "react";
type IconProps = { name: string; version: number; size?: number; fill?: string };
const Icon: React.FC<IconProps> = ({ name, version, size = 16, fill = "#fff" }) => {
  const [svg, setSvg] = useState<string | undefined>();
  useEffect(() => {
    fetch(
      `https://fonts.gstatic.com/s/i/materialiconsoutlined/${name}/v${version}/24px.svg`
    )
      .then((res) => res.text())
      .then((b) => setSvg(b))
      .catch((err) => console.log(err));
  }, [name, version]);
  return (
    <div style={{ display: "grid", placeItems: "center", width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: (svg ?? "") as string }} />
  );
};
export default Icon;
