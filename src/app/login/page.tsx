import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = { title: "Sign in" };
export default function LoginPage() { return <PagePlaceholder eyebrow="Account" title="Sign in" description="Authentication will be connected to Supabase in a later feature." />; }
