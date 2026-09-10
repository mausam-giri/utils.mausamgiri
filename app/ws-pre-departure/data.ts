export interface ChecklistItem {
  id: string;
  title: string;
  desc?: string;
}

/** Comfort / conditional items - hidden in Focus view unless flagged or searched */
export const optionalItemIds = new Set([
  "hotel-voucher-domestic",
  "body-lotion",
  "paper-soap",
  "detergent-pouch",
  "personal-hygiene",
  "towels",
  "tea-coffee",
  "biscuits",
  "nuts-seeds",
  "warmers",
  "exercise-mat",
  "stopwatch",
  "sunglasses",
  "safety-pins",
  "needle-thread",
]);

export const sectionPriority = [
  "travel-docs",
  "nsdc-items",
  "health-hygiene",
  "clothing",
  "tech-power",
  "travel-gear",
  "food-snacks",
  "info",
] as const;

export function isEssential(id: string) {
  return !optionalItemIds.has(id);
}

export function getAllChecklistItems() {
  return checklistData.flatMap((section) =>
    section.subsections.flatMap((sub) => sub.items),
  );
}

export interface Subsection {
  name: string;
  items: ChecklistItem[];
}

export interface Section {
  id: string;
  title: string;
  subsections: Subsection[];
}

export interface ArrivalCard {
  id: string;
  title: string;
  desc: string;
  href: string;
  arrivalAt: string;
  openHoursBefore: number;
  closeHoursBefore: number;
}

export const arrivalCard: ArrivalCard = {
  id: "foreigner-arrival-card",
  title: "Online Foreigner Arrival Card",
  desc: "Fill 72 to 24 hours before arrival in China.",
  href: "https://s.nia.gov.cn/ArrivalCardFillingPC/entry-registration-home",
  arrivalAt: "2026-09-19T19:00:00+08:00",
  openHoursBefore: 72,
  closeHoursBefore: 24,
};

