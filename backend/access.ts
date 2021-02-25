import { permissionsList } from "./schemas/PermissionFields";
import { ListAccessArgs } from "./types";

// Access control yes or no
export function isSignedIn({ session }: ListAccessArgs): boolean {
  return !!session;
};

const generatedPermissions = Object.fromEntries(permissionsList.map(permission => [
  permission,
  function({ session } : ListAccessArgs) {
    return !!session?.data.role?.[permission];
  }
]));

// permissions check if so. meets a criteriia - yes or no
export const permissions = {
  ...generatedPermissions,
  isAwesome({ session } : ListAccessArgs) {
    return session?.data.name.includes('Francois');
  }
};

// Rule based function
// return boolean or filter with limits

export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;

    // do they have the permission of canManageProducts?
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // if not do they own the item?
    return { user: { id: session.itemId } }
  },
  canReadProducts({ session } : ListAccessArgs) {
    if (!isSignedIn({ session })) return false;

    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // otherwise only see available prodcuts
    return { status: 'AVAILABLE' };
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;

    // do they have the permission of canManageProducts?
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // if not do they own the item?
    return { user: { id: session.itemId } }
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;

    // do they have the permission of canManageProducts?
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // if not do they own the item?
    return { order: { user: { id: session.itemId } } }
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;

    // do they have the permission of canManageUsers?
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // only update themselves
    return { id: session.itemId }
  },
}
