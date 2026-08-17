/**
 * Frontend-owned JSON payload examples for Swagger.
 * Derived from Iranian real-estate contract forms under /contracts/*.jpg
 */

export const deedInfoExample = {
  shareUnits: 6,
  cadastralNumber: '12345/67',
  subParcelNumber: '67',
  mainParcelNumber: '12345',
  plotNumber: '12',
  cadastralDistrict: '11',
  registrationArea: 'همدان',
  areaSqm: 120.5,
  postalCode: '6513112345',
};

export const facilitiesExample = {
  water: true,
  electricity: true,
  gas: true,
  telephone: false,
  parking: true,
  parkingCount: 1,
  storage: true,
  storageCount: 1,
  heating: 'PACKAGE_RADIATOR',
  cooling: 'SPLIT',
  elevator: true,
  notes: 'کابینت MDF، کف سرامیک',
};

export const saleTermsExample = {
  type: 'SALE',
  price: {
    totalRials: 15000000000,
    totalInWords: 'پانزده میلیارد ریال',
    currency: 'IRR',
    payments: [
      {
        label: 'بیعانه',
        amountRials: 2000000000,
        dueAt: '1404/01/15',
        method: 'CASH',
      },
      {
        label: 'باقیمانده در دفترخانه',
        amountRials: 13000000000,
        dueAt: '1404/02/20',
        method: 'BANK',
      },
    ],
  },
  transfer: {
    notaryOffice: 'دفترخانه شماره ۱۲ همدان',
    officialDeedDueAt: '1404/02/20',
    deliveryDueAt: '1404/02/25',
  },
  penalties: {
    delayPenaltyPerDayRials: 5000000,
    arbitrationCenter: 'مرکز داوری اتحادیه مشاورین املاک',
  },
  clauses: ['ماده۴ تا ماده۱۱ طبق فرم اتحادیه'],
};

export const rentTermsExample = {
  type: 'RENT',
  duration: {
    startDate: '1404/01/01',
    endDate: '1405/01/01',
    unit: 'YEAR',
    value: 1,
  },
  rent: {
    totalRials: 1200000000,
    monthlyRials: 100000000,
    securityDepositRials: 500000000,
    paymentDayOfMonth: 5,
    paymentMethod: {
      type: 'BANK',
      bankName: 'ملی',
      accountNumber: '0100000000000',
      branch: 'مرکزی',
    },
  },
  handoverDate: '1404/01/01',
  penalties: {
    delayPenaltyPerDayRials: 2000000,
  },
  clauses: ['مواد ۶ تا ۱۱ فرم اجاره'],
};

export const goodwillTermsExample = {
  type: 'GOODWILL',
  businessRight: {
    description: 'انتقال سرقفلی یک باب مغازه',
    unitCount: 1,
  },
  price: {
    totalRials: 8000000000,
    totalTomans: 800000000,
    paidUpfrontRials: 3000000000,
    remainingAtOfficialDeedRials: 5000000000,
  },
  transfer: {
    notaryOffice: 'دفترخانه شماره ۵',
    officialDeedDueAt: '1404/03/10',
    deliveryDueAt: '1404/03/12',
  },
  taxes: {
    municipal: true,
    business: true,
    transfer: true,
    payer: 'TRANSFEREE',
  },
};

export const preSaleTermsExample = {
  type: 'PRE_SALE',
  buildingPermitNumber: '99-100-20',
  buildingSpecs: {
    totalFloors: 5,
    unitsPerFloor: 2,
    unitAreaSqm: 120.5,
    targetFloor: 3,
    orientation: 'SOUTH',
    parkingNumber: 'P-03',
    storageNumber: 'S-03',
    flooring: 'CERAMIC',
    kitchenCabinets: 'MDF_HIGH_GLOSS',
    heatingSystem: 'PACKAGE_RADIATOR',
    coolingSystem: 'SPLIT',
    windowType: 'UPVC_DOUBLE_GLAZED',
    facadeType: 'TRAVERTINE',
    skeleton: 'CONCRETE',
    elevator: true,
    security: ['CCTV', 'ANTI_THEFT_DOOR'],
  },
  financials: {
    totalPriceRials: 50000000000,
    paymentSchedule: [
      { percent: 30, label: 'پیش‌پرداخت', dueAt: '1404/01/01' },
      { percent: 60, label: 'اقساط ساخت', dueAt: '1404/06/01' },
      { percent: 10, label: 'زمان انتقال سند', dueAt: '1405/01/01' },
    ],
  },
};

export const mutualRescissionTermsExample = {
  type: 'MUTUAL_RESCISSION',
  originalContract: {
    contractNumber: 'CNT-2025-088',
    contractType: 'SALE',
    signedAt: '1403/08/12',
  },
  rescission: {
    reason: 'توافق طرفین برای فسخ',
    effectiveDate: '1404/02/01',
    propertyReturnedAsIs: true,
    waiveFutureClaims: true,
  },
  settlement: {
    refundAmountRials: 2000000000,
    refundDueAt: '1404/02/05',
    notes: 'بازگشت بیعانه پس از تحویل ملک',
  },
};

