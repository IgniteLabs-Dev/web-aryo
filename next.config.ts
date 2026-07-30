import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co", // ✅ WILDCARD untuk semua supabase project
        pathname: "/storage/v1/object/**",
      },
      {
        protocol: "https",
        hostname: supabaseUrl.replace(/^https?:\/\//, "").split("/")[0], // exact match
      },
    ],
  },
};

export default nextConfig;
