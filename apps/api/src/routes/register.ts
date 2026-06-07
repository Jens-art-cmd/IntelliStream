import type { FastifyPluginAsync } from "fastify";

export default function registerRoutes(app: Parameters<FastifyPluginAsync>[0]) {
  return app;
}
