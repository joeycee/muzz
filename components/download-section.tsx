import Image from "next/image";

import { DownloadButton } from "@/components/download-button";
import { getMediaUrl } from "@/lib/api";
import { DownloadableTrack } from "@/lib/types";

export function DownloadSection({ tracks }: { tracks: DownloadableTrack[] }) {
  if (tracks.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5 rounded-[1.75rem] border border-[#31402c] bg-[#0f110f] p-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-[#7b9a70]">
          Your downloads
        </p>
        <h2 className="font-[family-name:var(--font-heading)] text-3xl text-stone-100">
          Download your music
        </h2>
      </div>

      <div className="space-y-4">
        {tracks.map((track) => {
          const artworkUrl = getMediaUrl(track.artwork);

          return (
            <article
              key={track.id}
              className="flex flex-col gap-4 rounded-[1.4rem] border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#111813,#1a2016)]">
                  {artworkUrl ? (
                    <Image
                      src={artworkUrl}
                      alt={track.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-2 text-center text-xs uppercase tracking-[0.14em] text-stone-300">
                      {track.product_name}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#7b9a70]">
                    {track.product_name}
                  </p>
                  <h3 className="text-lg text-stone-100">
                    {track.track_number}. {track.title}
                  </h3>
                </div>
              </div>

              <DownloadButton href={track.download_url} label="Download" />
            </article>
          );
        })}
      </div>
    </section>
  );
}
