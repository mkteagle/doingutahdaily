export type Category =
  | "Family Activities"
  | "Outdoor Adventures"
  | "Indoor Activities"
  | "Seasonal Events"
  | "Free Events"
  | "Holiday Events"
  | "Food & Dining"
  | "Arts & Culture"
  // New Season Categories
  | "Spring"
  | "Summer"
  | "Fall"
  | "Winter"
  // New Holiday Categories
  | "Easter"
  | "Christmas"
  | "Thanksgiving"
  | "Valentine's Day"
  | "Fourth of July";

// Category statistics type
export type CategoryStats = {
  category: Category;
  count: number;
  description: string;
};

// All available categories
export const CATEGORIES = [
  "Family Activities",
  "Outdoor Adventures",
  "Indoor Activities",
  "Seasonal Events",
  "Free Events",
  "Holiday Events",
  "Food & Dining",
  "Arts & Culture",
  "Spring",
  "Summer",
  "Fall",
  "Winter",
  "Easter",
  "Christmas",
  "Thanksgiving",
  "Valentine's Day",
  "Fourth of July",
] as const;

export const CATEGORY_COLORS: Record<
  Category,
  {
    light: string;
    dark: string;
  }
> = {
  "Family Activities": {
    light: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    dark: "bg-blue-900/30 text-blue-200 border-blue-800 hover:bg-blue-800/50",
  },
  "Outdoor Adventures": {
    light: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    dark: "bg-green-900/30 text-green-200 border-green-800 hover:bg-green-800/50",
  },
  "Indoor Activities": {
    light:
      "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
    dark: "bg-purple-900/30 text-purple-200 border-purple-800 hover:bg-purple-800/50",
  },
  "Seasonal Events": {
    light:
      "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
    dark: "bg-orange-900/30 text-orange-200 border-orange-800 hover:bg-orange-800/50",
  },
  "Free Events": {
    light: "bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200",
    dark: "bg-teal-900/30 text-teal-200 border-teal-800 hover:bg-teal-800/50",
  },
  "Holiday Events": {
    light: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
    dark: "bg-red-900/30 text-red-200 border-red-800 hover:bg-red-800/50",
  },
  "Food & Dining": {
    light:
      "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
    dark: "bg-yellow-900/30 text-yellow-200 border-yellow-800 hover:bg-yellow-800/50",
  },
  "Arts & Culture": {
    light: "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200",
    dark: "bg-pink-900/30 text-pink-200 border-pink-800 hover:bg-pink-800/50",
  },
  // New Seasonal Categories
  Spring: {
    light:
      "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
    dark: "bg-emerald-900/30 text-emerald-200 border-emerald-800 hover:bg-emerald-800/50",
  },
  Summer: {
    light:
      "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
    dark: "bg-yellow-900/30 text-yellow-200 border-yellow-800 hover:bg-yellow-800/50",
  },
  Fall: {
    light:
      "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
    dark: "bg-orange-900/30 text-orange-200 border-orange-800 hover:bg-orange-800/50",
  },
  Winter: {
    light: "bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200",
    dark: "bg-sky-900/30 text-sky-200 border-sky-800 hover:bg-sky-800/50",
  },
  // New Holiday Categories
  Easter: {
    light: "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200",
    dark: "bg-pink-900/30 text-pink-200 border-pink-800 hover:bg-pink-800/50",
  },
  Christmas: {
    light: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
    dark: "bg-red-900/30 text-red-200 border-red-800 hover:bg-red-800/50",
  },
  Thanksgiving: {
    light: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
    dark: "bg-amber-900/30 text-amber-200 border-amber-800 hover:bg-amber-800/50",
  },
  "Valentine's Day": {
    light: "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200",
    dark: "bg-rose-900/30 text-rose-200 border-rose-800 hover:bg-rose-800/50",
  },
  "Fourth of July": {
    light:
      "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200",
    dark: "bg-indigo-900/30 text-indigo-200 border-indigo-800 hover:bg-indigo-800/50",
  },
};

