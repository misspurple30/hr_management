import { useState, useEffect } from 'react';
import api from '../api';
import { FiX } from 'react-icons/fi';

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Créer un nouveau schedule</h3>
          <button 
            onClick={onClose} 
            type="button"
            className="p-1 text-gray-500 hover:text-red-600 rounded-full transition-colors"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Form */}
        <form id="schedule-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Réunion d'équipe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
              Employé <span className="text-red-500">*</span>
            </label>
            
            <select
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              disabled={loadingEmployees}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
            >
              <option value="">
                {loadingEmployees ? 'Chargement...' : 'Sélectionner un employé'}
              </option>
              
              {!loadingEmployees && employees.length > 0 && employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
            
            {!loadingEmployees && employees.length === 0 && (
              <p className="mt-1 text-xs text-orange-600">
                Aucun employé trouvé. 
              </p>
            )}
            {!loadingEmployees && employees.length > 0 && (
              <p className="mt-1 text-xs text-green-600">
                {employees.length} employé(s) disponible(s)
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Début <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                Fin <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {scheduleTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optionnel)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Détails supplémentaires..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="schedule-form"
            disabled={isSubmitting || loadingEmployees}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-400"
          >
            {isSubmitting ? 'Création...' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}