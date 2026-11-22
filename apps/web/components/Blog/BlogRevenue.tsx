import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";

function httpsUrl(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export function BlogAdvertisement() {
  const name = process.env.BLOG_SPONSOR_NAME?.trim();
  const website = httpsUrl(process.env.BLOG_SPONSOR_URL);
  if (!name || !website) return null;

  return (
    <aside aria-label="Advertisement" className="rounded-xl border border-border bg-card px-5 py-5">
      <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground">Advertisement</p>
      <a href={website} rel="sponsored" className="field-action-link">
        {name} <ArrowUpRight size={15} aria-hidden />
      </a>
    </aside>
  );
}

export function BlogSupport() {
  const supportUrl = httpsUrl(process.env.READER_SUPPORT_URL);

  return (
    <aside aria-label="Support Doing Utah Daily" className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <Heart size={20} className="text-canyon" aria-hidden />
      <h2 className="mt-3 font-display text-3xl">Support local stories</h2>
      <p className="mb-4 mt-2 text-sm leading-relaxed text-muted-foreground">
        Help us keep these Utah guides free for families.
      </p>
      {supportUrl && <a className="field-action-link mb-3" href={supportUrl}>
        Support our work <ArrowUpRight size={15} aria-hidden />
      </a>}
      <Link href="/contact" className="field-action-link block">Partner with us</Link>
    </aside>
  );
}
