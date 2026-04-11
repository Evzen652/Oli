import type { Grade } from '@/lib/engine/types';
import { Button } from '@/components/ui/button';
import { OlyLogo } from '@/components/shared/OlyLogo';
import { useT } from '@/app/LocaleProvider';

interface Props {
  onSelect: (grade: Grade) => void;
}

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function GradeSelect({ onSelect }: Props) {
  const t = useT();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <OlyLogo size="lg" className="mb-8" />
      <h1 className="text-2xl font-bold mb-6">{t('grade.select')}</h1>
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {GRADES.map((grade) => (
          <Button
            key={grade}
            variant="outline"
            size="xl"
            onClick={() => onSelect(grade)}
            className="aspect-square text-xl font-bold"
          >
            {grade}.
          </Button>
        ))}
      </div>
    </div>
  );
}
