import { useState } from 'react';
import { FiMail, FiPhone, FiMessageCircle, FiSend, FiCheck, FiHelpCircle, FiBook, FiUsers } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const FAQ_ITEMS = [
  {
    question: 'Comment ajouter un nouvel employé ?',
    answer: 'Allez dans la page Employés et cliquez sur "Ajouter un employé". Remplissez le formulaire avec les informations requises, y compris le département et le poste.',
  },
  {
    question: 'Comment créer un schedule ?',
    answer: 'Rendez-vous sur la page Schedule et cliquez sur "Nouveau schedule". Sélectionnez l\'employé, les dates et le type d\'événement.',
  },
  {
    question: 'Qui peut supprimer un département ?',
    answer: 'Seuls les administrateurs peuvent supprimer un département. Le département doit être vide (aucun employé assigné) avant de pouvoir être supprimé.',
  },
  {
    question: 'Comment changer mon mot de passe ?',
    answer: 'Allez dans Paramètres > Mot de passe. Entrez votre mot de passe actuel puis le nouveau mot de passe (minimum 6 caractères avec majuscule et chiffre).',
  },
  {
    question: 'Quels sont les différents rôles ?',
    answer: 'Il y a 3 rôles : Administrateur (accès complet), Responsable RH (gestion des employés et schedules) et Employé (consultation uniquement).',
  },
];

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.subject.trim() || !contactForm.message.trim()) return;
    setSent(true);
    setContactForm({ subject: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-neutral-50 animate-fade-in">
      <div className="max-w-4xl mx-auto p-4 lg:p-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Support</h1>
        <p className="text-sm text-neutral-500 mb-8">Besoin d'aide ? Trouvez des réponses ou contactez-nous</p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card hover padding="md" className="text-center">
            <div className="w-12 h-12 bg-info-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FiBook className="w-6 h-6 text-info-600" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-1">Documentation</h3>
            <p className="text-xs text-neutral-500">Guides et tutoriels complets</p>
          </Card>
          <Card hover padding="md" className="text-center">
            <div className="w-12 h-12 bg-success-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FiUsers className="w-6 h-6 text-success-600" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-1">Communauté</h3>
            <p className="text-xs text-neutral-500">Échangez avec d'autres utilisateurs</p>
          </Card>
          <Card hover padding="md" className="text-center">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FiHelpCircle className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-1">FAQ</h3>
            <p className="text-xs text-neutral-500">Questions fréquemment posées</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Questions fréquentes</h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, index) => (
                <Card key={index} padding="none" className="overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-neutral-900 pr-4">{item.question}</span>
                    <span className={`text-neutral-400 transition-transform flex-shrink-0 ${expandedFaq === index ? 'rotate-180' : ''}`}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4 pt-0">
                      <p className="text-sm text-neutral-600 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Nous contacter</h2>
            <Card padding="lg">
              {/* Contact info */}
              <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-neutral-100">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <FiMail className="w-4 h-4 text-neutral-400" />
                  <span>support@wehr.com</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <FiPhone className="w-4 h-4 text-neutral-400" />
                  <span>+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <FiMessageCircle className="w-4 h-4 text-neutral-400" />
                  <span>Chat en ligne</span>
                </div>
              </div>

              {sent ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiCheck className="w-6 h-6 text-success-600" />
                  </div>
                  <p className="text-sm font-medium text-neutral-900">Message envoyé !</p>
                  <p className="text-xs text-neutral-500 mt-1">Nous vous répondrons dans les plus brefs délais</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Sujet"
                    id="subject"
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Décrivez brièvement votre problème"
                  />
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1.5">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Donnez-nous plus de détails..."
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none transition-colors duration-150"
                    />
                  </div>
                  <Button type="submit" variant="primary" icon={<FiSend size={16} />} className="w-full">
                    Envoyer le message
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
