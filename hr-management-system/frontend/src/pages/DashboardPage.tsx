import { useEffect, useState } from 'react';
import api from '../api';
import { FiMoreHorizontal, FiCalendar } from 'react-icons/fi';
import ScheduleFormModal from '../components/ScheduleFormModal';
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
  jobPositions: any[];
  talentRequests: any[];
  announcements: any[];
  upcomingSchedules: any[];
  analytics: any;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/stats');

      if (response.data && response.data.data) {
        setStats(response.data.data);
      } else {
        throw new Error('Format de réponse invalide');
      }

      setError(null);
    } catch (error) {
      setError('Impossible de charger les statistiques du dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleScheduleCreated = () => {
    fetchDashboardStats();
  };

  if (loading) {
    return <PageSkeleton />;
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-screen w-full overflow-hidden bg-neutral-50">
        <ErrorState
          message={error || 'Impossible de charger les statistiques du dashboard'}
          onRetry={fetchDashboardStats}
        />
      </div>
    );
  }

  const { overview, announcements = [], upcomingSchedules = [] } = stats;

  const formatTime = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return 'N/A';
    }
  };

  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return new Date().toLocaleDateString('fr-FR');
    }
  };

  const getTimeLabel = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      // Format: "Aujourd'hui, 17:40"
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `Aujourd'hui, ${hours}:${minutes}`;
    } catch {
      return 'N/A';
    }
  };

  const prioritySchedules = upcomingSchedules.filter((s) =>
    s.type === 'REVIEW' || s.type === 'INTERVIEW'
  );

  const otherSchedules = upcomingSchedules.filter((s) =>
    s.type !== 'REVIEW' && s.type !== 'INTERVIEW'
  );

  return (
    <>
      <div className="w-full h-full overflow-y-auto bg-neutral-50 animate-fade-in">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-8">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Card 1: Available Position */}
                <Card padding="sm" className="bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200">
                  <p className="text-xs font-medium text-neutral-600 mb-1">Available Position</p>
                  <p className="text-3xl font-bold text-neutral-900 mb-2">{overview.availablePositions}</p>
                  <Badge variant="error" dot>{overview.urgentlyNeeded} Urgently needed</Badge>
                </Card>

                {/* Card 2: Job Open */}
                <Card padding="sm" className="bg-gradient-to-br from-info-50 to-info-100 border-info-200">
                  <p className="text-xs font-medium text-neutral-600 mb-1">Job Open</p>
                  <p className="text-3xl font-bold text-neutral-900 mb-2">{overview.availablePositions}</p>
                  <Badge variant="info" dot>{overview.availablePositions} Active hiring</Badge>
                </Card>

                {/* Card 3: New Employees */}
                <Card padding="sm" className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
                  <p className="text-xs font-medium text-neutral-600 mb-1">New Employees</p>
                  <p className="text-3xl font-bold text-neutral-900 mb-2">{overview.newEmployees}</p>
                  <Badge variant="primary" dot>{overview.newEmployees} Department</Badge>
                </Card>
              </div>

              {/* Row 2: Total Employees + Talent Request */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Total Employees */}
                <Card hover>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-medium text-neutral-500 mb-1">Total Employees</p>
                      <p className="text-3xl font-bold text-neutral-900">{overview.totalEmployees}</p>
                    </div>
                    {/* Mini graph placeholder */}
                    <svg className="w-16 h-10 flex-shrink-0" viewBox="0 0 64 40">
                      <path d="M 0 30 Q 16 25 32 20 T 64 10" fill="none" stroke="var(--color-primary-500)" strokeWidth="2"/>
                      <text x="50" y="8" fill="var(--color-primary-500)" fontSize="10">+8%</text>
                    </svg>
                  </div>
                  <div className="space-y-0.5 text-xs text-neutral-600">
                    <p>102 Men</p>
                    <p>56 Women</p>
                  </div>
                  <p className="text-xs text-primary-600 font-medium mt-2">+2% Past month</p>
                </Card>

                {/* Talent Request */}
                <Card hover>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-medium text-neutral-500 mb-1">Talent Request</p>
                      <p className="text-3xl font-bold text-neutral-900">{overview.talentRequests}</p>
                    </div>
                    {/* Mini graph placeholder */}
                    <svg className="w-16 h-10 flex-shrink-0" viewBox="0 0 64 40">
                      <path d="M 0 30 Q 16 25 32 20 T 64 10" fill="none" stroke="var(--color-primary-500)" strokeWidth="2"/>
                      <text x="50" y="8" fill="var(--color-primary-500)" fontSize="10">+8%</text>
                    </svg>
                  </div>
                  <div className="space-y-0.5 text-xs text-neutral-600">
                    <p>6 Men</p>
                    <p>10 Women</p>
                  </div>
                  <p className="text-xs text-primary-600 font-medium mt-2">+5% Past month</p>
                </Card>
              </div>

              {/* Announcements Section */}
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Announcement</h3>
                  <span className="text-xs text-neutral-500">{getTimeLabel(new Date())}</span>
                </div>

                <div className="space-y-3">
                  {announcements && announcements.length > 0 ? (
                    announcements.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-start justify-between p-3 border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 mb-1 truncate">{item.title || 'Sans titre'}</p>
                          <p className="text-xs text-neutral-500">
                            {formatTime(item.createdAt || new Date())}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                          <Button variant="ghost" size="sm" className="p-1">
                            <FiMoreHorizontal className="w-4 h-4 text-neutral-500" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      icon={<FiCalendar className="w-8 h-8" />}
                      title="Aucune annonce disponible"
                    />
                  )}
                </div>

                {announcements && announcements.length > 0 && (
                  <div className="mt-4 text-center">
                    <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                      See All Announcement
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-6">

              {/* Recently Activity */}
              <Card padding="lg" className="bg-gradient-to-br from-surface-dark to-neutral-900 text-white border-transparent">
                <h3 className="text-sm font-semibold mb-3">Recently Activity</h3>
                <p className="text-xs text-neutral-300 mb-2">
                  {getTimeLabel(new Date())}
                </p>
                <p className="text-sm font-semibold mb-2">You Posted a New Job</p>
                <p className="text-xs text-neutral-300 mb-4">
                  Kindly check the requirements and terms of work and make sure everything is right.
                </p>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-neutral-400">Today you makes 12 Activity</p>
                  <Button variant="primary" size="sm">
                    See All Activity
                  </Button>
                </div>
              </Card>

              {/* Upcoming Schedule */}
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Upcoming Schedule</h3>
                  <span className="text-xs text-neutral-500">{getTimeLabel(new Date())}</span>
                </div>

                {/* Priority Section */}
                {prioritySchedules.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-neutral-600 mb-2">Priority</p>
                    <div className="space-y-2">
                      {prioritySchedules.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-start justify-between p-2.5 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-neutral-900 mb-0.5 truncate">{item.title || 'Scheduled event'}</p>
                            <p className="text-xs text-neutral-500">
                              Today - {formatTime(item.startTime || new Date())}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="p-1 ml-2 flex-shrink-0">
                            <FiMoreHorizontal className="w-3 h-3 text-neutral-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Section */}
                {otherSchedules.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-neutral-600 mb-2">Other</p>
                    <div className="space-y-2">
                      {otherSchedules.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-start justify-between p-2.5 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-neutral-900 mb-0.5 truncate">{item.title || 'Scheduled event'}</p>
                            <p className="text-xs text-neutral-500">
                              Today - {formatTime(item.startTime || new Date())}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="p-1 ml-2 flex-shrink-0">
                            <FiMoreHorizontal className="w-3 h-3 text-neutral-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {prioritySchedules.length === 0 && otherSchedules.length === 0 && (
                  <EmptyState
                    icon={<FiCalendar className="w-8 h-8" />}
                    title="Aucun événement à venir"
                  />
                )}

                <div className="mt-4 text-center border-t border-neutral-200 pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary-600 hover:text-primary-700"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Create a New Schedule
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de création de schedule */}
      <ScheduleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onScheduleCreated={handleScheduleCreated}
      />
    </>
  );
}
