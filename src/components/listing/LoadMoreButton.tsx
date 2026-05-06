import { Button } from '@/components/ui/button';

const LoadMoreButton = ({
  onClick,
  remaining,
  label,
}: {
  onClick: () => void;
  remaining: number;
  label: string;
}) => {
  if (remaining <= 0) return null;
  return (
    <div className="flex justify-center mt-10">
      <Button onClick={onClick} variant="outline" size="lg" className="rounded-full">
        {label} ({remaining})
      </Button>
    </div>
  );
};

export default LoadMoreButton;