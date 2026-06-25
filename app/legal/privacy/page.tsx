import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        Last updated: June 2026. Please refer to the most current version posted on this site. This
        Privacy Policy describes how we collect, use, and share information about you when you use
        our platform.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        <strong>Contact information:</strong> Name, email address, phone number, and mailing address
        provided when you create an account or place an order.
      </p>
      <p>
        <strong>Health and consultation intake:</strong> Health history, current medications,
        symptoms, and other information you submit as part of the telehealth consultation process.
        This information is considered protected health information (PHI) under HIPAA where
        applicable.
      </p>
      <p>
        <strong>Payment information:</strong> Payment is processed by Stripe, Inc. We do not store
        full credit card numbers. We retain transaction records including the last four digits of
        your card, billing address, and transaction amounts.
      </p>
      <p>
        <strong>Usage data:</strong> IP address, browser type, pages visited, and time spent on the
        platform, collected automatically via cookies and similar technologies.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use your information to: facilitate telehealth consultations and transmit intake data to
        the licensed provider reviewing your case; process and fulfill prescription orders through
        partnered licensed pharmacies; send transactional communications (order confirmation,
        shipping updates, prescription renewal reminders); provide customer support; and comply with
        legal obligations including pharmacy law and telehealth regulations.
      </p>

      <h2>3. Sharing With Provider and Pharmacy Partners</h2>
      <p>
        To deliver our core service, we share relevant health and contact information with the
        licensed healthcare providers in our network and with the licensed compounding pharmacies
        that dispense prescriptions. These parties are bound by applicable HIPAA requirements and
        contractual data security obligations. We do not sell your personal health information to
        third parties for marketing purposes.
      </p>

      <h2>4. SMS and Email Communications</h2>
      <p>
        By providing your phone number or email address, you consent to receive transactional
        messages related to your account, consultations, and orders. Marketing communications
        (e.g., promotional emails or SMS) require separate opt-in consent, which you may withdraw
        at any time by following the unsubscribe instructions in any such message or contacting our
        support team. Standard messaging rates may apply for SMS.
      </p>

      <h2>5. Cookies and Tracking Technologies</h2>
      <p>
        We use cookies and similar technologies to maintain session state, analyze platform usage,
        and improve the user experience. You can control cookie preferences through your browser
        settings, though disabling certain cookies may affect platform functionality.
      </p>

      <h2>6. Data Security</h2>
      <p>
        We implement industry-standard administrative, technical, and physical safeguards designed
        to protect your personal information against unauthorized access, disclosure, alteration, or
        destruction. No method of transmission over the internet is completely secure; we cannot
        guarantee absolute security.
      </p>

      <h2>7. Data Retention</h2>
      <p>
        We retain personal information for as long as your account is active and as required by
        applicable law (including pharmacy record-keeping requirements). Health intake and
        prescription records are retained for a minimum of seven years or as required by state law.
      </p>

      <h2>8. Your Rights</h2>
      <p>
        Depending on your state of residence, you may have rights to access, correct, delete, or
        port your personal data. To submit a request, contact our support team. Note that certain
        information cannot be deleted where retention is required by law (e.g., prescription
        records).
      </p>

      <h2>9. Children&apos;s Privacy</h2>
      <p>
        This platform is not directed to individuals under 18 years of age. We do not knowingly
        collect personal information from minors.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. We will notify you of material changes by
        email or by posting a notice on the platform.
      </p>

      <h2>11. Contact</h2>
      <p>
        For privacy questions or to exercise your rights, please contact our support team through
        the help center.
      </p>
    </LegalLayout>
  );
}
