// Bundled content. Used to seed MongoDB once, and as the fallback the public
// page renders if the database cannot be reached, so the site is never empty.

export const galleryCategories = ["Homes", "Workspaces", "Hospitality", "Details"];

export const gallerySeed = [
  {
    slug: "monolith-house",
    title: "The Monolith House",
    category: "Homes",
    typeLabel: "Home",
    place: "Bhubaneswar",
    year: "2025",
    summary: "Laterite, lime plaster and a courtyard cut into the plan.",
    description:
      "A four-bedroom house on a corner plot in Patia, planned around a courtyard that pulls the monsoon through the middle of the plan instead of sealing it out. The laterite came from Khurda, the lime was slaked on site, and the north wall was rebuilt once to correct a window we had drawn a metre too far east.\n\nWe stayed on the job from the first measurement to the last coat of plaster eighteen months later. The family moved in during a wet week in June and reported that the courtyard drained better than the street.",
    cover: "/media/project-monolith.jpg",
    coverAlt:
      "Living room with a low sofa, warm plaster walls and a tall window",
    images: [
      {
        url: "/media/project-monolith.jpg",
        alt: "Living room with a low sofa, warm plaster walls and a tall window",
        caption: "Living room, north wall",
      },
      {
        url: "/media/detail-living.jpg",
        alt: "Afternoon light raking across a lime plaster wall",
        caption: "Three o'clock light on lime plaster",
      },
      {
        url: "/media/detail-stair.jpg",
        alt: "Hand-finished plaster stairwell with a curved handrail",
        caption: "Stairwell, six coats by hand",
      },
    ],
  },
  {
    slug: "aethelgard-skyline",
    title: "Aethelgard Skyline",
    category: "Homes",
    typeLabel: "Apartment",
    place: "Cuttack",
    year: "2026",
    summary: "Two flats joined, then quietened with oak and linen.",
    description:
      "Two neighbouring flats on the eighth floor, bought together and opened into one home for a family of five. The structural work was straightforward; the difficulty was making an apartment feel like a house with a garden, which we did with a long oak wall that hides the kitchen, storage and a study behind flush doors.\n\nEvery fixing was drawn before anything was ordered. The client's only brief was 'nothing that looks like a hotel', so there is no feature wall, no cove lighting, and no marble in the bathrooms.",
    cover: "/media/project-skyline.jpg",
    coverAlt: "Open apartment interior with pale oak joinery and soft daylight",
    images: [
      {
        url: "/media/project-skyline.jpg",
        alt: "Open apartment interior with pale oak joinery and soft daylight",
        caption: "The wall we removed, now a threshold",
      },
      {
        url: "/media/detail-living.jpg",
        alt: "Sunlight across a plaster wall and low furniture",
        caption: "Sitting room before the curtains went up",
      },
    ],
  },
  {
    slug: "terracotta-courtyard",
    title: "The Terracotta Courtyard",
    category: "Hospitality",
    typeLabel: "Hospitality",
    place: "Puri",
    year: "2025",
    summary: "A boutique stay built around shade, not air conditioning.",
    description:
      "Six rooms around a courtyard in the old town, built for a family who wanted guests to sit outside in July. The verandahs are deep enough to keep the sun off the walls until four in the afternoon, and the air conditioning runs only at night.\n\nThe mango tree was surveyed before the plan was drawn and never moved. Its root zone set the courtyard's dimensions, which is why the building is asymmetric and better for it.",
    cover: "/media/project-courtyard.jpg",
    coverAlt: "Hotel courtyard with arched openings and deep shaded seating",
    images: [
      {
        url: "/media/project-courtyard.jpg",
        alt: "Hotel courtyard with arched openings and deep shaded seating",
        caption: "Courtyard, mid-monsoon",
      },
      {
        url: "/media/detail-stair.jpg",
        alt: "Plaster stairwell with a curved handrail",
        caption: "The stair to the four rooms upstairs",
      },
    ],
  },
  {
    slug: "nexus-studio",
    title: "Nexus Studio",
    category: "Workspaces",
    typeLabel: "Workspace",
    place: "Bhubaneswar",
    year: "2026",
    summary: "Acoustic felt, blackened steel, and forty people who can think.",
    description:
      "A studio for a software team that had outgrown a rented floor. They asked for quiet and daylight, in that order, so the plan puts desks along the windows and every meeting room in the middle, wrapped in felt and blackened steel.\n\nWe tested the acoustics with the client's own team before the partitions were fabricated. The result is a room where forty people can take calls at once without anyone raising their voice.",
    cover: "/media/project-nexus.jpg",
    coverAlt: "Workspace with long desks, plants and black steel partitions",
    images: [
      {
        url: "/media/project-nexus.jpg",
        alt: "Workspace with long desks, plants and black steel partitions",
        caption: "The long desk, before the chairs arrived",
      },
      {
        url: "/media/studio.jpg",
        alt: "Studio table with material samples and drawings",
        caption: "Samples that became the partition",
      },
    ],
  },
  {
    slug: "brass-and-lime",
    title: "Brass, lime, laterite",
    category: "Details",
    typeLabel: "Details",
    place: "Across projects",
    year: "2026",
    summary: "The same four materials, photographed as they age.",
    description:
      "A study of the four materials that run through every GB Solutions project: laterite, lime plaster, teak and brass. Photographed across three sites at different ages, from a handrail oiled last month to a plaster wall that has been through four monsoons.\n\nNothing here is new. The point is what happens after the handover, which is the part of the job most studios stop photographing.",
    cover: "/media/detail-stair.jpg",
    coverAlt: "Curved plaster handrail against a hand-finished wall",
    images: [
      {
        url: "/media/detail-stair.jpg",
        alt: "Hand-finished plaster stairwell with a curved handrail",
        caption: "Handrail, oiled not lacquered",
      },
      {
        url: "/media/studio.jpg",
        alt: "Material samples and drawings on a studio table",
        caption: "Lime, teak, marble, brass",
      },
      {
        url: "/media/detail-living.jpg",
        alt: "Sunlight raking across a plaster wall",
        caption: "The finish nobody notices until it is wrong",
      },
    ],
  },
];

