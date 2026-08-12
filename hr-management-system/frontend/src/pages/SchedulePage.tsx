import { useEffect, useState } from 'react';
import api from '../api';
import { FiPlus, FiTrash2, FiUser, FiCalendar, FiFilter } from 'react-icons/fi';
import ScheduleFormModal from '../components/ScheduleFormModal';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import { PageSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';

interface Schedule {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: string;
  employeeId: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
  };
  createdAt: string;
}

const TYPE_BADGE_VARIANT: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'default'> = {
  MEETING: 'info',
  INTERVIEW: 'primary',
  TRAINING: 'success',
  REVIEW: 'warning',
  OTHER: 'default',
};

const TYPE_DOT_COLOR: Record<string, string> = {
  MEETING: 'bg-info-500',
  INTERVIEW: 'bg-primary-500',
  TRAINING: 'bg-success-500',
  REVIEW: 'bg-warning-500',
  OTHER: 'bg-neutral-500',
};

const TYPE_LABELS: Record<string, string> = {
  MEETING: 'Réunion',
  INTERVIEW: 'Entretien',
  TRAINING: 'Formation',
  REVIEW: 'Évaluation',
  OTHER: 'Autre',
};

export default function SchedulePage() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const canManage = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER';

  useEffect(() => {
    fetchSchedules();
  }, [typeFilter, dateFilter]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (typeFilter) params.append('type', typeFilter);
      if (dateFilter) {
        params.append('startDate', new Date(dateFilter).toISOString());
        const endOfDay = new Date(dateFilter);
        endOfDay.setHours(23, 59, 59, 999);
        params.append('endDate', endOfDay.toISOString());
      }

      const response = await api.get(`/schedules?${params}`);
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setSchedules(Array.isArray(data) ? data : data.data || []);
      }
    } catch {
      setError('Impossible de charger les schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce schedule ?')) return;
    try {
      await api.delete(`/schedules/${id}`);
      fetchSchedules();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  // Group schedules by date
  const groupedSchedules = schedules.reduce<Record<string, Schedule[]>>((groups, schedule) => {
    const dateKey = new Date(schedule.startTime).toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(schedule);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedSchedules).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  if (loading && schedules.length === 0) {
    return <PageSkeleton />;
  }

  if (error && schedules.length === 0) {
    return <ErrorState message={error} onRetry={fetchSchedules} />;
  }

  return (
    <>
      <div className="w-full h-full overflow-y-auto bg-neutral-50">
        <div className="max-w-7xl mx-auto p-4 lg:p-8 animate-fade-in">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold font-display text-neutral-900">Schedule</h1>
              <p className="text-sm text-neutral-500 mt-1">{schedules.length} événement(s)</p>
            </div>
            {canManage && (
              <Button
                variant="primary"
                icon={<FiPlus size={20} />}
                onClick={() => setIsModalOpen(true)}
              >
                Nouveau schedule
              </Button>
            )}
          </div>

          {/* Filters */}
          <Card padding="md" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">Tous les types</option>
                {Object.entries(TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </Select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
              <Button
                variant="outline"
                icon={<FiFilter size={18} />}
                onClick={() => { setTypeFilter(''); setDateFilter(''); }}
              >
                Réinitialiser
              </Button>
            </div>
          </Card>

          {/* Error */}
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-error-600">{error}</p>
            </div>
          )}

          {/* Schedule List */}
          {sortedDates.length === 0 ? (
            <EmptyState
              icon={<FiCalendar className="w-12 h-12" />}
              title="Aucun événement"
              description={typeFilter || dateFilter ? 'Aucun résultat pour ces filtres' : 'Planifiez votre premier événement'}
            />
          ) : (
            <div className="space-y-6">
              {sortedDates.map((dateKey) => {
                const daySchedules = groupedSchedules[dateKey];
                const todayLabel = isToday(daySchedules[0].startTime);
                return (
                  <div key={dateKey}>
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-sm font-semibold text-neutral-900">
                        {todayLabel ? "Aujourd'hui" : formatDate(daySchedules[0].startTime)}
                      </h2>
                      {todayLabel && (
                        <Badge variant="primary" dot>Today</Badge>
                      )}
                      <div className="flex-1 h-px bg-neutral-200" />
                      <span className="text-xs text-neutral-400">{daySchedules.length} événement(s)</span>
                    </div>

                    <div className="space-y-3">
                      {daySchedules
                        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                        .map((schedule) => {
                          const badgeVariant = TYPE_BADGE_VARIANT[schedule.type] || TYPE_BADGE_VARIANT.OTHER;
                          const dotColor = TYPE_DOT_COLOR[schedule.type] || TYPE_DOT_COLOR.OTHER;
                          const past = isPast(schedule.endTime);
                          return (
                            <Card
                              key={schedule.id}
                              hover
                              padding="md"
                              className={past ? 'opacity-60' : ''}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                  {/* Time column */}
                                  <div className="flex flex-col items-center flex-shrink-0 w-16">
                                    <span className="text-sm font-bold text-neutral-900">{formatTime(schedule.startTime)}</span>
                                    <div className="w-px h-4 bg-neutral-300 my-1" />
                                    <span className="text-xs text-neutral-500">{formatTime(schedule.endTime)}</span>
                                  </div>

                                  {/* Colored bar */}
                                  <div className={`w-1 self-stretch rounded-full ${dotColor} flex-shrink-0`} />

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="text-sm font-semibold text-neutral-900 truncate">{schedule.title}</h3>
                                      <Badge variant={badgeVariant}>
                                        {TYPE_LABELS[schedule.type] || schedule.type}
                                      </Badge>
                                    </div>

                                    {schedule.description && (
                                      <p className="text-xs text-neutral-500 mb-2 line-clamp-1">{schedule.description}</p>
                                    )}

                                    {schedule.employee && (
                                      <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                        <FiUser className="w-3 h-3" />
                                        <span>{schedule.employee.firstName} {schedule.employee.lastName}</span>
                                        <span className="text-neutral-300">|</span>
                                        <span>{schedule.employee.position}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                {canManage && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={<FiTrash2 size={16} />}
                                    onClick={() => handleDelete(schedule.id)}
                                    className="text-error-500 hover:bg-error-50 flex-shrink-0 ml-2"
                                    title="Supprimer"
                                  >
                                    {''}
                                  </Button>
                                )}
                              </div>
                            </Card>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ScheduleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onScheduleCreated={() => { setIsModalOpen(false); fetchSchedules(); }}
      />
    </>
  );
}
