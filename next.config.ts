import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
      {
        // GIFs da ExerciseDB OSS (hotlink; ver docs/exercisedb-migracao.md)
        protocol: "https",
        hostname: "static.exercisedb.dev",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
