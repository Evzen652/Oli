import type { PracticeTask, InputType } from '@/lib/engine/types';
import { NumberInput } from './inputs/NumberInput';
import { FractionInput } from './inputs/FractionInput';
import { SelectOneInput } from './inputs/SelectOneInput';
import { DragOrderInput } from './inputs/DragOrderInput';
import { FillBlankInput } from './inputs/FillBlankInput';
import { MatchPairsInput } from './inputs/MatchPairsInput';
import { MultiSelectInput } from './inputs/MultiSelectInput';
import { CategorizeInput } from './inputs/CategorizeInput';
import { TextInput } from './inputs/TextInput';

interface Props {
  task: PracticeTask;
  inputType: InputType;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export function PracticeInputRouter({ task, inputType, onSubmit, disabled }: Props) {
  const commonProps = { task, onSubmit, disabled };

  switch (inputType) {
    case 'comparison':
      return <SelectOneInput {...commonProps} options={['<', '=', '>']} isComparison />;
    case 'select_one':
      return <SelectOneInput {...commonProps} options={task.options ?? []} />;
    case 'fraction':
      return <FractionInput {...commonProps} />;
    case 'number':
      return <NumberInput {...commonProps} />;
    case 'drag_order':
      return <DragOrderInput {...commonProps} />;
    case 'fill_blank':
      return <FillBlankInput {...commonProps} />;
    case 'match_pairs':
      return <MatchPairsInput {...commonProps} />;
    case 'multi_select':
      return <MultiSelectInput {...commonProps} />;
    case 'categorize':
      return <CategorizeInput {...commonProps} />;
    case 'text':
      return <TextInput {...commonProps} />;
    default:
      return <TextInput {...commonProps} />;
  }
}
