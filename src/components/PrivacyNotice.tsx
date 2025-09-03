import { Card } from "@/components/ui/card";
import { Shield, Lock, Heart, Eye, UserCheck, FileText } from "lucide-react";

const PrivacyNotice = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 shadow-card border border-border/50">
          <div className="text-center space-y-6 mb-8">
            <div className="w-16 h-16 bg-primary-soft/20 rounded-full flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8 text-primary animate-float" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Your Privacy & Safety Come First
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We understand the sensitive nature of mental health support. Every interaction on our platform is designed with your confidentiality and security in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-foreground">End-to-End Encryption</h3>
              <p className="text-sm text-muted-foreground">
                All conversations and personal data are encrypted using industry-standard protocols.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground">Anonymous Access</h3>
              <p className="text-sm text-muted-foreground">
                Use our services without revealing your identity. Optional account creation for continuity.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground">No Data Tracking</h3>
              <p className="text-sm text-muted-foreground">
                We don't track your browsing habits or sell your data to third parties.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-foreground">Verified Professionals</h3>
              <p className="text-sm text-muted-foreground">
                All counselors and mental health professionals are licensed and background-checked.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold text-foreground">HIPAA Compliant</h3>
              <p className="text-sm text-muted-foreground">
                Our platform meets all healthcare privacy regulations and compliance standards.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold text-foreground">Crisis Support</h3>
              <p className="text-sm text-muted-foreground">
                24/7 crisis intervention with immediate connection to emergency services when needed.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-primary-soft/10 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Campus Integration Promise</h4>
                <p className="text-sm text-muted-foreground">
                  While we integrate with your campus mental health services for seamless support, 
                  we never share your personal conversations or identifying information without your explicit consent. 
                  You control what information is shared and when.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By using Campus MindWell, you agree to our Privacy Policy and Terms of Service. 
              Our commitment to your privacy is unwavering and legally binding.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default PrivacyNotice;