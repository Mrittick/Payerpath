/**
 * Icon SVG Exports — Single source of truth
 *
 * Every icon used across the design system is imported from the SVG library
 * via Vite's `?raw` suffix. If a library SVG changes, every consumer
 * automatically reflects the update — no copy-pasting path data.
 *
 * Usage:
 *   import { CrossFilled16, SearchRegular20 } from '../../Assets/Icon/icons';
 *   <Icon size="mini">{CrossFilled16}</Icon>
 *
 * Naming convention:
 *   {IconName}{Weight}{Size}  e.g. CrossFilled16, ChevronRightBold20
 */

/* ---- Raw SVG imports --------------------------------------------------- */

import crossFilled16Raw from './svg/cross-16-filled.svg?raw';
import crossFilled20Raw from './svg/cross-20-filled.svg?raw';
import tickCircleFilled16Raw from './svg/tick-circle-16-filled.svg?raw';
import tickCircleRegular16Raw from './svg/tick-circle-16-regular.svg?raw';
import filterRegular20Raw from './svg/filter-20-regular.svg?raw';
import chevronDownBold16Raw from './svg/chevron-down-16-bold.svg?raw';
import chevronUpBold16Raw from './svg/chevron-up-16-bold.svg?raw';
import chevronLeftBold16Raw from './svg/chevron-left-16-bold.svg?raw';
import chevronRightBold16Raw from './svg/chevron-right-16-bold.svg?raw';
import chevronLeftBold20Raw from './svg/chevron-left-20-bold.svg?raw';
import chevronRightBold20Raw from './svg/chevron-right-20-bold.svg?raw';
import informationCircleRegular16Raw from './svg/information-circle-16-regular.svg?raw';
import informationCircleFilled20Raw from './svg/information-circle-20-filled.svg?raw';
import searchRegular20Raw from './svg/search-20-regular.svg?raw';
import searchRegular16Raw from './svg/search-16-regular.svg?raw';
import searchBold16Raw from './svg/search-16-bold.svg?raw';
import copyBold16Raw from './svg/copy-16-bold.svg?raw';
import copyRegular16Raw from './svg/copy-16-regular.svg?raw';
import genericRegular32Raw from './svg/generic-32-regular.svg?raw';
import genericRegular20Raw from './svg/generic-20-regular.svg?raw';
import genericRegular16Raw from './svg/generic-16-regular.svg?raw';
import sidebarCollapseRegular24Raw from './svg/sidebar-collapse-24-regular.svg?raw';
import sidebarExpandRegular24Raw from './svg/sidebar-expand-24-regular.svg?raw';
import tickBold12Raw from './svg/tick-12-bold.svg?raw';
import tickBold16Raw from './svg/tick-16-bold.svg?raw';
import dashRegular12Raw from './svg/dash-12-regular.svg?raw';
import dashRegular16Raw from './svg/dash-16-regular.svg?raw';
import chevronDownRegular20Raw from './svg/chevron-down-20-regular.svg?raw';
import chevronRightRegular16Raw from './svg/chevron-right-16-regular.svg?raw';
import chevronRightRegular20Raw from './svg/chevron-right-20-regular.svg?raw';
import fixRegular16Raw from './svg/fix-16-regular.svg?raw';
import trashRegular20Raw from './svg/trash-20-regular.svg?raw';
import crossBold16Raw from './svg/cross-16-bold.svg?raw';
import crossBold20Raw from './svg/cross-20-bold.svg?raw';
import tickRegular20Raw from './svg/tick-20-regular.svg?raw';
import selectAllRegular20Raw from './svg/select-all-20-regular.svg?raw';
import datePickerRegular20Raw from './svg/date-picker-20-regular.svg?raw';
import timePickerRegular20Raw from './svg/time-picker-20-regular.svg?raw';

/* ---- Helper: raw SVG string → React <svg> element ---------------------- */

/**
 * Parses a raw SVG string and returns a React `<svg>` element that
 * uses `dangerouslySetInnerHTML` to inject the original SVG content.
 *
 * This approach:
 *   - Preserves exact path data from the library files
 *   - Avoids HTML→JSX attribute conversion issues (fill-rule vs fillRule)
 *   - Strips width/height so the parent Icon component controls sizing
 *   - Keeps viewBox for correct scaling
 */
