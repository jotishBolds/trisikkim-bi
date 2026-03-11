/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Seed script for Trisikkim BI database
 * Run: npx tsx scripts/seed.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as bcrypt from "bcryptjs";
import {
  users,
  heroSlides,
  dignitaries,
  siteSettings,
  tribes,
  staff,
  galleryCategories,
  galleryImages,
  pages,
  updates,
} from "../lib/db/schema";

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(pool);

  console.log("🌱 Seeding database...\n");

  // ─── Admin user ───────────────────────────────────────────────────
  console.log("→ Creating admin user...");
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await db
    .insert(users)
    .values({
      name: "Admin",
      email: "admin@trisikkim.gov.in",
      password: hashedPassword,
      role: "admin",
    })
    .onConflictDoNothing({ target: users.email });

  // ─── Hero Slides ──────────────────────────────────────────────────
  console.log("→ Seeding hero slides...");
  await db
    .insert(heroSlides)
    .values([
      {
        image: "/gallery/tribal-festivals/1.jpg",
        tag: "Preserving Heritage",
        tagIcon: "Leaf",
        headline: "Tribal Research Institute\n& Training Centre",
        subtext:
          "Under the Government of Sikkim · Preserving the cultural heritage and empowering the tribal communities of Sikkim.",
        ctaLabel: "Explore Our Work",
        ctaHref: "/about",
        accent: "#f4c430",
        statValue: "4",
        statLabel: "Tribal Communities",
        sortOrder: 0,
        active: true,
      },
      {
        image: "/gallery/janjatiya-gaurav/1.jpg",
        tag: "Research & Documentation",
        tagIcon: "BookOpen",
        headline: "Documenting Tribal\nHeritage & Knowledge",
        subtext:
          "Comprehensive research on the Lepcha, Bhutia, Limboo, and Tamang communities — their traditions, languages, and art forms.",
        ctaLabel: "View Research",
        ctaHref: "/about",
        accent: "#4fd1c5",
        statValue: "200+",
        statLabel: "Publications",
        sortOrder: 1,
        active: true,
      },
      {
        image: "/gallery/exchange-visit/1.jpg",
        tag: "Capacity Building",
        tagIcon: "Users",
        headline: "Empowering Tribal\nCommunities",
        subtext:
          "Training programs, skill development workshops, and educational support for the tribal youth of Sikkim.",
        ctaLabel: "Training Programs",
        ctaHref: "/updates/training-workshop",
        accent: "#f4c430",
        statValue: "5000+",
        statLabel: "Beneficiaries",
        sortOrder: 2,
        active: true,
      },
    ])
    .onConflictDoNothing();

  // ─── Dignitaries ──────────────────────────────────────────────────
  console.log("→ Seeding dignitaries...");
  await db
    .insert(dignitaries)
    .values([
      {
        name: "Shri Prem Singh Tamang (Golay)",
        role: "Hon'ble Chief Minister, Sikkim",
        image: "/dignitaries/cm.jpg",
        sortOrder: 0,
      },
      {
        name: "Shri Sonam Lama",
        role: "Hon'ble Minister, Social Welfare Department",
        image: "/dignitaries/minister.jpg",
        sortOrder: 1,
      },
      {
        name: "Dr. A.B. Subba",
        role: "Secretary, Social Welfare Department",
        image: "/dignitaries/secretary.jpg",
        sortOrder: 2,
      },
    ])
    .onConflictDoNothing();

  // ─── Site Settings ────────────────────────────────────────────────
  console.log("→ Seeding site settings...");
  const settingsData = [
    { key: "visitors_count", value: "12543" },
    { key: "last_updated", value: new Date().toISOString().split("T")[0] },
    {
      key: "footer_links",
      value: JSON.stringify([
        { label: "India.gov.in", href: "https://www.india.gov.in" },
        { label: "Sikkim.gov.in", href: "https://www.sikkim.gov.in" },
        {
          label: "Ministry of Tribal Affairs",
          href: "https://tribal.nic.in",
        },
        {
          label: "National Portal of India",
          href: "https://www.india.gov.in",
        },
        {
          label: "Digital India",
          href: "https://www.digitalindia.gov.in",
        },
      ]),
    },
    {
      key: "quick_stats",
      value: JSON.stringify([
        { icon: "Users", value: "12+", label: "Tribal Communities Documented" },
        { icon: "BookOpen", value: "200+", label: "Research Publications" },
        { icon: "Users", value: "5000+", label: "Beneficiaries Trained" },
        {
          icon: "Award",
          value: "30+",
          label: "Years of Dedicated Service",
        },
        { icon: "Globe", value: "100%", label: "Govt. of Sikkim Backed" },
      ]),
    },
  ];
  for (const s of settingsData) {
    await db
      .insert(siteSettings)
      .values(s)
      .onConflictDoNothing({ target: siteSettings.key });
  }

  // ─── Tribes ───────────────────────────────────────────────────────
  console.log("→ Seeding tribes...");
  await db
    .insert(tribes)
    .values([
      {
        id: "lepcha",
        name: "Lepcha",
        image: "/gallery/tribal-festivals/1.jpg",
        excerpt:
          "The Lepchas are the original inhabitants of Sikkim, known for their deep connection with nature and rich oral traditions.",
        content: "",
        accent: "#4fd1c5",
        heroImage: "/gallery/tribal-festivals/1.jpg",
        sections: JSON.stringify([
          {
            title: "History & Origin",
            icon: "BookOpen",
            accent: "#4fd1c5",
            content: [
              {
                type: "paragraph",
                text: "The Lepchas, also known as Rong-pa (children of the snowy peak), are considered the original inhabitants of Sikkim. They have a rich mythological tradition about their origins, believing they were created from the snows of Kanchenjunga.",
              },
            ],
          },
          {
            title: "Culture & Traditions",
            icon: "Users",
            accent: "#f4c430",
            content: [
              {
                type: "paragraph",
                text: "Lepcha culture is deeply rooted in nature worship and animistic beliefs. They have a unique script called Rong or Lepcha script, one of the earliest scripts of the region.",
              },
            ],
          },
        ]),
        sortOrder: 0,
      },
      {
        id: "bhutia",
        name: "Bhutia",
        image: "/gallery/tribal-festivals/2.jpg",
        excerpt:
          "The Bhutias of Sikkim are descendants of Tibetan migrants, known for their Buddhist traditions and colorful festivals.",
        content: "",
        accent: "#e74c3c",
        heroImage: "/gallery/tribal-festivals/2.jpg",
        sections: JSON.stringify([
          {
            title: "History & Origin",
            icon: "BookOpen",
            accent: "#e74c3c",
            content: [
              {
                type: "paragraph",
                text: "The Bhutias migrated from Tibet to Sikkim several centuries ago. They established the monarchy in Sikkim and played a pivotal role in shaping the state's political and cultural identity.",
              },
            ],
          },
        ]),
        sortOrder: 1,
      },
      {
        id: "limboo",
        name: "Limboo",
        image: "/gallery/tribal-festivals/3.jpg",
        excerpt:
          "The Limboos are one of the most ancient indigenous communities with a rich tradition of Mundhum oral scriptures.",
        content: "",
        accent: "#2ecc71",
        heroImage: "/gallery/tribal-festivals/3.jpg",
        sections: JSON.stringify([
          {
            title: "History & Origin",
            icon: "BookOpen",
            accent: "#2ecc71",
            content: [
              {
                type: "paragraph",
                text: "The Limboos, also known as Yakthungba, are one of the ancient indigenous communities of Sikkim. They have a rich oral tradition called Mundhum, which serves as their religious and philosophical guide.",
              },
            ],
          },
        ]),
        sortOrder: 2,
      },
      {
        id: "tamang",
        name: "Tamang",
        image: "/gallery/tribal-festivals/4.jpg",
        excerpt:
          "The Tamangs are known for their vibrant Damphu dance and strong Buddhist cultural heritage.",
        content: "",
        accent: "#9b59b6",
        heroImage: "/gallery/tribal-festivals/4.jpg",
        sections: JSON.stringify([
          {
            title: "History & Origin",
            icon: "BookOpen",
            accent: "#9b59b6",
            content: [
              {
                type: "paragraph",
                text: "The Tamangs are one of the major tribal communities from the hills, with strong Buddhist traditions and a vibrant cultural heritage. They are known for the Damphu dance and their distinctive cultural practices.",
              },
            ],
          },
        ]),
        sortOrder: 3,
      },
    ])
    .onConflictDoNothing({ target: tribes.id });

  // ─── Staff (Who's Who) ───────────────────────────────────────────
  console.log("→ Seeding staff...");
  await db
    .insert(staff)
    .values([
      { name: "Dr. A.B. Subba", position: "Director", sortOrder: 0 },
      {
        name: "Shri R.K. Sharma",
        position: "Research Officer",
        sortOrder: 1,
      },
      {
        name: "Smt. D. Lepcha",
        position: "Administrative Officer",
        sortOrder: 2,
      },
      {
        name: "Shri P. Tamang",
        position: "Research Assistant",
        sortOrder: 3,
      },
      {
        name: "Smt. K. Bhutia",
        position: "Documentation Officer",
        sortOrder: 4,
      },
    ])
    .onConflictDoNothing();

  // ─── Gallery Categories & Images ──────────────────────────────────
  console.log("→ Seeding gallery...");
  const categories = [
    {
      slug: "tribal-festivals",
      label: "Tribal Festivals & Cultural Events",
      description:
        "Celebrating the vibrant festivals and cultural traditions of Sikkim's tribal communities.",
      sortOrder: 0,
    },
    {
      slug: "janjatiya-gaurav",
      label: "Janjatiya Gaurav Diwas",
      description:
        "Highlights from Janjatiya Gaurav Diwas celebrations across Sikkim.",
      sortOrder: 1,
    },
    {
      slug: "exchange-visit",
      label: "Exchange Visits & Training Programs",
      description:
        "Documentation of exchange visits, workshops, and capacity-building initiatives.",
      sortOrder: 2,
    },
  ];

  for (const cat of categories) {
    await db
      .insert(galleryCategories)
      .values(cat)
      .onConflictDoNothing({ target: galleryCategories.slug });
  }

  // ─── Pages ────────────────────────────────────────────────────────
  console.log("→ Seeding pages...");
  await db
    .insert(pages)
    .values([
      {
        slug: "about",
        title: "About TRI",
        content: JSON.stringify({
          divisions: [
            { icon: "Library", label: "Library and Data Bank Unit" },
            { icon: "Building2", label: "Resource Centre / Cafeteria" },
            {
              icon: "Landmark",
              label:
                "Guest House / Girls Hostel / Boys Hostel / Conference Hall",
            },
            { icon: "Globe", label: "Museum" },
            { icon: "BookOpen", label: "Tribal Museum and Library" },
            {
              icon: "Mic2",
              label: "Audio-visual / Multimedia / Mini Theatre",
            },
            { icon: "Users", label: "Culture / Tradition" },
          ],
          roles: [
            "To extend academic support to the tribal students for implementation of different policies and program of education sector.",
            "To develop tribal E-learning and website on tribal languages for preservation.",
            "To design and develop materials for the promotion of tribal Arts & Artifacts.",
            "To conduct training program extending academic support to the ST.",
            "To conduct evaluative studies on issues related to tribal of Sikkim.",
            "To participate in various tribal programs organized by International/National and Regional Agencies as and when called for capacity enhancing.",
            "All tribal School Inspection and monitoring.",
          ],
        }),
      },
    ])
    .onConflictDoNothing({ target: pages.slug });

  // ─── Sample Updates ───────────────────────────────────────────────
  console.log("→ Seeding sample updates...");
  await db
    .insert(updates)
    .values([
      {
        category: "news-events",
        title: "Tribal Research Institute Inaugurated New Museum Wing",
        slug: "tri-new-museum-wing",
        excerpt:
          "The new museum wing showcases artifacts and historical items from all four tribal communities of Sikkim.",
        content:
          "The Tribal Research Institute has inaugurated a new museum wing dedicated to preserving and showcasing the rich cultural heritage of Sikkim's tribal communities. The wing features artifacts, traditional costumes, musical instruments, and historical documents from the Lepcha, Bhutia, Limboo, and Tamang communities.",
        publishedAt: new Date(),
      },
      {
        category: "training-workshop",
        title: "Capacity Building Workshop for Tribal Youth",
        slug: "capacity-building-workshop-tribal-youth",
        excerpt:
          "A workshop aimed at empowering tribal youth with skills for sustainable livelihoods.",
        content:
          "The Tribal Research Institute organized a three-day capacity building workshop for tribal youth across Sikkim. The workshop covered topics including digital literacy, entrepreneurship, and preservation of traditional knowledge.",
        publishedAt: new Date(),
      },
      {
        category: "activities",
        title: "Documentation Project: Lepcha Oral Traditions",
        slug: "documentation-lepcha-oral-traditions",
        excerpt:
          "An ongoing project to document and preserve the vanishing oral traditions of the Lepcha community.",
        content:
          "The TRI has launched a comprehensive documentation project focusing on the oral traditions of the Lepcha community. This includes recording traditional stories, songs, and ceremonial practices that are at risk of being lost.",
        publishedAt: new Date(),
      },
    ])
    .onConflictDoNothing({ target: updates.slug });

  console.log("\n✅ Seeding complete!");
  console.log("   Admin login: admin@trisikkim.gov.in / admin123\n");

  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
