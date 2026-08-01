import { IconDemo } from './components/Assets/Icon/IconDemo.tsx';
import { SubControlsDemo } from './components/Inputs and Interactive/Sub-Controls/SubControlsDemo.tsx';
import { CTAButtonsDemo } from './components/Inputs and Interactive/CTA Buttons/CTAButtonsDemo.tsx';
import { SpanButtonsDemo } from './components/Inputs and Interactive/Span Buttons/SpanButtonsDemo.tsx';
import { CompoundButtonsDemo } from './components/Inputs and Interactive/Compound Buttons/CompoundButtonsDemo.tsx';
import { SidebarDependenciesDemo } from './components/Inputs and Interactive/Sidebar Dependencies/SidebarDependenciesDemo.tsx';
import { TabDemo } from './components/Inputs and Interactive/Tab/TabDemo.tsx';
import { SelectionChipDemo } from './components/Inputs and Interactive/Selection Chip/SelectionChipDemo.tsx';
import { DropdownDemo } from './components/Inputs and Interactive/Dropdown/DropdownDemo.tsx';
import { ModalFieldDemo } from './components/Inputs and Interactive/Modal Field/ModalFieldDemo.tsx';
import { CheckboxDemo } from './components/Inputs and Interactive/Checkbox/CheckboxDemo.tsx';
import { SwitchDemo } from './components/Inputs and Interactive/Switch/SwitchDemo.tsx';
import { RadioDemo } from './components/Inputs and Interactive/Radio/RadioDemo.tsx';
import { CalendarDemo } from './components/Inputs and Interactive/Calendar/CalendarDemo.tsx';
import TimeDemo from './components/Inputs and Interactive/Time/TimeDemo.tsx';
import { DataEntryDemo } from './components/Data Entry/DataEntryDemo.tsx';
import { DatePickerDemo } from './components/Data Entry/DatePickerDemo.tsx';
import { TimePickerDemo } from './components/Data Entry/TimePickerDemo.tsx';

export function App() {
  return (
    <>
      <TimePickerDemo />
      <DatePickerDemo />
      <DataEntryDemo />
      <TimeDemo />
      <CalendarDemo />
      <SwitchDemo />
      <RadioDemo />
      <CheckboxDemo />
      <ModalFieldDemo />
      <DropdownDemo />
      <SelectionChipDemo />
      <TabDemo />
      <SidebarDependenciesDemo />
      <CompoundButtonsDemo />
      <SpanButtonsDemo />
      <CTAButtonsDemo />
      <SubControlsDemo />
      <IconDemo />
    </>
  );
}
