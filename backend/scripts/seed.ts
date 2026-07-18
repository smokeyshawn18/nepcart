import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { products } from "../src/db/schema.js";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const CATALOG = [
  {
    slug: "everest-home-jersey",
    name: "Everest Home Jersey",
    category: "Jerseys",
    description:
      "Lightweight football jersey inspired by Nepal's home colors, breathable mesh fabric, sweat-wicking finish, and athletic fit for match days and casual wear.",
    priceCents: 159900,
    imageUrl:
      "https://images.unsplash.com/photo-1526233814476-4c7e0d1c8a99?w=800&q=80",
  },
  {
    slug: "retro-red-devils-kit",
    name: "Retro Red Devils Kit",
    category: "Retro Kits",
    description:
      "Classic vintage-inspired football kit with soft-touch fabric, old-school collar styling, and fan-favorite retro look for collectors and supporters.",
    priceCents: 189900,
    imageUrl:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
  },
  {
    slug: "heritage-blue-away-jersey",
    name: "Heritage Blue Away Jersey",
    category: "Jerseys",
    description:
      "Modern away jersey with moisture-control fabric, slim cut, and durable stitching made for everyday wear and local football culture.",
    priceCents: 149900,
    imageUrl:
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&q=80",
  },
  {
    slug: "stadium-fan-tee",
    name: "Stadium Fan Tee",
    category: "Sportswear",
    description:
      "Casual football tee with relaxed fit, soft cotton blend, and bold graphic print for match-day styling around Nepal.",
    priceCents: 79900,
    imageUrl:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80",
  },
  {
    slug: "nepal-training-set",
    name: "Nepal Training Set",
    category: "Sportswear",
    description:
      "Two-piece training set with quick-dry fabric, elastic waist shorts, and lightweight top for football, gym, and outdoor sessions.",
    priceCents: 179900,
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
  },
  {
    slug: "matchday-football-shorts",
    name: "Matchday Football Shorts",
    category: "Sportswear",
    description:
      "Flexible performance shorts with breathable panels, secure waistband, and easy movement for training and weekend games.",
    priceCents: 69000,
    imageUrl:
      "https://images.unsplash.com/photo-1508341591423-4347099e1f19?w=800&q=80",
  },
  {
    slug: "pro-grip-football-boots",
    name: "Pro Grip Football Boots",
    category: "Football Accessories",
    description:
      "Firm-ground boots with textured upper, studded traction plate, and padded heel support for sharp turns and speed.",
    priceCents: 299900,
    imageUrl:
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800&q=80",
  },
  {
    slug: "training-cone-pack",
    name: "Training Cone Pack",
    category: "Football Accessories",
    description:
      "Portable cone set for drills, warmups, agility ladders, and academy training sessions across all levels.",
    priceCents: 39000,
    imageUrl:
      "https://images.unsplash.com/photo-1526401485004-2fda9f4aaf4d?w=800&q=80",
  },
  {
    slug: "elite-match-football",
    name: "Elite Match Football",
    category: "Football Accessories",
    description:
      "Durable stitched football with consistent bounce, high-visibility panel design, and reliable touch for turf and grass.",
    priceCents: 149900,
    imageUrl:
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&q=80",
  },
  {
    slug: "goalkeeper-glove-pro",
    name: "Goalkeeper Glove Pro",
    category: "Football Accessories",
    description:
      "Latex grip gloves with wrist support, impact padding, and secure closure for training and match use.",
    priceCents: 89000,
    imageUrl:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80",
  },
  {
    slug: "cricket-bat-english-willow",
    name: "Cricket Bat English Willow",
    category: "Cricket",
    description:
      "Balanced English willow bat with thick edges, clean pickup, and strong face for club cricket and competitive matches.",
    priceCents: 349900,
    imageUrl:
      "https://images.unsplash.com/photo-1592928302636-c83cf1b9c7a0?w=800&q=80",
  },
  {
    slug: "cricket-batting-pads",
    name: "Cricket Batting Pads",
    category: "Cricket",
    description:
      "Lightweight pads with reinforced protection, comfortable knee rolls, and secure straps for long innings.",
    priceCents: 179900,
    imageUrl:
      "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&q=80",
  },
  {
    slug: "cricket-batting-gloves",
    name: "Cricket Batting Gloves",
    category: "Cricket",
    description:
      "Flexible batting gloves with impact foam, breathable palm design, and reinforced finger protection.",
    priceCents: 89000,
    imageUrl:
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80",
  },
  {
    slug: "cricket-ball-leather",
    name: "Leather Cricket Ball",
    category: "Cricket",
    description:
      "Hand-stitched leather cricket ball for practice nets, leather ball tournaments, and club-level play.",
    priceCents: 25000,
    imageUrl:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
  },
  {
    slug: "running-shoe-nepal-fit",
    name: "Running Shoe Nepal Fit",
    category: "Sportswear",
    description:
      "Breathable running shoe with cushioned midsole, lightweight build, and grippy outsole for daily runs and fitness.",
    priceCents: 189900,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  },
  {
    slug: "gym-compression-shirt",
    name: "Gym Compression Shirt",
    category: "Sportswear",
    description:
      "Stretch compression top with sweat-wicking performance fabric for training, recovery, and layered sportswear looks.",
    priceCents: 99000,
    imageUrl:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80",
  },
  {
    slug: "fan-scarf-classic",
    name: "Classic Fan Scarf",
    category: "Accessories",
    description:
      "Soft woven supporter scarf for match days, streetwear styling, and club pride across Nepal.",
    priceCents: 29000,
    imageUrl:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800&q=80",
  },
  {
    slug: "sports-duffel-pro",
    name: "Sports Duffel Pro",
    category: "General",
    description:
      "Roomy duffel with shoe compartment, durable zipper, and padded strap for gym, football, and travel use.",
    priceCents: 129900,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  },
  {
    slug: "hydration-bottle-sport",
    name: "Hydration Bottle Sport",
    category: "Accessories",
    description:
      "Leakproof bottle with quick-sip lid and easy-carry loop for training, school, and everyday sports use.",
    priceCents: 19000,
    imageUrl:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
  },
];

async function main() {
  const rows = CATALOG.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    description: p.description,
    priceCents: p.priceCents,
    currency: "npr",
    imageUrl: p.imageUrl,
    active: true,
    featured: true,
  }));

  for (const row of rows) {
    await db
      .insert(products)
      .values(row)
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          name: row.name,
          category: row.category,
          description: row.description,
          priceCents: row.priceCents,
          currency: row.currency,
          imageUrl: row.imageUrl,
          active: row.active,
          featured: row.featured,
        },
      });
  }

  console.log(`Seed complete (${CATALOG.length} products upserted).`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
