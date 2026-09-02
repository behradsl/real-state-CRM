/**
 * Frontend-owned JSON payload examples for Swagger.
 * Aligned with typed terms shapes stored in contract.termsAndConditions.
 */

export const deedInfoExample = {
  cadastralNumber: '12345/67',
  subParcelNumber: '67',
  mainParcelNumber: '12345',
  plotNumber: '12',
  cadastralDistrict: '11',
  registrationArea: 'همدان',
  areaSqm: 120.5,
  postalCode: '6513112345',
  deedSerialNumber: 'SN-998877',
};

export const otherFacilitiesExample = [
  { name: 'گرمایش', kind: 'گرمایش از کف' },
  { name: 'کابینت', kind: 'MDF' },
];

const lawyersExample = {
  firstParty: {
    name: 'رضا وکیل',
    fatherName: 'علی',
    identityNumber: '123456',
    nationalCode: '0012345678',
    cause: 'وکالت‌نامه رسمی',
  },
};

const commissionExample = {
  cityRules: 'تعرفه اتحادیه همدان',
  amount: 225000000,
  firstPartyAmount: 112500000,
  secondPartyAmount: 112500000,
  taxPercent: 9,
  amountWithTax: 20250000,
  factorNumber: 'F-1001',
};

export const saleTermsExample = {
  type: 'SALE',
  shareUnits: 6,
  property: {
    shareUnits: 6,
    pricePerSqm: 125000000,
  },
  sale: {
    totalAmount: 15000000000,
    totalInWords: 'پانزده میلیارد ریال',
    prePaymentAmount: 2000000000,
    prePaymentChequeNumber: '123456',
    prePaymentBankName: 'ملی',
    prePaymentBankBranch: 'مرکزی',
    remainderAmount: 13000000000,
    voucherRegistrationDate: '1404/02/20',
    voucherOrganizationNumber: '۱۲',
    deliveryDate: '1404/02/25',
    cancelationPenalty: '۱۰٪ ثمن',
    breachPenalty: 'وجه التزام روزانه',
    notaryFeePayer: 'مشترک',
    delayPenaltyFirstPartyPerDay: 5000000,
    delayPenaltySecondPartyPerDay: 5000000,
  },
  lawyers: lawyersExample,
  commission: commissionExample,
  contract: {
    date: '1404/01/10',
    time: '11:30',
    description: 'مبایعه‌نامه آپارتمان',
  },
  notes: 'طبق فرم اتحادیه',
};

export const rentTermsExample = {
  type: 'RENT',
  shareUnits: 6,
  property: { shareUnits: 6 },
  rent: {
    durationMonths: 12,
    fromDate: '1404/01/01',
    toDate: '1405/01/01',
    monthlyAmount: 100000000,
    monthlyInWords: 'یکصد میلیون ریال',
    mortgageAmount: 500000000,
    mortgageInWords: 'پانصد میلیون ریال',
    totalInWords: 'یک میلیارد و دویست میلیون ریال',
    prePaymentAmount: 100000000,
    prePaymentChequeNumber: '654321',
    prePaymentBankName: 'ملت',
    prePaymentBankBranch: 'ولیعصر',
    remainderAmount: 400000000,
    remainderDueDate: '1404/01/15',
    deliveryDate: '1404/01/01',
    cancelationPenalty: 'یک ماه اجاره',
    breachPenalty: 'وجه التزام',
    notaryFeePayer: 'مستأجر',
    delayPenaltyFirstPartyPerDay: 2000000,
    delayPenaltySecondPartyPerDay: 2000000,
  },
  lawyers: lawyersExample,
  commission: commissionExample,
  notes: 'مواد ۶ تا ۱۱ فرم اجاره',
};

export const goodwillTermsExample = {
  type: 'GOODWILL',
  shareUnits: 6,
  property: {
    shareUnits: 6,
    pricePerSqm: 80000000,
  },
  goodwill: {
    totalAmount: 8000000000,
    prePaymentAmount: 3000000000,
    prePaymentChequeNumber: '778899',
    prePaymentBankName: 'صادرات',
    prePaymentBankBranch: 'مرکزی',
    remainderAmount: 5000000000,
    remainderDueDate: '1404/03/10',
    penaltyAmount: '۱۰٪',
    deliveryDate: '1404/03/12',
  },
  lawyers: lawyersExample,
  commission: commissionExample,
};

