export const CONTACT = {
  phone: '+255 713689686',
  email: 'info@akisgroup.net',
  address: 'Posta House, 7 Ghana Avenue / Ohio Street, Dar es Salaam, Tanzania',
  city: 'Dar es Salaam, Tanzania',
};

export const TAGLINE = 'Travel Smart, Travel Better';
export const BRAND_NAME = 'Smart Travels by HL';
export const USD_TO_TZS_RATE = 2600;

export const BOOKING_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
];

export const STATS = [
  { value: '500+', label: 'Happy Travelers' },
  { value: '50+', label: 'Destinations' },
  { value: '2025', label: 'Est.' },
];

export const WHY_CHOOSE_US = [
  { title: 'Expert Guidance', description: 'Seasoned travel consultants with deep destination knowledge.', icon: 'compass' },
  { title: 'Best Value', description: 'Competitive pricing and transparent fees with no hidden costs.', icon: 'badge-dollar-sign' },
  { title: 'Personalized Plans', description: 'Tailored itineraries designed around your preferences and budget.', icon: 'heart' },
  { title: '24/7 Support', description: 'Round-the-clock assistance before, during, and after your trip.', icon: 'headphones' },
];

export const TESTIMONIALS = [
  { name: 'Sarah M.', location: 'Dar es Salaam', text: 'Smart Travels made our honeymoon unforgettable. Every detail was perfectly planned!' },
  { name: 'James K.', location: 'Nairobi', text: 'Got the best flight deals and visa support. Highly recommend their services.' },
  { name: 'Amina H.', location: 'Zanzibar', text: 'Professional, friendly, and always available. Our family trip was seamless.' },
];

export const TEAM = [
  { name: 'HL Founder', role: 'Lead Travel Consultant', initials: 'HL' },
  { name: 'Travel Expert', role: 'Visa Specialist', initials: 'TE' },
  { name: 'Holiday Planner', role: 'Itinerary Designer', initials: 'HP' },
];

export const SERVICE_IMAGES = {
  'travel-consultancy': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
  'air-ticketing': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
  'visa-documentation-assistance': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
  'holiday-planning': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
};

export const FALLBACK_SERVICES = [
  {
    id: 1,
    name: 'Travel Consultancy',
    slug: 'travel-consultancy',
    description:
      'Expert travel advice tailored to your needs. We help you plan the perfect itinerary, choose destinations, and make informed travel decisions.',
    icon: 'compass',
    image: SERVICE_IMAGES['travel-consultancy'],
    price_from: 50,
    is_active: true,
  },
  {
    id: 2,
    name: 'Air Ticketing',
    slug: 'air-ticketing',
    description:
      'Competitive airfares on domestic and international flights. We search multiple airlines to find the best routes and prices for your journey.',
    icon: 'plane',
    image: SERVICE_IMAGES['air-ticketing'],
    price_from: 100,
    is_active: true,
  },
  {
    id: 3,
    name: 'Visa Documentation Assistance',
    slug: 'visa-documentation-assistance',
    description:
      'Complete visa application support including document preparation, form filling, and submission guidance for destinations worldwide.',
    icon: 'file-text',
    image: SERVICE_IMAGES['visa-documentation-assistance'],
    price_from: 75,
    is_active: true,
  },
  {
    id: 4,
    name: 'Holiday Planning',
    slug: 'holiday-planning',
    description:
      'End-to-end holiday packages including accommodation, activities, and transfers. Let us craft your dream vacation from start to finish.',
    icon: 'palmtree',
    image: SERVICE_IMAGES['holiday-planning'],
    price_from: 200,
    is_active: true,
  },
];

export const SERVICE_DETAILS = {
  'travel-consultancy': {
    highlights: [
      'One-on-one consultation with a travel expert',
      'Personalized itinerary planning',
      'Destination research and recommendations',
      'Budget planning and cost breakdown',
      'Travel tips for first-time and repeat travelers',
    ],
    idealFor: 'Individuals, families, and groups planning domestic or international trips',
  },
  'air-ticketing': {
    highlights: [
      'Domestic and international flight bookings',
      'Multi-airline fare comparison',
      'Flexible date and route options',
      'Group and corporate ticketing',
      'Ticket changes and rebooking support',
    ],
    idealFor: 'Business travelers, holidaymakers, and group bookings',
  },
  'visa-documentation-assistance': {
    highlights: [
      'Visa requirement assessment',
      'Document checklist and preparation',
      'Application form completion',
      'Embassy appointment guidance',
      'Follow-up and status tracking support',
    ],
    idealFor: 'Tourist, business, student, and transit visa applicants',
  },
  'holiday-planning': {
    highlights: [
      'Custom holiday packages and itineraries',
      'Hotel and resort bookings',
      'Airport transfers and local transport',
      'Activity and excursion arrangements',
      'Honeymoon, family, and adventure packages',
    ],
    idealFor: 'Couples, families, and groups seeking a fully planned getaway',
  },
};

export const HERO_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80',
    label: 'Explore the World',
    destination: 'Global Destinations',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=80',
    label: 'Tropical Escapes',
    destination: 'Zanzibar, Tanzania',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80',
    label: 'City Adventures',
    destination: 'Dubai, UAE',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80',
    label: 'Wildlife Safaris',
    destination: 'Serengeti, Tanzania',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80',
    label: 'Road Trips',
    destination: 'Scenic Routes',
  },
];

export const PREVIOUS_TOURS = [
  {
    id: 1,
    title: 'Zanzibar Beach Escape',
    destination: 'Zanzibar, Tanzania',
    duration: '7 Days',
    travelers: 8,
    description: 'Crystal-clear waters, Stone Town heritage walks, and sunset dhow cruises for a perfect island getaway.',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80',
  },
  {
    id: 2,
    title: 'Dubai City & Desert Safari',
    destination: 'Dubai, UAE',
    duration: '5 Days',
    travelers: 14,
    description: 'Luxury shopping, Burj Khalifa views, and an unforgettable evening desert adventure with traditional dining.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
  },
  {
    id: 3,
    title: 'Serengeti Wildlife Safari',
    destination: 'Serengeti, Tanzania',
    duration: '6 Days',
    travelers: 6,
    description: 'Big Five game drives, luxury tented camps, and the awe-inspiring Great Migration experience.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
  },
  {
    id: 4,
    title: 'Paris Romantic Getaway',
    destination: 'Paris, France',
    duration: '4 Days',
    travelers: 2,
    description: 'Eiffel Tower evenings, Seine river cruises, and charming café-hopping through the City of Light.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
  },
  {
    id: 5,
    title: 'Cape Town Adventure',
    destination: 'Cape Town, South Africa',
    duration: '8 Days',
    travelers: 10,
    description: 'Table Mountain hikes, Cape Winelands tours, and coastal drives along the spectacular Garden Route.',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80',
  },
  {
    id: 6,
    title: 'Istanbul Cultural Journey',
    destination: 'Istanbul, Turkey',
    duration: '5 Days',
    travelers: 12,
    description: 'Hagia Sophia, Grand Bazaar treasures, and Bosphorus cruises bridging Europe and Asia.',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
  },
];
