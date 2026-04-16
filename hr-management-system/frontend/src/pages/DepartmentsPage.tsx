import { useEffect, useState } from 'react';
import api from '../api';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiSearch } from 'react-icons/fi';
import DepartmentFormModal from '../components/DepartmentFormModal';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { PageSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

interface Department {
  id: string;
  name: string;
  description?: string;
  color?: string;
  headCount: number;
  _count?: {
    employees: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function DepartmentsPage() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const canManage = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER';

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/departments');
      if (response.data.success && response.data.data) {
        setDepartments(response.data.data);
      }
    } catch {
      setError('Impossible de charger les départements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedDepartment(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setSelectedDepartment(dept);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
      return;
    }
    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <>
      <div className="w-full h-full overflow-y-auto bg-neutral-50 animate-fade-in">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Départements</h1>
              <p className="text-sm text-neutral-500 mt-1">{departments.length} département(s) au total</p>
            </div>
            {canManage && (
              <Button variant="primary" icon={<FiPlus size={20} />} onClick={handleCreate}>
                Ajouter un département
              </Button>
            )}
          </div>

          {/* Search */}
          <Card padding="sm" className="mb-6">
            <div className="max-w-md">
              <Input
                type="text"
                placeholder="Rechercher un département..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<FiSearch size={16} />}
              />
            </div>
          </Card>

          {/* Error */}
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-error-600">{error}</p>
            </div>
          )}

          {/* Department Cards */}
          {filteredDepartments.length === 0 ? (
            <EmptyState
              icon={<FiUsers className="w-12 h-12" />}
              title="Aucun département trouvé"
              description={searchTerm ? 'Essayez une autre recherche' : 'Commencez par créer un département'}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDepartments.map((dept) => {
                const employeeCount = dept._count?.employees ?? dept.headCount;
                return (
                  <Card
                    key={dept.id}
                    hover
                    padding="none"
                    className="overflow-hidden"
                  >
                    {/* Color bar */}
                    <div className="h-2" style={{ backgroundColor: dept.color || '#3b82f6' }} />

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: dept.color || '#3b82f6' }}
                          >
                            {dept.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-neutral-900">{dept.name}</h3>
                            <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                              <FiUsers className="w-3 h-3" />
                              {employeeCount} employé{employeeCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>

                        {canManage && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEdit(dept)}
                              className="p-2 text-warning-600 hover:bg-warning-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            {user?.role === 'ADMIN' && (
                              <button
                                onClick={() => handleDelete(dept.id)}
                                className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {dept.description && (
                        <p className="text-sm text-neutral-600 line-clamp-2">{dept.description}</p>
                      )}

                      <div className="mt-4 pt-3 border-t border-neutral-100">
                        <div className="flex items-center justify-between text-xs text-neutral-400">
                          <span>
                            Créé le {new Date(dept.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <DepartmentFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedDepartment(null);
        }}
        onDepartmentSaved={fetchDepartments}
        department={selectedDepartment}
      />
    </>
  );
}