export const preSaleTermsExample = {
  type: 'PRE_SALE',
  presale: {
    renovationCode: 'RNV-99',
    technicalIdNumber: 'TECH-100',
    insuranceNumber: 'INS-55',
    buildingPermitNumber: '99-100-20',
    buildingPermitDate: '1402/05/01',
    equipped: 'بله',
    totalFloors: 5,
    totalUnits: 10,
    areaSqm: 120.5,
    storage: 'دارد',
    orientation: 'جنوبی',
    parkingNumberAndArea: 'P-03 / ۱۲ متر',
    flooringType: 'سرامیک',
    cabinetAndFaucetType: 'MDF براق',
    bathroomType: 'فرنگی',
    switchOutletType: 'لگراند',
    entranceDoorType: 'ضد سرقت',
    interiorDoorType: 'HDF',
    ceilingPlasterType: 'گچ',
    emergencyWaterSourceType: 'منبع',
    heatingType: 'پکیج',
    coolerType: 'اسپیلیت',
    intercomType: 'تصویری',
    cctv: 'دارد',
    tilingType: 'پرسلان',
    windowType: 'UPVC دوجداره',
    facadeType: 'تراورتن',
    parkingFloorWallCover: 'رنگ',
    lighting: 'LED',
    balconyCorridorRailing: 'شیشه‌ای',
    fireExtinguisher: 'دارد',
    elevator: 'دارد',
    waterMotor: 'دارد',
    utilitiesScore: 'کامل',
    loan: 'دارد',
    loanType: 'مسکن',
    loanInstallmentAmount: 50000000,
    totalAmount: 50000000000,
    totalInWords: 'پنجاه میلیارد ریال',
    deliveryDate: '1405/01/01',
    deedTransferDate: '1405/02/01',
    selfDeclareFormNumber: 'SDF-12',
    voucherOrganizationNumber: '۱۲',
  },
  lawyers: lawyersExample,
  commission: commissionExample,
};

export const mutualRescissionTermsExample = {
  type: 'MUTUAL_RESCISSION',
  rescission: {
    originalContractNumber: 'CNT-2025-088',
    originalContractDate: '1403/08/12',
    originalAgencyName: 'آژانس نمونه',
    aggregationClause: 'تجمیع تعهدات طبق قرارداد اصلی',
    deliveryClause: 'تحویل ملک در وضعیت فعلی',
    price: 2000000000,
    paymentType: 'نقد',
  },
  property: {
    shareUnits: 6,
    areaSqm: 120.5,
    county: 'همدان',
    ownershipNumber: 'OWN-44',
  },
  lawyers: lawyersExample,
  commission: commissionExample,
};

export const constructionJointVentureTermsExample = {
  type: 'CONSTRUCTION_JOINT_VENTURE',
  shareUnits: 6,
  property: {
    shareUnits: 6,
    areaSqm: 250.5,
  },
  cjv: {
    propertyDescription: 'قطعه زمین مسکونی',
    totalAmount: 50000000000,
    totalInWords: 'پنجاه میلیارد ریال',
    governmentalCosts: 2000000000,
    constructionCosts: 30000000000,
    facilityRightsCosts: 1000000000,
    destructionCost: 500000000,
    firstPartyShare: '۵۵٪',
    secondPartyShare: '۴۵٪',
    startDateInWords: 'اول فروردین ۱۴۰۴',
    endDateInWords: 'اول فروردین ۱۴۰۶',
    costDetailsPrepareDate: '1404/01/15',
    voucherTransferDate: '1404/02/01',
    shareUnitsToTransfer: '۳',
    delayPenaltyFirstPartyPerDay: 10000000,
    delayPenaltySecondPartyPerDay: 10000000,
  },
  lawyers: lawyersExample,
  commission: commissionExample,
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
    summary: 'Apartment with typed facilities + deedInfo',
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
        details: 'ونک',
        postalCode: '1968912345',
      },
      water: true,
      electricity: true,
      gas: true,
      telephone: false,
      parking: true,
      parkingCount: 1,
      storage: true,
      storageCount: 1,
      storageArea: 15,
      elevator: true,
      otherFacilities: otherFacilitiesExample,
      deedInfo: deedInfoExample,
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
      totalAmount: 15000000000,
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
      totalAmount: 1200000000,
      monthlyAmount: 100000000,
      depositAmount: 500000000,
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
      totalAmount: 8000000000,
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
      totalAmount: 50000000000,
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
      totalAmount: 50000000000,
      termsAndConditions: constructionJointVentureTermsExample,
    },
  },
};
