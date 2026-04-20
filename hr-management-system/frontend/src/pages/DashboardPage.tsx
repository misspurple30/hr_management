import { useEffect, useState } from 'react';
import api from '../api';
import { FiMoreHorizontal, FiCalendar, FiTrendingUp } from 'react-icons/fi';
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

  if (loading) return <PageSkeleton />;

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-neutral-50">
        <ErrorState
          message={error || 'Impossible de charger les statistiques'}
          onRetry={fetchDashboardStats}
        />
      </div>
    );
  }

  const { overview, announcements = [], upcomingSchedules = [] } = stats;

  const formatTime = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch { return 'N/A'; }
  };

  const getTimeLabel = (dateString: string | Date) => {
    const date = new Date(dateString);
    return `Aujourd'hui, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const prioritySchedules = upcomingSchedules.filter(s => s.type === 'REVIEW' || s.type === 'INTERVIEW');
  const otherSchedules = upcomingSchedules.filter(s => s.type !== 'REVIEW' && s.type !== 'INTERVIEW');

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-neutral-900 font-sans pb-10">
      <div className="max-w-[1440px] mx-auto px-6 py-8 lg:px-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-neutral-900">Dashboard</h1>
            <p className="text-neutral-500 font-medium">Bon retour ! Voici ce qui se passe aujourd'hui.</p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 shadow-xl shadow-primary-100 rounded-2xl"
          >
            + Nouveau Planning
          </Button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Main Column */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* High-Level Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card className="border-none bg-orange-50/50 p-6 rounded-[2rem] transition-hover hover:shadow-lg">
                <h3 className="text-sm font-bold text-orange-600/80 uppercase tracking-widest mb-2">Available</h3>
                <p className="text-4xl font-black mb-4">{overview.availablePositions}</p>
                <Badge variant="error" dot className="bg-white/80">{overview.urgentlyNeeded} Urgent</Badge>
              </Card>

              <Card className="border-none bg-blue-50/50 p-6 rounded-[2rem] transition-hover hover:shadow-lg">
                <h3 className="text-sm font-bold text-blue-600/80 uppercase tracking-widest mb-2">Job Open</h3>
                <p className="text-4xl font-black mb-4">{overview.availablePositions}</p>
                <Badge variant="info" dot className="bg-white/80">Active Hiring</Badge>
              </Card>

              <Card className="border-none bg-purple-50/50 p-6 rounded-[2rem] transition-hover hover:shadow-lg">
                <h3 className="text-sm font-bold text-purple-600/80 uppercase tracking-widest mb-2">New Staff</h3>
                <p className="text-4xl font-black mb-4">{overview.newEmployees}</p>
                <Badge variant="primary" dot className="bg-white/80">Department</Badge>
              </Card>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card hover className="p-8 border-neutral-100 rounded-[2.5rem]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-neutral-500 font-bold text-sm uppercase tracking-wider mb-1">Total Employees</p>
                    <h2 className="text-5xl font-black">{overview.totalEmployees}</h2>
                  </div>
                  <div className="text-emerald-500 flex items-center gap-1 font-black text-sm bg-emerald-50 px-3 py-1 rounded-full">
                    <FiTrendingUp /> +2%
                  </div>
                </div>
                <div className="flex gap-6 text-xs font-bold text-neutral-400">
                  <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary-500" /> 102 Men</span>
                  <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-400" /> 56 Women</span>
                </div>
              </Card>

              <Card hover className="p-8 border-neutral-100 rounded-[2.5rem]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-neutral-500 font-bold text-sm uppercase tracking-wider mb-1">Talent Requests</p>
                    <h2 className="text-5xl font-black">{overview.talentRequests}</h2>
                  </div>
                  <div className="text-emerald-500 flex items-center gap-1 font-black text-sm bg-emerald-50 px-3 py-1 rounded-full">
                    <FiTrendingUp /> +5%
                  </div>
                </div>
                <div className="flex gap-6 text-xs font-bold text-neutral-400">
                  <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary-500" /> 6 Men</span>
                  <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-400" /> 10 Women</span>
                </div>
              </Card>
            </div>

            {/* Announcements */}
            <Card className="rounded-[2.5rem] border-neutral-100 overflow-hidden">
              <div className="p-8 border-b border-neutral-50 flex justify-between items-center bg-neutral-50/30">
                <h3 className="text-lg font-black italic">Announcements</h3>
                <span className="text-xs font-bold text-neutral-400 bg-white px-4 py-2 rounded-xl shadow-sm border border-neutral-100">{getTimeLabel(new Date())}</span>
              </div>
              <div className="p-4 space-y-2">
                {announcements.length > 0 ? (
                  announcements.slice(0, 3).map((item) => (
                    <div key={item.id} className="group flex items-center justify-between p-5 rounded-[1.5rem] hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-100">
                      <div>
                        <p className="text-md font-bold text-neutral-800 group-hover:text-primary-600 transition-colors">{item.title}</p>
                        <p className="text-xs text-neutral-400 mt-1 font-medium italic">{formatTime(item.createdAt)}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiMoreHorizontal className="w-5 h-5 text-neutral-400" />
                      </Button>
                    </div>
                  ))
                ) : <EmptyState title="Aucune annonce" />}
              </div>
              <div className="p-6 text-center border-t border-neutral-50">
                <button className="text-sm font-black text-primary-600 hover:underline underline-offset-8 transition-all">See All Announcements</button>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="xl:col-span-4 space-y-8">
            
            {/* Recently Activity - Premium Dark Card */}
            <div className="bg-[#161B22] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary-500/20 transition-all" />
              <h3 className="text-xl font-black mb-8 relative z-10 italic">Recently Activity</h3>
              <div className="space-y-2 relative z-10">
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">{getTimeLabel(new Date())}</p>
                <p className="text-lg font-bold leading-tight">You Posted a New Job</p>
                <p className="text-sm text-neutral-400 font-medium leading-relaxed mb-10">
                  Kindly check the requirements and terms of work and make sure everything is right.
                </p>
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs font-bold text-neutral-500">12 Activities today</p>
                  <Button variant="primary" className="w-full sm:w-auto px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-primary-900/40">
                    See All Activity
                  </Button>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <Card className="rounded-[3rem] border-neutral-100 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-black italic underline decoration-primary-200 decoration-4 underline-offset-4">Upcoming Schedule</h3>
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{getTimeLabel(new Date())}</span>
              </div>

              <div className="space-y-8">
                {prioritySchedules.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.2em] mb-4">Priority</p>
                    <div className="space-y-3">
                      {prioritySchedules.map(item => (
                        <div key={item.id} className="flex gap-4 group cursor-pointer">
                          <div className="w-1.5 h-12 rounded-full bg-red-400 group-hover:scale-y-110 transition-transform" />
                          <div className="flex-1 min-w-0 py-1">
                            <p className="text-sm font-bold text-neutral-800 truncate">{item.title}</p>
                            <p className="text-xs text-neutral-400 font-medium italic mt-1">{formatTime(item.startTime)}</p>
                          </div>
                          <FiMoreHorizontal className="text-neutral-200 group-hover:text-neutral-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.2em] mb-4">Other</p>
                  <div className="space-y-3">
                    {otherSchedules.slice(0, 3).map(item => (
                      <div key={item.id} className="flex gap-4 group cursor-pointer">
                        <div className="w-1.5 h-12 rounded-full bg-neutral-100 group-hover:bg-primary-200 transition-colors" />
                        <div className="flex-1 min-w-0 py-1">
                          <p className="text-sm font-bold text-neutral-700 truncate">{item.title}</p>
                          <p className="text-xs text-neutral-400 font-medium italic mt-1">{formatTime(item.startTime)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <Button 
                  variant="ghost" 
                  className="w-full py-4 border-2 border-dashed border-neutral-100 rounded-2xl text-primary-600 font-black text-xs hover:bg-primary-50 transition-all"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create a New Schedule
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