function svgFromRaw(raw: string): React.ReactElement {
  /* Extract viewBox */
  const viewBoxMatch = raw.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch?.[1] ?? '0 0 16 16';

  /* Extract inner content (everything between <svg ...> and </svg>) */
  const innerMatch = raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  const innerHTML = innerMatch?.[1] ?? '';

  return (
    <svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      dangerouslySetInnerHTML={{ __html: innerHTML }}
    />
  );
}

/* ---- Exported icon elements -------------------------------------------- */

/* Cross / Close */
export const CrossFilled16 = svgFromRaw(crossFilled16Raw);
export const CrossFilled20 = svgFromRaw(crossFilled20Raw);

/* Tick / Check */
export const TickBold12 = svgFromRaw(tickBold12Raw);
export const TickBold16 = svgFromRaw(tickBold16Raw);

/* Dash / Minus (mixed checkbox) */
export const DashRegular12 = svgFromRaw(dashRegular12Raw);
export const DashRegular16 = svgFromRaw(dashRegular16Raw);

/* Tick / Check circle */
export const TickCircleFilled16 = svgFromRaw(tickCircleFilled16Raw);
export const TickCircleRegular16 = svgFromRaw(tickCircleRegular16Raw);

/* Filter */
export const FilterRegular20 = svgFromRaw(filterRegular20Raw);

/* Chevrons — 16px bold */
export const ChevronDownBold16 = svgFromRaw(chevronDownBold16Raw);
export const ChevronUpBold16 = svgFromRaw(chevronUpBold16Raw);
export const ChevronLeftBold16 = svgFromRaw(chevronLeftBold16Raw);
export const ChevronRightBold16 = svgFromRaw(chevronRightBold16Raw);

/* Chevrons — 20px bold */
export const ChevronLeftBold20 = svgFromRaw(chevronLeftBold20Raw);
export const ChevronRightBold20 = svgFromRaw(chevronRightBold20Raw);

/* Chevrons — 16px regular */
export const ChevronRightRegular16 = svgFromRaw(chevronRightRegular16Raw);

/* Chevrons — 20px regular */
export const ChevronDownRegular20 = svgFromRaw(chevronDownRegular20Raw);
export const ChevronRightRegular20 = svgFromRaw(chevronRightRegular20Raw);

/* Information circle */
export const InformationCircleRegular16 = svgFromRaw(informationCircleRegular16Raw);
export const InformationCircleFilled20 = svgFromRaw(informationCircleFilled20Raw);

/* Search */
export const SearchRegular20 = svgFromRaw(searchRegular20Raw);
export const SearchRegular16 = svgFromRaw(searchRegular16Raw);
export const SearchBold16 = svgFromRaw(searchBold16Raw);

/* Copy */
export const CopyBold16 = svgFromRaw(copyBold16Raw);
export const CopyRegular16 = svgFromRaw(copyRegular16Raw);

/* Generic (placeholder action icon) */
export const GenericRegular32 = svgFromRaw(genericRegular32Raw);
export const GenericRegular20 = svgFromRaw(genericRegular20Raw);
export const GenericRegular16 = svgFromRaw(genericRegular16Raw);

/* Trash / Delete */
export const TrashRegular20 = svgFromRaw(trashRegular20Raw);

/* Cross / Close — Bold */
export const CrossBold16 = svgFromRaw(crossBold16Raw);
export const CrossBold20 = svgFromRaw(crossBold20Raw);

/* Tick / Check — Regular */
export const TickRegular20 = svgFromRaw(tickRegular20Raw);

/* Select All */
export const SelectAllRegular20 = svgFromRaw(selectAllRegular20Raw);

/* Fix (wrench) */
export const FixRegular16 = svgFromRaw(fixRegular16Raw);

/* Date Picker — Calendar */
export const DatePickerRegular20 = svgFromRaw(datePickerRegular20Raw);

/* Time Picker — Clock */
export const TimePickerRegular20 = svgFromRaw(timePickerRegular20Raw);

/* Sidebar Collapse / Expand */
export const SidebarCollapseRegular24 = svgFromRaw(sidebarCollapseRegular24Raw);
export const SidebarExpandRegular24 = svgFromRaw(sidebarExpandRegular24Raw);
