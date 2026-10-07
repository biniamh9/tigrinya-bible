import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = { title: "Bible" };
export default function BiblePage() { return <PagePlaceholder eyebrow="Scripture" title="Bible reader" description="Translation, book, chapter, search, and verse tools will be built here." />; }
