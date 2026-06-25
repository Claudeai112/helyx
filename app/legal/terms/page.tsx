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
        Helyx Peptides operates a research-supply e-commerce platform offering peptide compounds
        for laboratory and research use. We do not provide medical services or facilitate clinical
        care. All products are sold solely for research purposes and are not for human or animal
        consumption.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years of age and a resident of the United States. By placing an
        order you represent that you are 18 or older and will use all products solely for lawful
        research purposes. Creating an account on behalf of another person is prohibited without
        explicit legal authority (e.g., legal guardianship).
      </p>

      <h2>3. Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your login credentials and for
        all activity under your account. You agree to notify us immediately of any unauthorized
        access. We reserve the right to suspend or terminate accounts that violate these Terms or
        that we believe pose a risk of fraud or harm.
      </p>

      <h2>4. Research-Use Restriction</h2>
      <p>
        All products available for purchase through this platform are sold strictly for research
        use only and are not for human or animal consumption. By placing an order, you
        confirm that products will be used solely for lawful laboratory or research purposes in
        compliance with all applicable laws and regulations in your jurisdiction. Resale of
        research compounds purchased through this platform is strictly prohibited.
      </p>

      <h2>5. Payments and Billing</h2>
      <p>
        Product pricing is displayed at checkout. By submitting payment you authorize us to charge
        the payment method on file. All fees are in U.S. dollars. Prices are subject to change
        with reasonable notice.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by applicable law, our total liability to you for any claim
        arising out of or relating to these Terms or your use of the platform shall not exceed the
        total amount paid by you in the twelve (12) months preceding the claim. We are not liable
        for indirect, incidental, consequential, or punitive damages.
      </p>

      <h2>7. Disclaimer of Warranties</h2>
      <p>
        The platform and its content are provided &quot;as is&quot; without warranties of any kind, express
        or implied. We do not warrant that the platform will be uninterrupted, error-free, or free
        of viruses or other harmful components.
      </p>

      <h2>8. Governing Law and Dispute Resolution</h2>
      <p>
        These Terms are governed by the laws of [State], without regard to its conflict-of-law
        provisions. Any dispute arising under these Terms shall first be submitted to informal
        negotiation. If not resolved within 30 days, disputes shall be resolved through binding
        arbitration under the rules of the American Arbitration Association, on an individual basis
        (no class actions).
      </p>

      <h2>9. Changes to These Terms</h2>
      <p>
        We may update these Terms periodically. Material changes will be communicated via email or
        a notice on the platform. Continued use of the platform after changes take effect
        constitutes acceptance of the revised Terms.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these Terms can be directed to our support team through the help center.
      </p>
    </LegalLayout>
  );
}
