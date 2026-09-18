const Footer = () => (
  <footer className="border-t border-border px-6 py-10 md:px-12 lg:px-16">
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        OBX — Outcome-Based X
      </p>
      <a
        href="https://www.luisprato.com"
        className="font-sans text-sm text-muted-foreground transition-opacity hover:opacity-60"
      >
        luisprato.com
      </a>
    </div>
  </footer>
);

export default Footer;
