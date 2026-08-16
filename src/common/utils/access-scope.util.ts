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
    return { organizationId: actor.organizationId };
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

  if (isOwner(actor) && actor.organizationId === target.organizationId) {
    return;
  }

  if (actor.id === target.id) {
    return;
  }

  throw new ForbiddenException('You do not have access to this user');
}

/**
 * Rules when creating a user:
 * - ADMIN may create in any org and any role
 * - OWNER may only create in their org, and cannot create ADMIN
 */
export function resolveCreateUserOrganizationId(
  actor: PublicUser,
  requestedOrganizationId: string,
): string {
  if (isAdmin(actor)) {
    return requestedOrganizationId;
  }

  if (isOwner(actor)) {
    return actor.organizationId;
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
    return { ...notDeleted, organizationId: actor.organizationId };
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

  if (isOwner(actor) && actor.organizationId === property.organizationId) {
    return;
  }

  if (actor.id === property.ownerId) {
    return;
  }

  throw new ForbiddenException('You do not have access to this property');
}

/**
 * Organization for a new property:
 * - ADMIN may choose any org
 * - everyone else is forced to their own org
 */
export function resolvePropertyOrganizationId(
  actor: PublicUser,
  requestedOrganizationId?: string,
): string {
  if (isAdmin(actor)) {
    if (!requestedOrganizationId) {
      throw new ForbiddenException('organizationId is required for admin');
    }
    return requestedOrganizationId;
  }

  return actor.organizationId;
}

/**
 * Assigned agent (ownerId) for a new property:
 * - default: current user
 * - ADMIN / OWNER may assign another user (caller validates membership)
 */
export function resolvePropertyOwnerId(
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
    throw new ForbiddenException('You can only assign properties to yourself');
  }

  return actor.id;
}
