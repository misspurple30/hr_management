import { useEffect, useState } from 'react';
import api from '../api';
import { FiBriefcase, FiUsers, FiClock, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { PageSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  type: string;
  urgency: string;
  status: string;
  description?: string;
  requirements?: string;
  activeHiring: number;
  createdAt: string;
}

interface TalentRequest {
  id: string;
  department: string;
  position: string;
  quantity: number;
  priority: string;
  status: string;
  description?: string;
  createdAt: string;
}

interface DashboardData {
  jobPositions: JobPosition[];
  talentRequests: TalentRequest[];
  overview: {
    availablePositions: number;
    urgentlyNeeded: number;
    talentRequests: number;
  };
}

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Temps plein',
  PART_TIME: 'Temps partiel',
  CONTRACT: 'Contrat',
  INTERN: 'Stage',
};

const STATUS_BADGE_VARIANT: Record<string, 'success' | 'default' | 'warning' | 'info' | 'error'> = {
  OPEN: 'success',
  CLOSED: 'default',
  ON_HOLD: 'warning',
  PENDING: 'info',
  APPROVED: 'success',
  REJECTED: 'error',
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Ouvert',
  CLOSED: 'Fermé',
  ON_HOLD: 'En attente',
  PENDING: 'En cours',
  APPROVED: 'Approuvé',
  REJECTED: 'Refusé',
};

const PRIORITY_BADGE_VARIANT: Record<string, 'default' | 'info' | 'warning' | 'error'> = {
  LOW: 'default',
  NORMAL: 'info',
  HIGH: 'warning',
  URGENT: 'error',
};

export default function RecruitmentPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'positions' | 'requests'>('positions');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/stats');
      if (response.data?.data) {
        setData(response.data.data);
      }
    } catch {
      setError('Impossible de charger les données de recrutement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  if (error || !data) {
    return <ErrorState message={error || 'Données non disponibles'} onRetry={fetchData} />;
  }

  const { jobPositions = [], talentRequests = [], overview } = data;

  return (
    <div className="w-full h-full overflow-y-auto bg-neutral-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Recrutement</h1>
        <p className="text-sm text-neutral-500 mb-8">Gestion des postes ouverts et demandes de talents</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-info-50 rounded-xl flex items-center justify-center">
                <FiBriefcase className="w-5 h-5 text-info-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{overview.availablePositions}</p>
                <p className="text-xs text-neutral-500">Postes ouverts</p>
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-error-50 rounded-xl flex items-center justify-center">
                <FiAlertCircle className="w-5 h-5 text-error-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{overview.urgentlyNeeded}</p>
                <p className="text-xs text-neutral-500">Urgents</p>
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{overview.talentRequests}</p>
                <p className="text-xs text-neutral-500">Demandes de talents</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card padding="none" className="p-1 mb-6">
          <div className="flex gap-1">
            <Button
              variant={activeTab === 'positions' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('positions')}
              icon={<FiBriefcase size={16} />}
              className="flex-1"
            >
              Postes ({jobPositions.length})
            </Button>
            <Button
              variant={activeTab === 'requests' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('requests')}
              icon={<FiTrendingUp size={16} />}
              className="flex-1"
            >
              Demandes ({talentRequests.length})
            </Button>
          </div>
        </Card>

        {/* Job Positions Tab */}
        {activeTab === 'positions' && (
          <>
            {jobPositions.length === 0 ? (
              <EmptyState
                icon={<FiBriefcase className="w-12 h-12" />}
                title="Aucun poste ouvert"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobPositions.map((job) => {
                  const badgeVariant = STATUS_BADGE_VARIANT[job.status] || 'success';
                  return (
                    <Card key={job.id} hover padding="md">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-sm font-semibold text-neutral-900">{job.title}</h3>
                        <Badge variant={badgeVariant}>
                          {STATUS_LABELS[job.status] || job.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <FiBriefcase className="w-3.5 h-3.5" />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <FiClock className="w-3.5 h-3.5" />
                          <span>{JOB_TYPE_LABELS[job.type] || job.type}</span>
                        </div>
                        {job.activeHiring > 0 && (
                          <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <FiUsers className="w-3.5 h-3.5" />
                            <span>{job.activeHiring} candidature(s) active(s)</span>
                          </div>
                        )}
                      </div>

                      {job.urgency === 'URGENT' && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-error-50 rounded-lg">
                          <FiAlertCircle className="w-3.5 h-3.5 text-error-600" />
                          <span className="text-xs font-medium text-error-700">Recrutement urgent</span>
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-neutral-100">
                        <p className="text-xs text-neutral-400">
                          Publié le {new Date(job.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Talent Requests Tab */}
        {activeTab === 'requests' && (
          <>
            {talentRequests.length === 0 ? (
              <EmptyState
                icon={<FiUsers className="w-12 h-12" />}
                title="Aucune demande de talent"
              />
            ) : (
              <Card padding="none" className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Département</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Poste</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Quantité</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Priorité</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {talentRequests.map((req) => {
                      const statusVariant = STATUS_BADGE_VARIANT[req.status] || 'info';
                      const priorityVariant = PRIORITY_BADGE_VARIANT[req.priority] || 'info';
                      return (
                        <tr key={req.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-neutral-900">{req.department}</td>
                          <td className="px-6 py-4 text-sm text-neutral-600">{req.position}</td>
                          <td className="px-6 py-4 text-sm text-neutral-600">{req.quantity}</td>
                          <td className="px-6 py-4">
                            <Badge variant={priorityVariant}>{req.priority}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={statusVariant}>
                              {STATUS_LABELS[req.status] || req.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-xs text-neutral-500">
                            {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
