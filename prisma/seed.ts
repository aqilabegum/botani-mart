// Seed script for Botani Mart
// Run with: bun run prisma/db/seed.ts  (or bunx prisma db seed)
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

type P = {
  slug: string
  name: string
  category: string
  price: number
  unit: string
  emoji: string
  short: string
  description: string
  benefits: string[]
  usage: string
}

const PRODUCTS: P[] = [
  {
    slug: 'benih-cabai-rawit',
    name: 'Benih Cabai Rawit Unggul',
    category: 'Benih',
    price: 25000,
    unit: 'sachet 10 g',
    emoji: '🌶️',
    short: 'Benih cabai rawit daya tumbuh tinggi.',
    description:
      'Benih hibrida tahan penyakit layu, cocok dataran rendah hingga menengah. Diolah dengan teknologi primer untuk menjaga viabilitas benih hingga 2 tahun penyimpanan.',
    benefits: ['Daya kecambah ≥ 85%', 'Tahan layu bakteri', 'Produktif hingga 1 kg/tanaman'],
    usage:
      'Rendam benih 4 jam, semai pada media halus 3-4 minggu, pindah tanam dengan jarak 50x60 cm.',
  },
  {
    slug: 'benih-tomat-ceri',
    name: 'Benih Tomat Ceri',
    category: 'Benih',
    price: 30000,
    unit: 'sachet 5 g',
    emoji: '🍅',
    short: 'Tomat ceri manis, cocok pot dan polybag.',
    description:
      'Varietas determinate dengan buah kecil manis dan panen berkelanjutan. Ideal untuk pehobi lahan sempit dan urban farming.',
    benefits: ['Cocok lahan sempit', 'Rasa manis', 'Panen 60-70 HST'],
    usage: 'Semai di media halus, pindah tanam saat 4 daun sejati. Butuh sangga buah.',
  },
  {
    slug: 'benih-padi-inpari',
    name: 'Benih Padi Inpari 32',
    category: 'Benih',
    price: 14000,
    unit: 'kg',
    emoji: '🌾',
    short: 'Padi tahan wereng dan blas.',
    description:
      'Varietas padi sawah umur genjah dengan potensi hasil tinggi. Tahan terhadap serangan wereng coklat dan penyakit blas.',
    benefits: ['Umur ±120 hari', 'Tahan blas', 'Potensi 8 ton/ha'],
    usage: 'Rendam 24 jam, peram 24 jam, semai 18-21 hari sebelum pindah tanam.',
  },
  {
    slug: 'pupuk-npk-16',
    name: 'Pupuk NPK 16-16-16',
    category: 'Pupuk',
    price: 18000,
    unit: 'kg',
    emoji: '🧪',
    short: 'Pupuk majemuk seimbang untuk semua tanaman.',
    description:
      'Pupuk granul dengan kandungan N, P, K seimbang 16-16-16. Serbaguna untuk sayuran, buah, dan tanaman hias.',
    benefits: ['Mempercepat pertumbuhan', 'Memperbanyak bunga dan buah', 'Mudah larut'],
    usage: 'Tabur 5-10 g per tanaman setiap 2 minggu, jauhkan dari batang untuk hindari bakar akar.',
  },
  {
    slug: 'pupuk-kompos-organik',
    name: 'Pupuk Kompos Organik',
    category: 'Pupuk',
    price: 35000,
    unit: '5 kg',
    emoji: '🌱',
    short: 'Kompos matang untuk memperbaiki tanah.',
    description:
      'Kompos dari limbah pertanian terfermentasi sempurna selama 60 hari. Bebas bau dan patogen, kaya mikroba menguntungkan.',
    benefits: ['Memperbaiki struktur tanah', 'Ramah lingkungan', 'Menambah mikroba baik'],
    usage: 'Campurkan 1:3 dengan tanah saat pengolahan lahan awal.',
  },
  {
    slug: 'pestisida-neem',
    name: 'Pestisida Nabati Neem',
    category: 'Pestisida Nabati',
    price: 45000,
    unit: 'botol 500 ml',
    emoji: '🍃',
    short: 'Pengendali hama alami dari biji mimba.',
    description:
      'Ekstrak neem (azadirachtin) efektif untuk kutu daun, ulat, dan thrips. Ramah serangga penyerbuk dan residunya rendah.',
    benefits: ['Aman bagi serangga penyerbuk', 'Residu rendah', 'Bahan alami'],
    usage: 'Larutkan 5 ml per liter air, semprot sore hari tiap 5-7 hari.',
  },
  {
    slug: 'cangkul-baja',
    name: 'Cangkul Baja Karbon',
    category: 'Alat Pertanian',
    price: 85000,
    unit: 'unit',
    emoji: '⛏️',
    short: 'Cangkul kuat bergagang kayu jati.',
    description:
      'Mata cangkul baja karbon tahan aus untuk pengolahan lahan. Gagang kayu jati ergonomis dengan finish halus.',
    benefits: ['Tahan lama', 'Gagang ergonomis', 'Tidak mudah bengkok'],
    usage: 'Bersihkan dan keringkan setelah pakai; asah berkala agar selalu tajam.',
  },
  {
    slug: 'sprayer-manual-16l',
    name: 'Sprayer Manual 16 Liter',
    category: 'Alat Pertanian',
    price: 220000,
    unit: 'unit',
    emoji: '💦',
    short: 'Sprayer punggung untuk pupuk cair dan pestisida.',
    description:
      'Tangki 16 liter dengan tuas pompa manual dan nozzle dapat diatur. Tali punggung empuk dengan bantalan spons.',
    benefits: ['Semprotan merata', 'Tali punggung empuk', 'Nozzle 3 mode'],
    usage: 'Isi tidak lebih dari batas maksimal, pompa hingga tekanan cukup sebelum semprot.',
  },
  {
    slug: 'cocopeat-blok',
    name: 'Cocopeat Blok 5 kg',
    category: 'Media Tanam',
    price: 22000,
    unit: 'blok',
    emoji: '🥥',
    short: 'Media tanam serabut kelapa, retensi air baik.',
    description:
      'Blok cocopeat 5 kg yang mengembang hingga 70 liter saat direndam. Bersih, bebas gulma, dan pH netral.',
    benefits: ['Menyimpan air', 'Aerasi baik', 'Bebas gulma'],
    usage: 'Rendam dalam air hingga mengembang, cuci untuk hilangkan tanin, lalu campur sekam/kompos.',
  },
]