export const videoSeed = [
  {
    title: "A window cut for north light",
    place: "Patia, Bhubaneswar",
    recordedOn: "March 2026",
    duration: "0:07",
    note: "The wall was already up. We took it down again.",
    description:
      "A quiet walk through the sitting room at the Monolith House, filmed the week the plaster cured. North light, no lamps, one window moved a metre to the left.",
    poster: "/media/video/north-light.jpg",
    posterAlt: "Afternoon sun raking across a plaster wall and low furniture",
    source: "file",
    src: "/media/video/north-light.mp4",
  },
  {
    title: "Six coats of lime",
    place: "Buxi Bazar, Cuttack",
    recordedOn: "January 2026",
    duration: "0:07",
    note: "Why the last three coats are only water and pigment.",
    description:
      "Our plasterer finishing the stairwell. The first three coats build the body; the last three are water, pigment and a trowel that never stops moving.",
    poster: "/media/video/lime.jpg",
    posterAlt: "Hand-finished plaster stairwell with a curved handrail",
    source: "file",
    src: "/media/video/lime.mp4",
  },
  {
    title: "A courtyard that takes the rain",
    place: "Old town, Puri",
    recordedOn: "August 2025",
    duration: "0:07",
    note: "Drainage, shade, and one very old mango tree.",
    description:
      "Filmed at the end of a monsoon afternoon. Everything you can hear is water finding the channel we cut around the tree.",
    poster: "/media/video/courtyard.jpg",
    posterAlt: "Courtyard open to the sky with deep shaded verandahs",
    source: "file",
    src: "/media/video/courtyard.mp4",
  },
  {
    title: "Where the drawings get argued over",
    place: "Saheed Nagar studio",
    recordedOn: "June 2026",
    duration: "0:07",
    note: "Sample day, the part nobody photographs.",
    description:
      "A morning in the studio: three stones on the table, two of them rejected, and a client learning why the cheaper marble is the expensive one.",
    poster: "/media/video/studio.jpg",
    posterAlt: "Studio table with stone samples, drawings and a brass rule",
    source: "file",
    src: "/media/video/studio.mp4",
  },
];
