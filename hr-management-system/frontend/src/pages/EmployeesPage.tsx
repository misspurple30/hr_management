import { useEffect, useState } from 'react';
import api from '../api';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiFilter, FiUsers } from 'react-icons/fi';
import EmployeeFormModal from '../components/EmployeeFormModal';
import EmployeeDetailsModal from '../components/EmployeeDetailModal';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { TableSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import Avatar from '../components/ui/Avatar';

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  departmentId: string;
  department?: {
    id: string;
    name: string;
    color?: string;
  };
  hireDate: string;
  salary: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  createdAt: string;
}

interface PaginatedResponse {
  data: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, searchTerm, statusFilter, departmentFilter]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(departmentFilter && { departmentId: departmentFilter }),
      });

      const response = await api.get(`/employees?${params}`);

      if (response.data.success && response.data.data) {
        const result = response.data.data as PaginatedResponse;
        setEmployees(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotal(result.pagination.total);
      }
    } catch (err: any) {
      setError('Impossible de charger les employés');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedEmployee(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormModalOpen(true);
  };

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      return;
    }

    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err: any) {
      setError('Erreur lors de la suppression');
    }
  };

  const handleEmployeeSaved = () => {
    fetchEmployees();
  };

  const getStatusBadgeVariant = (status: string): 'success' | 'error' | 'warning' | 'default' => {
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
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading && employees.length === 0) {
    return (
      <div className="w-full h-full bg-neutral-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-neutral-200 rounded-lg animate-pulse" />
              <div className="h-4 w-32 bg-neutral-200 rounded-lg animate-pulse" />
            </div>
            <div className="h-10 w-44 bg-neutral-200 rounded-lg animate-pulse" />
          </div>
          <Card padding="sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-10 bg-neutral-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-neutral-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-neutral-100 rounded-lg animate-pulse" />
            </div>
          </Card>
          <TableSkeleton rows={5} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full overflow-y-auto bg-neutral-50 animate-fade-in">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold font-display text-neutral-900">Employés</h1>
              <p className="text-sm text-neutral-500 mt-1">{total} employé(s) au total</p>
            </div>
            <Button
              variant="primary"
              icon={<FiPlus size={20} />}
              onClick={handleCreate}
            >
              Ajouter un employé
            </Button>
          </div>

          {/* Filters */}
          <Card padding="sm" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Search */}
              <Input
                type="text"
                placeholder="Rechercher par nom, email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                icon={<FiSearch size={18} />}
              />

              {/* Status Filter */}
              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tous les statuts</option>
                <option value="ACTIVE">Actif</option>
                <option value="INACTIVE">Inactif</option>
                <option value="ON_LEAVE">En congé</option>
              </Select>

              {/* Reset Filters */}
              <Button
                variant="outline"
                icon={<FiFilter size={18} />}
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setDepartmentFilter('');
                  setCurrentPage(1);
                }}
              >
                Réinitialiser
              </Button>
            </div>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="mb-6">
              <ErrorState message={error} onRetry={fetchEmployees} />
            </div>
          )}

          {/* Employees Table */}
          {!error && (
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Employé
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Poste
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Département
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Date d'embauche
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {employees.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-0">
                          <EmptyState
                            icon={<FiUsers size={40} />}
                            title="Aucun employé trouvé"
                            description="Commencez par ajouter un employé"
                            action={
                              <Button
                                variant="primary"
                                size="sm"
                                icon={<FiPlus size={16} />}
                                onClick={handleCreate}
                              >
                                Ajouter un employé
                              </Button>
                            }
                          />
                        </td>
                      </tr>
                    ) : (
                      employees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <Avatar
                                firstName={employee.firstName}
                                lastName={employee.lastName}
                                color={employee.department?.color}
                                size="sm"
                              />
                              <div>
                                <div className="text-sm font-semibold font-display text-neutral-900">
                                  {employee.firstName} {employee.lastName}
                                </div>
                                <div className="text-sm text-neutral-500">{employee.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {employee.employeeId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                            {employee.position}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {employee.department?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {formatDate(employee.hireDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={getStatusBadgeVariant(employee.status)} dot>
                              {getStatusLabel(employee.status)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<FiEye size={16} />}
                                onClick={() => handleView(employee)}
                                title="Voir détails"
                                className="text-info-600 hover:bg-info-50"
                              >
                                {''}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<FiEdit2 size={16} />}
                                onClick={() => handleEdit(employee)}
                                title="Modifier"
                                className="text-warning-600 hover:bg-warning-50"
                              >
                                {''}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<FiTrash2 size={16} />}
                                onClick={() => handleDelete(employee.id)}
                                title="Supprimer"
                                className="text-error-600 hover:bg-error-50"
                              >
                                {''}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
                  <div className="text-sm text-neutral-500">
                    Page {currentPage} sur {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedEmployee(null);
        }}
        onEmployeeSaved={handleEmployeeSaved}
        employee={selectedEmployee}
      />

      <EmployeeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
      />
    </>
  );
}
