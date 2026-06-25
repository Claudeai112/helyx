import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = { title: "Medical Disclaimer" };

export default function MedicalDisclaimerPage() {
  return (
    <LegalLayout title="Medical Disclaimer">
      <p>
        Last updated: June 2026. Please refer to the most current version posted on this site, as
        this policy may be updated periodically.
      </p>

      <h2>Prescription-Only Products</h2>
      <p>
        All peptide therapeutics and compounded medications offered through this platform are
        prescription items. They are dispensed exclusively through licensed compounding pharmacies
        that are partnered with our telehealth network. No product is shipped, dispensed, or
        otherwise provided to any individual without a valid prescription issued by a licensed
        healthcare provider following a clinical evaluation.
      </p>

      <h2>Evaluation and Prescriber Approval Required</h2>
      <p>
        Access to prescription products requires completion of a telehealth consultation. A licensed
        healthcare provider — which may include a physician, nurse practitioner, or physician
        assistant operating within their scope of practice — reviews each intake, assesses clinical
        eligibility, and, if appropriate, issues a prescription. Eligibility is determined solely by
        the reviewing licensed provider, not by this platform or its operators.
      </p>

      <h2>No Medical Advice</h2>
      <p>
        This website and its content — including articles, FAQs, product descriptions, and dosing
        references — are provided for general educational purposes only and do not constitute
        medical advice, diagnosis, or treatment. Nothing on this site should be construed as a
        recommendation to begin, modify, or discontinue any medical treatment. Always seek the
        advice of your own physician or another qualified healthcare professional with any questions
        you may have regarding a medical condition or prescription therapy.
      </p>

      <h2>No Efficacy Guarantees</h2>
      <p>
        Individual outcomes vary. No representation is made that any prescription product will
        produce a particular therapeutic result. Clinical evidence cited on this site reflects
        published research; it does not constitute a guarantee of personal efficacy or safety.
      </p>

      <h2>Emergency Situations</h2>
      <p>
        This platform does not provide emergency medical services. If you believe you are
        experiencing a medical emergency, call 911 or go to your nearest emergency room immediately.
      </p>

      <h2>Regulatory Status</h2>
      <p>
        Compounded peptide medications are prepared by licensed pharmacies pursuant to valid
        prescriptions under applicable federal and state pharmacy law. This platform operates in
        compliance with applicable telehealth regulations. The regulatory landscape for compounded
        medications is subject to change; the licensed providers and pharmacies in our network
        maintain current compliance with all applicable requirements.
      </p>

      <h2>Questions</h2>
      <p>
        If you have questions about the medical disclaimer or the prescription process, please
        contact our support team through the help center.
      </p>
    </LegalLayout>
  );
}
