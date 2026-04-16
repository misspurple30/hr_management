import { useState, useEffect } from 'react';
import api from '../api';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

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
        form="department-form"
        variant="primary"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isEditMode ? 'Modifier' : 'Créer'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Modifier le département' : 'Créer un département'}
      footer={footerContent}
    >
      <form id="department-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom"
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ex: Ressources Humaines"
          required
        />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Description du département..."
            className="w-full rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder-neutral-400 px-3.5 py-2.5 transition-colors duration-150 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
          />
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Couleur
          </label>
          <div className="flex items-center gap-3">
            <Select
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="flex-1"
            >
              {COLORS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
            <div
              className="w-10 h-10 rounded-lg border border-neutral-200 flex-shrink-0"
              style={{ backgroundColor: formData.color }}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-sm text-error-600">{error}</p>
          </div>
        )}
      </form>
    </Modal>
  );
}
