/**
 * Seed script for DUD activities — SLC metro area
 * Run with: pnpm --filter db seed
 *
 * These are real places in the Salt Lake City metro area.
 * Descriptions are written in the DUD brand voice — honest, practical, parent-tested.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

function createId(): string {
  const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
  let id = "";
  const bytes = crypto.getRandomValues(new Uint8Array(25));
  for (let i = 0; i < 25; i++) {
    id += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return id;
}

interface SeedActivity {
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  address: string;
  city: string;
  region: string;
  costTier: "free" | "budget" | "moderate" | "premium";
  priceNotes?: string;
  duration?: string;
  bestTime?: string;
  parking?: string;
  restrooms: boolean;
  strollerFriendly: boolean;
  wheelchairAccessible: boolean;
  website?: string;
  ageBands: ("0-2" | "3-5" | "6-8" | "9-11" | "12-14" | "15-17" | "all_ages")[];
  categories: string[];
  tags: string[];
  seasons: string[];
}

const ACTIVITIES: SeedActivity[] = [
  {
    slug: "liberty-park",
    title: "Liberty Park",
    description:
      "SLC's best park, hands down. Two playgrounds (the big one near 900 S is better for toddlers), a pond with ducks, Tracy Aviary right there, and enough grass to run off any sugar high. The splash pad opens Memorial Day weekend — get there before 11am or forget about parking.",
    shortDescription: "SLC's best family park. Playgrounds, duck pond, splash pad in summer.",
    address: "600 E 900 S",
    city: "Salt Lake City",
    region: "SLC Metro",
    costTier: "free",
    duration: "1–3 hours",
    bestTime: "Morning, especially weekends",
    parking: "Street parking on 700 E is your best bet. The lot fills by 10am on Saturdays.",
    restrooms: true,
    strollerFriendly: true,
    wheelchairAccessible: true,
    website: "https://www.slc.gov/parks/parks-division/liberty-park/",
    ageBands: ["0-2", "3-5", "6-8", "9-11", "all_ages"],
    categories: ["Outdoor Adventures", "Free Events"],
    tags: ["park", "playground", "splash pad", "ducks", "picnic"],
    seasons: ["spring", "summer", "fall"],
  },
  {
    slug: "discovery-gateway-museum",
    title: "Discovery Gateway Children's Museum",
    description:
      "Skip the touristy first floor. Third floor is where it's at — the outdoor rooftop play area is genuinely great and nobody talks about it. Best for under-8. Teens will be bored in 20 minutes. $14.50/person, free for under 1. First Friday of the month is half price.",
    shortDescription: "Hands-on children's museum. Skip to the third floor.",
    address: "444 W 100 S",
    city: "Salt Lake City",
    region: "SLC Metro",
    costTier: "moderate",
    priceNotes: "$14.50/person. Under 1 free. First Friday half price.",
    duration: "2–3 hours",
    bestTime: "Weekday mornings are way less crowded",
    parking: "Gateway Mall garage — validate at the museum front desk.",
    restrooms: true,
    strollerFriendly: true,
    wheelchairAccessible: true,
    website: "https://discoverygateway.org",
    ageBands: ["0-2", "3-5", "6-8"],
    categories: ["Indoor Activities", "Educational"],
    tags: ["museum", "hands-on", "rainy day", "toddler"],
    seasons: ["year-round"],
  },
  {
    slug: "bells-canyon-trail",
    title: "Bells Canyon Trail",
    description:
      "6 and up. Bathroom at trailhead. ~90 minutes if you set the pace. The lower falls are the goal — don't try the upper falls with kids unless they're solid hikers (it gets steep and scrambly). Parking lot fills by 9am on summer Saturdays. Pack snacks, no concessions anywhere nearby.",
    shortDescription: "Family hike to lower falls. 90 min round trip. Ages 6+.",
    address: "Bells Canyon Trailhead, Wasatch Blvd",
    city: "Sandy",
    region: "SLC Metro",
    costTier: "free",
    duration: "~90 min round trip",
    bestTime: "Early morning summer, midday spring/fall",
    parking: "Small lot at trailhead — arrive before 9am on weekends or park on the street below.",
    restrooms: true,
    strollerFriendly: false,
    wheelchairAccessible: false,
    ageBands: ["6-8", "9-11", "12-14", "15-17"],
    categories: ["Outdoor Adventures", "Free Events"],
    tags: ["hiking", "waterfall", "nature", "exercise"],
    seasons: ["spring", "summer", "fall"],
  },
  {
    slug: "tracy-aviary",
    title: "Tracy Aviary",
    description:
      "Inside Liberty Park. Way better than you'd expect — the bird shows are legitimately entertaining (even the teens watched). Free-flight bird encounters daily at 11am and 2pm. Budget about 90 minutes. Stroller-friendly paths throughout. $10 adults, $8 kids 3-12, under 3 free.",
    shortDescription: "Bird park inside Liberty Park. Shows at 11am & 2pm.",
    address: "589 E 1300 S",
    city: "Salt Lake City",
    region: "SLC Metro",
    costTier: "budget",
    priceNotes: "$10 adults, $8 kids 3-12, under 3 free",
    duration: "~90 min",
    bestTime: "Arrive by 10:30 to catch the 11am bird show",
    parking: "Use Liberty Park parking — street on 700 E or the main lot.",
    restrooms: true,
    strollerFriendly: true,
    wheelchairAccessible: true,
    website: "https://tracyaviary.org",
    ageBands: ["0-2", "3-5", "6-8", "9-11", "12-14", "all_ages"],
    categories: ["Outdoor Adventures", "Educational"],
    tags: ["birds", "nature", "animals", "shows"],
    seasons: ["spring", "summer", "fall"],
  },
  {
    slug: "international-peace-gardens",
    title: "International Peace Gardens",
    description:
      "Most people drive past this. Most people are wrong. It's at the south end of Jordan Park, tucked away where nobody looks. 28 country gardens, a creek, and almost zero crowds. Perfect for a quiet stroll with littles or for homeschool geography lessons. Completely free, always open.",
    shortDescription: "Hidden gem — 28 country gardens with zero crowds. Free.",
    address: "1000 S 900 W",
    city: "Salt Lake City",
    region: "SLC Metro",
    costTier: "free",
    duration: "45–60 min",
    bestTime: "Any morning. It's never crowded.",
    parking: "Free lot at Jordan Park.",
    restrooms: true,
    strollerFriendly: true,
    wheelchairAccessible: true,
    ageBands: ["all_ages"],
    categories: ["Outdoor Adventures", "Free Events", "Educational"],
    tags: ["garden", "quiet", "hidden gem", "walk", "free"],
    seasons: ["spring", "summer", "fall"],
  },
  {
    slug: "wheeler-farm",
    title: "Wheeler Historic Farm",
    description:
      "Free to walk around — you'll see cows, pigs, chickens, horses. The wagon ride is $3 and worth it for under-7. The hay maze in October is the best family Halloween activity in the valley, no contest. Bring quarters for the animal feed dispensers. Muddy after rain, wear boots.",
    shortDescription: "Free farm walk — animals, wagon rides, Oct hay maze.",
    address: "6351 S 900 E",
    city: "Murray",
    region: "SLC Metro",
    costTier: "free",
    priceNotes: "Free entry. Wagon rides $3. Some activities extra.",
    duration: "1–2 hours",
    bestTime: "Morning for animals. October for hay maze.",
    parking: "Free lot, usually has space.",
    restrooms: true,
    strollerFriendly: true,
    wheelchairAccessible: true,
    website: "https://wheelerfarm.com",
    ageBands: ["0-2", "3-5", "6-8", "9-11", "all_ages"],
    categories: ["Outdoor Adventures", "Free Events", "Educational"],
    tags: ["farm", "animals", "wagon ride", "pumpkin", "hay maze"],
    seasons: ["spring", "summer", "fall"],
  },
  {
    slug: "hogle-zoo",
    title: "Utah's Hogle Zoo",
    description:
      "Classic Utah family outing. The new Rocky Shores exhibit is worth seeing — otters and seals at eye level. Pack a lunch, food inside is overpriced. The zoo is built on a hill so bring a stroller even for bigger kids. Summer evenings (Zoo Lights in December) are less crowded than mornings.",
    shortDescription: "Utah's zoo. Pack a lunch, bring a stroller for the hills.",
    address: "2600 Sunnyside Ave",
    city: "Salt Lake City",
    region: "SLC Metro",
    costTier: "moderate",
    priceNotes: "$24.95 adults, $19.95 kids 3-12, under 3 free. Parking $10.",
    duration: "3–4 hours",
    bestTime: "Weekday mornings. Summer evenings. Avoid Saturday midday.",
    parking: "$10 lot. Or park free on Sunnyside Ave and walk 5 min.",
    restrooms: true,
    strollerFriendly: true,
    wheelchairAccessible: true,
    website: "https://www.hoglezoo.org",
    ageBands: ["0-2", "3-5", "6-8", "9-11", "12-14", "all_ages"],
    categories: ["Outdoor Adventures", "Educational"],
    tags: ["zoo", "animals", "otters", "family classic"],
    seasons: ["year-round"],
  },
  {
    slug: "bonneville-shoreline-trail-ensign-peak",
    title: "Ensign Peak Trail",
    description:
      "Short, steep, rewarding. 20 minutes up, maybe 15 down. The view of the whole valley is stunning and kids love the sense of accomplishment. Not stroller-friendly at all — it's a real trail. Good for 5+ with a bit of hiking experience. No shade, bring water and hats in summer.",
    shortDescription: "20 min hike, stunning valley views. Ages 5+.",
    address: "Ensign Peak Trailhead, N Capitol Blvd",
    city: "Salt Lake City",
    region: "SLC Metro",
    costTier: "free",
    duration: "~40 min round trip",
    bestTime: "Sunrise or late afternoon. No shade.",
    parking: "Small lot at trailhead. Street parking if full.",
    restrooms: false,
    strollerFriendly: false,
    wheelchairAccessible: false,
    ageBands: ["6-8", "9-11", "12-14", "15-17"],
    categories: ["Outdoor Adventures", "Free Events"],
    tags: ["hiking", "views", "short hike", "sunset"],
    seasons: ["spring", "summer", "fall"],
  },
  {
    slug: "natural-history-museum-of-utah",
    title: "Natural History Museum of Utah",
    description:
      "The building itself is worth the trip — built into the mountainside with views of the whole valley. Dinosaur hall is the headliner but the Native Peoples floor is genuinely excellent. The outdoor Sky Terrace trail is free and open to anyone. Budget 2-3 hours. $16.95 adults, $12.95 kids.",
    shortDescription: "Stunning museum on the mountainside. Dinosaurs + valley views.",
    address: "301 Wakara Way",
    city: "Salt Lake City",
    region: "SLC Metro",
    costTier: "moderate",
    priceNotes: "$16.95 adults, $12.95 kids 3-12, under 3 free",
    duration: "2–3 hours",
    bestTime: "Weekday afternoons. Free first Wednesday evenings.",
    parking: "Free lot at the museum.",
    restrooms: true,
    strollerFriendly: true,
    wheelchairAccessible: true,
    website: "https://nhmu.utah.edu",
    ageBands: ["3-5", "6-8", "9-11", "12-14", "15-17", "all_ages"],
    categories: ["Indoor Activities", "Educational"],
    tags: ["museum", "dinosaurs", "science", "views", "rainy day"],
    seasons: ["year-round"],
  },
  {
    slug: "sugarhouse-park",
    title: "Sugar House Park",
    description:
      "The jogging track around the pond is perfect for bikes and scooters. Two playgrounds — the one near the south entrance is newer. Big open fields for kites, frisbee, whatever. The sledding hill in winter is the best free winter activity in the city. Free, always open.",
    shortDescription: "Great park for bikes, kites, and winter sledding. Free.",
    address: "1330 E 2100 S",
    city: "Salt Lake City",
    region: "SLC Metro",
    costTier: "free",
    duration: "1–3 hours",
    bestTime: "Anytime. Winter for sledding hill.",
    parking: "Multiple free lots around the park.",
    restrooms: true,
    strollerFriendly: true,
    wheelchairAccessible: true,
    ageBands: ["0-2", "3-5", "6-8", "9-11", "12-14", "all_ages"],
    categories: ["Outdoor Adventures", "Free Events"],
    tags: ["park", "playground", "sledding", "bikes", "pond"],
    seasons: ["year-round"],
  },
  {
    slug: "cowabunga-bay",
    title: "Cowabunga Bay Water Park",
    description:
      "Draper's big water park. The lazy river is solid, wave pool is fun for 8+. Lines for slides get long after noon — arrive at opening. Bring your own snacks (they allow coolers). Not cheap but it's a full day activity. Season passes pay for themselves in 3 visits.",
    shortDescription: "Water park in Draper. Go early, bring coolers.",
    address: "12047 S Factory Outlet Dr",
    city: "Draper",
    region: "SLC Metro",
    costTier: "moderate",
    priceNotes: "~$35/person day pass. Season pass ~$80.",
    duration: "4–6 hours (full day)",
    bestTime: "Gates open, be in line. Midweek is less packed.",
    parking: "Free lot.",
    restrooms: true,
    strollerFriendly: false,
    wheelchairAccessible: true,
    website: "https://www.cowabungabay.com",
    ageBands: ["3-5", "6-8", "9-11", "12-14", "15-17"],
    categories: ["Outdoor Adventures", "Sports & Rec"],
    tags: ["water park", "slides", "summer", "swimming"],
    seasons: ["summer"],
  },
  {
    slug: "thanksgiving-point-museum-of-curiosity",
    title: "Museum of Natural Curiosity at Thanksgiving Point",
    description:
      "The outdoor Kidopolis area alone is worth the drive to Lehi. Four floors of hands-on stuff — the rainforest room and the water play area are the highlights. Busy on Saturdays but manageable on weekdays. Bundle with the gardens for a full day. $20/person, under 2 free.",
    shortDescription: "Four floors of hands-on play in Lehi. Kidopolis is a must.",
    address: "3003 Thanksgiving Way",
    city: "Lehi",
    region: "SLC Metro",
    costTier: "moderate",
    priceNotes: "$20/person. Under 2 free. Garden combo available.",
    duration: "3–4 hours",
    bestTime: "Weekdays. Saturdays are packed.",
    parking: "Free, huge lot.",
    restrooms: true,
    strollerFriendly: true,
    wheelchairAccessible: true,
    website: "https://thanksgivingpoint.org",
    ageBands: ["0-2", "3-5", "6-8", "9-11"],
    categories: ["Indoor Activities", "Educational"],
    tags: ["museum", "hands-on", "water play", "rainforest"],
    seasons: ["year-round"],
  },
];

async function seed() {
  console.log("Seeding activities...");

  for (const data of ACTIVITIES) {
    const {
      ageBands,
      categories,
      tags,
      seasons,
      ...activityData
    } = data;

    // Insert activity
    const [activity] = await db
      .insert(schema.activities)
      .values({
        ...activityData,
        published: true,
        featured: ["liberty-park", "bells-canyon-trail", "wheeler-farm", "natural-history-museum-of-utah"].includes(data.slug),
      })
      .onConflictDoNothing()
      .returning();

    if (!activity) {
      console.log(`  Skipping ${data.slug} (already exists)`);
      continue;
    }

    console.log(`  + ${activity.title}`);

    // Insert related data
    if (ageBands.length) {
      await db
        .insert(schema.activityAgeBands)
        .values(ageBands.map((ageBand) => ({ activityId: activity.id, ageBand })));
    }
    if (categories.length) {
      await db
        .insert(schema.activityCategories)
        .values(categories.map((category) => ({ activityId: activity.id, category })));
    }
    if (tags.length) {
      await db
        .insert(schema.activityTags)
        .values(tags.map((tag) => ({ activityId: activity.id, tag })));
    }
    if (seasons.length) {
      await db
        .insert(schema.activitySeasons)
        .values(seasons.map((season) => ({ activityId: activity.id, season })));
    }

    // Add "actually_went" verification for seeded data
    await db.insert(schema.verifications).values({
      activityId: activity.id,
      badge: "actually_went",
      verifiedBy: "Doing Utah Daily",
      notes: "Initial seed — personally visited",
      expiresAt: new Date(Date.now() + 90 * 86400000), // 90 days
    });
  }

  console.log(`\nSeeded ${ACTIVITIES.length} activities with verifications.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
