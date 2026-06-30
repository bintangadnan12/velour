// ═══════════════════════════════════════════════════════════════════════════
//  MASTER TEMPLATE CONFIG
//  Ganti isi file ini saja untuk setiap klien — jangan ubah file lain.
// ═══════════════════════════════════════════════════════════════════════════

export const BRAND = {
  // ── Identitas brand ──────────────────────────────────────────────────────
  name:     'FORMA',          // Nama brand — muncul di Nav, footer, scene step, Aura4
  tagline:  'Walk with intent.',
  founded:  '2022',
  city:     'New York',
  country:  'Indonesia',      // opsional, untuk footer

  // ── Warna utama (CSS hex / rgb) ───────────────────────────────────────────
  // Skema gelap: background video, teks putih di atas video
  // Skema terang: dipakai di section produk & about
  colorDark:   '#0a0908',     // bg section produk & about
  colorLight:  '#f5f3ef',     // bg produk cards
  colorAccent: '#C9A84C',     // warna kursor, gold accent

  // ── Video frames ──────────────────────────────────────────────────────────
  // Letakkan frame di /public/frames/frame0001.jpg ... frame0300.jpg
  // Untuk mobile: /public/frames-mobile/frame0001.jpg ... frame0300.jpg
  totalFrames: 300,
  // Key frame per scene (frame terakhir sebelum freeze) — sesuaikan dengan video klien
  keyFrames:   [45, 105, 165, 225, 299] as const,
  // Frame awal per scene
  startFrames: [0,  46,  106, 166, 226] as const,
}

// ── 5 Scene teks (sesuaikan cerita brand klien) ───────────────────────────
export const SCENES = [
  {
    id:       'arrival',
    step:     '01',
    headline: ['The', 'Arrival.'],
    accent:   'First Edition · 200 Pairs · New York',
    body:     'Engineered from a single conviction — that footwear should earn its place in your life. Permanently.',
    cta:      false,
    align:    'left' as const,
  },
  {
    id:       'construct',
    step:     '02',
    headline: ['Every Layer.', 'Considered.'],
    accent:   '08 Components · 03 Materials · Zero Excess',
    body:     'We showed you the inside so you could trust the outside. Nothing hidden. Nothing unnecessary.',
    cta:      false,
    align:    'right' as const,
  },
  {
    id:       'sole',
    step:     '03',
    headline: ['Ground', 'Intelligence.'],
    accent:   'Recycled Rubber · Multi-Directional Grip · 12mm Stack',
    body:     'The sole is the first thing that meets the world.\nWe treated it accordingly.',
    cta:      false,
    align:    'left' as const,
  },
  {
    id:       'upper',
    step:     '04',
    headline: ['Skin-Grade', 'Leather.'],
    accent:   'Full-Grain · Naturally Tanned · Traceable to Source',
    body:     'The upper ages with you.\nCreases become character. Wear becomes story.',
    cta:      false,
    align:    'right' as const,
  },
  {
    id:       'finale',
    step:     '05',
    headline: ['FORMA', '001.'],
    accent:   '200 Pairs · No Restock · Ships in 48h',
    body:     null,
    cta:      true,
    align:    'center' as const,
  },
]

// ── Produk ────────────────────────────────────────────────────────────────
// Tambah objek baru di array ini untuk produk ke-4, ke-5, dst.
export const PRODUCTS = [
  {
    id:       1,
    name:     'FORMA Drift',
    category: 'Daily Trainer',
    price:    '$340',
    tag:      'Bestseller · 3 Seasons',
    desc:     "Recycled EVA midsole. Breathable mesh upper. The shoe you forget you're wearing — until you miss it.",
    img:      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=85&auto=format&fit=crop',
    rotation: -2,
  },
  {
    id:       2,
    name:     'FORMA Bone',
    category: 'Minimal Silhouette',
    price:    '$295',
    tag:      'Limited · 62 remaining',
    desc:     'Full-grain leather. Tonal stitching. Wears with everything or nothing else. A wardrobe constant.',
    img:      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&q=85&auto=format&fit=crop',
    rotation: 2,
  },
  {
    id:       3,
    name:     'FORMA Noir',
    category: 'Leather Edition',
    price:    '$420',
    tag:      'New this season',
    desc:     'Waxed calfskin. Commando sole. Wears into work or into the night without asking permission.',
    img:      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&q=85&auto=format&fit=crop',
    rotation: -2,
  },
  // ── Produk ke-4 (uncomment & isi bila klien punya lebih banyak) ──────────
  // {
  //   id:       4,
  //   name:     'FORMA Alba',
  //   category: 'Premium White',
  //   price:    '$380',
  //   tag:      'New Arrival',
  //   desc:     'Deskripsi produk ke-4.',
  //   img:      '/photos/product-4.jpg',   // simpan di /public/photos/
  //   rotation: 2,
  // },
]

