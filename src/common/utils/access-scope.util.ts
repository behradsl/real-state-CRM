import { ForbiddenException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PublicUser } from '../../users/users.service';

/** True if actor is a platform admin. */
export function isAdmin(actor: PublicUser): boolean {
  return actor.role === UserRole.ADMIN;
}

/** True if actor owns their organization. */
export function isOwner(actor: PublicUser): boolean {
  return actor.role === UserRole.OWNER;
}

/**
 * Prisma `where` for listing users by role:
 * - ADMIN → all users
 * - OWNER → users in same organization
 * - others → only themselves
 */
export function userListWhere(actor: PublicUser): Prisma.UserWhereInput {
  if (isAdmin(actor)) {
    return {};
  }

  if (isOwner(actor)) {
    return { organizationId: requireOrganizationId(actor) };
  }

  return { id: actor.id };
}

/**
 * Ensures actor may read/update/delete the target user.
 * - ADMIN → any user
 * - OWNER → users in same organization
 * - others → only their own record
 */
export function assertCanAccessUser(
  actor: PublicUser,
  target: Pick<PublicUser, 'id' | 'organizationId'>,
): void {
  if (isAdmin(actor)) {
    return;
  }

  if (
    isOwner(actor) &&
    actor.organizationId !== null &&
    actor.organizationId === target.organizationId
  ) {
    return;
  }

  if (actor.id === target.id) {
    return;
  }

  throw new ForbiddenException('You do not have access to this user');
}

/**
 * Rules when creating a user:
 * - ADMIN may create ADMIN with null org; otherwise organizationId required
 * - OWNER may only create in their org, and cannot create ADMIN
 */
export function resolveCreateUserOrganizationId(
  actor: PublicUser,
  requestedOrganizationId: string | undefined,
  role: UserRole | undefined,
): string | null {
  if (isAdmin(actor)) {
    const effectiveRole = role ?? UserRole.AGENT;
    if (effectiveRole === UserRole.ADMIN) {
      return requestedOrganizationId ?? null;
    }
    if (!requestedOrganizationId) {
      throw new ForbiddenException(
        'organizationId is required when creating a non-admin user',
      );
    }
    return requestedOrganizationId;
  }

  if (isOwner(actor)) {
    return requireOrganizationId(actor);
  }

  throw new ForbiddenException(
    'Only admins and organization owners can create users',
  );
}

export function assertCanAssignRole(
  actor: PublicUser,
  role: UserRole | undefined,
): void {
  if (!role) {
    return;
  }

  if (isAdmin(actor)) {
    return;
  }

  if (isOwner(actor) && role !== UserRole.ADMIN) {
    return;
  }

  throw new ForbiddenException('You cannot assign this role');
}

/**
 * Prisma `where` for listing properties:
 * - ADMIN → all (non-deleted)
 * - OWNER → organization properties
 * - others → properties they own (ownerId)
 */
export function propertyListWhere(actor: PublicUser): Prisma.PropertyWhereInput {
  const notDeleted: Prisma.PropertyWhereInput = { deletedAt: null };

  if (isAdmin(actor)) {
    return notDeleted;
  }

  if (isOwner(actor)) {
    return { ...notDeleted, organizationId: requireOrganizationId(actor) };
  }

  return { ...notDeleted, ownerId: actor.id };
}

/**
 * Ensures actor may access a property record.
 * - ADMIN → any
 * - OWNER → same organization
 * - others → only if they are the property owner
 */
export function assertCanAccessProperty(
  actor: PublicUser,
  property: { ownerId: string; organizationId: string },
): void {
  if (isAdmin(actor)) {
    return;
  }

  if (
    isOwner(actor) &&
    actor.organizationId === property.organizationId
  ) {
    return;
  }

  if (actor.id === property.ownerId) {
    return;
  }

  throw new ForbiddenException('You do not have access to this property');
}

/**
 * Parties / contracts list:
 * - ADMIN → all (non-deleted)
 * - OWNER / staff → same organization
 */
export function partyListWhere(actor: PublicUser): Prisma.PartyWhereInput {
  const notDeleted: Prisma.PartyWhereInput = { deletedAt: null };

  if (isAdmin(actor)) {
    return notDeleted;
  }

  return { ...notDeleted, organizationId: requireOrganizationId(actor) };
}

export function assertCanAccessParty(
  actor: PublicUser,
  party: { organizationId: string },
): void {
  if (isAdmin(actor)) {
    return;
  }

  if (actor.organizationId === party.organizationId) {
    return;
  }

  throw new ForbiddenException('You do not have access to this party');
}

export function contractListWhere(
  actor: PublicUser,
): Prisma.ContractWhereInput {
  const notDeleted: Prisma.ContractWhereInput = { deletedAt: null };

  if (isAdmin(actor)) {
    return notDeleted;
  }

  return { ...notDeleted, organizationId: requireOrganizationId(actor) };
}

export function assertCanAccessContract(
  actor: PublicUser,
  contract: { organizationId: string },
): void {
  if (isAdmin(actor)) {
    return;
  }

  if (actor.organizationId === contract.organizationId) {
    return;
  }

  throw new ForbiddenException('You do not have access to this contract');
}

/**
 * Organization list / access:
 * - ADMIN → all
 * - OWNER → their organization only
 * - others → forbidden for list; no org management
 */
export function organizationListWhere(
  actor: PublicUser,
): Prisma.OrganizationWhereInput {
  if (isAdmin(actor)) {
    return {};
  }

  if (isOwner(actor)) {
    return { id: requireOrganizationId(actor) };
  }

  throw new ForbiddenException('You do not have access to organizations');
}

export function assertCanAccessOrganization(
  actor: PublicUser,
  organizationId: string,
): void {
  if (isAdmin(actor)) {
    return;
  }

  if (isOwner(actor) && actor.organizationId === organizationId) {
    return;
  }

  throw new ForbiddenException('You do not have access to this organization');
}

/**
 * Organization for a new org-scoped resource:
 * - ADMIN may choose any org
 * - everyone else is forced to their own org
 */
export function resolveScopedOrganizationId(
  actor: PublicUser,
  requestedOrganizationId?: string,
): string {
  if (isAdmin(actor)) {
    if (!requestedOrganizationId) {
      throw new ForbiddenException('organizationId is required for admin');
    }
    return requestedOrganizationId;
  }

  return requireOrganizationId(actor);
}

/**
 * Assigned agent (ownerId) for a new org-scoped resource:
 * - default: current user
 * - ADMIN / OWNER may assign another user (caller validates membership)
 */
export function resolveScopedOwnerId(
  actor: PublicUser,
  requestedOwnerId?: string,
): string {
  if (!requestedOwnerId) {
    return actor.id;
  }

  if (isAdmin(actor) || isOwner(actor)) {
    return requestedOwnerId;
  }

  if (requestedOwnerId !== actor.id) {
    throw new ForbiddenException('You can only assign records to yourself');
  }

  return actor.id;
}

/** Non-admin users must belong to an organization. */
export function requireOrganizationId(actor: PublicUser): string {
  if (!actor.organizationId) {
    throw new ForbiddenException(
      'Only platform admins may have a null organizationId',
    );
  }
  return actor.organizationId;
}

/** @deprecated use resolveScopedOrganizationId */
export const resolvePropertyOrganizationId = resolveScopedOrganizationId;

/** @deprecated use resolveScopedOwnerId */
export const resolvePropertyOwnerId = resolveScopedOwnerId;
