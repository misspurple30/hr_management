import { useState } from 'react';
import { FiMail, FiPhone, FiMessageCircle, FiSend, FiCheck, FiHelpCircle, FiBook, FiUsers } from 'react-icons/fi';

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
    <div className="w-full h-full overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support</h1>
        <p className="text-sm text-gray-500 mb-8">Besoin d'aide ? Trouvez des réponses ou contactez-nous</p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiBook className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Documentation</h3>
            <p className="text-xs text-gray-500">Guides et tutoriels complets</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiUsers className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Communauté</h3>
            <p className="text-xs text-gray-500">Échangez avec d'autres utilisateurs</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiHelpCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">FAQ</h3>
            <p className="text-xs text-gray-500">Questions fréquemment posées</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Questions fréquentes</h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900 pr-4">{item.question}</span>
                    <span className={`text-gray-400 transition-transform flex-shrink-0 ${expandedFaq === index ? 'rotate-180' : ''}`}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4 pt-0">
                      <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nous contacter</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Contact info */}
              <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FiMail className="w-4 h-4 text-gray-400" />
                  <span>support@wehr.com</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FiPhone className="w-4 h-4 text-gray-400" />
                  <span>+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FiMessageCircle className="w-4 h-4 text-gray-400" />
                  <span>Chat en ligne</span>
                </div>
              </div>

              {sent ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Message envoyé !</p>
                  <p className="text-xs text-gray-500 mt-1">Nous vous répondrons dans les plus brefs délais</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                    <input
                      type="text"
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Décrivez brièvement votre problème"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Donnez-nous plus de détails..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FiSend size={16} />
                    Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
