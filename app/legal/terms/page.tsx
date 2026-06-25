import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p>
        Last updated: June 2026. Please refer to the most current version posted on this site. By
        accessing or using this platform you agree to be bound by these Terms of Service.
      </p>

      <h2>1. About This Platform</h2>
      <p>
        This platform connects patients with independent licensed healthcare providers and licensed
        compounding pharmacies. We do not employ healthcare providers, practice medicine, or
        dispense medications. All prescribing decisions are made independently by the licensed
        providers in our network.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years of age and a resident of a U.S. state in which our partnered
        providers are licensed to practice. By creating an account you represent that you meet these
        requirements. Creating an account on behalf of another person is prohibited without explicit
        legal authority (e.g., legal guardianship).
      </p>

      <h2>3. Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your login credentials and for
        all activity under your account. You agree to notify us immediately of any unauthorized
        access. We reserve the right to suspend or terminate accounts that violate these Terms or
        that we believe pose a risk of fraud or harm.
      </p>

      <h2>4. Prescription Nature of Products</h2>
      <p>
        All products available for purchase through this platform are prescription items. A valid
        prescription issued by a licensed healthcare provider is required before any product is
        dispensed. Submitting false or misleading information during your intake or consultation
        may result in immediate account termination and may constitute fraud under applicable law.
      </p>

      <h2>5. No Resale</h2>
      <p>
        Prescription medications dispensed through this platform are for your personal therapeutic
        use only as directed by your prescribing provider. Resale, redistribution, or transfer of
        any prescription product to another individual is strictly prohibited and may violate
        federal and state law.
      </p>

      <h2>6. Payments and Billing</h2>
      <p>
        Consultation fees and product pricing are displayed at checkout. By submitting payment you
        authorize us to charge the payment method on file. All fees are in U.S. dollars. Prices are
        subject to change with reasonable notice.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by applicable law, our total liability to you for any claim
        arising out of or relating to these Terms or your use of the platform shall not exceed the
        total amount paid by you in the twelve (12) months preceding the claim. We are not liable
        for indirect, incidental, consequential, or punitive damages.
      </p>

      <h2>8. Disclaimer of Warranties</h2>
      <p>
        The platform and its content are provided &quot;as is&quot; without warranties of any kind, express
        or implied. We do not warrant that the platform will be uninterrupted, error-free, or free
        of viruses or other harmful components.
      </p>

      <h2>9. Governing Law and Dispute Resolution</h2>
      <p>
        These Terms are governed by the laws of [State], without regard to its conflict-of-law
        provisions. Any dispute arising under these Terms shall first be submitted to informal
        negotiation. If not resolved within 30 days, disputes shall be resolved through binding
        arbitration under the rules of the American Arbitration Association, on an individual basis
        (no class actions).
      </p>

      <h2>10. Changes to These Terms</h2>
      <p>
        We may update these Terms periodically. Material changes will be communicated via email or
        a notice on the platform. Continued use of the platform after changes take effect
        constitutes acceptance of the revised Terms.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these Terms can be directed to our support team through the help center.
      </p>
    </LegalLayout>
  );
}
