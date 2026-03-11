"use client";

import dynamic from "next/dynamic";

const OrganisationChartViewer = dynamic(
  () => import("@/components/OrganisationChartViewer"),
  { ssr: false },
);

export default function Page() {
  return <OrganisationChartViewer />;
}
