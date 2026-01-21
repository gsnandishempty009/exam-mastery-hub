import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              StudyHub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and mobile application.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Personal Information:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Name and email address</li>
                  <li>User account credentials</li>
                  <li>Academic information (branch, semester, year)</li>
                  <li>Contact queries and messages</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Usage Information:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Pages visited and time spent</li>
                  <li>Files downloaded or accessed</li>
                  <li>Search queries and preferences</li>
                  <li>Device and browser information</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>To provide and maintain our services</li>
              <li>To respond to your queries and support requests</li>
              <li>To personalize your learning experience</li>
              <li>To send notifications about new content or updates</li>
              <li>To improve and optimize our platform</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We implement comprehensive security measures to protect your personal data, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Encrypted data transmission (SSL/TLS)</li>
              <li>Secure authentication mechanisms</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and user permissions</li>
              <li>Password protection and encrypted storage</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. You can request deletion of your account and associated data at any time by contacting us.
            </p>
          </section>

          {/* Third-Party Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Third-Party Sharing</h2>
            <p className="text-gray-700 leading-relaxed">
              We do not sell or share your personal information with third parties without your explicit consent, except:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
              <li>When required by law or legal process</li>
              <li>To service providers who assist in operating our platform</li>
              <li>With your explicit permission for specific purposes</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-3 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> nandishtech009@gmail.com
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Support:</strong> Help Center available in the StudyHub platform
              </p>
            </div>
          </section>

          {/* Policy Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Policy Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of the platform constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
