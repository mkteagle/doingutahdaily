export const POST_CATEGORIES = [
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
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];
