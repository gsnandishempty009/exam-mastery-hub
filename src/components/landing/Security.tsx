import { Shield, Lock, Eye, CheckCircle, Database, KeyRound, AlertCircle, Zap } from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "Encrypted Data",
    description: "All your personal information and academic data is encrypted using industry-standard SSL/TLS protocols.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Only authorized users can access specific features. Students and admins have separate secure dashboards.",
  },
  {
    icon: KeyRound,
    title: "Secure Authentication",
    description: "Your credentials are protected with secure password hashing and authentication mechanisms.",
  },
  {
    icon: Database,
    title: "Secure Database",
    description: "All data is stored in a secure, enterprise-grade database with regular backups and monitoring.",
  },
  {
    icon: Eye,
    title: "Privacy Protected",
    description: "We respect your privacy. Your data is never shared with third parties without your consent.",
  },
  {
    icon: CheckCircle,
    title: "Verified & Trusted",
    description: "Our platform is built on Supabase, a trusted open-source backend infrastructure.",
  },
];

const Security = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Marquee Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-y border-primary/20 mb-12 overflow-hidden">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .marquee-content {
            animation: marquee 30s linear infinite;
            display: flex;
            gap: 3rem;
            padding: 1rem 0;
          }
          .marquee-content:hover {
            animation-play-state: paused;
          }
          .marquee-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            white-space: nowrap;
            font-weight: 600;
            font-size: 0.95rem;
            padding: 0 1rem;
          }
        `}</style>
        <div className="marquee-content">
          <div className="marquee-item text-primary">
            <Zap className="w-4 h-4" />
            ✨ New Feature: PDF Upload & URL Support for Notes & Question Papers
          </div>
          <div className="marquee-item text-accent">
            <AlertCircle className="w-4 h-4" />
            ⚠️ Caution: Keep your login credentials safe and never share your password
          </div>
          <div className="marquee-item text-primary">
            <Zap className="w-4 h-4" />
            🔒 Latest Update: Enhanced Security with Role-Based Access Control
          </div>
          <div className="marquee-item text-accent">
            <AlertCircle className="w-4 h-4" />
            ⚠️ Always use official channels for admin contact requests
          </div>
          <div className="marquee-item text-primary">
            <Zap className="w-4 h-4" />
            ✨ New Feature: Detailed Query Tracking with Subject, Semester & Year
          </div>
          <div className="marquee-item text-accent">
            <AlertCircle className="w-4 h-4" />
            ⚠️ Reminder: Verify the authenticity of links before clicking
          </div>
          <div className="marquee-item text-primary">
            <Zap className="w-4 h-4" />
            🛡️ Security: All data is encrypted and regularly backed up
          </div>
          <div className="marquee-item text-accent">
            <AlertCircle className="w-4 h-4" />
            ⚠️ Best Practice: Log out when using shared devices or public computers
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-semibold">Your Data is Safe</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Enterprise-Grade <span className="text-gradient">Security</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We take data security seriously. Your credentials, study materials, and personal information are protected with the highest standards of encryption and security protocols.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-display text-2xl font-bold mb-6">
              Why You Can Trust StudyHub
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Industry-Standard Encryption</p>
                  <p className="text-muted-foreground">All data in transit and at rest is encrypted using 256-bit encryption.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Regular Security Audits</p>
                  <p className="text-muted-foreground">Our infrastructure undergoes regular security assessments and updates.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">GDPR & Privacy Compliant</p>
                  <p className="text-muted-foreground">We comply with international data protection regulations and privacy standards.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Secure API Endpoints</p>
                  <p className="text-muted-foreground">All communications between your device and our servers are secure and authenticated.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;
