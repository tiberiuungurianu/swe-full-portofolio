import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page">
      <section className="section">
        <h1 className="section-heading">page not found</h1>
        <p className="section-intro">
          That route does not exist on this portfolio.
        </p>
        <div className="inline-actions">
          <Link className="button button--primary" href="/">
            back home
          </Link>
          <Link className="button button--ghost" href="/projects">
            browse projects
          </Link>
        </div>
      </section>
    </div>
  );
}
