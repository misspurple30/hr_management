import { useState, useEffect } from 'react';
import api from '../api';
import { FiX } from 'react-icons/fi';

type DepartmentFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDepartmentSaved: () => void;
  department?: Department | null;
};

interface Department {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

interface FormData {
  name: string;
  description: string;
  color: string;
}

const COLORS = [
  { value: '#ef4444', label: 'Rouge' },
  { value: '#f97316', label: 'Orange' },
  { value: '#eab308', label: 'Jaune' },
  { value: '#22c55e', label: 'Vert' },
  { value: '#3b82f6', label: 'Bleu' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#ec4899', label: 'Rose' },
  { value: '#6b7280', label: 'Gris' },
];

export default function DepartmentFormModal({ isOpen, onClose, onDepartmentSaved, department }: DepartmentFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    color: '#3b82f6',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!department;

  useEffect(() => {
    if (isOpen && department) {
      setFormData({
        name: department.name,
        description: department.description || '',
        color: department.color || '#3b82f6',
      });
    } else if (!isOpen) {
      setFormData({ name: '', description: '', color: '#3b82f6' });
      setError(null);
    }
  }, [isOpen, department]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Le nom du département est requis');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditMode && department) {
        await api.put(`/departments/${department.id}`, formData);
      } else {
        await api.post('/departments', formData);
      }
      onDepartmentSaved();
      onClose();
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        setError(err.response.data.errors.map((e: any) => e.msg).join(', '));
      } else {
        setError(isEditMode ? 'Erreur lors de la modification' : 'Erreur lors de la création');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditMode ? 'Modifier le département' : 'Créer un département'}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="p-1 text-gray-500 hover:text-red-600 rounded-full transition-colors"
          >
            <FiX size={22} />
          </button>
        </div>

        <form id="department-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Ressources Humaines"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Description du département..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Couleur
            </label>
            <div className="flex items-center gap-3">
              <select
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {COLORS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <div
                className="w-10 h-10 rounded-lg border border-gray-200 flex-shrink-0"
                style={{ backgroundColor: formData.color }}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </form>

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
            form="department-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-400"
          >
            {isSubmitting ? (isEditMode ? 'Modification...' : 'Création...') : (isEditMode ? 'Modifier' : 'Créer')}
          </button>
        </div>
      </div>
    </div>
  );
}
