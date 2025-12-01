import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
let supabaseHostname: string | undefined

if (supabaseUrl) {
  try {
    supabaseHostname = new URL(supabaseUrl).hostname
  } catch {
    supabaseHostname = undefined
  }
}

const remotePatterns: NextConfig["images"]["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "via.placeholder.com",
  },
  {
    protocol: "https",
    hostname: "www.canva.com",
  },
  {
    protocol: "https",
    hostname: "images.pexels.com",
  },
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
]

if (supabaseHostname) {
  remotePatterns.push({
    protocol: "https",
    hostname: supabaseHostname,
  })
}

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns,
  },
};

export default nextConfig;
