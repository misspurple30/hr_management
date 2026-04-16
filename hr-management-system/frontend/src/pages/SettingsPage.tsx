import { useState } from 'react';
import { FiUser, FiLock, FiBell, FiShield, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

type Tab = 'profile' | 'password' | 'notifications';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // Notification preferences (local state, no backend)
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    scheduleReminders: true,
    announcementAlerts: true,
    weeklyReport: false,
  });

  const clearMessages = () => {
    setSuccess(null);
    setError(null);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      setError('Le prénom et le nom sont requis');
      return;
    }

    setProfileSubmitting(true);
    try {
      await api.put('/auth/me', {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
      });
      await refreshUser();
      setSuccess('Profil mis à jour avec succès');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setError('Tous les champs sont requis');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setPasswordSubmitting(true);
    try {
      await api.put('/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setSuccess('Mot de passe modifié avec succès');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const getRoleDisplay = (role: string) => {
    const roles: Record<string, string> = {
      ADMIN: 'Administrateur',
      HR_MANAGER: 'Responsable RH',
      USER: 'Employé',
    };
    return roles[role] || role;
  };

  const tabs = [
    { id: 'profile' as Tab, label: 'Profil', icon: FiUser },
    { id: 'password' as Tab, label: 'Mot de passe', icon: FiLock },
    { id: 'notifications' as Tab, label: 'Notifications', icon: FiBell },
  ];

  return (
    <div className="w-full h-full overflow-y-auto bg-neutral-50 animate-fade-in">
      <div className="max-w-4xl mx-auto p-4 lg:p-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Paramètres</h1>
        <p className="text-sm text-neutral-500 mb-8">Gérez votre compte et vos préférences</p>

        {/* Tabs */}
        <Card padding="none" className="flex gap-1 p-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); clearMessages(); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </Card>

        {/* Messages */}
        {success && (
          <div className="flex items-center gap-2 p-4 bg-success-50 border border-success-200 rounded-xl mb-6">
            <FiCheck className="text-success-600 flex-shrink-0" />
            <p className="text-sm text-success-700">{success}</p>
          </div>
        )}
        {error && (
          <div className="p-4 bg-error-50 border border-error-200 rounded-xl mb-6">
            <p className="text-sm text-error-600">{error}</p>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card padding="lg">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-200">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xl">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">{user?.firstName} {user?.lastName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <FiShield className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-sm text-neutral-500">{getRoleDisplay(user?.role || '')}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  id="firstName"
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                />
                <Input
                  label="Nom"
                  id="lastName"
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>

              <div>
                <Input
                  label="Email"
                  id="email"
                  type="email"
                  value={profileForm.email}
                  disabled
                />
                <p className="text-xs text-neutral-400 mt-1">L'email ne peut pas être modifié</p>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary" loading={profileSubmitting}>
                  {profileSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Changer le mot de passe</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
              <Input
                label="Mot de passe actuel"
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              />
              <div>
                <Input
                  label="Nouveau mot de passe"
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                />
                <p className="text-xs text-neutral-400 mt-1">Minimum 6 caractères, avec majuscule et chiffre</p>
              </div>
              <Input
                label="Confirmer le mot de passe"
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary" loading={passwordSubmitting}>
                  {passwordSubmitting ? 'Modification...' : 'Modifier le mot de passe'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Préférences de notification</h2>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Notifications par email', desc: 'Recevoir les notifications importantes par email' },
                { key: 'scheduleReminders', label: 'Rappels de schedule', desc: 'Recevoir un rappel avant chaque événement planifié' },
                { key: 'announcementAlerts', label: 'Alertes d\'annonces', desc: 'Être notifié des nouvelles annonces' },
                { key: 'weeklyReport', label: 'Rapport hebdomadaire', desc: 'Recevoir un résumé hebdomadaire par email' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{item.label}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof prev],
                    }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-primary-600' : 'bg-neutral-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-400 mt-4">Les préférences sont enregistrées pour cette session</p>
          </Card>
        )}
      </div>
    </div>
  );
}
