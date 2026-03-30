/* ============================================
   SCENARIO CONFIGURATION ENGINE
   32 Personalisation Scenarios
   ============================================ */

// Plan data reference
const PLANS = {
  select: {
    id: 'select',
    name: 'HealthShield Select',
    type: 'Base / Customisable',
    defaultTagline: 'Customisable plan',
    basePrice: 6580,
    originalPrice: 9014,
    features: [
      'Restore Infinity Plus (unlimited SI resets)',
      'Infinite Advantage (no SI limit on one claim)',
      '30-day PED wait via Advanced Cover Rider',
      'OPD Care / Mental Wellbeing riders',
      '7.5% Professional Discount',
      'Young Family Discount (10% if all under 40)',
      'No upper age limit for entry',
      'Annual health check-up',
      'Consumables cover',
      'Room category: any'
    ]
  },
  premier: {
    id: 'premier',
    name: 'HealthShield Premier',
    type: 'Comprehensive / Premium',
    defaultTagline: 'Comprehensive plan + Additional Riders',
    basePrice: 12450,
    originalPrice: 14800,
    features: [
      'Global Cover (worldwide hospitalisation)',
      'Air Ambulance up to ₹5L',
      'Accidental Death Benefit (100% SI, max ₹50L)',
      'Maternity + ₹20K girl child bonus',
      'Unlimited specialist teleconsult',
      'Restore Benefit',
      'Compassionate Travel',
      'OPD dental cover',
      'Annual health check-up',
      'Consumables cover'
    ]
  },
  plus: {
    id: 'plus',
    name: 'HealthShield Plus',
    type: 'Super Top-Up',
    defaultTagline: 'Extends your existing cover',
    basePrice: 3200,
    originalPrice: 4100,
    features: [
      'Deductible: ₹2L–₹20L',
      'SI up to ₹1 Crore',
      'Aggregate deductible (family floater)',
      '50% cumulative bonus/claim-free year',
      'Global Cover optional (+10%)',
      'No PPC up to ₹50L SI (age ≤45)',
      'Annual health check-up',
      'Consumables cover',
      'Room category: any',
      'Day care procedures'
    ]
  },
  eldercare: {
    id: 'eldercare',
    name: 'SeniorShield',
    type: 'Senior-specific',
    defaultTagline: 'Built for 61+, dignity-focused',
    basePrice: 18900,
    originalPrice: 22000,
    features: [
      'No upper age limit',
      'Home Nursing (7 days)',
      'Home Physio (10 sessions)',
      'Compassionate Caregiver (14 days)',
      'Home Care (10% SI)',
      'Annual dental + eye + ortho check-up',
      '20% co-pay (waivable)',
      'PED: 24 months',
      'SI: ₹5L / ₹10L / ₹25L',
      'Day care procedures'
    ]
  },
  criti: {
    id: 'criti',
    name: 'CritiShield',
    type: 'Critical Illness',
    defaultTagline: 'Lump-sum on diagnosis',
    basePrice: 4500,
    originalPrice: 5200,
    features: [
      '50 or 100 CI cover (lump sum)',
      'Cancer 360° Indemnity',
      'Waiver of 70% renewal for 3 years',
      'Multipay (3 claims lifetime)',
      'Hospital Cash',
      'Wellsurance (surgery lump sums)',
      'Personal Accident (₹3L)',
      'Pays at diagnosis, not at discharge',
      'Chemo, radio, global treatment',
      'Critical illness cover'
    ]
  }
};

