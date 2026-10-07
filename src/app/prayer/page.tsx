import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = { title: "Prayer" };
export default function PrayerPage() { return <PagePlaceholder eyebrow="Prayer" title="Pray for one another" description="Private group prayer requests and the “I prayed” interaction will live here." />; }