// ── About / Stats ─────────────────────────────────────────────────────────
export const ABOUT = {
  headline: ['Built for the ground', 'beneath your feet.'],
  p1: 'FORMA began in 2022 with a single question: why does footwear that costs a thousand dollars still feel disposable at eighteen months?',
  p2: 'We stripped out the marketing, the seasonal overproduction, the name-chasing. What remained was material honesty, precision construction, and the discipline to make only 200 pairs per style — ever.',
  location: 'FORMA Studio · New York',
  stats: [
    { value: '2022', label: 'Founded' },
    { value: '200',  label: 'Units per style' },
    { value: '12',   label: 'Styles per year' },
  ],
  principles: [
    { title: 'Material honesty', body: 'Every component is disclosed. No blended fabrics sold as pure. No synthetic leather sold as real.' },
    { title: 'Scale discipline',  body: "200 pairs per style. No exceptions. When it's gone, it doesn't come back." },
    { title: 'Lifetime repair',   body: 'Every FORMA comes with free repair for life. Because ownership should mean something.' },
  ],
}

// ── Integrasi / CTA Scene 5 ───────────────────────────────────────────────
export const INTEGRATIONS = {
  // Email waitlist (scene 5 form submit)
  email: {
    enabled:     true,
    placeholder: 'your@email.com',
    buttonLabel: 'Secure Pair',
    successMsg:  "You're on the list — we'll reach out before the drop.",
    // Endpoint API jika ingin kirim ke backend / Mailchimp / dsb.
    // Kosongkan string untuk mode "simulasi" (tidak benar-benar submit)
    apiEndpoint: '',
  },

  // WhatsApp CTA
  whatsapp: {
    enabled: false,
    // Nomor tanpa tanda + atau spasi, format internasional: 628123456789
    number:  '628123456789',
    message: 'Halo, saya tertarik dengan produk FORMA. Bisa info lebih lanjut?',
    label:   'Chat WhatsApp',
  },

  // Toko online / e-commerce link
  store: {
    enabled: false,
    url:     'https://tokopedia.com/forma',   // Tokopedia / Shopee / Shopify / dsb.
    label:   'Beli di Toko',
  },
}

// ── Footer nav & trust bar ────────────────────────────────────────────────
export const FOOTER = {
  tagline:  'Walk with intent.',
  socials:  ['Instagram', 'Pinterest', 'TikTok'],
  trustBar: [
    'Free shipping over $200',
    'Free 30-day returns',
    'Secure checkout',
    'GOTS certified',
    'Carbon-neutral shipping',
    'Lifetime repair',
  ],
  nav: [
    {
      heading: 'Shop',
      links: ['New Arrivals', 'Best Sellers', 'FORMA Drift', 'FORMA Bone', 'FORMA Noir'],
    },
    {
      heading: 'Brand',
      links: ['Our Story', 'Sustainability', 'Size Guide', 'Care Guide'],
    },
    {
      heading: 'Support',
      links: ['Shipping & Returns', 'FAQ', 'Contact', 'Track Order'],
    },
  ],
  copyright: '© 2026 FORMA. All rights reserved.',
  legal: ['Privacy Policy', 'Terms of Use', 'Accessibility'],
}
