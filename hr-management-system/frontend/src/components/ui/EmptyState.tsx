import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
      <div className="text-neutral-300 flex justify-center mb-4">{icon}</div>
      <p className="text-base font-medium text-neutral-500 mb-1">{title}</p>
      {description && <p className="text-sm text-neutral-400 mb-4">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
