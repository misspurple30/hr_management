import { FiMail, FiPhone, FiCalendar, FiDollarSign, FiBriefcase, FiUser } from 'react-icons/fi';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Avatar from './ui/Avatar';

interface EmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any | null;
}

export default function EmployeeDetailsModal({ isOpen, onClose, employee }: EmployeeDetailsModalProps) {
  if (!employee) return null;

  const getStatusVariant = (status: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'error';
      case 'ON_LEAVE':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Actif';
      case 'INACTIVE':
        return 'Inactif';
      case 'ON_LEAVE':
        return 'En congé';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const footerContent = (
    <Button variant="outline" onClick={onClose}>
      Fermer
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${employee.firstName} ${employee.lastName}`}
      size="lg"
      footer={footerContent}
    >
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar
          firstName={employee.firstName}
          lastName={employee.lastName}
          color={employee.department?.color}
          size="lg"
        />
        <div>
          <h3 className="text-xl font-semibold font-display text-neutral-900">
            {employee.firstName} {employee.lastName}
          </h3>
          <p className="text-sm text-neutral-500">{employee.position}</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <Badge variant={getStatusVariant(employee.status)} dot>
          {getStatusLabel(employee.status)}
        </Badge>
      </div>

      {/* Information Grid */}
      <div className="space-y-6">

        {/* Personal Information */}
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-3">
            Informations personnelles
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="flex items-start gap-3">
              <div className="p-2 bg-info-50 rounded-lg">
                <FiMail className="w-5 h-5 text-info-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Email</p>
                <p className="text-sm font-medium text-neutral-900">{employee.email}</p>
              </div>
            </div>

            {employee.phone && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-success-50 rounded-lg">
                  <FiPhone className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Téléphone</p>
                  <p className="text-sm font-medium text-neutral-900">{employee.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <FiUser className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">ID Employé</p>
                <p className="text-sm font-medium text-neutral-900">{employee.employeeId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-3">
            Informations professionnelles
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <FiBriefcase className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Poste</p>
                <p className="text-sm font-medium text-neutral-900">{employee.position}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-info-50 rounded-lg">
                <FiBriefcase className="w-5 h-5 text-info-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Département</p>
                <p className="text-sm font-medium text-neutral-900">
                  {employee.department?.name || 'Non assigné'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <FiCalendar className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Date d'embauche</p>
                <p className="text-sm font-medium text-neutral-900">
                  {formatDate(employee.hireDate)}
                </p>
              </div>
            </div>

            {employee.salary && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-success-50 rounded-lg">
                  <FiDollarSign className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Salaire</p>
                  <p className="text-sm font-medium text-neutral-900">
                    {formatCurrency(employee.salary)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-3">
            Informations supplémentaires
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <p className="text-xs text-neutral-500">Date de création</p>
              <p className="text-sm font-medium text-neutral-900">
                {formatDate(employee.createdAt)}
              </p>
            </div>

            {employee.updatedAt && (
              <div>
                <p className="text-xs text-neutral-500">Dernière mise à jour</p>
                <p className="text-sm font-medium text-neutral-900">
                  {formatDate(employee.updatedAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
