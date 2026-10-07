import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = { title: "Groups" };
export default function GroupsPage() { return <PagePlaceholder eyebrow="Grow together" title="Private study groups" description="Small groups will study Scripture, answer guided questions, and pray together here." />; }