// Descriptions for each category
export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  "Family Activities":
    "Fun activities for the whole family to enjoy together. From parks and playgrounds to museums and entertainment centers.",
  "Outdoor Adventures":
    "Exploring Utah's beautiful landscapes and natural wonders. Hiking trails, scenic drives, state parks, and outdoor recreational activities.",
  "Indoor Activities":
    "Great indoor destinations and activities for any weather. Perfect for rainy days or escaping the heat or cold.",
  "Seasonal Events":
    "Special events that celebrate Utah's distinct seasons. From summer festivals to winter wonderlands.",
  "Free Events":
    "No-cost activities and events around the state. Great options for family fun on a budget.",
  "Holiday Events":
    "Special celebrations and holiday-themed activities. Includes major holidays and local celebrations.",
  "Food & Dining":
    "Local eateries, food festivals, and dining experiences. Discover Utah's culinary scene and family-friendly restaurants.",
  "Arts & Culture":
    "Cultural events, museums, and artistic experiences. Explore Utah's rich heritage and vibrant arts community.",
  Spring:
    "Celebrate the renewal of nature with spring activities, flower festivals, and outdoor events as Utah comes alive after winter.",
  Summer:
    "Beat the heat with summer adventures, outdoor concerts, water activities, and family-friendly festivals across Utah.",
  Fall: "Experience Utah's stunning fall colors, harvest festivals, corn mazes, and seasonal activities perfect for the whole family.",
  Winter:
    "Discover Utah's winter wonderland with skiing, snowboarding, ice skating, and cozy indoor activities during the cold months.",
  // New Holiday Categories
  Easter:
    "Find Easter egg hunts, spring celebrations, and family-friendly holiday events throughout Utah.",
  Christmas:
    "Explore Utah's magical Christmas events, light displays, holiday markets, and festive family activities.",
  Thanksgiving:
    "Celebrate gratitude with Utah's Thanksgiving events, turkey trots, fall festivals, and community gatherings.",
  "Valentine's Day":
    "Find romantic date ideas, family-friendly Valentine's events, and special holiday activities across Utah.",
  "Fourth of July":
    "Celebrate Independence Day with fireworks displays, parades, patriotic events, and family festivities throughout Utah.",
};

// County to category mapping
export const COUNTY_TO_CATEGORIES: Record<string, Category[]> = {
  "Salt Lake": ["Family Activities", "Indoor Activities"],
  Utah: ["Family Activities", "Indoor Activities"],
  Davis: ["Family Activities", "Indoor Activities"],
  Cache: ["Family Activities", "Seasonal Events"],
  Iron: ["Family Activities", "Outdoor Adventures"],
  Tooele: ["Family Activities", "Outdoor Adventures"],
};

export const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  // Existing categories
  "Family Activities": ["family", "kids", "children", "activities", "fun"],
  "Outdoor Adventures": ["outdoor", "hiking", "mountain", "trail", "adventure"],
  "Indoor Activities": ["indoor", "museum", "inside"],
  "Seasonal Events": [
    "season",
    "seasonal",
    "spring",
    "summer",
    "fall",
    "winter",
  ],
  "Free Events": ["free", "no cost"],
  "Holiday Events": ["christmas", "holiday", "easter", "halloween"],
  "Food & Dining": ["food", "restaurant", "dining", "eat"],
  "Arts & Culture": ["art", "culture", "museum", "history", "gallery"],

  // New Seasonal Categories
  Spring: [
    "spring",
    "blossom",
    "flower",
    "garden",
    "bloom",
    "may",
    "april",
    "march",
    "tulip",
    "butterfly",
  ],
  Summer: [
    "summer",
    "pool",
    "beach",
    "swim",
    "sun",
    "june",
    "july",
    "august",
    "vacation",
    "bbq",
    "barbecue",
    "picnic",
  ],
  Fall: [
    "fall",
    "autumn",
    "harvest",
    "leaves",
    "september",
    "october",
    "november",
    "pumpkin",
    "apple",
    "corn maze",
    "halloween",
  ],
  Winter: [
    "winter",
    "snow",
    "ski",
    "snowboard",
    "december",
    "january",
    "february",
    "ice skating",
    "sledding",
    "snowman",
  ],

  // New Holiday Categories
  Easter: [
    "easter",
    "egg hunt",
    "bunny",
    "spring",
    "basket",
    "eggs",
    "chocolate",
    "parade",
    "pastel",
    "sunday",
  ],
  Christmas: [
    "christmas",
    "santa",
    "holiday",
    "december",
    "lights",
    "tree",
    "gifts",
    "carols",
    "winter",
    "festive",
    "presents",
    "north pole",
  ],
  Thanksgiving: [
    "thanksgiving",
    "turkey",
    "harvest",
    "november",
    "gratitude",
    "feast",
    "autumn",
    "parade",
    "family dinner",
    "fall",
  ],
  "Valentine's Day": [
    "valentine",
    "love",
    "romance",
    "february",
    "hearts",
    "chocolate",
    "date",
    "couples",
    "romantic",
    "dinner",
  ],
  "Fourth of July": [
    "fourth of july",
    "4th of july",
    "independence day",
    "fireworks",
    "parade",
    "patriotic",
    "america",
    "july",
    "summer",
    "bbq",
    "flag",
  ],
};

