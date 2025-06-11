/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domain genérico para hosts sem subdomínios extras
    domains: ["nizldtkfqatrwoeiapaq.supabase.co"],
    // + remotePatterns para exatamente o caminho onde suas imagens vivem
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nizldtkfqatrwoeiapaq.supabase.co",
        port: "",
        // corresponda a tudo sob /storage/v1/object/public/uploads/
        pathname: "/storage/v1/object/public/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
