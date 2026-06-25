import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = { title: "Research Use Disclaimer" };

export default function MedicalDisclaimerPage() {
  return (
    <LegalLayout title="Research Use Disclaimer">
      <p>
        Last updated: June 2026. Please refer to the most current version posted on this site, as
        this policy may be updated periodically.
      </p>

      <h2>Research Use Only</h2>
      <p>
        All peptide compounds and related products offered through this platform are sold strictly
        for in-vitro and laboratory research purposes only. They are NOT for human or
        animal consumption, and are not approved, intended, or suitable for clinical, diagnostic,
        or therapeutic use. These products are not drugs and make no therapeutic or medical
        claims of any kind.
      </p>

      <h2>No Medical Advice</h2>
      <p>
        This website and its content — including articles, FAQs, product descriptions, and
        technical references — are provided for general informational and educational purposes only
        and do not constitute medical advice, diagnosis, or treatment. Nothing on this site should
        be construed as a therapeutic recommendation or as guidance for use in humans or animals.
        If you have medical questions, seek the advice of a qualified healthcare professional.
      </p>

      <h2>Buyer Responsibility</h2>
      <p>
        By placing an order, the buyer represents and warrants that they are a qualified researcher
        and that all products purchased will be used solely for lawful laboratory or research
        purposes. The buyer is solely responsible for ensuring that their use of research compounds
        complies with all applicable laws and regulations in their jurisdiction, including proper
        handling, storage, and disposal of research materials in accordance with applicable safety
        guidelines.
      </p>

      <h2>No Efficacy Guarantees</h2>
      <p>
        Research outcomes vary. No representation is made that any product will produce a
        particular result in any research context. Scientific literature and data cited on this
        site reflect published research findings; such citations do not constitute efficacy or
        safety guarantees for any specific application.
      </p>

      <h2>Emergency Situations</h2>
      <p>
        This platform is not an emergency service and does not provide emergency assistance of any
        kind. If you believe you are experiencing a medical emergency, call 911 or go to your
        nearest emergency room immediately.
      </p>

      <h2>Questions</h2>
      <p>
        If you have questions about this disclaimer or our research-supply products, please contact
        our support team through the help center.
      </p>
    </LegalLayout>
  );
}
