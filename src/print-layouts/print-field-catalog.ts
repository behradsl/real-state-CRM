import { ContractType } from '@prisma/client';

const lawyerKeys = (prefix: 'firstParty' | 'secondParty') =>
  [
    `${prefix}.lawyer.name`,
    `${prefix}.lawyer.fatherName`,
    `${prefix}.lawyer.identityNumber`,
    `${prefix}.lawyer.birthPlace`,
    `${prefix}.lawyer.birthDate`,
    `${prefix}.lawyer.identityExportPlace`,
    `${prefix}.lawyer.nationalCode`,
    `${prefix}.lawyer.address`,
    `${prefix}.lawyer.postalCode`,
    `${prefix}.lawyer.cause`,
  ] as const;

const orgStampKeys = [
  'organization.name',
  'organization.licenseNumber',
  'organization.ownerName',
  'organization.address',
  'contract.date',
  'contract.time',
  'contract.description',
  'commission.cityRules',
  'commission.amount',
  'commission.firstPartyAmount',
  'commission.secondPartyAmount',
  'commission.taxPercent',
  'commission.amountWithTax',
  'commission.factorNumber',
  'commission.firstPartyFactorNumber',
  'commission.secondPartyFactorNumber',
] as const;

/**
 * Party print keys aligned with frontend partyFieldsForContract +
 * partyPrintKeysFromFields (per contract type).
 */
const partyKeysByType: Record<
  ContractType,
  (prefix: 'firstParty' | 'secondParty') => readonly string[]
> = {
  SALE: (prefix) =>
    [
      `${prefix}.name`,
      `${prefix}.fatherName`,
      `${prefix}.identityNumber`,
      `${prefix}.identityExportPlace`,
      `${prefix}.nationalCode`,
      `${prefix}.birthPlace`,
      `${prefix}.address`,
      `${prefix}.postalCode`,
      `${prefix}.phone`,
    ] as const,
  RENT: (prefix) =>
    [
      `${prefix}.name`,
      `${prefix}.fatherName`,
      `${prefix}.identityNumber`,
      `${prefix}.nationalCode`,
      `${prefix}.birthPlace`,
      `${prefix}.address`,
      `${prefix}.postalCode`,
      `${prefix}.phone`,
    ] as const,
  GOODWILL: (prefix) =>
    [
      `${prefix}.name`,
      `${prefix}.fatherName`,
      `${prefix}.identityNumber`,
      `${prefix}.nationalCode`,
      `${prefix}.address`,
      `${prefix}.phone`,
    ] as const,
  PRE_SALE: (prefix) =>
    [
      `${prefix}.name`,
      `${prefix}.fatherName`,
      `${prefix}.identityNumber`,
      `${prefix}.nationalCode`,
      `${prefix}.birthPlace`,
      `${prefix}.birthDate`,
      `${prefix}.address`,
      `${prefix}.postalCode`,
      `${prefix}.phone`,
    ] as const,
  MUTUAL_RESCISSION: (prefix) =>
    [
      `${prefix}.name`,
      `${prefix}.fatherName`,
      `${prefix}.identityNumber`,
      `${prefix}.nationalCode`,
      `${prefix}.address`,
      `${prefix}.phone`,
    ] as const,
  CONSTRUCTION_JOINT_VENTURE: (prefix) =>
    [
      `${prefix}.name`,
      `${prefix}.fatherName`,
      `${prefix}.identityNumber`,
      `${prefix}.nationalCode`,
      `${prefix}.address`,
      `${prefix}.postalCode`,
      `${prefix}.phone`,
    ] as const,
};

/**
 * Property print keys from propertyFieldsForContract +
 * propertyPrintKeysFromFields, plus terms-only keys not on PropertyForm.
 */
const propertyKeysByType: Record<ContractType, readonly string[]> = {
  SALE: [
    'property.type',
    'property.areaSqm',
    'property.yearBuilt',
    'property.parking',
    'property.storage',
    'property.address',
    'property.postalCode',
    'property.cadastralNumber',
    'property.subParcelNumber',
    'property.mainParcelNumber',
    'property.cadastralDistrict',
    'property.registrationArea',
    'property.shareUnits',
    'property.pricePerSqm',
  ],
  RENT: [
    'property.type',
    'property.bedrooms',
    'property.parking',
    'property.storage',
    'property.postalCode',
    'property.cadastralNumber',
    'property.subParcelNumber',
    'property.mainParcelNumber',
    'property.deedSerialNumber',
    'property.shareUnits',
    'property.ownerName',
  ],
  GOODWILL: [
    'property.type',
    'property.storage',
    'property.cadastralNumber',
    'property.subParcelNumber',
    'property.mainParcelNumber',
    'property.cadastralDistrict',
    'property.registrationArea',
    'property.shareUnits',
    'property.pricePerSqm',
  ],
  PRE_SALE: [
    'property.type',
    'property.cadastralNumber',
    'property.address',
  ],
  MUTUAL_RESCISSION: [
    'property.type',
    'property.areaSqm',
    'property.cadastralNumber',
    'property.subParcelNumber',
    'property.mainParcelNumber',
    'property.cadastralDistrict',
    'property.shareUnits',
    'property.county',
    'property.ownershipNumber',
  ],
  CONSTRUCTION_JOINT_VENTURE: [
    'property.type',
    'property.areaSqm',
    'property.address',
    'property.postalCode',
    'property.shareUnits',
  ],
};

