import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <section className="hero-bg">
      <div className="wrap relative z-10 flex min-h-[60vh] flex-col items-start justify-center gap-6 py-24">
        <span className="eyebrow">Error 404</span>
        <h1 className="h-display">This page took a <span className="text-accent">wrong turn.</span></h1>
        <p className="lead">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">Back to home <Icon name="arrow" /></Link>
          <Link href="/projects" className="btn btn-ghost">See projects</Link>
        </div>
      </div>
    </section>
  );
}