// All 32 scenarios
const SCENARIOS = {
  // ========== Category: Price & Value (1-4) ==========
  1: {
    scenarioId: 1,
    scenarioName: 'Price-conscious buyer',
    category: 'Price & Value',
    aiSignal: 'Sorts by price, filters SI below ₹5L, asks "cheapest plan"',
    recommendedPlans: ['select'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'Best Value' },
    scenarioBanner: {
      headline: 'Full hospitalisation cover — ₹18/day. No compromises.',
      body: 'Complete health protection at a price that works for you.',
      bgColor: 'blue'
    },
    tiaGreeting: 'We found plans that fit your budget.',
    primaryCTA: 'See what ₹18/day covers',
    priceDisplay: 'daily',
    discountBadge: { text: '27% Off', percentage: 27 },
    featurePriority: ['Consumables cover', 'Room category: any', 'Annual health check-up', 'Restore Infinity Plus (unlimited SI resets)'],
    newElements: ['costConverter'],
    trustSignals: ['Claim settlement ratio: 96%', '30-day free look period — full refund if not satisfied'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '5',
    policyTenure: '1',
    planTaglines: { select: 'Maximum coverage at minimum cost' }
  },

  2: {
    scenarioId: 2,
    scenarioName: 'High-value seeker',
    category: 'Price & Value',
    aiSignal: 'Filters SI ₹50L+, reads "no room rent cap", "zero co-pay"',
    recommendedPlans: ['premier', 'select', 'plus'],
    preSelectedPlan: 'premier',
    recommendedBadgePlan: 'premier',
    planCardBadges: { premier: 'Most Complete' },
    scenarioBanner: {
      headline: 'India\'s most complete health plan.',
      body: 'Zero co-pay. No room rent cap. Global cover included.',
      bgColor: 'purple'
    },
    tiaGreeting: 'Here\'s the premium protection you\'re looking for.',
    primaryCTA: 'Proceed to optional covers',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Global Cover (worldwide hospitalisation)', 'Air Ambulance up to ₹5L', 'Unlimited specialist teleconsult', 'Restore Benefit'],
    newElements: [],
    trustSignals: ['No room rent cap — choose any hospital', 'Covers 580+ day care procedures'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '50',
    policyTenure: '1',
    planTaglines: { premier: 'The most comprehensive plan in India' }
  },

  3: {
    scenarioId: 3,
    scenarioName: 'EMI / instalment seeker',
    category: 'Price & Value',
    aiSignal: 'Searches "monthly pay", "EMI option", drops off at payment',
    recommendedPlans: ['select', 'plus'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'Best EMI Value' },
    scenarioBanner: {
      headline: 'The longer you commit, the less you pay.',
      body: 'See your premium as a monthly cost — it\'s more affordable than you think.',
      bgColor: 'blue'
    },
    tiaGreeting: 'We can break it down monthly for you.',
    primaryCTA: 'See monthly payment options',
    priceDisplay: 'monthly',
    discountBadge: { text: '10% off 3-year tenure', percentage: 10 },
    featurePriority: ['Restore Infinity Plus (unlimited SI resets)', 'Annual health check-up', 'Consumables cover'],
    newElements: ['costConverter'],
    trustSignals: ['Pay monthly, stay protected yearly'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '10',
    policyTenure: '3',
    tenureBadge: '10% discount on 3-year tenure',
    planTaglines: { select: 'Affordable monthly payments available' }
  },

  4: {
    scenarioId: 4,
    scenarioName: 'Cumulative bonus maximiser',
    category: 'Price & Value',
    aiSignal: 'Asks about cumulative bonus, renewal discount, reads bonus growth',
    recommendedPlans: ['select', 'premier'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'Best Bonus Growth' },
    scenarioBanner: {
      headline: 'Your cover can double — without paying more.',
      body: '50% Cumulative Bonus per claim-free year. In 5 years, your ₹10L becomes ₹20L.',
      bgColor: 'green'
    },
    tiaGreeting: 'Let\'s show you how your Cumulative Bonus grows.',
    primaryCTA: 'Lock in your bonus growth',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Restore Infinity Plus (unlimited SI resets)', 'Annual health check-up', 'Consumables cover'],
    newElements: ['ncbCalculator'],
    trustSignals: ['50% Cumulative Bonus per claim-free year', 'Maximum bonus: 100% of sum insured'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '10',
    policyTenure: '1',
    planTaglines: { select: 'Rewards you for staying healthy' }
  },

  // ========== Category: Employment (5-8) ==========
  5: {
    scenarioId: 5,
    scenarioName: 'Salaried with employer cover',
    category: 'Employment',
    aiSignal: 'Mentions "company insurance", enters low SI',
    recommendedPlans: ['plus', 'select'],
    preSelectedPlan: 'plus',
    recommendedBadgePlan: 'plus',
    planCardBadges: { plus: 'Recommended Top-Up' },
    scenarioBanner: {
      headline: 'Company cover ends when employment does.',
      body: 'A top-up gives you ₹1 crore of cover — not ₹1 crore of premium.',
      bgColor: 'orange'
    },
    tiaGreeting: 'Let\'s close the gap your employer cover leaves.',
    primaryCTA: 'See your coverage gap',
    priceDisplay: 'annual',
    discountBadge: { text: '7.5% Professional Discount', percentage: 7.5 },
    featurePriority: ['Deductible: ₹2L–₹20L', 'SI up to ₹1 Crore', '50% cumulative bonus/claim-free year'],
    newElements: ['gapVisualiser'],
    trustSignals: ['7.5% Professional Discount for salaried individuals', '₹1 crore of cover. Not ₹1 crore of premium.'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '25',
    policyTenure: '1',
    planTaglines: { plus: 'Sits over your employer cover', select: '80D tax deduction eligible' }
  },

  6: {
    scenarioId: 6,
    scenarioName: 'Self-employed / freelancer',
    category: 'Employment',
    aiSignal: 'Selects "self-employed" or "freelancer" in form',
    recommendedPlans: ['premier', 'select'],
    preSelectedPlan: 'premier',
    recommendedBadgePlan: 'premier',
    planCardBadges: { premier: 'Most Complete' },
    scenarioBanner: {
      headline: 'Built for people who can\'t afford to be sick.',
      body: 'Home care, domiciliary, restore benefit — and 80D tax deduction.',
      bgColor: 'blue'
    },
    tiaGreeting: 'Independent professionals need independent protection.',
    primaryCTA: 'Protect your income',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Restore Benefit', 'Compassionate Travel', 'OPD dental cover', 'Unlimited specialist teleconsult'],
    newElements: [],
    trustSignals: ['80D deduction: save up to ₹75,000 in taxes', 'Home care and domiciliary cover included'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '25',
    policyTenure: '1',
    planTaglines: { premier: 'Built for people who can\'t afford to be sick', select: 'Independence-first health cover' }
  },

  7: {
    scenarioId: 7,
    scenarioName: 'Government / PSU employee',
    category: 'Employment',
    aiSignal: 'Mentions CGHS, ECHS, ESIC, or government job',
    recommendedPlans: ['plus', 'criti'],
    preSelectedPlan: 'plus',
    recommendedBadgePlan: 'plus',
    planCardBadges: { plus: 'Bridges CGHS Gap' },
    scenarioBanner: {
      headline: 'CGHS for the basics. HealthShield Plus for everything else.',
      body: 'Private hospitals, zero waiting, continuity after retirement.',
      bgColor: 'blue'
    },
    tiaGreeting: 'Let\'s cover what CGHS doesn\'t.',
    primaryCTA: 'See deductible options',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Deductible: ₹2L–₹20L', 'SI up to ₹1 Crore', 'Global Cover optional (+10%)'],
    newElements: ['gapVisualiser'],
    trustSignals: ['Continues after retirement', 'Access to private hospital network'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '25',
    policyTenure: '1',
    planTaglines: { plus: 'Bridges CGHS/ESIC gaps', criti: 'Lump-sum on critical illness diagnosis' }
  },

  8: {
    scenarioId: 8,
    scenarioName: 'NRI / global professional',
    category: 'Employment',
    aiSignal: 'Enters foreign address, asks about OCI cover',
    recommendedPlans: ['premier'],
    preSelectedPlan: 'premier',
    recommendedBadgePlan: 'premier',
    planCardBadges: { premier: 'No Borders. No Gaps.' },
    scenarioBanner: {
      headline: 'No borders. No gaps.',
      body: 'Global cover for planned hospitalisation. NRI/OCI eligible. Visa medical expenses included.',
      bgColor: 'purple'
    },
    tiaGreeting: 'Global protection for global citizens.',
    primaryCTA: 'Get worldwide cover',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Global Cover (worldwide hospitalisation)', 'Air Ambulance up to ₹5L', 'Compassionate Travel', 'Unlimited specialist teleconsult'],
    newElements: [],
    trustSignals: ['Covers treatment in 180+ countries', 'NRI/OCI eligible'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '50',
    policyTenure: '1',
    planTaglines: { premier: 'Health cover without borders' }
  },

  // ========== Category: Family & Life Stage (9-13) ==========
  9: {
    scenarioId: 9,
    scenarioName: 'Family floater buyer',
    category: 'Family & Life Stage',
    aiSignal: 'Asks about floater, adds spouse/kids',
    recommendedPlans: ['select', 'premier'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'Family Friendly' },
    scenarioBanner: {
      headline: 'One premium. Everyone protected.',
      body: 'Two hospital visits in one year? Your entire family stays covered — every time, every member — with Restore Infinity Plus.',
      bgColor: 'blue'
    },
    tiaGreeting: 'Here\'s the best plan for your whole family.',
    primaryCTA: 'Cover your family today',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Restore Infinity Plus (unlimited SI resets)', 'Annual health check-up', 'Consumables cover'],
    newElements: ['gapVisualiser'],
    trustSignals: ['Unlimited SI resets with Restore Infinity Plus', 'Family floater discount applied'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '15',
    policyTenure: '1',
    policyFor: 'Self + Spouse + 2 Kids - 400001',
    planTaglines: { select: 'One premium. Everyone protected.', premier: 'Complete family protection' }
  },

  10: {
    scenarioId: 10,
    scenarioName: 'Newly married couple',
    category: 'Family & Life Stage',
    aiSignal: 'Age 24-34, recently added spouse, asks about maternity',
    recommendedPlans: ['premier', 'select'],
    preSelectedPlan: 'premier',
    recommendedBadgePlan: 'premier',
    planCardBadges: { premier: 'Couples Cover' },
    scenarioBanner: {
      headline: 'A new chapter deserves the right protection.',
      body: 'Cover both of you under one plan. Because taking care of each other is what partnership is about.',
      bgColor: 'purple'
    },
    tiaGreeting: 'Congratulations! Let\'s protect what matters most.',
    primaryCTA: 'Protect your partner today',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Maternity + ₹20K girl child bonus', 'Unlimited specialist teleconsult', 'Global Cover (worldwide hospitalisation)'],
    newElements: ['maternityTimeline'],
    trustSignals: ['₹20K girl child bonus', 'Newborn cover from Day 1'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '15',
    policyTenure: '1',
    policyFor: 'Self + Spouse - 400001',
    planTaglines: { premier: 'Complete couples cover + future-ready benefits', select: 'Flexible cover for two' }
  },

  11: {
    scenarioId: 11,
    scenarioName: 'Expecting parent / maternity seeker',
    category: 'Family & Life Stage',
    aiSignal: 'Searched "maternity cover", "delivery insurance"',
    recommendedPlans: ['premier', 'select'],
    preSelectedPlan: 'premier',
    recommendedBadgePlan: 'premier',
    planCardBadges: { premier: 'Best Maternity Plan' },
    scenarioBanner: {
      headline: 'Every day you wait is a day the clock isn\'t running.',
      body: 'Maternity cover, newborn from Day 1, girl child bonus. Start the waiting period now.',
      bgColor: 'orange'
    },
    tiaGreeting: 'Let\'s get your maternity cover started — the clock begins today.',
    primaryCTA: 'Start maternity waiting period now',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Maternity + ₹20K girl child bonus', 'Unlimited specialist teleconsult', 'Restore Benefit'],
    newElements: ['maternityTimeline'],
    trustSignals: ['Real delivery cost data: Normal ₹50K–₹2L, C-section ₹1.5L–₹5L', 'Newborn covered from Day 1'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '15',
    policyTenure: '1',
    policyFor: 'Self + Spouse - 400001',
    planTaglines: { premier: 'Complete maternity + newborn cover', select: 'Maternity Care rider available' }
  },

  12: {
    scenarioId: 12,
    scenarioName: 'Parent covering senior parents',
    category: 'Family & Life Stage',
    aiSignal: 'Adds members 60+, searches "parents health plan"',
    recommendedPlans: ['eldercare'],
    preSelectedPlan: 'eldercare',
    recommendedBadgePlan: 'eldercare',
    planCardBadges: { eldercare: 'Built for Parents' },
    scenarioBanner: {
      headline: 'They spent 30 years protecting you.',
      body: 'A policy can return the favour. Home nursing, compassionate caregiver, no upper age limit.',
      bgColor: 'blue'
    },
    tiaGreeting: 'Let\'s find the right cover for your parents.',
    primaryCTA: 'Protect your parents today',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['No upper age limit', 'Home Nursing (7 days)', 'Compassionate Caregiver (14 days)', 'Home Care (10% SI)'],
    newElements: [],
    trustSignals: ['No upper age limit', 'Home-based care included', '24-month PED waiting period'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '10',
    policyTenure: '1',
    policyFor: 'Father (65) + Mother (62) - 400001',
    planTaglines: { eldercare: 'Dignity-focused care for parents' }
  },

  13: {
    scenarioId: 13,
    scenarioName: 'Young single individual',
    category: 'Family & Life Stage',
    aiSignal: 'Age under 28, single, asks "do I really need it"',
    recommendedPlans: ['select'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'Young Family Discount' },
    scenarioBanner: {
      headline: 'Young Family Discount — 10% off if all insured are under 40.',
      body: 'Lock your rate now. It only goes up with age. Plus, save up to ₹25,000 in taxes under 80D.',
      bgColor: 'green'
    },
    tiaGreeting: 'Smart financial move — lock your premium while you\'re young.',
    primaryCTA: 'Lock your rate before it rises',
    priceDisplay: 'daily',
    discountBadge: { text: '10% Young Family Discount', percentage: 10 },
    featurePriority: ['Restore Infinity Plus (unlimited SI resets)', 'Annual health check-up', 'Consumables cover'],
    newElements: ['costConverter'],
    trustSignals: ['80D tax deduction: save ₹25,000/year', 'Rate locked at current age premium'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '5',
    policyTenure: '1',
    planTaglines: { select: 'Smart financial planning starts here' }
  },

  // ========== Category: Health Profile (14-19) ==========
  14: {
    scenarioId: 14,
    scenarioName: 'Pre-existing — diabetes',
    category: 'Health Profile',
    aiSignal: 'Declared diabetes, searched "diabetes cover"',
    recommendedPlans: ['select'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'PED-Friendly' },
    scenarioBanner: {
      headline: 'Declare honestly — you\'re more protected than you think.',
      body: 'Advanced Cover Rider: 30-day PED wait instead of the standard 36 months. Day-care coverage for insulin included.',
      bgColor: 'blue'
    },
    tiaGreeting: 'We have plans designed for people with diabetes.',
    primaryCTA: 'Get covered with 30-day PED wait',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['30-day PED wait via Advanced Cover Rider', 'OPD Care / Mental Wellbeing riders', 'Restore Infinity Plus (unlimited SI resets)'],
    newElements: [],
    trustSignals: ['30-day PED waiting with Advanced Cover Rider', 'Day-care coverage for insulin management'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '10',
    policyTenure: '1',
    planTaglines: { select: 'Advanced Cover Rider: 30-day PED wait' }
  },

  15: {
    scenarioId: 15,
    scenarioName: 'Pre-existing — cardiac / hypertension',
    category: 'Health Profile',
    aiSignal: 'Declared hypertension or heart condition',
    recommendedPlans: ['criti', 'select'],
    preSelectedPlan: 'criti',
    recommendedBadgePlan: 'criti',
    planCardBadges: { criti: 'Critical + Hospital' },
    scenarioBanner: {
      headline: 'Lump-sum at diagnosis + hospitalisation cover.',
      body: 'CritiShield pays when diagnosed. HealthShield Select covers the hospital stay. Together, they cover everything.',
      bgColor: 'red'
    },
    tiaGreeting: 'Two plans that work together for cardiac conditions.',
    primaryCTA: 'Get dual cardiac protection',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['50 or 100 CI cover (lump sum)', 'Multipay (3 claims lifetime)', 'Waiver of 70% renewal for 3 years', 'Critical illness cover'],
    newElements: [],
    trustSignals: ['Waiver of premium on diagnosis', 'Multipay: up to 3 claims in a lifetime'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '15',
    policyTenure: '1',
    planTaglines: { criti: 'Pays at diagnosis, not at discharge', select: 'Covers the hospital stay' }
  },

  16: {
    scenarioId: 16,
    scenarioName: 'Critical illness risk profile',
    category: 'Health Profile',
    aiSignal: 'Asks about cancer cover, lump-sum, family illness history',
    recommendedPlans: ['criti'],
    preSelectedPlan: 'criti',
    recommendedBadgePlan: 'criti',
    planCardBadges: { criti: 'Cancer 360° Included' },
    scenarioBanner: {
      headline: 'Pays at diagnosis, not at discharge.',
      body: '100 critical illnesses covered. Cancer 360° for chemo, radio, and global treatment. Lump-sum when you need it most.',
      bgColor: 'red'
    },
    tiaGreeting: 'Comprehensive critical illness protection — here\'s your plan.',
    primaryCTA: 'Get critical illness cover',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Cancer 360° Indemnity', '50 or 100 CI cover (lump sum)', 'Multipay (3 claims lifetime)', 'Waiver of 70% renewal for 3 years'],
    newElements: [],
    trustSignals: ['100 critical illnesses covered', 'Cancer 360°: chemo, radio, global treatment'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '25',
    policyTenure: '1',
    planTaglines: { criti: 'Lump-sum on critical illness diagnosis' }
  },

  17: {
    scenarioId: 17,
    scenarioName: 'Fitness-conscious wellness seeker',
    category: 'Health Profile',
    aiSignal: 'Asks about wellness rewards, OPD, gym benefits',
    recommendedPlans: ['premier', 'select'],
    preSelectedPlan: 'premier',
    recommendedBadgePlan: 'premier',
    planCardBadges: { premier: 'Gets Better With You' },
    scenarioBanner: {
      headline: 'Gets better the healthier you are.',
      body: 'Wellness rewards, unlimited teleconsult, OPD cover ₹20K — a plan that rewards your healthy lifestyle.',
      bgColor: 'green'
    },
    tiaGreeting: 'A health plan that rewards your healthy lifestyle.',
    primaryCTA: 'Start earning wellness rewards',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Unlimited specialist teleconsult', 'OPD dental cover', 'Annual health check-up', 'Restore Benefit'],
    newElements: [],
    trustSignals: ['Wellness program with real rewards', 'OPD cover up to ₹20,000'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '15',
    policyTenure: '1',
    planTaglines: { premier: 'Rewards your healthy lifestyle', select: 'Add OPD Care rider' }
  },

  18: {
    scenarioId: 18,
    scenarioName: 'Mental health coverage seeker',
    category: 'Health Profile',
    aiSignal: 'Searched "mental health insurance", "therapy cover"',
    recommendedPlans: ['select'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'Mental Health Is Health' },
    scenarioBanner: {
      headline: 'Mental health is health.',
      body: 'Therapy, counselling, psychiatric OPD — all covered. No stigma, no fine print.',
      bgColor: 'purple'
    },
    tiaGreeting: 'Mental health coverage — clear, simple, covered.',
    primaryCTA: 'Get mental health cover',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['OPD Care / Mental Wellbeing riders', 'Restore Infinity Plus (unlimited SI resets)', 'Annual health check-up'],
    newElements: [],
    trustSignals: ['Mental wellbeing rider: therapy and counselling covered', 'Psychiatric OPD included'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '10',
    policyTenure: '1',
    planTaglines: { select: 'Mental Wellbeing Rider included' }
  },

  19: {
    scenarioId: 19,
    scenarioName: 'Frequent traveller / accident-prone',
    category: 'Health Profile',
    aiSignal: 'Asked about personal accident, air ambulance',
    recommendedPlans: ['premier', 'criti'],
    preSelectedPlan: 'premier',
    recommendedBadgePlan: 'premier',
    planCardBadges: { premier: 'Travel-Ready' },
    scenarioBanner: {
      headline: 'Accident far from home? You\'re covered.',
      body: 'Air ambulance, accidental death benefit, emergency evacuation — wherever you are.',
      bgColor: 'blue'
    },
    tiaGreeting: 'Protection that travels with you.',
    primaryCTA: 'Get travel-ready cover',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Air Ambulance up to ₹5L', 'Accidental Death Benefit (100% SI, max ₹50L)', 'Global Cover (worldwide hospitalisation)', 'Compassionate Travel'],
    newElements: [],
    trustSignals: ['Air ambulance up to ₹5 lakh', 'Global emergency coverage'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '25',
    policyTenure: '1',
    planTaglines: { premier: 'Air ambulance + global emergency cover', criti: 'Personal Accident ₹3L cover' }
  },

  // ========== Category: Purchase Intent (20-24) ==========
  20: {
    scenarioId: 20,
    scenarioName: 'First-time insurance buyer',
    category: 'Purchase Intent',
    aiSignal: 'Selected "no existing policy", asked basic questions',
    recommendedPlans: ['select', 'premier'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'Recommended' },
    scenarioBanner: {
      headline: 'Your first health insurance — made simple.',
      body: '3 steps: Choose a plan. Add your details. You\'re protected. 30-day free look period if you change your mind.',
      bgColor: 'blue'
    },
    tiaGreeting: 'Your personalised quote is ready!',
    primaryCTA: 'Proceed to optional covers',
    priceDisplay: 'annual',
    discountBadge: { text: '27% Off', percentage: 27 },
    featurePriority: ['Annual health check-up', 'Consumables cover', 'Room category: any', 'Restore Infinity Plus (unlimited SI resets)'],
    newElements: [],
    trustSignals: ['Claim settlement ratio: 96%', '30-day free look period — full refund if not satisfied', '24/7 claims assistance'],
    helpButtonText: 'Need Help?',
    sumInsured: '15',
    policyTenure: '1',
    planTaglines: { select: 'Customisable plan', premier: 'Comprehensive plan + Additional Riders' }
  },

  21: {
    scenarioId: 21,
    scenarioName: 'Policy switcher / portability seeker',
    category: 'Purchase Intent',
    aiSignal: 'Mentioned porting, NCB transfer, competitor insurer name',
    recommendedPlans: ['select', 'premier'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'Easy Port-In' },
    scenarioBanner: {
      headline: 'Your waiting period is yours to keep.',
      body: 'NCB carry-forward. Waiting period credit. Switch in 3 simple steps.',
      bgColor: 'green'
    },
    tiaGreeting: 'Switching is easier than you think. Your waiting period transfers.',
    primaryCTA: 'Start your switch — 3 steps',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Restore Infinity Plus (unlimited SI resets)', 'Annual health check-up', 'Consumables cover'],
    newElements: [],
    trustSignals: ['Waiting periods transfer with you', 'NCB carry-forward from previous insurer', '3-step portability process'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '15',
    policyTenure: '1',
    planTaglines: { select: 'Seamless switch with waiting period credit', premier: 'Upgrade your cover when you switch' }
  },

  22: {
    scenarioId: 22,
    scenarioName: 'Top-up / super top-up seeker',
    category: 'Purchase Intent',
    aiSignal: 'Asked about top-up, deductible, wants higher coverage',
    recommendedPlans: ['plus'],
    preSelectedPlan: 'plus',
    recommendedBadgePlan: 'plus',
    planCardBadges: { plus: '₹1Cr Cover, Low Premium' },
    scenarioBanner: {
      headline: '₹1 crore of cover. Not ₹1 crore of premium.',
      body: 'Set your deductible to match your existing cover. Pay only for the gap.',
      bgColor: 'blue'
    },
    tiaGreeting: 'Top-up your existing cover — affordably.',
    primaryCTA: 'See deductible options',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Deductible: ₹2L–₹20L', 'SI up to ₹1 Crore', 'Aggregate deductible (family floater)', '50% cumulative bonus/claim-free year'],
    newElements: ['gapVisualiser'],
    trustSignals: ['Deductible matches your existing cover', '₹1 Crore SI at affordable premium'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '50',
    policyTenure: '1',
    planTaglines: { plus: '₹1 crore cover at top-up pricing' }
  },

  23: {
    scenarioId: 23,
    scenarioName: 'Lapsed policyholder',
    category: 'Purchase Intent',
    aiSignal: 'Previously had policy not renewed, "my policy expired"',
    recommendedPlans: ['select'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'Welcome Back' },
    scenarioBanner: {
      headline: 'One policy away from being protected again.',
      body: 'Every day without insurance is a day at risk. 20% Favorable Experience Discount to welcome you back.',
      bgColor: 'orange'
    },
    tiaGreeting: 'Welcome back — let\'s get you covered again.',
    primaryCTA: 'Restart your cover today',
    priceDisplay: 'annual',
    discountBadge: { text: '20% Favorable Experience Discount', percentage: 20 },
    featurePriority: ['Restore Infinity Plus (unlimited SI resets)', 'Annual health check-up', 'Consumables cover'],
    newElements: ['lapseCallout'],
    trustSignals: ['20% Favorable Experience Discount', '30-day free look period'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '10',
    policyTenure: '1',
    planTaglines: { select: 'Welcome back — your health cover restarts today' }
  },

  24: {
    scenarioId: 24,
    scenarioName: 'Renewal-ready existing customer',
    category: 'Purchase Intent',
    aiSignal: 'Policy expiry within 45 days, no renewal initiated',
    recommendedPlans: ['select', 'premier'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'Your Current Plan', premier: 'Upgrade Available' },
    scenarioBanner: {
      headline: 'Your NCB is at stake — renew before it\'s gone.',
      body: 'You\'ve earned years of no-claim bonus. Lapsing means starting from zero. Renew in 2 clicks.',
      bgColor: 'orange'
    },
    tiaGreeting: 'Your policy is up for renewal — don\'t lose your NCB.',
    primaryCTA: 'Renew in 2 clicks',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Restore Infinity Plus (unlimited SI resets)', 'Annual health check-up', 'Consumables cover'],
    newElements: ['ncbCalculator', 'lapseCallout'],
    trustSignals: ['Your accumulated NCB carries forward on renewal', 'Upgrade to Premier for just ₹X more'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '15',
    policyTenure: '1',
    planTaglines: { select: 'Your current plan — renew now', premier: 'See what Premier adds' }
  },

  // ========== Category: Digital Behaviour (25-30) ==========
  25: {
    scenarioId: 25,
    scenarioName: 'Comparison-fatigued researcher',
    category: 'Digital Behaviour',
    aiSignal: 'High session count, 5+ plan pages, no conversion',
    recommendedPlans: ['select', 'premier', 'plus'],
    preSelectedPlan: 'premier',
    recommendedBadgePlan: 'premier',
    planCardBadges: { premier: 'Recommended For You' },
    scenarioBanner: {
      headline: 'We\'ve done the research — here\'s your match.',
      body: 'Based on what you\'ve been comparing, HealthShield Premier is the best fit. One decision. Done.',
      bgColor: 'blue'
    },
    tiaGreeting: 'We\'ve narrowed it down for you.',
    primaryCTA: 'Get covered — decision made',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Global Cover (worldwide hospitalisation)', 'Unlimited specialist teleconsult', 'Restore Benefit'],
    newElements: ['callbackScheduler'],
    trustSignals: ['Recommended based on your research pattern'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '15',
    policyTenure: '1',
    hideComparison: true,
    planTaglines: { premier: 'Recommended based on your research', select: 'Value option', plus: 'Top-up option' }
  },

  26: {
    scenarioId: 26,
    scenarioName: 'Cart abandoner at payment step',
    category: 'Digital Behaviour',
    aiSignal: 'Completed health form + plan selection, dropped off at payment',
    recommendedPlans: ['select'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'Your Selection' },
    scenarioBanner: {
      headline: 'Your policy was almost active.',
      body: 'Same premium, same benefits. Everything pre-filled. One step left.',
      bgColor: 'blue'
    },
    tiaGreeting: 'Welcome back — you were almost there!',
    primaryCTA: 'Complete your policy',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Restore Infinity Plus (unlimited SI resets)', 'Annual health check-up', 'Consumables cover'],
    newElements: ['resumptionBanner'],
    trustSignals: ['Claim settlement ratio: 96%', '30-day free look period — full refund if not satisfied'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '15',
    policyTenure: '1',
    planTaglines: { select: 'Your pre-selected plan — one step left' }
  },

  27: {
    scenarioId: 27,
    scenarioName: 'Referral / word-of-mouth buyer',
    category: 'Digital Behaviour',
    aiSignal: 'Arrived via referral link, coupon code',
    recommendedPlans: ['select'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'Referral Discount Applied' },
    scenarioBanner: {
      headline: 'Your friend made a great recommendation.',
      body: '₹500 referral discount already applied. Trusted by 2 crore+ families.',
      bgColor: 'green'
    },
    tiaGreeting: 'Welcome! Your referral discount is ready.',
    primaryCTA: 'Claim your ₹500 discount',
    priceDisplay: 'annual',
    discountBadge: { text: '₹500 Referral Discount Applied', percentage: 0 },
    featurePriority: ['Restore Infinity Plus (unlimited SI resets)', 'Annual health check-up', 'Consumables cover'],
    newElements: ['referralBanner'],
    trustSignals: ['Trusted by 2 crore+ families', '₹500 referral discount applied'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '10',
    policyTenure: '1',
    referralText: '₹500 discount from your friend — already applied.',
    planTaglines: { select: 'Your friend\'s recommendation' }
  },

  28: {
    scenarioId: 28,
    scenarioName: 'Mobile-first / low-bandwidth',
    category: 'Digital Behaviour',
    aiSignal: 'Slow connection, high page load time, 2G/3G',
    recommendedPlans: ['select'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'Recommended' },
    scenarioBanner: {
      headline: 'Your health insurance — one page, one plan.',
      body: 'Pre-filled from your call. Tap below to get covered.',
      bgColor: 'blue'
    },
    tiaGreeting: 'Here\'s your plan — simple and ready.',
    primaryCTA: 'Get covered now',
    priceDisplay: 'daily',
    discountBadge: { text: '27% Off', percentage: 27 },
    featurePriority: ['Annual health check-up', 'Consumables cover', 'Room category: any'],
    newElements: ['costConverter'],
    trustSignals: [],
    helpButtonText: 'Need Help?',
    sumInsured: '5',
    policyTenure: '1',
    liteMode: true,
    planTaglines: { select: 'Simple, affordable health cover' }
  },

  29: {
    scenarioId: 29,
    scenarioName: 'Agent call — no time right now',
    category: 'Digital Behaviour',
    aiSignal: 'Call ended under 60s, "call me later"',
    recommendedPlans: ['select'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'Saved For You' },
    scenarioBanner: {
      headline: 'We\'ll call when you\'re ready.',
      body: 'Your plan is saved. Pick a time that works.',
      bgColor: 'blue'
    },
    tiaGreeting: 'Your advisor saved your progress.',
    primaryCTA: 'Choose a callback time',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Restore Infinity Plus (unlimited SI resets)', 'Annual health check-up', 'Consumables cover'],
    newElements: ['callbackScheduler'],
    trustSignals: ['Your advisor saved your progress'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '15',
    policyTenure: '1',
    planTaglines: { select: 'Saved from your last conversation' }
  },

  30: {
    scenarioId: 30,
    scenarioName: 'DIY buyer — dismisses agent value',
    category: 'Digital Behaviour',
    aiSignal: 'Dismissed agent chat, clicked "skip", selected self-serve',
    recommendedPlans: ['select', 'premier'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'Best Value' },
    scenarioBanner: {
      headline: 'You know what you want. Here it is.',
      body: 'Full control. Compare, customise, and buy — your way.',
      bgColor: 'blue'
    },
    tiaGreeting: 'Your quote is ready — customise it your way.',
    primaryCTA: 'Proceed to optional covers',
    priceDisplay: 'annual',
    discountBadge: { text: '27% Off', percentage: 27 },
    featurePriority: ['Restore Infinity Plus (unlimited SI resets)', 'Annual health check-up', 'Consumables cover', 'Room category: any'],
    newElements: ['diyChecker'],
    trustSignals: [],
    helpButtonText: 'Need Help?',
    sumInsured: '15',
    policyTenure: '1',
    planTaglines: { select: 'Customisable plan', premier: 'Comprehensive plan + Additional Riders' }
  },

  // ========== Category: Geography (31-32) ==========
  31: {
    scenarioId: 31,
    scenarioName: 'Tier-2 / Tier-3 city resident',
    category: 'Geography',
    aiSignal: 'Pin code is Tier-2/3',
    recommendedPlans: ['plus', 'select'],
    preSelectedPlan: 'select',
    recommendedBadgePlan: 'select',
    planCardBadges: { select: 'Your City Covered' },
    scenarioBanner: {
      headline: 'Premium health cover, right where you are.',
      body: 'Strong hospital network in your city. AYUSH facilities included. Specialist teleconsult anytime.',
      bgColor: 'blue'
    },
    tiaGreeting: 'Great coverage is available in your city.',
    primaryCTA: 'Explore your city\'s network',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Restore Infinity Plus (unlimited SI resets)', 'Annual health check-up', 'Consumables cover'],
    newElements: [],
    trustSignals: ['AYUSH facilities covered', 'Teleconsult for specialist access', 'Ambulance cover included'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '10',
    policyTenure: '1',
    hospitalTitle: 'XYZ Insurance Network Hospitals - Jaipur',
    hospitalCount: '120+',
    planTaglines: { select: 'Smart pricing for your city', plus: 'Extend your cover affordably' }
  },

  32: {
    scenarioId: 32,
    scenarioName: 'Metro / urban high-income buyer',
    category: 'Geography',
    aiSignal: 'Metro pin code, income signals high',
    recommendedPlans: ['premier'],
    preSelectedPlan: 'premier',
    recommendedBadgePlan: 'premier',
    planCardBadges: { premier: 'Mumbai Premium Cover' },
    scenarioBanner: {
      headline: 'Mumbai hospitals. Mumbai-grade cover.',
      body: 'No room rent cap. Single private room. Air ambulance. Global cover — built for the demands of living in Mumbai.',
      bgColor: 'purple'
    },
    tiaGreeting: 'Premium protection for Mumbai.',
    primaryCTA: 'Get Mumbai-grade cover',
    priceDisplay: 'annual',
    discountBadge: null,
    featurePriority: ['Global Cover (worldwide hospitalisation)', 'Air Ambulance up to ₹5L', 'Unlimited specialist teleconsult', 'Restore Benefit'],
    newElements: [],
    trustSignals: ['No room rent cap', 'Single private room', '180+ network hospitals in Mumbai'],
    helpButtonText: 'Talk to your advisor',
    sumInsured: '50',
    policyTenure: '1',
    hospitalTitle: 'XYZ Insurance Network Hospitals - Mumbai',
    hospitalCount: '180+',
    planTaglines: { premier: 'Mumbai\'s top hospitals. Zero room rent cap.' }
  }
};
