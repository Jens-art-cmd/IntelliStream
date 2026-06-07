import type { Metadata } from "next";

export const metadata: Metadata = { title: "Alerts" };

export default function AlertsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Alerts</h1>
      <p className="text-gray-500 dark:text-gray-400">Der Alert-Manager wird in Kürze freigeschaltet.</p>
    </div>
  );
}
