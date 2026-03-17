export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-16 pb-20">
      <p className="text-sm uppercase tracking-[0.35em] text-[#7b9a70]">About</p>
      <h1 className="font-[family-name:var(--font-heading)] text-5xl text-stone-100 sm:text-6xl">
        About Muzz
      </h1>
      <div className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-8">
        <p className="text-lg leading-8 text-stone-300">
          This is a placeholder about page ready for artist bio, press highlights,
          live credentials, and brand story content.
        </p>
      </div>
    </div>
  );
}
