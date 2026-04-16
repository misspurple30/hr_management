import React, { useState, useEffect } from 'react';
import api from '../api';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeSaved: () => void;
  employee?: any | null;
}

interface Department {
  id: string;
  name: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  departmentId: string;
  hireDate: string;
  salary: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  password?: string;
}

export default function EmployeeFormModal({ isOpen, onClose, onEmployeeSaved, employee }: EmployeeFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    departmentId: '',
    hireDate: '',
    salary: '',
    status: 'ACTIVE',
    password: '',
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!employee;

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();

      if (employee) {
        setFormData({
          firstName: employee.firstName || '',
          lastName: employee.lastName || '',
          email: employee.email || '',
          phone: employee.phone || '',
          position: employee.position || '',
          departmentId: employee.departmentId || '',
          hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
          salary: employee.salary?.toString() || '',
          status: employee.status || 'ACTIVE',
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, employee]);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      departmentId: '',
      hireDate: '',
      salary: '',
      status: 'ACTIVE',
      password: '',
    });
    setError(null);
  };

  const fetchDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const response = await api.get('/departments');
      const depts = response.data.data?.data || response.data.data || [];
      setDepartments(depts);
    } catch {
      setError('Impossible de charger les départements');
    } finally {
      setLoadingDepartments(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Le prénom et le nom sont requis');
      return;
    }
    if (!formData.email.trim()) {
      setError('L\'email est requis');
      return;
    }
    if (!formData.departmentId) {
      setError('Le département est requis');
      return;
    }
    if (!isEditMode && !formData.password) {
      setError('Le mot de passe est requis pour créer un employé');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        departmentId: formData.departmentId,
        hireDate: formData.hireDate,
        salary: parseFloat(formData.salary) || 0,
        status: formData.status,
        ...(formData.password && { password: formData.password }),
      };

      if (isEditMode) {
        await api.put(`/employees/${employee.id}`, payload);
      } else {
        await api.post('/employees', payload);
      }

      onEmployeeSaved();
      onClose();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map((e: any) => e.msg).join(', '));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erreur lors de l\'enregistrement');
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
        form="employee-form"
        variant="primary"
        loading={isSubmitting}
        disabled={isSubmitting || loadingDepartments}
      >
        {isEditMode ? 'Mettre à jour' : 'Créer'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Modifier l\'employé' : 'Ajouter un employé'}
      size="lg"
      footer={footerContent}
    >
      <form id="employee-form" onSubmit={handleSubmit} className="space-y-4">

        {/* Name Row */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Prénom"
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            label="Nom"
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Téléphone"
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Position & Department */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Poste"
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          />
          <Select
            label="Département"
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            required
            disabled={loadingDepartments}
          >
            <option value="">Sélectionner...</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Hire Date & Salary */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date d'embauche"
            type="date"
            id="hireDate"
            name="hireDate"
            value={formData.hireDate}
            onChange={handleChange}
            required
          />
          <Input
            label="Salaire"
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>

        {/* Status */}
        <Select
          label="Statut"
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="ACTIVE">Actif</option>
          <option value="INACTIVE">Inactif</option>
          <option value="ON_LEAVE">En congé</option>
        </Select>

        {/* Password (only for creation) */}
        {!isEditMode && (
          <div>
            <Input
              label="Mot de passe"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditMode}
              minLength={6}
            />
            <p className="text-xs text-neutral-500 mt-1">Minimum 6 caractères</p>
          </div>
        )}

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
