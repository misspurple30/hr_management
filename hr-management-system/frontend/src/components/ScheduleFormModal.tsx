import { useState, useEffect } from 'react';
import api from '../api';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

type ScheduleFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onScheduleCreated: () => void;
};

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

const scheduleTypes = ['MEETING', 'INTERVIEW', 'REVIEW', 'TRAINING', 'OTHER'] as const;
type ScheduleType = typeof scheduleTypes[number];

interface FormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  type: ScheduleType;
  employeeId: string;
}

export default function ScheduleFormModal({ isOpen, onClose, onScheduleCreated }: ScheduleFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'MEETING',
    employeeId: '',
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les employés quand la modale s'ouvre
  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    } else {
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        type: 'MEETING',
        employeeId: '',
      });
      setError(null);
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    setError(null);

    try {
      const response = await api.get('/employees');

      let employeesList = [];

      if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
        employeesList = response.data.data.data;
      }
      else if (Array.isArray(response.data)) {
        employeesList = response.data;
      }
      setEmployees(employeesList);

    } catch (err: any) {

      if (err.response?.status === 401) {
        setError('Non authentifié. Veuillez vous reconnecter.');
      } else {
        setError('Impossible de charger les employés');
      }

      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      setError('Le titre est requis');
      return;
    }
    if (!formData.employeeId) {
      setError('Veuillez sélectionner un employé');
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      setError('Les dates de début et fin sont requises');
      return;
    }
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      setError('La date de fin doit être après la date de début');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        type: formData.type,
        employeeId: formData.employeeId,
      };

      await api.post('/schedules', payload);
      onScheduleCreated();
      onClose();

    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map((e: any) => e.msg).join(', '));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erreur lors de la création du schedule');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerContent = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      <Button
        type="submit"
        form="schedule-form"
        variant="primary"
        loading={isSubmitting}
        disabled={isSubmitting || loadingEmployees}
      >
        Créer
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer un nouveau schedule"
      footer={footerContent}
    >
      <form id="schedule-form" onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <Input
          label="Titre"
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ex: Réunion d'équipe"
          required
        />

        {/* Employee */}
        <div>
          <Select
            label="Employé"
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            disabled={loadingEmployees}
            required
          >
            <option value="">
              {loadingEmployees ? 'Chargement...' : 'Sélectionner un employé'}
            </option>
            {!loadingEmployees && employees.length > 0 && employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </Select>
          {!loadingEmployees && employees.length === 0 && (
            <p className="mt-1 text-xs text-warning-600">
              Aucun employé trouvé.
            </p>
          )}
          {!loadingEmployees && employees.length > 0 && (
            <p className="mt-1 text-xs text-success-600">
              {employees.length} employé(s) disponible(s)
            </p>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Début"
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
          <Input
            label="Fin"
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>

        {/* Type */}
        <Select
          label="Type"
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          {scheduleTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </option>
          ))}
        </Select>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Description (optionnel)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Détails supplémentaires..."
            className="w-full rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder-neutral-400 px-3.5 py-2.5 transition-colors duration-150 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-sm text-error-600">{error}</p>
          </div>
        )}
      </form>
    </Modal>
  );
}
