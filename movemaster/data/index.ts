export { crew } from './crew';
export { services } from './services';
export { cities } from './cities';
export { reviews } from './reviews';

import type { CompanyStats, FAQItem, BlogPost, PricingTier } from '@/types';

export const companyStats: CompanyStats = {
  totalMoves: '12,400+',
  yearsInBusiness: '14',
  citiesCovered: '15+',
  customerRating: '4.9',
  crewMembers: '48',
  onTimeRate: '97%',
};

export const faqs: FAQItem[] = [
  {
    id: 'faq1',
    question: 'How far in advance should I book my move?',
    answer: 'We recommend booking at least 2-3 weeks in advance for residential moves, especially during peak season (May through September). However, our SOS Move service can accommodate bookings with as little as 24-48 hours notice, subject to crew availability. For large commercial moves or long-distance relocations, 4-6 weeks is ideal.',
    category: 'booking',
  },
  {
    id: 'faq2',
    question: 'How is my move priced?',
    answer: 'Our residential moves are priced hourly based on the size of your home and the number of crew members required. The hourly rate includes your crew, truck, fuel surcharge, and all moving equipment. Long-distance moves are priced as a flat fee based on distance and home size. We also offer flat-rate packing services priced per room. All pricing is fully transparent — use our online calculator to get an instant estimate, and your final quote will include a detailed breakdown.',
    category: 'pricing',
  },
  {
    id: 'faq3',
    question: 'What is included in the base moving rate?',
    answer: 'Every move includes: your dedicated moving crew, a fully equipped truck, protective blankets and furniture pads, floor runners and door-frame protectors, furniture dollies and moving straps, furniture disassembly and reassembly, and the fuel surcharge. Basic transit insurance is also included at no extra charge.',
    category: 'pricing',
  },
  {
    id: 'faq4',
    question: 'Do I need to be present during the move?',
    answer: 'We require that you or a designated representative be present at pickup and available at delivery to confirm inventory and sign off on the move. During the actual moving process, you do not need to be actively involved — our crews are self-directing and will manage the logistics. Many clients choose to handle cleaning or errands while we work.',
    category: 'moving-day',
  },
  {
    id: 'faq5',
    question: 'How do you protect my furniture and floors?',
    answer: 'We use heavy-duty moving blankets and furniture pads to wrap all large furniture before moving it. Mattress bags protect beds. Floor runners are placed at all entry points and throughout the home. Door-frame protectors are installed to prevent damage to walls and trim. Stretch wrap is used for drawers, doors, and items that could shift. We take these precautions on every single move.',
    category: 'moving-day',
  },
  {
    id: 'faq6',
    question: 'What is your cancellation policy?',
    answer: 'You may cancel or reschedule your move up to 72 hours before your booked date at no charge. Cancellations within 48 hours of the move may forfeit the deposit. Cancellations within 24 hours of the move forfeit the full deposit. We understand emergencies happen and review each situation with compassion — please contact us as soon as your plans change.',
    category: 'booking',
  },
  {
    id: 'faq7',
    question: 'Are your movers background checked?',
    answer: 'Yes, every MoveMaster Pro crew member undergoes a thorough background check before employment. Our hiring process also includes reference checks, a skills assessment, and a supervised training period. Our team is bonded and insured, giving you complete peace of mind about who is in your home.',
    category: 'booking',
  },
  {
    id: 'faq8',
    question: 'Do you charge for travel time?',
    answer: 'Our hourly rate begins when the crew arrives at your origin address, not when they depart from our facility. For moves that are longer than 45 minutes of travel distance (one way), a travel fee may apply. This will always be disclosed clearly in your quote before you book.',
    category: 'pricing',
  },
  {
    id: 'faq9',
    question: 'What items can you NOT move?',
    answer: 'For safety and liability reasons, we cannot transport: hazardous materials (gasoline, propane tanks, paint, cleaning solvents), perishable food items, live plants over 3 feet tall, pets, or illegal items. We also cannot transport items of extraordinary monetary value (cash, jewelry, financial documents) — these should be transported personally. Call us if you have questions about specific items.',
    category: 'moving-day',
  },
  {
    id: 'faq10',
    question: 'What happens if something is damaged during my move?',
    answer: 'All moves are covered by our Basic Transit Insurance, which covers items at $0.60 per pound per article as required by Ontario law. We strongly recommend our Enhanced Insurance upgrade (available at booking) which covers items at full replacement value. If damage occurs, report it to your crew lead immediately and complete a damage report form. Claims are processed within 5-7 business days.',
    category: 'moving-day',
  },
  {
    id: 'faq11',
    question: 'Do you supply packing materials?',
    answer: 'Yes — if you add our packing service, all materials are supplied by us at no extra charge, including boxes (various sizes), packing paper, bubble wrap, foam wrap, tape, wardrobe boxes, and dish pack boxes. If you prefer to purchase your own materials for self-packing, we can supply a recommended materials list based on your home size.',
    category: 'packing',
  },
  {
    id: 'faq12',
    question: 'How long does packing take?',
    answer: 'Our professional packers work approximately 1-1.5 rooms per hour per packer. A 2-bedroom home typically takes 3-4 hours with two packers. Kitchens take longest due to the volume of fragile items. We recommend booking packing for the day before your move date so the move itself can proceed with maximum efficiency.',
    category: 'packing',
  },
  {
    id: 'faq13',
    question: 'Can you pack just some rooms?',
    answer: 'Absolutely. Many clients prefer to self-pack straightforward items like books and clothing, and hire us only for the kitchen, fragile items, and large artwork. We are happy to do a partial pack on whatever rooms or item categories you specify.',
    category: 'packing',
  },
  {
    id: 'faq14',
    question: 'How does your storage work?',
    answer: 'Our storage facilities are climate-controlled units located in the Southern Ontario area. When you book storage with your move, our crew loads directly into your assigned unit — eliminating a separate handling step. You can access your unit during business hours with your personal access code. Monthly pricing is $149 for a standard unit, with discounts available for 3-month and 6-month commitments.',
    category: 'storage',
  },
  {
    id: 'faq15',
    question: 'Is my stuff insured while in storage?',
    answer: 'Yes. All items in our storage facilities are covered by our Storage Protection Plan, which provides $2,500 of basic coverage. Enhanced coverage up to $25,000 is available for an additional monthly premium. A photo inventory is taken at the time of storage for documentation purposes.',
    category: 'storage',
  },
  {
    id: 'faq16',
    question: 'Can I get a firm, not-to-exceed quote?',
    answer: 'For moves with clear, pre-defined scope (fixed origin and destination, no surprises), we offer a not-to-exceed guarantee in writing at booking. If the move runs faster than estimated, you pay for actual hours only. If it runs longer due to unforeseen circumstances (not due to scope changes), we honor the original estimate.',
    category: 'pricing',
  },
  {
    id: 'faq17',
    question: 'Do you move pianos?',
    answer: 'Yes, and we take it very seriously. We have three Piano Moving Certified technicians on our team who handle all piano moves. Upright pianos, grand pianos, and baby grands are all within our capability. We assess each piano individually for its specific requirements. Piano moves always include our Enhanced Specialty Insurance for full replacement value coverage.',
    category: 'moving-day',
  },
  {
    id: 'faq18',
    question: 'What is the deposit amount and when is it due?',
    answer: 'We require a deposit of 20% of your estimated move cost at the time of booking. This deposit is applied to your final invoice. The deposit can be paid by credit card online through our secure booking portal. The remaining balance is due on the day of your move upon completion.',
    category: 'booking',
  },
  {
    id: 'faq19',
    question: 'Can I get a quote over the phone or online?',
    answer: 'Yes to both. Our online quote wizard gives you a detailed price estimate in about 5 minutes based on your move details. For complex moves, large homes, or commercial relocations, we recommend a 15-minute phone consultation with one of our coordinators who can provide a more precise quote. Virtual or in-person pre-move assessments are also available for large jobs.',
    category: 'booking',
  },
  {
    id: 'faq20',
    question: 'Do you offer moving services on weekends and holidays?',
    answer: 'Yes. We operate 7 days a week, 365 days a year. Weekend and holiday rates may include a small premium (typically 10-15%). Many clients prefer to move on weekends to minimize disruption to work schedules, and our crews are fully staffed on Saturdays and Sundays. Statutory holiday availability is limited — we recommend booking well in advance for holiday weekend moves.',
    category: 'booking',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'bp1',
    slug: 'how-to-pack-kitchen-for-moving',
    title: '10 Pro Tips for Packing Your Kitchen Like a Moving Expert',
    excerpt: 'The kitchen is the hardest room to pack — fragile items, awkward shapes, and sheer volume. Here is how our professional packers approach it.',
    content: `The kitchen is consistently the room that surprises first-time movers the most. What looks like a manageable collection of dishes and appliances turns into an enormous volume of oddly-shaped, fragile, heavy items that require specific packing techniques to survive a move intact.

**Start with what you rarely use.** The stand mixer you break out at Christmas, the fondue set from your wedding — these should go in boxes first, weeks before moving day. This reduces the crunch in the final days and gets your least-essential kitchen items safely packed early.

**Invest in proper dish packs.** Standard boxes are not suitable for plates and bowls. Dish pack boxes have double-thick corrugated walls and are specifically designed for heavy, breakable kitchen items. Our crews use them exclusively for all dish and glassware packing.

**Pack plates vertically, not flat.** Counter-intuitively, plates survive moves better when packed on their edge rather than lying flat. Think of how record stores store vinyl — the structural integrity of a plate is much stronger along its edge than across its flat surface. Pack them like records with dividers between each plate.

**Use your dish towels and cloth napkins as packing material.** Wrap serving bowls in dish towels, nestle glasses inside folded napkins. This serves double duty: it packs your kitchen linens and provides excellent protection for your dishes simultaneously.

**Never leave empty space in boxes.** Empty space allows items to shift and collide in transit. Fill all gaps with crumpled packing paper. Shake each box gently before sealing — if you hear movement, add more fill.

**Label by contents AND fragility.** Write on the side of each box (not just the top), including what room it belongs to and a fragility rating. Our labelling system uses red tape for all fragile boxes so the crew knows immediately to handle them with extra care.

**Pack your appliances in their original boxes if possible.** Nothing protects a blender or espresso machine better than the custom-moulded packaging it came in. Keep original boxes for your most expensive appliances.

**Defrost your refrigerator 24 hours before moving day.** A running fridge cannot be moved safely. Defrost it the night before, clean it out, and leave the doors open. Pack a cooler with anything temperature-sensitive.

**Treat sharp knives seriously.** Wrap each knife individually in several layers of packing paper and clearly mark the box "SHARP — HANDLE WITH CARE." Knife blocks can be wrapped intact.

**Plan your kitchen essentials box.** Pack a separate "open first" box with the items you will need immediately in your new home: coffee maker, mugs, a pot, basic cutlery, dish soap, and a sponge. This box goes in last and comes out first.`,
    category: 'tips',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop',
    author: 'Priya Mehta',
    publishedAt: '2024-11-15',
    readTime: 6,
    tags: ['packing', 'kitchen', 'tips', 'moving'],
  },
  {
    id: 'bp2',
    slug: 'moving-toronto-guide-2024',
    title: 'The Complete Guide to Moving in Toronto: What Nobody Tells You',
    excerpt: 'Toronto moving has its own rules — parking permits, elevator bookings, building restrictions. Here is everything you need to know before moving day.',
    content: `Moving in Toronto is not like moving anywhere else in Canada. The density, the condo culture, the narrow streets, and the regulatory environment create a set of unique challenges that can derail even well-planned moves. Here is our complete insider guide based on thousands of Toronto moves.

**The elevator booking is not optional.** In virtually every Toronto condo building, you must book the freight elevator in advance for your move. Most buildings require 48-72 hours notice, and many only allow moves during specific hours (typically 8am-5pm, no weekends in some buildings). Missing this booking means your crew could be waiting hours. We handle all elevator bookings for our clients automatically.

**You will need a parking permit.** Street parking for a moving truck in most Toronto neighbourhoods requires a temporary parking permit from the City of Toronto. You can apply online at toronto.ca, and permits typically cost $33.50 for a 24-hour period. Apply at least 3 business days in advance. Failure to obtain a permit means your truck could be ticketed or towed — which stops your entire move.

**Moving in July and August is peak chaos.** The majority of Toronto leases end on July 31st, making August 1st the single busiest moving day in Ontario every year. Crews, trucks, and elevators are at maximum demand. If you have flexibility, avoid this window. If you cannot, book your movers at least 6-8 weeks in advance.

**Old Toronto homes have their own challenges.** The Annex, Roncesvalles, Leslieville, and other established neighbourhoods are full of Victorian and Edwardian semi-detached homes with narrow staircases, small doors, and no parking. An experienced Toronto crew knows how to navigate these — ask specifically about your building type when booking.

**Check your building rules.** Many Toronto condos have rules about which items may be moved through which entrances, whether movers need to be in uniform, and whether the building needs a certificate of insurance from the moving company. We provide all standard documentation automatically with every move.

**TTC and traffic are real factors.** Plan your move start time carefully. Rush hour on the Gardiner, the DVP, and anywhere downtown can add significant time to your move. Early morning start times (7-8am) are almost always more efficient than mid-morning in Toronto.`,
    category: 'local',
    image: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=800&h=500&fit=crop',
    author: 'Mike Kowalski',
    publishedAt: '2024-10-28',
    readTime: 8,
    tags: ['toronto', 'guide', 'moving', 'local tips'],
  },
  {
    id: 'bp3',
    slug: 'downsizing-guide-for-seniors',
    title: 'Downsizing After 60: A Compassionate Guide to Moving Less Stuff',
    excerpt: 'Letting go of decades of accumulated belongings is one of the hardest emotional challenges in moving. Here is how to approach it with intention.',
    content: `Downsizing is rarely just a logistical exercise — it is an emotional process of deciding which parts of your life to carry forward and which to release. For seniors moving to a smaller home or retirement community, this process can be profound. Here is a framework we have developed through thousands of senior moves.

**Give yourself more time than you think you need.** Sorting through 30 or 40 years of belongings cannot be done in a weekend. Start the process 3-6 months before your move date. Work in short sessions — 2-3 hours — to avoid emotional and physical exhaustion.

**Sort by category, not by room.** This approach, popularized by professional organizers, means gathering all your books together before sorting, then all clothing, then all kitchenware, etc. Seeing everything in a category at once makes it much easier to make decisions and identify duplicates.

**Photograph sentimental items before donating.** If you have furniture or objects that carry memories but do not fit in your new space, photograph them before they leave. A photo album of your home and its contents can be a treasured keepsake that takes up almost no physical space.

**Involve family early but set boundaries.** Letting children and grandchildren take items they value reduces the burden of disposal and ensures family treasures stay in the family. But set a deadline and stick to it — items unclaimed by the deadline get donated or sold.

**Use the "move and decide later" rule selectively.** For items you are genuinely unsure about, it is okay to move them and make the final decision once you are settled. But limit this category to no more than 10-15% of your total belongings — otherwise you will move too much and still face the decision later.

**Hire a senior move manager.** Our Gentle Transition service includes move management support, donation coordination, and a patient, unhurried approach to the physical move itself. You do not have to do this alone.`,
    category: 'guides',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop',
    author: 'Darnell Thompson',
    publishedAt: '2024-09-12',
    readTime: 7,
    tags: ['senior moving', 'downsizing', 'guide', 'tips'],
  },
  {
    id: 'bp4',
    slug: 'office-move-checklist',
    title: 'The 30-Day Office Relocation Checklist Every Business Needs',
    excerpt: 'Commercial moves require months of planning to execute without business disruption. Our 30-day countdown has everything covered.',
    content: `Office relocations are complex projects that touch every aspect of your business — your team, your technology, your clients, and your operations. Businesses that treat commercial moves as a logistics problem usually experience disruption. Businesses that treat them as a full project usually do not. Here is our 30-day master checklist.

**30 Days Out**
- Notify all clients and vendors of your upcoming address change
- Arrange for mail forwarding and address updates with Canada Post
- Audit all your equipment and furniture — what moves, what gets replaced?
- Book MoveMaster Pro and schedule a pre-move site visit

**21 Days Out**
- Develop an office layout plan for the new space
- Order any new furniture that needs to be delivered to the new address
- Begin updating your address with banks, suppliers, and government agencies
- Arrange for IT infrastructure setup at the new location

**14 Days Out**
- Brief your team on the move plan and their specific responsibilities
- Begin packing non-essential items and archives
- Confirm parking and loading dock arrangements at both buildings
- Obtain certificates of insurance if required by building management

**7 Days Out**
- Pack all personal desk items
- Label all equipment and furniture with destination location codes
- Back up all critical data and systems
- Confirm schedule with MoveMaster Pro coordinator

**Move Weekend**
- MoveMaster Pro crew arrives — usually Friday evening or Saturday morning
- All packing complete before crew arrives
- Supervise loading and document any pre-existing damage
- Oversee unloading and initial setup at new location

**Post-Move (Week 1)**
- Test all technology and connectivity
- Confirm everyone has received their equipment and personal items
- Update your Google Business Profile, website, and social media
- Send a formal address change notification to your full contact list`,
    category: 'guides',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop',
    author: 'Jessica Park',
    publishedAt: '2024-08-05',
    readTime: 9,
    tags: ['commercial', 'office move', 'checklist', 'business'],
  },
  {
    id: 'bp5',
    slug: 'moving-long-distance-ontario',
    title: 'Long-Distance Moving in Ontario: What to Expect and How to Prepare',
    excerpt: 'Moving across Ontario is a fundamentally different experience from a local move. Here is the complete preparation guide.',
    content: `Long-distance moves in Ontario — anything over an hour of driving — require a different kind of planning than local moves. The logistics of an all-day haul, the complexity of coordinating timing at both ends, and the extended period where your belongings are in transit all need specific attention.

**Get everything in writing.** For local moves, a phone quote can suffice. For long-distance, insist on a written quote that specifies the total price, what is included, the delivery window, and the insurance coverage. Read the fine print on delivery timing — some carriers quote multi-day delivery windows.

**Understand your insurance options.** Standard carrier liability for long-distance moves in Ontario is $0.60 per pound per article — that means a 10-pound laptop damaged in transit is covered for $6. This is essentially no coverage. Always purchase Enhanced Insurance for long-distance moves.

**Plan your delivery timing carefully.** Long-distance moves may not always be able to guarantee same-day delivery, especially for very long hauls (Toronto to Windsor, for example). Understand the delivery window before you book and make arrangements for where you will stay if your belongings arrive a day after you do.

**Create a detailed inventory.** Before your crew loads the truck, walk through the home with the lead mover and document what is going on the truck. Photograph large, high-value items. This documentation is your protection if something goes missing or is damaged in transit.

**Pack an essentials bag.** For a long-distance move, assume you might not have access to your boxes for 12-24 hours after you arrive. Pack a bag with medications, a change of clothes, toiletries, important documents, phone chargers, and snacks — everything you need to get through the first night.

**GPS tracking is your friend.** All MoveMaster Pro long-distance moves include a GPS tracking link. Share it with family members who want to know where your belongings are. It provides real peace of mind during what can be a nerve-wracking transit period.`,
    category: 'guides',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop',
    author: 'Tyler Bouchard',
    publishedAt: '2024-07-22',
    readTime: 7,
    tags: ['long distance', 'Ontario', 'guide', 'tips'],
  },
  {
    id: 'bp6',
    slug: 'waterloo-region-moving-guide',
    title: "Moving to the Waterloo Region: A Local's Guide to Your New Home",
    excerpt: "Kitchener, Waterloo, and Cambridge are booming. Here's everything you need to know about settling into Canada's tech triangle.",
    content: `The Waterloo Region has become one of Canada's most dynamic growth markets, attracting tech workers from across the country and around the world. If you are moving to Kitchener, Waterloo, or Cambridge, here is what you need to know to hit the ground running.

**The Region is actually three cities.** Kitchener and Waterloo share a border and blend into each other seamlessly — many residents cross from one to the other without realizing it. Cambridge, to the south, has its own distinct character with the beautiful Grand River running through the historic downtown. Each has its own city hall, mayor, and local culture.

**The ION Light Rail changes everything.** Waterloo Region's light rail transit line connects Conestoga Mall in Waterloo through Uptown Waterloo, to downtown Kitchener, and south toward Cambridge. Living near an ION stop significantly reduces your car dependence. Many new developments have been built specifically around the ION corridor.

**Uptown Waterloo vs. Downtown Kitchener.** These are the two main urban hubs. Uptown Waterloo is more upscale and walkable, with boutique shops, restaurants, and easy access to Waterloo Park. Downtown Kitchener has undergone significant revitalization and is now home to the Google Canadian HQ, Communitech, and a thriving arts scene.

**The university effect is real.** University of Waterloo and Wilfrid Laurier produce tens of thousands of graduates annually, many of whom stay in the region. This creates a young, educated, entrepreneurial culture — but also a competitive rental market near the universities. If you are renting, secure your place well in advance.

**Register your vehicle and get your Ontario health card updated.** When moving from another province, you have 60 days to register your vehicle and obtain an Ontario driver's license. Health card transitions depend on your province of origin. Complete these quickly — Ontario's OHIP has a 3-month waiting period for new provincial residents.

**MoveMaster Pro has a dedicated Waterloo Region crew.** We have served Kitchener, Waterloo, Cambridge, and Guelph for years and know every neighbourhood, building, and road in the region. Our local knowledge makes your move faster and smoother.`,
    category: 'local',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop',
    author: 'Jessica Park',
    publishedAt: '2024-06-10',
    readTime: 8,
    tags: ['waterloo region', 'kitchener', 'local guide', 'moving'],
  },
];

