import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Os arquivos da landing page já são preparados para a web. Servi-los
  // diretamente mantém o preview local e a publicação privada consistentes.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
