import type { Metadata } from "next";
import { MaisPage } from "@/features/pages/mais-page";

export const metadata: Metadata = {
  title: "Mais",
};

export default function MaisRoute() {
  return <MaisPage />;
}
