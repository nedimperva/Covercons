// next.config.js
module.exports = {
  images: {
    domains: ["fonts.gstatic.com"],
  },
  experimental: {
    serverComponentsExternalPackages: ["@resvg/resvg-js", "sharp"],
  },
};
