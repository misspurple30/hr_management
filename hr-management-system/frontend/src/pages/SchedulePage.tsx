import { useEffect, useState } from 'react';
import api from '../api';
import { FiPlus, FiTrash2, FiClock, FiUser, FiCalendar, FiFilter } from 'react-icons/fi';
import ScheduleFormModal from '../components/ScheduleFormModal';
import { useAuth } from '../context/AuthContext';

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

const TYPE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  MEETING: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  INTERVIEW: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  TRAINING: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  REVIEW: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  OTHER: { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' },
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
    return (
      <div className="flex items-center justify-center h-screen w-full bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-500">Chargement des schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
              <p className="text-sm text-gray-500 mt-1">{schedules.length} événement(s)</p>
            </div>
            {canManage && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FiPlus size={20} />
                Nouveau schedule
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Tous les types</option>
                  {Object.entries(TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                onClick={() => { setTypeFilter(''); setDateFilter(''); }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 flex items-center justify-center gap-2"
              >
                <FiFilter size={18} />
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Schedule List */}
          {sortedDates.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-lg font-medium text-gray-400 mb-1">Aucun événement</p>
              <p className="text-sm text-gray-400">
                {typeFilter || dateFilter ? 'Aucun résultat pour ces filtres' : 'Planifiez votre premier événement'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedDates.map((dateKey) => {
                const daySchedules = groupedSchedules[dateKey];
                const todayLabel = isToday(daySchedules[0].startTime);
                return (
                  <div key={dateKey}>
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-sm font-semibold text-gray-900">
                        {todayLabel ? "Aujourd'hui" : formatDate(daySchedules[0].startTime)}
                      </h2>
                      {todayLabel && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                          Today
                        </span>
                      )}
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400">{daySchedules.length} événement(s)</span>
                    </div>

                    <div className="space-y-3">
                      {daySchedules
                        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                        .map((schedule) => {
                          const colors = TYPE_COLORS[schedule.type] || TYPE_COLORS.OTHER;
                          const past = isPast(schedule.endTime);
                          return (
                            <div
                              key={schedule.id}
                              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow ${past ? 'opacity-60' : ''}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                  {/* Time column */}
                                  <div className="flex flex-col items-center flex-shrink-0 w-16">
                                    <span className="text-sm font-bold text-gray-900">{formatTime(schedule.startTime)}</span>
                                    <div className="w-px h-4 bg-gray-300 my-1" />
                                    <span className="text-xs text-gray-500">{formatTime(schedule.endTime)}</span>
                                  </div>

                                  {/* Colored bar */}
                                  <div className={`w-1 self-stretch rounded-full ${colors.dot} flex-shrink-0`} />

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="text-sm font-semibold text-gray-900 truncate">{schedule.title}</h3>
                                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
                                        {TYPE_LABELS[schedule.type] || schedule.type}
                                      </span>
                                    </div>

                                    {schedule.description && (
                                      <p className="text-xs text-gray-500 mb-2 line-clamp-1">{schedule.description}</p>
                                    )}

                                    {schedule.employee && (
                                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <FiUser className="w-3 h-3" />
                                        <span>{schedule.employee.firstName} {schedule.employee.lastName}</span>
                                        <span className="text-gray-300">|</span>
                                        <span>{schedule.employee.position}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                {canManage && (
                                  <button
                                    onClick={() => handleDelete(schedule.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 ml-2"
                                    title="Supprimer"
                                  >
                                    <FiTrash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </div>
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
