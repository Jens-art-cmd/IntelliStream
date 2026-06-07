

const nextConfig = {
  transpilePackages: ["@intellistream/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