const typeTermsKeys: Record<ContractType, readonly string[]> = {
  SALE: [
    'sale.totalAmount',
    'sale.totalInWords',
    'sale.prePaymentAmount',
    'sale.prePaymentChequeNumber',
    'sale.prePaymentBankName',
    'sale.prePaymentBankBranch',
    'sale.remainderAmount',
    'sale.voucherRegistrationDate',
    'sale.voucherOrganizationNumber',
    'sale.deliveryDate',
    'sale.cancelationPenalty',
    'sale.breachPenalty',
    'sale.notaryFeePayer',
    'sale.delayPenaltyFirstPartyPerDay',
    'sale.delayPenaltySecondPartyPerDay',
  ],
  RENT: [
    'rent.durationMonths',
    'rent.fromDate',
    'rent.toDate',
    'rent.monthlyAmount',
    'rent.monthlyInWords',
    'rent.mortgageAmount',
    'rent.mortgageInWords',
    'rent.totalInWords',
    'rent.prePaymentAmount',
    'rent.prePaymentChequeNumber',
    'rent.prePaymentBankName',
    'rent.prePaymentBankBranch',
    'rent.remainderAmount',
    'rent.remainderDueDate',
    'rent.deliveryDate',
    'rent.cancelationPenalty',
    'rent.breachPenalty',
    'rent.notaryFeePayer',
    'rent.delayPenaltyFirstPartyPerDay',
    'rent.delayPenaltySecondPartyPerDay',
  ],
  GOODWILL: [
    'goodwill.totalAmount',
    'goodwill.prePaymentAmount',
    'goodwill.prePaymentChequeNumber',
    'goodwill.prePaymentBankName',
    'goodwill.prePaymentBankBranch',
    'goodwill.remainderAmount',
    'goodwill.remainderDueDate',
    'goodwill.penaltyAmount',
    'goodwill.deliveryDate',
  ],
  PRE_SALE: [
    'presale.renovationCode',
    'presale.technicalIdNumber',
    'presale.insuranceNumber',
    'presale.buildingPermitNumber',
    'presale.buildingPermitDate',
    'presale.equipped',
    'presale.totalFloors',
    'presale.totalUnits',
    'presale.areaSqm',
    'presale.storage',
    'presale.orientation',
    'presale.parkingNumberAndArea',
    'presale.flooringType',
    'presale.cabinetAndFaucetType',
    'presale.bathroomType',
    'presale.switchOutletType',
    'presale.entranceDoorType',
    'presale.interiorDoorType',
    'presale.ceilingPlasterType',
    'presale.emergencyWaterSourceType',
    'presale.heatingType',
    'presale.coolerType',
    'presale.intercomType',
    'presale.cctv',
    'presale.tilingType',
    'presale.windowType',
    'presale.facadeType',
    'presale.parkingFloorWallCover',
    'presale.lighting',
    'presale.balconyCorridorRailing',
    'presale.fireExtinguisher',
    'presale.elevator',
    'presale.waterMotor',
    'presale.utilitiesScore',
    'presale.loan',
    'presale.loanType',
    'presale.loanInstallmentAmount',
    'presale.totalAmount',
    'presale.totalInWords',
    'presale.deliveryDate',
    'presale.deedTransferDate',
    'presale.selfDeclareFormNumber',
    'presale.voucherOrganizationNumber',
  ],
  MUTUAL_RESCISSION: [
    'rescission.originalContractNumber',
    'rescission.originalContractDate',
    'rescission.originalAgencyName',
    'rescission.aggregationClause',
    'rescission.deliveryClause',
    'rescission.price',
    'rescission.paymentType',
  ],
  CONSTRUCTION_JOINT_VENTURE: [
    'cjv.propertyDescription',
    'cjv.totalAmount',
    'cjv.totalInWords',
    'cjv.governmentalCosts',
    'cjv.constructionCosts',
    'cjv.facilityRightsCosts',
    'cjv.destructionCost',
    'cjv.firstPartyShare',
    'cjv.secondPartyShare',
    'cjv.startDateInWords',
    'cjv.endDateInWords',
    'cjv.costDetailsPrepareDate',
    'cjv.voucherTransferDate',
    'cjv.shareUnitsToTransfer',
    'cjv.delayPenaltyFirstPartyPerDay',
    'cjv.delayPenaltySecondPartyPerDay',
  ],
};

function catalogForType(type: ContractType): readonly string[] {
  const partyKeys = partyKeysByType[type];
  return [
    ...partyKeys('firstParty'),
    ...lawyerKeys('firstParty'),
    ...partyKeys('secondParty'),
    ...lawyerKeys('secondParty'),
    ...propertyKeysByType[type],
    ...typeTermsKeys[type],
    ...orgStampKeys,
  ];
}

export const PRINT_FIELD_CATALOG: Record<ContractType, readonly string[]> = {
  SALE: catalogForType(ContractType.SALE),
  RENT: catalogForType(ContractType.RENT),
  GOODWILL: catalogForType(ContractType.GOODWILL),
  PRE_SALE: catalogForType(ContractType.PRE_SALE),
  MUTUAL_RESCISSION: catalogForType(ContractType.MUTUAL_RESCISSION),
  CONSTRUCTION_JOINT_VENTURE: catalogForType(
    ContractType.CONSTRUCTION_JOINT_VENTURE,
  ),
};

export function isAllowedPrintField(
  contractType: ContractType,
  fieldKey: string,
): boolean {
  return (PRINT_FIELD_CATALOG[contractType] as readonly string[]).includes(
    fieldKey,
  );
}
