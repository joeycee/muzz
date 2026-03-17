export function DownloadButton({
  href,
  label = "Download",
}: {
  href: string;
  label?: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-[#7b9a70] px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#93b586]"
    >
      {label}
    </a>
  );
}
