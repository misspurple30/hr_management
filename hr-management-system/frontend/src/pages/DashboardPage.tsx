import { useEffect, useState } from 'react';
import api from '../api';
import { FiMoreHorizontal, FiBriefcase, FiUserCheck, FiUserPlus } from 'react-icons/fi';
import ScheduleFormModal from '../components/ScheduleFormModal';
import DepartmentDistributionChart from '../components/DepartmentDistributionChart';
import { PageSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

interface DashboardStats {
  overview: {
    totalEmployees: number;
    activeEmployees: number;
    newEmployees: number;
    availablePositions: number;
    urgentlyNeeded: number;
    talentRequests: number;
  };
  announcements: any[];
  upcomingSchedules: any[];
  analytics: {
    employeesByDepartment: { departmentId: string; _count: number }[];
  };
}

interface Department {
  id: string;
  name: string;
  color?: string;
}

const TYPE_DOT_COLOR: Record<string, string> = {
  MEETING: 'bg-info-500',
  INTERVIEW: 'bg-primary-500',
  TRAINING: 'bg-success-500',
  REVIEW: 'bg-warning-500',
  OTHER: 'bg-neutral-400',
};

const DEFAULT_DEPARTMENT_COLOR = '#6b7280';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, departmentsResponse] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/departments'),
      ]);

      if (statsResponse.data && statsResponse.data.data) {
        setStats(statsResponse.data.data);
      } else {
        throw new Error('Format de réponse invalide');
      }
      if (departmentsResponse.data.success && departmentsResponse.data.data) {
        setDepartments(departmentsResponse.data.data);
      }
      setError(null);
    } catch {
      setError('Impossible de charger les statistiques du dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleScheduleCreated = () => {
    fetchDashboardData();
  };

  if (loading) return <PageSkeleton />;

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-neutral-50">
        <ErrorState
          message={error || 'Impossible de charger les statistiques'}
          onRetry={fetchDashboardData}
        />
      </div>
    );
  }

  const { overview, announcements = [], upcomingSchedules = [] } = stats;

  const departmentDistribution = (stats.analytics?.employeesByDepartment || [])
    .map((entry) => {
      const department = departments.find((d) => d.id === entry.departmentId);
      return {
        id: entry.departmentId,
        name: department?.name || 'Sans département',
        color: department?.color || DEFAULT_DEPARTMENT_COLOR,
        count: entry._count,
      };
    })
    .sort((a, b) => b.count - a.count);

  const formatTime = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch { return 'N/A'; }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const prioritySchedules = upcomingSchedules.filter((s) => s.type === 'REVIEW' || s.type === 'INTERVIEW');
  const otherSchedules = upcomingSchedules.filter((s) => s.type !== 'REVIEW' && s.type !== 'INTERVIEW');

  return (
    <div className="min-h-screen bg-neutral-50 pb-10">
      <div className="max-w-[1440px] mx-auto px-6 py-8 lg:px-10">

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight text-neutral-900">Dashboard</h1>
            <p className="text-neutral-500">Bon retour ! Voici ce qui se passe aujourd'hui.</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setIsModalOpen(true)}>
            + Nouveau Planning
          </Button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

          {/* Main Column */}
          <div className="xl:col-span-8 space-y-8">

            {/* High-Level Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card hover padding="lg">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                  <FiBriefcase className="w-5 h-5 text-primary-600" />
                </div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Postes disponibles</p>
                <p className="text-3xl font-bold text-neutral-900 mb-3">{overview.availablePositions}</p>
                <Badge variant="error" dot>{overview.urgentlyNeeded} urgent(s)</Badge>
              </Card>

              <Card hover padding="lg">
                <div className="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center mb-4">
                  <FiUserCheck className="w-5 h-5 text-success-600" />
                </div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Employés actifs</p>
                <p className="text-3xl font-bold text-neutral-900 mb-3">{overview.activeEmployees}</p>
                <Badge variant="success" dot>sur {overview.totalEmployees} au total</Badge>
              </Card>

              <Card hover padding="lg">
                <div className="w-10 h-10 bg-info-50 rounded-lg flex items-center justify-center mb-4">
                  <FiUserPlus className="w-5 h-5 text-info-600" />
                </div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Nouveaux collaborateurs</p>
                <p className="text-3xl font-bold text-neutral-900 mb-3">{overview.newEmployees}</p>
                <Badge variant="info" dot>ce mois-ci</Badge>
              </Card>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card hover padding="lg">
                <p className="text-neutral-500 font-medium text-sm mb-1">Total Employés</p>
                <h2 className="text-4xl font-bold font-display text-neutral-900">{overview.totalEmployees}</h2>
                <p className="text-xs text-neutral-400 mt-2">Répartis sur l'ensemble des départements</p>
              </Card>

              <Card hover padding="lg">
                <p className="text-neutral-500 font-medium text-sm mb-1">Demandes de talents</p>
                <h2 className="text-4xl font-bold font-display text-neutral-900">{overview.talentRequests}</h2>
                <p className="text-xs text-neutral-400 mt-2">En attente de traitement</p>
              </Card>
            </div>

            {/* Announcements */}
            <Card padding="none" className="overflow-hidden">
              <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold font-display text-neutral-900">Annonces</h3>
                <span className="text-xs font-medium text-neutral-400">{formatTime(new Date())}</span>
              </div>
              <div className="p-4 space-y-1">
                {announcements.length > 0 ? (
                  announcements.slice(0, 3).map((item) => (
                    <div key={item.id} className="group flex items-center justify-between p-4 rounded-lg hover:bg-neutral-50 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">{item.title}</p>
                        <p className="text-xs text-neutral-400 mt-1">{formatTime(item.createdAt)}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiMoreHorizontal className="w-5 h-5 text-neutral-400" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    icon={<FiMoreHorizontal className="w-10 h-10" />}
                    title="Aucune annonce"
                    description="Les annonces publiées apparaîtront ici"
                  />
                )}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="xl:col-span-4 space-y-8">

            {/* Department distribution - signature widget */}
            <div className="bg-surface-dark rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
              <h3 className="text-lg font-semibold font-display mb-6 relative z-10">Répartition par département</h3>
              <div className="relative z-10">
                <DepartmentDistributionChart data={departmentDistribution} />
              </div>
            </div>

            {/* Schedule */}
            <Card padding="lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold font-display text-neutral-900">Planning à venir</h3>
              </div>

              <div className="space-y-6">
                {prioritySchedules.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">Prioritaire</p>
                    <div className="space-y-3">
                      {prioritySchedules.map((item) => (
                        <div key={item.id} className="flex gap-3 group">
                          <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${TYPE_DOT_COLOR[item.type] || TYPE_DOT_COLOR.OTHER}`} />
                          <div className="flex-1 min-w-0 py-0.5">
                            <p className="text-sm font-semibold text-neutral-800 truncate">{item.title}</p>
                            <p className="text-xs text-neutral-400 mt-0.5">{formatDate(item.startTime)} · {formatTime(item.startTime)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">Autres</p>
                  {otherSchedules.length > 0 ? (
                    <div className="space-y-3">
                      {otherSchedules.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex gap-3 group">
                          <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${TYPE_DOT_COLOR[item.type] || TYPE_DOT_COLOR.OTHER}`} />
                          <div className="flex-1 min-w-0 py-0.5">
                            <p className="text-sm font-medium text-neutral-700 truncate">{item.title}</p>
                            <p className="text-xs text-neutral-400 mt-0.5">{formatDate(item.startTime)} · {formatTime(item.startTime)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    prioritySchedules.length === 0 && (
                      <p className="text-sm text-neutral-400">Aucun événement planifié</p>
                    )
                  )}
                </div>
              </div>

              <div className="mt-8">
                <Button
                  variant="ghost"
                  className="w-full py-3.5 border-2 border-dashed border-neutral-200 rounded-xl text-primary-600 font-semibold text-sm hover:bg-primary-50 transition-all"
                  onClick={() => setIsModalOpen(true)}
                >
                  Créer un nouveau planning
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ScheduleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onScheduleCreated={handleScheduleCreated}
      />
    </div>
  );
}
