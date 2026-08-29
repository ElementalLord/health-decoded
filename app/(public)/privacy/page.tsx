import type { Metadata } from "next";

import {
  LegalList,
  LegalPage,
  LegalSection,
  LegalSubsection,
} from "@/components/shared/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Health Decoded Privacy Policy.",
};

export default function PrivacyPage() {
  return (
    <LegalPage lastUpdated="August 27, 2026" title="Health Decoded Privacy Policy">
      <p>
        Health Decoded (“Health Decoded,” “we,” “us,” or “our”) is an educational platform designed
        to help people better understand Type 2 diabetes through educational lessons, activities,
        resources, appointment-preparation tools, and an AI-powered educational tutor.
      </p>
      <p>
        This Privacy Policy explains what information we collect, how we use it, how we share it,
        and the choices available to you when you use Health Decoded.
      </p>
      <LegalSection title="1. Information We Collect">
        <LegalSubsection title="Account Information">
          <p>
            When you create an account, Health Decoded collects information necessary to create and
            maintain your account, including your email address and authentication information.
          </p>
          <p>Health Decoded may also store:</p>
          <LegalList>
            <li>Your display name</li>
            <li>Your account creation date</li>
            <li>Whether you have completed onboarding</li>
          </LegalList>
          <p>
            Authentication identity and account credentials are handled through our authentication
            provider.
          </p>
        </LegalSubsection>
        <LegalSubsection title="Preferences and Accessibility Information">
          <p>
            Health Decoded may store settings that help provide a consistent and accessible
            experience, including:
          </p>
          <LegalList>
            <li>Reduced-motion preference</li>
            <li>Preferred text size</li>
            <li>Language or locale</li>
            <li>Time zone</li>
          </LegalList>
          <p>These settings are associated with your account.</p>
        </LegalSubsection>
        <LegalSubsection title="Learning and Progress Information">
          <p>
            When you use Health Decoded, we may store information about your educational activity,
            including:
          </p>
          <LegalList>
            <li>Lessons started or completed</li>
            <li>Your current progress within lessons</li>
            <li>The position you last viewed within a lesson</li>
            <li>Activities completed</li>
            <li>Activity completion results</li>
            <li>Experience points</li>
            <li>Learning milestones</li>
            <li>Journey start or completion information</li>
            <li>Dates and times associated with learning activity</li>
          </LegalList>
          <p>
            This information is used to provide your personalized learning experience and preserve
            your progress.
          </p>
        </LegalSubsection>
        <LegalSubsection title="Reflections and User-Submitted Content">
          <p>Some Health Decoded activities allow you to enter short written reflections.</p>
          <p>
            These reflections are associated with your learning progress and are stored so that the
            application can provide the related learning experience.
          </p>
          <p>
            Because Health Decoded focuses on diabetes education, a reflection could contain
            health-related information if you choose to include it.
          </p>
          <p>
            Please do not include unnecessary sensitive information, such as your full medical
            record, insurance information, passwords, Social Security number, or other information
            that is not needed for the activity.
          </p>
        </LegalSubsection>
        <LegalSubsection title="AI Tutor Information">
          <p>
            Health Decoded provides an AI Tutor for educational questions about Type 2 diabetes and
            related topics.
          </p>
          <p>
            When you use the AI Tutor, your current message and limited conversation context may be
            processed by our servers to generate a response.
          </p>
          <p>
            The current AI Tutor is designed to keep conversation history within the active browser
            session rather than create a permanent user-visible chat history. New AI conversations
            and messages are not currently written to the application&apos;s persistent conversation
            tables.
          </p>
          <p>
            Relevant Health Decoded educational content and limited account learning context may
            also be used to make an AI response more relevant.
          </p>
        </LegalSubsection>
        <LegalSubsection title="Technical and Security Information">
          <p>
            We may process limited technical information necessary to operate, secure, and
            troubleshoot Health Decoded.
          </p>
          <p>Depending on the feature and request, this may include information such as:</p>
          <LegalList>
            <li>Request timestamps</li>
            <li>Authentication and session information</li>
            <li>Request-size categories</li>
            <li>Performance or latency information</li>
            <li>Error or failure categories</li>
            <li>Security-related classifications</li>
            <li>Technical identifiers used to detect abuse or manage requests</li>
          </LegalList>
          <p>
            Health Decoded&apos;s AI logging system is designed not to place conversation content,
            AI prompts, AI responses, medical questions, API keys, or provider tokens into
            operational logs.
          </p>
        </LegalSubsection>
      </LegalSection>
      <LegalSection title="2. How We Use Information">
        <p>We may use information we collect to:</p>
        <LegalList>
          <li>Create and maintain your account</li>
          <li>Authenticate you</li>
          <li>Provide Health Decoded&apos;s educational features</li>
          <li>Save and restore your learning progress</li>
          <li>Remember accessibility and presentation preferences</li>
          <li>Provide personalized learning recommendations</li>
          <li>Track educational milestones and learning streaks</li>
          <li>Provide appointment-preparation functionality</li>
          <li>Provide the AI Tutor</li>
          <li>Protect the security and reliability of the service</li>
          <li>Detect and prevent abuse</li>
          <li>Troubleshoot technical problems</li>
          <li>Improve Health Decoded and its educational experience</li>
        </LegalList>
        <p>We do not sell your personal information.</p>
      </LegalSection>
      <LegalSection title="3. Health-Related Information">
        <p>Health Decoded is an educational service focused on Type 2 diabetes.</p>
        <p>
          Some information associated with your use of the service may therefore be sensitive or
          health-related, particularly information that you voluntarily enter into reflections or
          the AI Tutor.
        </p>
        <p>
          Health Decoded is designed to minimize unnecessary collection of medical information. The
          service is not intended to function as a medical record system.
        </p>
        <p>
          You should only provide information necessary to use a feature and should avoid submitting
          highly sensitive information that is not necessary.
        </p>
      </LegalSection>
      <LegalSection title="4. AI Processing">
        <p>The Health Decoded AI Tutor uses Google Gemini to generate educational responses.</p>
        <p>
          When you use the AI Tutor, your message and limited session context may be transmitted
          from Health Decoded&apos;s server to the AI provider for processing.
        </p>
        <p>
          Health Decoded&apos;s AI system is designed to limit the context sent to the AI provider.
          It does not intentionally send raw database records, hidden activity answers, internal
          database identifiers, draft content, reviewer information, or unrelated metadata as part
          of the normal AI context.
        </p>
        <p>
          The AI Tutor is an educational feature. It is not a medical diagnosis or treatment system
          and should not be relied upon for emergency decisions, medication changes, dosage
          decisions, or other medical decisions requiring a healthcare professional.
        </p>
      </LegalSection>
      <LegalSection title="5. How We Share Information">
        <p>We do not sell your personal information.</p>
        <p>
          We may share or make information available to service providers that help us operate
          Health Decoded, including providers used for:
        </p>
        <LegalList>
          <li>Authentication</li>
          <li>Database and application infrastructure</li>
          <li>Hosting</li>
          <li>AI processing</li>
          <li>Security and reliability</li>
        </LegalList>
        <p>
          These providers may process information on our behalf as necessary to provide their
          services.
        </p>
        <p>We may also disclose information when reasonably necessary to:</p>
        <LegalList>
          <li>Comply with applicable law or legal process</li>
          <li>Respond to lawful governmental requests</li>
          <li>Protect the security of Health Decoded</li>
          <li>Prevent fraud, abuse, or security incidents</li>
          <li>Protect the rights, safety, or property of Health Decoded, our users, or others</li>
        </LegalList>
      </LegalSection>
      <LegalSection title="6. Data Security">
        <p>
          We use technical and organizational measures intended to protect information handled by
          Health Decoded.
        </p>
        <p>
          For example, Health Decoded&apos;s database uses access controls designed to restrict
          users to their own account, settings, learning progress, and reflections.
        </p>
        <p>
          Sensitive activity-answer information is separated from user-accessible activity
          information, and normal client roles are not granted direct access to those protected
          answer keys.
        </p>
        <p>
          AI credentials are kept on the server and are not intended to be exposed to browser users.
        </p>
        <p>
          Despite these safeguards, no internet-connected service can guarantee absolute security.
        </p>
      </LegalSection>
      <LegalSection title="7. Data Retention">
        <p>
          We retain information for as long as reasonably necessary to provide Health Decoded,
          maintain your account and learning experience, protect the service, comply with legal
          obligations, and resolve disputes.
        </p>
        <p>
          Learning progress and account information may remain associated with your account while
          your account is active.
        </p>
        <p>
          User-submitted reflections may remain stored as part of your learning records until they
          are deleted through available functionality or otherwise removed in accordance with our
          retention practices.
        </p>
        <p>
          The current AI Tutor does not intentionally maintain a permanent user-visible conversation
          history. AI conversation content exists within the active session for the purpose of
          generating responses.
        </p>
        <p>
          Technical and security information may be retained for a reasonable period for security,
          troubleshooting, and operational purposes.
        </p>
      </LegalSection>
      <LegalSection title="8. Cookies and Similar Technologies">
        <p>
          Health Decoded may use cookies, browser storage, authentication tokens, and similar
          technologies that are necessary to:
        </p>
        <LegalList>
          <li>Keep you signed in</li>
          <li>Maintain secure sessions</li>
          <li>Remember preferences</li>
          <li>Protect the application</li>
          <li>Provide core functionality</li>
        </LegalList>
        <p>The specific technologies used may change as Health Decoded develops.</p>
      </LegalSection>
      <LegalSection title="9. Your Privacy Choices">
        <p>
          Depending on your location and applicable law, you may have rights concerning your
          personal information, which may include the right to:
        </p>
        <LegalList>
          <li>Request access to information associated with your account</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of certain information</li>
          <li>Ask how your information is used</li>
          <li>Exercise other rights provided by applicable privacy law</li>
        </LegalList>
        <p>
          Some information may need to be retained where required by law or reasonably necessary for
          security, fraud prevention, or other legitimate purposes.
        </p>
        <p>To make a privacy request, contact us using the information provided below.</p>
      </LegalSection>
      <LegalSection title="10. Children's Privacy">
        <p>
          Health Decoded is an educational service and does not intentionally collect more personal
          information from children than is reasonably necessary to provide the service.
        </p>
        <p>Users should not provide unnecessary sensitive information through Health Decoded.</p>
        <p>
          Parents or guardians who believe that a child has provided personal information that
          should be removed may contact us using the information below.
        </p>
        <p>
          Where additional requirements apply because of the age of a user or the applicable law,
          Health Decoded may take additional steps as required.
        </p>
      </LegalSection>
      <LegalSection title="11. Third-Party Services">
        <p>
          Health Decoded relies on third-party technology providers to operate portions of the
          service.
        </p>
        <p>
          These may include providers responsible for authentication, database infrastructure,
          hosting, security, and artificial-intelligence processing.
        </p>
        <p>
          These providers may process information according to their own privacy policies and
          applicable agreements.
        </p>
        <p>
          The providers used by Health Decoded may change as the service develops. This Privacy
          Policy will be updated when material changes to our data practices occur.
        </p>
      </LegalSection>
      <LegalSection title="12. Changes to This Privacy Policy">
        <p>
          We may update this Privacy Policy when Health Decoded&apos;s features, data practices, or
          legal obligations change.
        </p>
        <p>
          When we make material changes, we will update the “Last Updated” date and may provide
          additional notice when appropriate.
        </p>
      </LegalSection>
      <LegalSection title="13. Contact Us">
        <p>
          Questions about this Privacy Policy or requests concerning personal information may be
          sent to:
        </p>
        <p>
          Health Decoded
          <br />
          Privacy Contact: naitik.s.patel10@gmail.com
        </p>
      </LegalSection>
      <LegalSection title="14. Educational and Medical Disclaimer">
        <p>
          Health Decoded provides educational information about Type 2 diabetes. It is not a
          substitute for professional medical advice, diagnosis, treatment, or emergency care.
        </p>
        <p>
          Information provided by the AI Tutor and other Health Decoded features may contain errors
          and should not be treated as medical instructions.
        </p>
        <p>
          Do not use Health Decoded for emergency medical decisions. For medical concerns specific
          to you, consult a qualified healthcare professional.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
