import { useEffect, useState } from 'react';
import api from '../api';
import { FiMoreHorizontal } from 'react-icons/fi';
import ScheduleFormModal from '../components/ScheduleFormModal';


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
    return (
      <div className="flex items-center justify-center h-screen w-full overflow-hidden bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-500">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-screen w-full overflow-hidden bg-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-lg text-gray-700 font-medium mb-2">Erreur de chargement</p>
          <p className="text-sm text-gray-500 mb-4 px-4">{error}</p>
        </div>
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
  console.log(formatDate)

  const getTimeLabel = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      console.log(now);
      
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
      <div className="w-full h-full overflow-y-auto bg-white">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Card 1: Available Position */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-600 mb-1">Available Position</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{overview.availablePositions}</p>
                  <p className="text-xs text-red-600 font-medium">{overview.urgentlyNeeded} Urgently needed</p>
                </div>

                {/* Card 2: Job Open */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-600 mb-1">Job Open</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">10</p>
                  <p className="text-xs text-blue-600 font-medium">{overview.availablePositions} Active hiring</p>
                </div>

                {/* Card 3: New Employees */}
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-600 mb-1">New Employees</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{overview.newEmployees}</p>
                  <p className="text-xs text-pink-600 font-medium">{overview.newEmployees} Department</p>
                </div>
              </div>

              {/* Row 2: Total Employees + Talent Request */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Total Employees */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Total Employees</p>
                      <p className="text-3xl font-bold text-gray-900">{overview.totalEmployees}</p>
                    </div>
                    {/* Mini graph placeholder */}
                    <svg className="w-16 h-10 flex-shrink-0" viewBox="0 0 64 40">
                      <path d="M 0 30 Q 16 25 32 20 T 64 10" fill="none" stroke="#ef4444" strokeWidth="2"/>
                      <text x="50" y="8" fill="#ef4444" fontSize="10">+8%</text>
                    </svg>
                  </div>
                  <div className="space-y-0.5 text-xs text-gray-600">
                    <p>102 Men</p>
                    <p>56 Women</p>
                  </div>
                  <p className="text-xs text-red-500 font-medium mt-2">+2% Past month</p>
                </div>

                {/* Talent Request */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Talent Request</p>
                      <p className="text-3xl font-bold text-gray-900">{overview.talentRequests}</p>
                    </div>
                    {/* Mini graph placeholder */}
                    <svg className="w-16 h-10 flex-shrink-0" viewBox="0 0 64 40">
                      <path d="M 0 30 Q 16 25 32 20 T 64 10" fill="none" stroke="#ef4444" strokeWidth="2"/>
                      <text x="50" y="8" fill="#ef4444" fontSize="10">+8%</text>
                    </svg>
                  </div>
                  <div className="space-y-0.5 text-xs text-gray-600">
                    <p>6 Men</p>
                    <p>10 Women</p>
                  </div>
                  <p className="text-xs text-red-500 font-medium mt-2">+5% Past month</p>
                </div>
              </div>

              {/* Announcements Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Announcement</h3>
                  <span className="text-xs text-gray-500">{getTimeLabel(new Date())}</span>
                </div>

                <div className="space-y-3">
                  {announcements && announcements.length > 0 ? (
                    announcements.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-start justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-1 truncate">{item.title || 'Sans titre'}</p>
                          <p className="text-xs text-gray-500">
                            {formatTime(item.createdAt || new Date())}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <FiMoreHorizontal className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-4">Aucune annonce disponible</p>
                  )}
                </div>

                {announcements && announcements.length > 0 && (
                  <div className="mt-4 text-center">
                    <button className="text-xs font-medium text-red-600 hover:text-red-700">
                      See All Announcement
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              
              {/* Recently Activity */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-900 text-white rounded-lg p-6">
                <h3 className="text-sm font-semibold mb-3">Recently Activity</h3>
                <p className="text-xs text-blue-100 mb-2">
                  {getTimeLabel(new Date())}
                </p>
                <p className="text-sm font-semibold mb-2">You Posted a New Job</p>
                <p className="text-xs text-blue-50 mb-4">
                  Kindly check the requirements and terms of work and make sure everything is right.
                </p>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-blue-100">Today you makes 12 Activity</p>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors whitespace-nowrap">
                    See All Activity
                  </button>
                </div>
              </div>

              {/* Upcoming Schedule */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Upcoming Schedule</h3>
                  <span className="text-xs text-gray-500">{getTimeLabel(new Date())}</span>
                </div>

                {/* Priority Section */}
                {prioritySchedules.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Priority</p>
                    <div className="space-y-2">
                      {prioritySchedules.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-start justify-between p-2.5 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 mb-0.5 truncate">{item.title || 'Scheduled event'}</p>
                            <p className="text-xs text-gray-500">
                              Today - {formatTime(item.startTime || new Date())}
                            </p>
                          </div>
                          <button className="p-1 hover:bg-gray-300 rounded transition-colors ml-2 flex-shrink-0">
                            <FiMoreHorizontal className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Section */}
                {otherSchedules.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">Other</p>
                    <div className="space-y-2">
                      {otherSchedules.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-start justify-between p-2.5 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 mb-0.5 truncate">{item.title || 'Scheduled event'}</p>
                            <p className="text-xs text-gray-500">
                              Today - {formatTime(item.startTime || new Date())}
                            </p>
                          </div>
                          <button className="p-1 hover:bg-gray-300 rounded transition-colors ml-2 flex-shrink-0">
                            <FiMoreHorizontal className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {prioritySchedules.length === 0 && otherSchedules.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-4">Aucun événement à venir</p>
                )}

                <div className="mt-4 text-center border-t pt-4">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    Create a New Schedule
                  </button>
                </div>
              </div>
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