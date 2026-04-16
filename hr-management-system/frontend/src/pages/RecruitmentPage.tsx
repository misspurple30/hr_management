import { useEffect, useState } from 'react';
import api from '../api';
import { FiBriefcase, FiUsers, FiClock, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

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

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  OPEN: { bg: 'bg-green-50', text: 'text-green-700' },
  CLOSED: { bg: 'bg-gray-100', text: 'text-gray-600' },
  ON_HOLD: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  PENDING: { bg: 'bg-blue-50', text: 'text-blue-700' },
  APPROVED: { bg: 'bg-green-50', text: 'text-green-700' },
  REJECTED: { bg: 'bg-red-50', text: 'text-red-700' },
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Ouvert',
  CLOSED: 'Fermé',
  ON_HOLD: 'En attente',
  PENDING: 'En cours',
  APPROVED: 'Approuvé',
  REJECTED: 'Refusé',
};

const PRIORITY_STYLES: Record<string, { bg: string; text: string }> = {
  LOW: { bg: 'bg-gray-100', text: 'text-gray-600' },
  NORMAL: { bg: 'bg-blue-50', text: 'text-blue-700' },
  HIGH: { bg: 'bg-orange-50', text: 'text-orange-700' },
  URGENT: { bg: 'bg-red-50', text: 'text-red-700' },
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
    return (
      <div className="flex items-center justify-center h-screen w-full bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-white">
        <div className="text-center">
          <FiAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-lg text-gray-700 font-medium mb-2">Erreur</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const { jobPositions = [], talentRequests = [], overview } = data;

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recrutement</h1>
        <p className="text-sm text-gray-500 mb-8">Gestion des postes ouverts et demandes de talents</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FiBriefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overview.availablePositions}</p>
                <p className="text-xs text-gray-500">Postes ouverts</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <FiAlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overview.urgentlyNeeded}</p>
                <p className="text-xs text-gray-500">Urgents</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overview.talentRequests}</p>
                <p className="text-xs text-gray-500">Demandes de talents</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-lg shadow-sm p-1 mb-6">
          <button
            onClick={() => setActiveTab('positions')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors flex-1 justify-center ${
              activeTab === 'positions' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiBriefcase size={16} />
            Postes ({jobPositions.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors flex-1 justify-center ${
              activeTab === 'requests' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiTrendingUp size={16} />
            Demandes ({talentRequests.length})
          </button>
        </div>

        {/* Job Positions Tab */}
        {activeTab === 'positions' && (
          <>
            {jobPositions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FiBriefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-lg font-medium text-gray-400">Aucun poste ouvert</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobPositions.map((job) => {
                  const statusStyle = STATUS_STYLES[job.status] || STATUS_STYLES.OPEN;
                  return (
                    <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                          {STATUS_LABELS[job.status] || job.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FiBriefcase className="w-3.5 h-3.5" />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FiClock className="w-3.5 h-3.5" />
                          <span>{JOB_TYPE_LABELS[job.type] || job.type}</span>
                        </div>
                        {job.activeHiring > 0 && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FiUsers className="w-3.5 h-3.5" />
                            <span>{job.activeHiring} candidature(s) active(s)</span>
                          </div>
                        )}
                      </div>

                      {job.urgency === 'URGENT' && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 rounded-md">
                          <FiAlertCircle className="w-3.5 h-3.5 text-red-600" />
                          <span className="text-xs font-medium text-red-700">Recrutement urgent</span>
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                          Publié le {new Date(job.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
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
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-lg font-medium text-gray-400">Aucune demande de talent</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Département</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Poste</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priorité</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {talentRequests.map((req) => {
                      const statusStyle = STATUS_STYLES[req.status] || STATUS_STYLES.PENDING;
                      const priorityStyle = PRIORITY_STYLES[req.priority] || PRIORITY_STYLES.NORMAL;
                      return (
                        <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{req.department}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{req.position}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{req.quantity}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityStyle.bg} ${priorityStyle.text}`}>
                              {req.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                              {STATUS_LABELS[req.status] || req.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">
                            {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