const CATEGORIES = [
  { name: 'Benih', icon: 'seedling', blurb: 'Benih unggul berdaya kecambah tinggi untuk tanaman pangan & hias.' },
  { name: 'Pupuk', icon: 'flask-conical', blurb: 'Pupuk organik & anorganik untuk pertumbuhan optimal.' },
  { name: 'Pestisida Nabati', icon: 'leaf', blurb: 'Pengendali hama alami yang ramah lingkungan.' },
  { name: 'Alat Pertanian', icon: 'wrench', blurb: 'Alat kerja tahan lama untuk olah lahan & aplikasi.' },
  { name: 'Media Tanam', icon: 'layers', blurb: 'Media tanam siap pakai untuk pot, polybag, & hidroponik.' },
]

async function main() {
  console.log('Seeding products...')
  for (const p of PRODUCTS) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: { ...p, benefits: JSON.stringify(p.benefits) },
      create: { ...p, benefits: JSON.stringify(p.benefits) },
    })
  }
  console.log(`Seeded ${PRODUCTS.length} products.`)

  console.log('Seeding categories...')
  for (const c of CATEGORIES) {
    await db.category.upsert({
      where: { name: c.name },
      update: c,
      create: c,
    })
  }
  console.log(`Seeded ${CATEGORIES.length} categories.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
