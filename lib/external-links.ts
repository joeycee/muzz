export type ExternalLink = {
  label: string;
  href: string;
  iconUrl: string;
  blurb: string;
  category: "social" | "support" | "booking";
};

export const externalLinks: ExternalLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/mitchmurraymusic",
    iconUrl: "https://cdn.simpleicons.org/instagram/c8a87a",
    blurb: "Daily moments, clips, and visual snapshots from the Mitch world.",
    category: "social",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@MitchMurrayMusic",
    iconUrl: "https://cdn.simpleicons.org/youtube/c8a87a",
    blurb: "Live videos, recorded sessions, and longer-form music content.",
    category: "social",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/mmmusic9",
    iconUrl: "https://cdn.simpleicons.org/facebook/c8a87a",
    blurb: "Updates, event posts, and another place to stay connected.",
    category: "social",
  },
  {
    label: "SoundCloud",
    href: "https://soundcloud.com/mitchmuzz",
    iconUrl: "https://cdn.simpleicons.org/soundcloud/c8a87a",
    blurb: "Loose edges, raw uploads, and audio-first listening.",
    category: "social",
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/artist/6KFuzy5DI8gLXn90g8Rs8w?si=cYOWdxt_QOKbj55Jg83lcQ&nd=1&dlsi=5b844eff842f4b14",
    iconUrl: "https://cdn.simpleicons.org/spotify/c8a87a",
    blurb: "Stream the catalog on Spotify and drop the tracks into rotation.",
    category: "social",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@muznz",
    iconUrl: "https://cdn.simpleicons.org/tiktok/c8a87a",
    blurb: "Short-form clips, live moments, and quick hits from the Mitch universe.",
    category: "social",
  },
  {
    label: "Etsy",
    href: "https://www.etsy.com/nz/shop/EKGShopNZ",
    iconUrl: "https://cdn.simpleicons.org/etsy/c8a87a",
    blurb: "Shop supporting goods and physical pieces through Etsy.",
    category: "support",
  },
  {
    label: "Buy Me a Coffee",
    href: "https://buymeacoffee.com/muznz",
    iconUrl: "https://cdn.simpleicons.org/buymeacoffee/c8a87a",
    blurb: "A simple way to back the music and keep the momentum moving.",
    category: "support",
  },
  {
    label: "PayPal SR62H",
    href: "https://www.paypal.com/ncp/payment/SR62HL86E5LSJ",
    iconUrl: "https://cdn.simpleicons.org/paypal/c8a87a",
    blurb: "Direct PayPal support link for quick contribution.",
    category: "support",
  },
  {
    label: "PayPal YRA47",
    href: "https://www.paypal.com/ncp/payment/YRA4742P4BB8Y",
    iconUrl: "https://cdn.simpleicons.org/paypal/c8a87a",
    blurb: "Alternate PayPal payment link for direct support.",
    category: "support",
  },
  {
    label: "PayPal CGB8X",
    href: "https://www.paypal.com/ncp/payment/CGB8XVUCFSHJ4",
    iconUrl: "https://cdn.simpleicons.org/paypal/c8a87a",
    blurb: "Another direct PayPal route for backing the project.",
    category: "support",
  },
  {
    label: "GigHQ",
    href: "https://app.gighq.co.nz/login",
    iconUrl: "https://api.iconify.design/mdi/calendar-star.svg?color=%23c8a87a",
    blurb: "Booking platform access for live work and event coordination.",
    category: "booking",
  },
];
