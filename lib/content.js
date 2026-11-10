export const studio = {
  name: "GB Solutions",
  since: "2011",
  tagline: "Interior architecture and turnkey build",
  addressLines: ["214, Saheed Nagar", "Bhubaneswar, Odisha 751007"],
  phone: "+91 98765 43210",
  phoneHref: "tel:+919876543210",
  email: "studio@gbsolutions.in",
  hours: "Monday to Saturday, 10am to 7pm IST",
};

export const places = [
  "Bhubaneswar",
  "Cuttack",
  "Puri",
  "Konark",
  "Rourkela",
  "Sambalpur",
  "Berhampur",
  "Balasore",
];

export const projects = [
  {
    slug: "monolith-house",
    title: "The Monolith House",
    type: "Homes",
    typeLabel: "Home",
    place: "Bhubaneswar",
    year: "2025",
    summary: "Laterite, lime plaster and a courtyard cut into the plan.",
    image: "/media/project-monolith.jpg",
    alt: "Living room with a low sofa, warm plaster walls and a tall window",
  },
  {
    slug: "aethelgard-skyline",
    title: "Aethelgard Skyline",
    type: "Homes",
    typeLabel: "Apartment",
    place: "Cuttack",
    year: "2026",
    summary: "Two flats joined, then quietened with oak and linen.",
    image: "/media/project-skyline.jpg",
    alt: "Open apartment interior with pale oak joinery and soft daylight",
  },
  {
    slug: "terracotta-courtyard",
    title: "The Terracotta Courtyard",
    type: "Hospitality",
    typeLabel: "Hospitality",
    place: "Puri",
    year: "2025",
    summary: "A boutique stay built around shade, not air conditioning.",
    image: "/media/project-courtyard.jpg",
    alt: "Hotel courtyard with arched openings and deep shaded seating",
  },
  {
    slug: "nexus-studio",
    title: "Nexus Studio",
    type: "Workspaces",
    typeLabel: "Workspace",
    place: "Bhubaneswar",
    year: "2026",
    summary: "Acoustic felt, blackened steel, and forty people who can think.",
    image: "/media/project-nexus.jpg",
    alt: "Workspace with long desks, plants and black steel partitions",
  },
];

export const materials = [
  {
    name: "Laterite and lime plaster",
    note: "Quarried near Khurda, slaked on site, finished by hand.",
  },
  {
    name: "Italian marble and granite",
    note: "Slab-matched at the yard, never on your floor.",
  },
  {
    name: "Teak, rosewood and veneer",
    note: "Seasoned through two monsoons before it becomes a door.",
  },
  {
    name: "Brass, copper, blackened steel",
    note: "Left to patinate. We do not lacquer time.",
  },
];

export const processSteps = [
  {
    number: "01",
    title: "Survey and brief",
    body: "We measure the site, watch the light at three times of day, and write down how you actually use each room — not how a brochure says you should.",
  },
  {
    number: "02",
    title: "Drawings and samples",
    body: "Plans, elevations, joinery details and physical samples on your table before anything is ordered. This is the stage where money is saved.",
  },
  {
    number: "03",
    title: "Build and procure",
    body: "Our own carpenters, masons and site engineers. One budget, weekly photographs, and decisions written down so they stay decided.",
  },
  {
    number: "04",
    title: "Handover and care",
    body: "We close the snag list with you standing in the room, hand over a material file, and come back at six months to see how it has aged.",
  },
];

export const reel = [
  {
    id: "north-light",
    title: "A window cut for north light",
    place: "Patia, Bhubaneswar",
    length: "2:10",
    note: "The wall was already up. We took it down again.",
    image: "/media/detail-living.jpg",
    alt: "Sunlight raking across a plaster wall and low furniture",
  },
  {
    id: "lime",
    title: "Six coats of lime plaster",
    place: "Buxi Bazar, Cuttack",
    length: "1:48",
    note: "Why the last three coats are only water and pigment.",
    image: "/media/detail-stair.jpg",
    alt: "Hand-finished plaster stairwell with a curved handrail",
  },
  {
    id: "courtyard",
    title: "A courtyard that takes the rain",
    place: "Old town, Puri",
    length: "2:34",
    note: "Drainage, shade, and one very old mango tree.",
    image: "/media/project-courtyard.jpg",
    alt: "Courtyard open to the sky with deep shaded verandahs",
  },
];

export const projectTypes = [
  "Full home turnkey",
  "Interiors only",
  "Villa or independent house",
  "Workspace",
  "Hospitality",
];

export const cities = [
  "Bhubaneswar",
  "Cuttack",
  "Puri",
  "Elsewhere in Odisha",
  "Outside Odisha",
];

export const budgets = [
  "Under 10 lakh",
  "10 to 25 lakh",
  "25 to 50 lakh",
  "50 lakh and above",
  "Not decided yet",
];

// Absolute hashes so the same header works on /work, /work/[slug] and the
// homepage without extra plumbing.
export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Studio", href: "/#studio" },
  { label: "Process", href: "/#process" },
  { label: "Video journal", href: "/#journal" },
  { label: "Contact", href: "/#contact" },
];