export const constructionJointVentureTermsExample = {
  type: 'CONSTRUCTION_JOINT_VENTURE',
  land: {
    areaSqm: 250.5,
    landValueRials: 50000000000,
  },
  shares: {
    firstPartyPercent: 55,
    secondPartyPercent: 45,
    firstPartyDangs: 3.3,
    secondPartyDangs: 2.7,
  },
  timeline: {
    startDate: '1404/01/01',
    endDate: '1406/01/01',
    milestones: [
      { name: 'اسکلت', dueAt: '1404/08/01' },
      { name: 'نازک‌کاری', dueAt: '1405/06/01' },
      { name: 'تحویل', dueAt: '1406/01/01' },
    ],
  },
  constructionObligations: {
    builderParty: 'SECOND_PARTY',
    landOwnerParty: 'FIRST_PARTY',
    permitsResponsibility: 'SECOND_PARTY',
  },
};

export const signatureDataExample = {
  method: 'DRAWN',
  signedByRole: 'FIRST_PARTY',
  imageBase64Preview: null,
  device: 'tablet',
  ip: '10.0.0.1',
};

/** Full POST /properties body example for Swagger */
export const createPropertyBodyExample = {
  apartment: {
    summary: 'Apartment with deedInfo + facilities',
    value: {
      title: 'آپارتمان ۳ خوابه ونک',
      description: 'نورگیر جنوبی، پارکینگ و انباری',
      propertyType: 'APARTMENT',
      areaSqm: 120.5,
      floor: 3,
      totalFloors: 5,
      yearBuilt: 2018,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpots: 1,
      furnished: false,
      referenceCode: 'APT-1001',
      address: {
        city: 'تهران',
        province: 'تهران',
        street: 'ونک',
        postalCode: '1968912345',
      },
      facilities: facilitiesExample,
      deedInfo: {
        data: deedInfoExample,
      },
    },
  },
};

/** Full POST /contracts body examples for Swagger ApiBody */
export const createContractBodyExamples = {
  sale: {
    summary: 'SALE — مبایعه نامه',
    value: {
      contractType: 'SALE',
      contractNumber: 'CNT-SALE-2026-001',
      propertyId: '11111111-1111-4111-8111-111111111111',
      description: 'مبایعه نامه آپارتمان',
      commissionPercentage: 1.5,
      commissionAmount: 225000000,
      taxPercentage: 9,
      taxAmount: 20250000,
      firstPartyCommissionPercentage: 0.75,
      firstPartyCommissionAmount: 112500000,
      secondPartyCommissionPercentage: 0.75,
      secondPartyCommissionAmount: 112500000,
      firstPartyId: '22222222-2222-4222-8222-222222222222',
      secondPartyId: '33333333-3333-4333-8333-333333333333',
      witnessIds: [
        '44444444-4444-4444-8444-444444444444',
        '55555555-5555-4555-8555-555555555555',
      ],
      termsAndConditions: saleTermsExample,
    },
  },
  rent: {
    summary: 'RENT — اجاره نامه',
    value: {
      contractType: 'RENT',
      contractNumber: 'CNT-RENT-2026-001',
      propertyId: '11111111-1111-4111-8111-111111111111',
      firstPartyId: '22222222-2222-4222-8222-222222222222',
      secondPartyId: '33333333-3333-4333-8333-333333333333',
      commissionAmount: 50000000,
      termsAndConditions: rentTermsExample,
    },
  },
  goodwill: {
    summary: 'GOODWILL — انتقال سرقفلی',
    value: {
      contractType: 'GOODWILL',
      contractNumber: 'CNT-GW-2026-001',
      propertyId: '11111111-1111-4111-8111-111111111111',
      firstPartyId: '22222222-2222-4222-8222-222222222222',
      secondPartyId: '33333333-3333-4333-8333-333333333333',
      termsAndConditions: goodwillTermsExample,
    },
  },
  preSale: {
    summary: 'PRE_SALE — پیش فروش',
    value: {
      contractType: 'PRE_SALE',
      contractNumber: 'CNT-PS-2026-001',
      propertyId: '11111111-1111-4111-8111-111111111111',
      firstPartyId: '22222222-2222-4222-8222-222222222222',
      secondPartyId: '33333333-3333-4333-8333-333333333333',
      termsAndConditions: preSaleTermsExample,
    },
  },
  mutualRescission: {
    summary: 'MUTUAL_RESCISSION — اقاله',
    value: {
      contractType: 'MUTUAL_RESCISSION',
      contractNumber: 'CNT-MR-2026-001',
      propertyId: '11111111-1111-4111-8111-111111111111',
      firstPartyId: '22222222-2222-4222-8222-222222222222',
      secondPartyId: '33333333-3333-4333-8333-333333333333',
      termsAndConditions: mutualRescissionTermsExample,
    },
  },
  constructionJointVenture: {
    summary: 'CONSTRUCTION_JOINT_VENTURE — مشارکت در ساخت',
    value: {
      contractType: 'CONSTRUCTION_JOINT_VENTURE',
      contractNumber: 'CNT-CJV-2026-001',
      propertyId: '11111111-1111-4111-8111-111111111111',
      firstPartyId: '22222222-2222-4222-8222-222222222222',
      secondPartyId: '33333333-3333-4333-8333-333333333333',
      termsAndConditions: constructionJointVentureTermsExample,
    },
  },
};