export const checklistData: Section[] = [
  {
    id: "travel-docs",
    title: "Travel & Documents",
    subsections: [
      {
        name: "Domestic Travel",
        items: [
          {
            id: "govt-id",
            title: "Valid Government ID",
            desc: "Carry original for domestic transit and airport check-in",
          },
          {
            id: "flight-tickets-domestic",
            title: "Domestic Flight Tickets",
            desc: "Printed or digital boarding pass and full itinerary",
          },
          {
            id: "hotel-voucher-domestic",
            title: "Domestic Hotel Voucher",
            desc: "Confirmation for any stopover or transit stay in India",
          },
        ],
      },
      {
        name: "International Travel",
        items: [
          {
            id: "passport",
            title: "Passport (Original)",
            desc: "Keep on you at all times - never pack in checked luggage",
          },
          {
            id: "china-visa",
            title: "China Visa",
            desc: "Valid visa in passport plus a digital copy on your phone",
          },
          {
            id: "travel-insurance",
            title: "Travel Insurance",
            desc: "Policy document with coverage details and emergency helpline",
          },
          {
            id: "invitation-letter",
            title: "Visa Invitation Letter",
            desc: "Official WorldSkills / competition invitation letter",
          },
          {
            id: "flight-tickets-intl",
            title: "International Flight Tickets",
            desc: "Boarding passes, e-tickets, and complete return itinerary",
          },
          {
            id: "hotel-voucher-intl",
            title: "International Hotel Voucher",
            desc: "Confirmed booking for Shanghai and any transit stays abroad",
          },
        ],
      },
      {
        name: "Supporting Documents",
        items: [
          {
            id: "emergency-contact",
            title: "Emergency Contact Numbers",
            desc: "Save NSDC, team manager, and family contacts offline",
          },
          {
            id: "noc-employer-parents",
            title: "NoC from Employer / Parents",
            desc: "Signed letter if required by your institution or visa process",
          },
          {
            id: "medicine-prescription",
            title: "Medicine Prescription",
            desc: "Doctor's prescription for any medication you carry",
          },
          {
            id: "passport-photos",
            title: "Passport-Size Photos",
            desc: "2 recent photos - keep with your travel documents",
          },
        ],
      },
      {
        name: "Document Backups",
        items: [
          {
            id: "document-copies",
            title: "Two Sets of Photocopies",
            desc: "One set in check-in luggage, one set in hand luggage",
          },
        ],
      },
    ],
  },
  {
    id: "nsdc-items",
    title: "NSDC Provided Items",
    subsections: [
      {
        name: "Ceremonial & Competition Attire",
        items: [
          {
            id: "ceremony-attire",
            title: "Ceremony Attire",
            desc: "As per NSDC allotment - verify size and completeness",
          },
          {
            id: "tracksuit",
            title: "Track Suit with T-Shirt",
            desc: "As per NSDC allotment - include matching T-shirt",
          },
          {
            id: "trousers-shoes",
            title: "Formal Trousers & Shoes",
            desc: "For opening ceremony and official events",
          },
        ],
      },
      {
        name: "Kit & Merchandise",
        items: [
          {
            id: "cabin-trolley",
            title: "Cabin Trolley / Bag",
            desc: "NSDC-issued cabin bag - confirm before departure",
          },
          {
            id: "accessories",
            title: "Accessories Kit",
            desc: "Lapel pins and other NSDC-issued accessories",
          },
          {
            id: "intl-adaptor",
            title: "International Adaptor",
            desc: "Type I or Universal adaptor for China",
          },
          {
            id: "merchandise",
            title: "Merchandise",
            desc: "Team merchandise as per NSDC allotment",
          },
          {
            id: "table-flag",
            title: "Indian Flag",
            desc: "Table flag and hand flags as per allotment",
          },
          {
            id: "umbrella",
            title: "Umbrella",
            desc: "NSDC-issued or personal - useful for rain and sun",
          },
        ],
      },
      {
        name: "Currency",
        items: [
          {
            id: "foreign-currency",
            title: "Foreign Currency",
            desc: "USD / CNY in small denominations for immediate expenses",
          },
        ],
      },
    ],
  },
  {
    id: "clothing",
    title: "Clothing & Footwear",
    subsections: [
      {
        name: "Everyday Wear",
        items: [
          {
            id: "jacket",
            title: "Jacket",
            desc: "Light layer for air-conditioned venues and cooler evenings",
          },
          {
            id: "jeans",
            title: "Jeans (Blue / Black)",
            desc: "1–2 pairs for casual wear outside competition hours",
          },
          {
            id: "t-shirts",
            title: "T-Shirts",
            desc: "Enough for daily wear between competition days",
          },
          {
            id: "night-clothing",
            title: "Night Clothing",
            desc: "Comfortable sleepwear for the full trip duration",
          },
          {
            id: "white-socks",
            title: "Socks",
            desc: "Minimum 4–6 pairs - include sports and everyday pairs",
          },
          {
            id: "undergarments",
            title: "Undergarments",
            desc: "Minimum 4–6 pairs for the full trip",
          },
          {
            id: "warmers",
            title: "Warmers",
            desc: "Thermal layers if applicable for your skill or climate needs",
          },
        ],
      },
      {
        name: "Footwear",
        items: [
          {
            id: "formal-shoes",
            title: "Formal Shoes",
            desc: "Polished pair for ceremonies and official events",
          },
          {
            id: "sports-shoes",
            title: "Sports Shoes",
            desc: "Comfortable pair for daily walking and training",
          },
          {
            id: "safety-shoes",
            title: "Skill-Specific Safety Shoes",
            desc: "Required safety footwear for your competition skill",
          },
          {
            id: "bathroom-slippers",
            title: "Bathroom Slippers",
            desc: "Flip-flops or slides for hotel bathrooms and showers",
          },
        ],
      },
    ],
  },
  {
    id: "health-hygiene",
    title: "Health & Hygiene",
    subsections: [
      {
        name: "Medicines",
        items: [
          {
            id: "medications",
            title: "Personal Medications",
            desc: "Pack in carry-on with prescription - include extras for delays",
          },
          {
            id: "pain-relief",
            title: "Pain Relief",
            desc: "Paracetamol / ibuprofen for headaches and muscle soreness",
          },
          {
            id: "first-aid",
            title: "First-Aid Kit",
            desc: "Band-aids, antiseptic, and basic wound care supplies",
          },
        ],
      },
      {
        name: "Toiletries",
        items: [
          {
            id: "toiletries",
            title: "Shampoo / Shower Gel / Soap",
            desc: "Travel-size if you prefer not to use hotel-provided items",
          },
          {
            id: "body-lotion",
            title: "Body Lotion",
            desc: "Moisturizer for dry hotel air and long travel days",
          },
          {
            id: "deodorant",
            title: "Deodorant / Antiperspirant",
            desc: "Roll-on or stick - pack in liquids bag if aerosol",
          },
          {
            id: "toothbrush-paste",
            title: "Toothbrush & Toothpaste",
            desc: "Travel kit - keep in hand luggage for long flights",
          },
          {
            id: "paper-soap",
            title: "Paper Soap",
            desc: "Compact sheets for situations without running water",
          },
          {
            id: "detergent-pouch",
            title: "Small Detergent Pouch",
            desc: "For hand-washing clothes during a long stay",
          },
        ],
      },
      {
        name: "Daily Hygiene",
        items: [
          {
            id: "hand-sanitizer",
            title: "Hand Sanitizer & Mask",
            desc: "Sanitizer under 100 ml for carry-on; pack spare masks",
          },
          {
            id: "wet-wipes",
            title: "Wet Wipes",
            desc: "Travel pack for quick clean-ups on the go",
          },
          {
            id: "tissues",
            title: "Hanky / Tissues",
            desc: "Pocket pack of tissues or a small handkerchief",
          },
          {
            id: "sunscreen",
            title: "Sunscreen",
            desc: "SPF 50+ - Shanghai sun can be strong in September",
          },
          {
            id: "personal-hygiene",
            title: "Personal Hygiene Items",
            desc: "Any additional items specific to your daily routine",
          },
          {
            id: "towels",
            title: "Towels (Small & Large)",
            desc: "Travel towel and a small face towel as backup",
          },
        ],
      },
    ],
  },
  {
    id: "food-snacks",
    title: "Food & Snacks",
    subsections: [
      {
        name: "Ready-to-Eat Snacks",
        items: [
          {
            id: "dry-snacks",
            title: "Dry Snacks",
            desc: "Commercially packaged - theplas, khakhras, or similar",
          },
          {
            id: "energy-bars",
            title: "Energy Bars",
            desc: "High-protein bars for long competition days",
          },
          {
            id: "nuts-seeds",
            title: "Dry Fruits & Nuts",
            desc: "Almonds, walnuts, or mixed dry fruits for quick energy",
          },
          {
            id: "biscuits",
            title: "Biscuits",
            desc: "Glucose or digestive biscuits for light snacking",
          },
          {
            id: "tea-coffee",
            title: "Tea & Coffee Sachets",
            desc: "Instant sachets if you need your usual morning drink",
          },
        ],
      },
    ],
  },
  {
    id: "tech-power",
    title: "Tech & Power",
    subsections: [
      {
        name: "Chargers & Adapters",
        items: [
          
          {
            id: "device-chargers",
            title: "Mobile & Laptop Chargers",
            desc: "All chargers and cables - label them to avoid mix-ups",
          },
          {
            id: "power-bank",
            title: "Power Bank",
            desc: "Fully charged - carry in hand luggage only",
          },
        ],
      },
    ],
  },
  {
    id: "travel-gear",
    title: "Travel Gear & Tools",
    subsections: [
      {
        name: "Bags & Carry",
        items: [
          {
            id: "small-backpack",
            title: "Small Backpack",
            desc: "Day bag for venue visits, sightseeing, and daily essentials",
          },
          {
            id: "water-bottle",
            title: "Water Bottle",
            desc: "Reusable bottle - refill at hotel and venue stations",
          },
        ],
      },
      {
        name: "On-the-Go Essentials",
        items: [
          {
            id: "sunglasses",
            title: "Sunglasses",
            desc: "UV protection for outdoor travel and venue transfers",
          },
          {
            id: "safety-pins",
            title: "Safety Pins",
            desc: "One or two packets - quick fixes for clothing emergencies",
          },
          {
            id: "needle-thread",
            title: "Needle & Thread (White & Black)",
            desc: "Small sewing kit for badge, button, or hem repairs",
          },
        ],
      },
      {
        name: "Competition Tools",
        items: [
          {
            id: "stopwatch",
            title: "Stopwatch",
            desc: "If applicable for your skill - check competition regulations",
          },
          {
            id: "exercise-mat",
            title: "Exercise Mat",
            desc: "Portable mat if you follow a daily training schedule",
          },
        ],
      },
    ],
  },
  {
    id: "info",
    title: "Itinerary & Reminders",
    subsections: [
      {
        name: "Accommodation",
        items: [
          {
            id: "hotel-info",
            title: "Vienna International Hotel",
            desc: "Shanghai Hongqiao - save address in English and Chinese",
          },
        ],
      },
      {
        name: "Before You Leave",
        items: [
          {
            id: "hotel-addresses-saved",
            title: "Hotel Addresses Saved (EN + 中文)",
            desc: "Save all hotel addresses offline in both English and Chinese",
          },
          {
            id: "passport-accessible",
            title: "Passport Kept Accessible",
            desc: "Keep passport on you - required for ID checks at venues",
          },
        ],
      },
    ],
  },
];
