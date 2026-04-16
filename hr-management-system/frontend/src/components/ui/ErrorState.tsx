import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import Button from './Button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px] w-full bg-white rounded-xl">
      <div className="text-center px-4">
        <div className="w-14 h-14 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAlertCircle className="w-7 h-7 text-error-500" />
        </div>
        <p className="text-base font-medium text-neutral-800 mb-1">Erreur de chargement</p>
        <p className="text-sm text-neutral-500 mb-5 max-w-sm">{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" icon={<FiRefreshCw size={14} />} onClick={onRetry}>
            Réessayer
          </Button>
        )}
      </div>
    </div>
  );
}