export const pricingTiers: PricingTier[] = [
  {
    id: 'basic',
    name: 'Essential Move',
    description: 'Everything you need for a straightforward local move. Perfect for studios, 1-bedroom apartments, and small households.',
    baseRate: 129,
    features: [
      '2-person crew',
      'Moving truck included',
      'Protective blankets and pads',
      'Basic furniture dollies',
      'Floor runners',
      'Fuel surcharge included',
      'Basic transit insurance',
      'Up to 25km local radius',
    ],
    popular: false,
  },
  {
    id: 'standard',
    name: 'Complete Move',
    description: 'Our most popular package for 2-3 bedroom homes. Includes enhanced equipment and a dedicated coordinator.',
    baseRate: 169,
    features: [
      '3-person crew',
      'Large moving truck included',
      'All Essential Move features',
      'Dedicated move coordinator',
      'Furniture disassembly and reassembly',
      'Wardrobe boxes included (4)',
      'Enhanced transit insurance',
      'Door-frame protectors',
      'Free in-home estimate',
      'Real-time move updates',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'White Glove Move',
    description: 'The ultimate moving experience. Full-service with packing, premium protection, and our senior crew leads.',
    baseRate: 249,
    features: [
      '4-5 person elite crew',
      'Premium moving truck fleet',
      'All Complete Move features',
      'Full packing and unpacking service',
      'All packing materials supplied',
      'Custom crating for fragile items',
      'Full-value replacement insurance',
      'Priority booking and scheduling',
      'Post-move placement assistance',
      'Complimentary 30-day storage',
      '24/7 coordinator availability',
    ],
    popular: false,
  },
];
