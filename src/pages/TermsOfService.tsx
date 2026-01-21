import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using StudyHub, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Service Description</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              StudyHub provides an online platform for students to access:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Study notes organized by branch, subject, and module</li>
              <li>Previous year question papers</li>
              <li>Support and contact features</li>
              <li>Administrative portal for instructors</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Users agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide accurate and truthful information during registration</li>
              <li>Maintain confidentiality of login credentials</li>
              <li>Use the platform for educational purposes only</li>
              <li>Respect intellectual property rights</li>
              <li>Not engage in unauthorized access or misuse</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          {/* Intellectual Property Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Intellectual Property Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              All content, materials, and documents on StudyHub, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Study notes and tutorials</li>
              <li>Question papers and solutions</li>
              <li>Platform design and functionality</li>
              <li>Trademarks and logos</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              are the property of StudyHub or its content providers. Unauthorized reproduction, distribution, or modification is prohibited.
            </p>
          </section>

          {/* Acceptable Use Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Acceptable Use Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Transmit harmful, offensive, or illegal content</li>
              <li>Attempt to gain unauthorized access to the system</li>
              <li>Harass, threaten, or abuse other users</li>
              <li>Spam or create multiple fake accounts</li>
              <li>Upload malware or malicious code</li>
              <li>Violate privacy or security of others</li>
            </ul>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Disclaimer of Warranties</h2>
            <p className="text-gray-700 leading-relaxed">
              StudyHub is provided "as is" without warranties of any kind, either express or implied. We do not guarantee:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
              <li>Uninterrupted or error-free service</li>
              <li>Accuracy or completeness of content</li>
              <li>Suitability for any particular purpose</li>
              <li>Absence of viruses or harmful components</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              StudyHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service, even if advised of the possibility of such damages.
            </p>
          </section>

          {/* Account Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Account Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              StudyHub reserves the right to suspend or terminate your account if you violate these terms or engage in prohibited conduct. Upon termination, you lose access to all services and data associated with your account.
            </p>
          </section>

          {/* Support and Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Support and Contact</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              For support or inquiries regarding these terms:
            </p>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> nandishtech009@gmail.com
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Help Center:</strong> Available in the StudyHub platform
              </p>
            </div>
          </section>

          {/* Modifications to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Modifications to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              StudyHub reserves the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the platform constitutes acceptance of the modified terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which StudyHub operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Severability</h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
