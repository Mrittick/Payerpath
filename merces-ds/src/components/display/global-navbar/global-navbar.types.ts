/* Figma: Global Navbar — 967:3420 */

import type { IconName } from '../../../assets/icon/icon.types';

export type NavbarProduct = 'payerpath' | 'echart-coder';

export type NavbarCategoryId =
  /* ── Payerpath ── */
  | 'dashboard'
  | 'claims'
  | 'patients'
  | 'reports'
  | 'maintenance'
  | 'resources'
  | 'analytics'
  /* ── eChart Coder ── */
  | 'home'
  | 'admin'
  | 'project-settings'
  | 'code-review'
  | 'audit'
  | 'hold-charts'
  | 'quality-control'
  | 'archive';

/** A page registered in the navbar. Adding a page here makes it appear
 *  automatically under the correct category — no component changes needed. */
export interface NavbarPage {
  id: string;
  label: string;
  categoryId: NavbarCategoryId;
  isCurrent?: boolean;
}

/** Internal shape — the 7 structural category items.
 *  These are always present because of their icon dependency. */
export interface NavbarCategoryDef {
  id: NavbarCategoryId;
  label: string;
  /** merces-icon name */
  icon: IconName;
}

/** The 7 Payerpath fixed category items. Order determines render order.
 *  Figma: Navbar Items 958:3170 — Category variants
 *  Icon type logic: standalone → filled when isCurrent; with sub-items → filled when expanded AND isCurrent */
export const NAVBAR_CATEGORIES: readonly NavbarCategoryDef[] = [
  { id: 'dashboard',   label: 'Dashboard',   icon: 'dashboard'  },
  { id: 'claims',      label: 'Claims',      icon: 'currency'   },
  { id: 'patients',    label: 'Patients',    icon: 'user-file'  },
  { id: 'reports',     label: 'Reports',     icon: 'invoice'    },
  { id: 'maintenance', label: 'Maintenance', icon: 'fix'        },
  { id: 'resources',   label: 'Resources',   icon: 'tools'      },
  { id: 'analytics',   label: 'Analytics',   icon: 'chart'      },
] as const;

/** The 9 eChart Coder fixed category items.
 *  Figma: Global Navbar eChart Coder — 1661:16643 */
export const ECHART_CODER_CATEGORIES: readonly NavbarCategoryDef[] = [
  { id: 'home',             label: 'Home',             icon: 'home'              },
  { id: 'admin',            label: 'Admin',            icon: 'user-group-config' },
  { id: 'project-settings', label: 'Project Settings', icon: 'wrench'            },
  { id: 'code-review',      label: 'Code Review',      icon: 'scan'              },
  { id: 'audit',            label: 'Audit',            icon: 'invoice'           },
  { id: 'hold-charts',      label: 'Hold Charts',      icon: 'sort'              },
  { id: 'quality-control',  label: 'Quality Control',  icon: 'tick-circle'       },
  { id: 'reports',          label: 'Reports',          icon: 'dashboard'         },
  { id: 'archive',          label: 'Archive',          icon: 'archive'           },
] as const;