// Helper functions
export function isCategoryValid(category: string): category is Category {
  // @ts-ignore
  return CATEGORIES.includes(category as Category);
}

export function validateCategories(categories: unknown): Category[] {
  if (!Array.isArray(categories)) {
    return [];
  }
  return categories.filter(isCategoryValid);
}

export const CATEGORY_FALLBACKS: Record<string, string[]> = {
  "Family Activities": [
    "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5",
    "https://images.unsplash.com/photo-1576016770956-debb63d92058",
    "https://images.unsplash.com/photo-1601821326018-d949a54b6402",
    "https://images.unsplash.com/photo-1519248494489-1e9f5586bf10",
    "https://images.unsplash.com/photo-1543589077-47d81606c1bf",
    "https://images.unsplash.com/photo-1512389142860-9c449e58a543",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de",
    "https://images.unsplash.com/photo-1580687774498-124b6278fcf3",
    "https://images.unsplash.com/photo-1518998053901-5348d3961a04",
  ],
  "Outdoor Adventures": [
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
    "https://images.unsplash.com/photo-1533577116850-9cc66cad8a9b",
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946",
    "https://images.unsplash.com/photo-1586968295564-52c5d8d3559e",
    "https://images.unsplash.com/photo-1506783323968-e8dad28ae1de",
    "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a",
    "https://images.unsplash.com/photo-1507371341162-763b5e419408",
    "https://images.unsplash.com/photo-1510466385855-4b0a6cef6014",
    "https://images.unsplash.com/photo-1418985991508-e47386d96a71",
    "https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7",
  ],
  "Indoor Activities": [
    "https://images.unsplash.com/photo-1577997352126-8c795da26ba4",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843",
    "https://images.unsplash.com/photo-1522184216316-3c1a2f3f8c6f",
    "https://images.unsplash.com/photo-1515541324332-7dd0c37426e0",
    "https://images.unsplash.com/photo-1543589077-47d81606c1bf",
    "https://images.unsplash.com/photo-1512389142860-9c449e58a543",
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7",
    "https://images.unsplash.com/photo-1518542331925-4e0d5c4df441",
    "https://images.unsplash.com/photo-1531063592104-1a6c5b92a6d6",
    "https://images.unsplash.com/photo-1524438418049-ab2acb7aa48f",
  ],
  "Seasonal Events": [
    "https://images.unsplash.com/photo-1543393470-551206b6b01a",
    "https://images.unsplash.com/photo-1601821326018-d949a54b6402",
    "https://images.unsplash.com/photo-1519248494489-1e9f5586bf10",
    "https://images.unsplash.com/photo-1543589077-47d81606c1bf",
    "https://images.unsplash.com/photo-1512389142860-9c449e58a543",
    "https://images.unsplash.com/photo-1580687774498-124b6278fcf3",
    "https://images.unsplash.com/photo-1518998053901-5348d3961a04",
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946",
    "https://images.unsplash.com/photo-1586968295564-52c5d8d3559e",
    "https://images.unsplash.com/photo-1507371341162-763b5e419408",
  ],
  "Free Events": [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    "https://images.unsplash.com/photo-1511174511562-5f7f18b30d4b",
    "https://images.unsplash.com/photo-1503428593586-e225b39bddfe",
    "https://images.unsplash.com/photo-1485217447740-0c58b987f10e",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    "https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
    "https://images.unsplash.com/photo-1505929595793-52dba20f0f9c",
    "https://images.unsplash.com/photo-1495790355057-a4f0b8c49e5d",
    "https://images.unsplash.com/photo-1495576772974-54f7bcfbf3d8",
  ],
  "Holiday Events": [
    "https://images.unsplash.com/photo-1542204165-2f6aa1cd2313",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
    "https://images.unsplash.com/photo-1543589077-47d81606c1bf",
    "https://images.unsplash.com/photo-1512389142860-9c449e58a543",
    "https://images.unsplash.com/photo-1503264116251-35a269479413",
    "https://images.unsplash.com/photo-1548687774-bd35b1daec1f",
    "https://images.unsplash.com/photo-1519861153417-48cebc59f0eb",
    "https://images.unsplash.com/photo-1552429097-080b7aa0b9f4",
    "https://images.unsplash.com/photo-1576671089884-02b71a68b5b4",
    "https://images.unsplash.com/photo-1548095115-c4d17e2b1f26",
  ],
  "Food & Dining": [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de",
    "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    "https://images.unsplash.com/photo-1495195134817-aeb325a55b65",
    "https://images.unsplash.com/photo-1506354666786-959d6d497f1a",
    "https://images.unsplash.com/photo-1532634726-8b9fb99825c0",
    "https://images.unsplash.com/photo-1483736762161-1b9a2fc7d8b4",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543",
    "https://images.unsplash.com/photo-1464347744102-11db6282f854",
  ],
  "Arts & Culture": [
    "https://images.unsplash.com/photo-1580687774498-124b6278fcf3",
    "https://images.unsplash.com/photo-1518998053901-5348d3961a04",
    "https://images.unsplash.com/photo-1506773090264-ac0b07293a64",
    "https://images.unsplash.com/photo-1517345418765-a06387e015b9",
    "https://images.unsplash.com/photo-1482784160316-6eb046863ece",
    "https://images.unsplash.com/photo-1485201546206-0bde8b1d9b2b",
    "https://images.unsplash.com/photo-1510138480511-012d6097db1f",
    "https://images.unsplash.com/photo-1475688621402-81e2e7a80827",
    "https://images.unsplash.com/photo-1495510099262-cb55f04243cb",
    "https://images.unsplash.com/photo-1465403927572-6077d8d9d61d",
  ],
  Spring: [
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946",
    "https://images.unsplash.com/photo-1586968295564-52c5d8d3559e",
    "https://images.unsplash.com/photo-1517544705065-1d3ff5dcf479",
    "https://images.unsplash.com/photo-1550905785-3d5f1aabe4a6",
    "https://images.unsplash.com/photo-1551274087-d5a964b4d8cc",
    "https://images.unsplash.com/photo-1582821834145-6a1a9dd0a67c",
    "https://images.unsplash.com/photo-1494526585095-c41746248156",
    "https://images.unsplash.com/photo-1558199143-920ad95fbc51",
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b",
    "https://images.unsplash.com/photo-1523307730658-447f31cbfc96",
  ],
  Summer: [
    "https://images.unsplash.com/photo-1506783323968-e8dad28ae1de",
    "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a",
    "https://images.unsplash.com/photo-1523528283117-b6cb9e52975e",
    "https://images.unsplash.com/photo-1529065616360-42005a4d158e",
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    "https://images.unsplash.com/photo-1533577116850-9cc66cad8a9b",
    "https://images.unsplash.com/photo-1508182319740-e4e8e15a26c2",
    "https://images.unsplash.com/photo-1505575967450-d4cfc8e14e4b",
    "https://images.unsplash.com/photo-1535920527000-b6b6a9a0d8e4",
    "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e",
  ],
  Fall: [
    "https://images.unsplash.com/photo-1507371341162-763b5e419408",
    "https://images.unsplash.com/photo-1510466385855-4b0a6cef6014",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    "https://images.unsplash.com/photo-1501621965065-c6e1cf6b53e2",
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    "https://images.unsplash.com/photo-1545171130-c2761d56c83d",
    "https://images.unsplash.com/photo-1531266755973-87b9e4d60fa0",
    "https://images.unsplash.com/photo-1542241647-5697f8f94816",
    "https://images.unsplash.com/photo-1515410731717-0d06dbf05f6b",
    "https://images.unsplash.com/photo-1475691689965-546199b12f37",
  ],
  Winter: [
    "https://images.unsplash.com/photo-1418985991508-e47386d96a71",
    "https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7",
    "https://images.unsplash.com/photo-1515010242076-0e6fa362f7d7",
    "https://images.unsplash.com/photo-1514405702559-3b2675c95edc",
    "https://images.unsplash.com/photo-1515090126065-bf4b39a2bb12",
    "https://images.unsplash.com/photo-1477601263568-7e522f6c3b9b",
    "https://images.unsplash.com/photo-1543332164-6e24f03d60b6",
    "https://images.unsplash.com/photo-1519669556874-908db15aaf8a",
    "https://images.unsplash.com/photo-1509089563585-000d48f97f8c",
    "https://images.unsplash.com/photo-1546617895-e7624e2933c8",
  ],
  Easter: [
    "https://images.unsplash.com/photo-1522184216316-3c1a2f3f8c6f",
    "https://images.unsplash.com/photo-1515541324332-7dd0c37426e0",
    "https://images.unsplash.com/photo-1519268491675-bb67f21a2672",
    "https://images.unsplash.com/photo-1521266205517-83cb928af99f",
    "https://images.unsplash.com/photo-1486575008579-2a7b4b239ea3",
    "https://images.unsplash.com/photo-1541845153-fdb04f3c4786",
    "https://images.unsplash.com/photo-1525130413817-d45c1d2b478d",
    "https://images.unsplash.com/photo-1522448298144-3e66c0b32f9e",
    "https://images.unsplash.com/photo-1549317663-524c0b8df89a",
    "https://images.unsplash.com/photo-1523308303761-24cf456e8b70",
  ],
  Christmas: [
    "https://images.unsplash.com/photo-1543589077-47d81606c1bf",
    "https://images.unsplash.com/photo-1512389142860-9c449e58a543",
    "https://images.unsplash.com/photo-1513105737059-ff0cf0580fd2",
    "https://images.unsplash.com/photo-1546346605-5c21b20726d7",
    "https://images.unsplash.com/photo-1544207247-514cbae3c5cd",
    "https://images.unsplash.com/photo-1516214104701-8e3b9efb2b1a",
    "https://images.unsplash.com/photo-1511963214736-ac4c3e1cbf41",
    "https://images.unsplash.com/photo-1513938709626-d4f93bfa2829",
    "https://images.unsplash.com/photo-1545478573-9c37e17d81a6",
    "https://images.unsplash.com/photo-1508399694770-1a01028b1654",
  ],
  Thanksgiving: [
    "https://images.unsplash.com/photo-1506368249639-73a05d6f6488",
    "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98",
    "https://images.unsplash.com/photo-1567527157891-9c1f9b2b3aa5",
    "https://images.unsplash.com/photo-1533717089689-86917e17a1f2",
    "https://images.unsplash.com/photo-1563208723-652a136f3fbb",
    "https://images.unsplash.com/photo-1571299850321-d9ddc94f8437",
    "https://images.unsplash.com/photo-1574704555994-174f0ecde351",
    "https://images.unsplash.com/photo-1531947323161-bc75f5f1752e",
    "https://images.unsplash.com/photo-1571292217872-b36bb1b3db32",
    "https://images.unsplash.com/photo-1472393365320-db77a5abbecc",
  ],
  "Valentine's Day": [
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7",
    "https://images.unsplash.com/photo-1518542331925-4e0d5c4df441",
    "https://images.unsplash.com/photo-1501614836153-d856d41f60d8",
    "https://images.unsplash.com/photo-1517544705065-1d3ff5dcf479",
    "https://images.unsplash.com/photo-1521106279331-16b0e6943a7e",
    "https://images.unsplash.com/photo-1513451713350-dee890297c4a",
    "https://images.unsplash.com/photo-1519268491675-bb67f21a2672",
    "https://images.unsplash.com/photo-1501621965065-c6e1cf6b53e2",
    "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4",
    "https://images.unsplash.com/photo-1515003197213-bca8123f0ad1",
  ],
  "Fourth of July": [
    "https://images.unsplash.com/photo-1531063592104-1a6c5b92a6d6",
    "https://images.unsplash.com/photo-1524438418049-ab2acb7aa48f",
    "https://images.unsplash.com/photo-1564078516393-cf4d731dbe56",
    "https://images.unsplash.com/photo-1531266755973-87b9e4d60fa0",
    "https://images.unsplash.com/photo-1496177677007-05eb7d34b322",
    "https://images.unsplash.com/photo-1508946971161-ec8e71440fd2",
    "https://images.unsplash.com/photo-1509474520651-7f8b673eaac4",
    "https://images.unsplash.com/photo-1533581132556-2df9c7ba8c39",
    "https://images.unsplash.com/photo-1527933240431-048e14abbbf5",
    "https://images.unsplash.com/photo-1533514114760-6e25f8f55f3b",
  ],
};

export const DEFAULT_FALLBACKS = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
  "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b",
  "https://images.unsplash.com/photo-1543393470-551206b6b01a",
  "https://images.unsplash.com/photo-1507371341162-763b5e419408",
  "https://images.unsplash.com/photo-1576016770956-debb63d92058",
  "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de",
  "https://images.unsplash.com/photo-1580687774498-124b6278fcf3",
  "https://images.unsplash.com/photo-1518998053901-5348d3961a04",
];
