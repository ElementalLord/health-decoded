import type { Metadata } from "next";

import { LegalList, LegalPage, LegalSection } from "@/components/shared/legal-page";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Health Decoded Terms of Use.",
};

export default function TermsPage() {
  return (
    <LegalPage lastUpdated="August 27, 2026" title="Health Decoded Terms of Use">
      <p>
        Welcome to Health Decoded. These Terms of Use (“Terms”) govern your use of the Health
        Decoded website, application, educational content, AI Tutor, and related services
        (collectively, the “Service”).
      </p>
      <p>
        By creating an account or using the Service, you agree to these Terms. If you do not agree
        with these Terms, do not use Health Decoded.
      </p>
      <LegalSection title="1. About Health Decoded">
        <p>
          Health Decoded is an educational platform designed to help people better understand Type 2
          diabetes.
        </p>
        <p>The Service may include:</p>
        <LegalList>
          <li>Educational lessons and activities</li>
          <li>Learning progress and milestones</li>
          <li>Educational resources</li>
          <li>Appointment-preparation tools</li>
          <li>Caregiver education and support content</li>
          <li>An AI-powered educational tutor</li>
          <li>Other educational features we may add over time</li>
        </LegalList>
        <p>
          Health Decoded is intended to support learning and understanding. It is not a healthcare
          provider.
        </p>
      </LegalSection>
      <LegalSection title="2. Medical Disclaimer">
        <p>Health Decoded does not provide medical advice.</p>
        <p>
          The information provided through Health Decoded, including information provided by the AI
          Tutor, is intended for general educational purposes only.
        </p>
        <p>Health Decoded does not provide:</p>
        <LegalList>
          <li>Medical diagnoses</li>
          <li>Individualized treatment plans</li>
          <li>Emergency medical care</li>
          <li>Medication prescriptions</li>
          <li>Medication dosage instructions</li>
          <li>Instructions to start, stop, or change medication</li>
          <li>A substitute for a healthcare professional</li>
        </LegalList>
        <p>Do not rely on Health Decoded for emergency medical decisions.</p>
        <p>
          If you are experiencing a medical emergency, contact emergency services or seek immediate
          professional medical care.
        </p>
        <p>
          For questions about your personal health, medications, blood glucose, symptoms, or
          treatment, consult a qualified healthcare professional.
        </p>
      </LegalSection>
      <LegalSection title="3. AI Tutor">
        <p>
          Health Decoded includes an AI Tutor intended to provide educational explanations about
          Type 2 diabetes and related topics.
        </p>
        <p>
          The AI Tutor may make mistakes, misunderstand questions, provide incomplete information,
          or provide information that is not appropriate for a particular person.
        </p>
        <p>
          You are responsible for evaluating information provided by the AI Tutor and should verify
          important medical information with a qualified healthcare professional.
        </p>
        <p>The AI Tutor must not be used as a replacement for professional medical care.</p>
        <p>
          You should not submit passwords, financial information, Social Security numbers,
          medical-record numbers, or other unnecessary sensitive information to the AI Tutor.
        </p>
      </LegalSection>
      <LegalSection title="4. Accounts">
        <p>Some Health Decoded features require an account.</p>
        <p>You agree to:</p>
        <LegalList>
          <li>Provide accurate information when creating your account</li>
          <li>Keep your login credentials secure</li>
          <li>Not share your account with another person</li>
          <li>Notify us if you believe your account has been compromised</li>
          <li>Use the Service only for lawful purposes</li>
        </LegalList>
        <p>
          You are responsible for activity occurring through your account unless the activity
          resulted from circumstances outside your reasonable control.
        </p>
      </LegalSection>
      <LegalSection title="5. Acceptable Use">
        <p>You may use Health Decoded only for lawful and appropriate purposes.</p>
        <p>You may not:</p>
        <LegalList>
          <li>Attempt to gain unauthorized access to another user&apos;s account or information</li>
          <li>Attempt to bypass security or access controls</li>
          <li>Reverse engineer or interfere with the Service</li>
          <li>Use automated systems to abuse or overload the Service</li>
          <li>Upload malicious software or code</li>
          <li>Attempt to access restricted administrative or database information</li>
          <li>Use Health Decoded to provide medical services to another person</li>
          <li>
            Use the Service in a way that could harm Health Decoded, its users, or its
            infrastructure
          </li>
        </LegalList>
        <p>
          We may restrict or suspend access when reasonably necessary to protect the Service or its
          users.
        </p>
      </LegalSection>
      <LegalSection title="6. User-Submitted Content">
        <p>
          Certain Health Decoded features allow you to submit information, including written
          reflections.
        </p>
        <p>You retain your rights in content that you submit.</p>
        <p>
          By submitting content, you grant Health Decoded the limited permission necessary to store,
          process, display, and use that content to provide the feature for which you submitted it.
        </p>
        <p>
          You are responsible for the content you submit and should not submit information that you
          do not have the right to provide.
        </p>
        <p>
          Because Health Decoded concerns diabetes education, avoid including unnecessary sensitive
          medical or personal information in user-submitted content.
        </p>
        <p>
          Our collection and handling of information is described further in the Health Decoded
          Privacy Policy.
        </p>
      </LegalSection>
      <LegalSection title="7. Intellectual Property">
        <p>
          Health Decoded and its contents, including its name, branding, software, design,
          educational materials, text, graphics, interfaces, and other original materials, are owned
          by Health Decoded or its applicable licensors.
        </p>
        <p>Except where permitted by law or expressly authorized by us, you may not:</p>
        <LegalList>
          <li>Copy or reproduce substantial portions of Health Decoded</li>
          <li>Modify or create derivative works from the Service</li>
          <li>Redistribute Health Decoded content</li>
          <li>Sell or commercially exploit Health Decoded content</li>
          <li>Remove copyright, trademark, or other proprietary notices</li>
        </LegalList>
        <p>You may use Health Decoded for its intended educational purposes.</p>
      </LegalSection>
      <LegalSection title="8. Educational Content and Third-Party Information">
        <p>
          Health Decoded may provide links to or references to third-party websites, organizations,
          educational materials, or other resources.
        </p>
        <p>These resources are provided for convenience and educational purposes.</p>
        <p>
          Health Decoded does not necessarily endorse or control third-party content and is not
          responsible for the accuracy, availability, or practices of third-party websites or
          services.
        </p>
      </LegalSection>
      <LegalSection title="9. Service Availability">
        <p>
          We strive to keep Health Decoded available and reliable, but we do not guarantee that the
          Service will:
        </p>
        <LegalList>
          <li>Always be available</li>
          <li>Be uninterrupted</li>
          <li>Be error-free</li>
          <li>Be completely secure</li>
          <li>Always contain current or accurate information</li>
        </LegalList>
        <p>We may modify, suspend, or discontinue features of Health Decoded at any time.</p>
      </LegalSection>
      <LegalSection title="10. Privacy">
        <p>Your use of Health Decoded is also subject to our Privacy Policy.</p>
        <p>
          The Privacy Policy explains what information we collect, how we use it, how we share it,
          and how we protect it.
        </p>
        <p>
          By using Health Decoded, you acknowledge that you have had an opportunity to review the
          Privacy Policy.
        </p>
      </LegalSection>
      <LegalSection title="11. Account Suspension and Termination">
        <p>We may suspend or terminate an account when reasonably necessary, including when:</p>
        <LegalList>
          <li>These Terms are violated</li>
          <li>The Service is being abused</li>
          <li>Fraudulent or harmful activity is suspected</li>
          <li>Suspension is necessary to protect users or the Service</li>
          <li>Required by law</li>
        </LegalList>
        <p>You may stop using Health Decoded at any time.</p>
      </LegalSection>
      <LegalSection title="12. Disclaimer of Warranties">
        <p>
          To the extent permitted by applicable law, Health Decoded is provided on an “as is” and
          “as available” basis.
        </p>
        <p>We do not guarantee that:</p>
        <LegalList>
          <li>Educational information will always be complete or error-free</li>
          <li>AI-generated information will always be accurate</li>
          <li>The Service will meet every user&apos;s individual needs</li>
          <li>The Service will always be available</li>
          <li>The Service will produce a particular health or educational outcome</li>
        </LegalList>
        <p>
          Nothing in these Terms excludes rights or protections that cannot legally be excluded.
        </p>
      </LegalSection>
      <LegalSection title="13. Limitation of Liability">
        <p>
          To the extent permitted by applicable law, Health Decoded and its operators will not be
          responsible for indirect, incidental, special, consequential, or similar damages resulting
          from or related to your use of the Service.
        </p>
        <p>
          Nothing in these Terms limits liability where doing so would be prohibited by applicable
          law.
        </p>
      </LegalSection>
      <LegalSection title="14. Changes to These Terms">
        <p>
          We may update these Terms when Health Decoded&apos;s features, services, or legal requirements
          change.
        </p>
        <p>
          When material changes are made, we will update the “Last Updated” date and may provide
          additional notice when appropriate.
        </p>
        <p>
          Your continued use of Health Decoded after updated Terms become effective constitutes
          acceptance of the updated Terms to the extent permitted by applicable law.
        </p>
      </LegalSection>
      <LegalSection title="15. Governing Law">
        <p>
          These Terms will be governed by applicable law, without regard to conflict-of-law
          principles, except where applicable law provides otherwise.
        </p>
        <p>Any dispute will be handled in accordance with applicable law.</p>
      </LegalSection>
      <LegalSection title="16. Contact">
        <p>Questions about these Terms may be sent to:</p>
        <p>
          Health Decoded
          <br />
          Email: naitik.s.patel10@gmail.com
        </p>
      </LegalSection>
    </LegalPage>
  );
}
