import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = { title: "Shipping Policy" };

export default function ShippingPage() {
  return (
    <LegalLayout title="Shipping Policy">
      <p>
        Last updated: June 2026. Please refer to the most current version posted on this site. This
        policy applies to prescription orders fulfilled through our partnered licensed compounding
        pharmacies.
      </p>

      <h2>Processing Times</h2>
      <p>
        After a prescription is issued by your licensed provider, the dispensing pharmacy typically
        processes and ships orders within <strong>3–5 business days</strong>. Processing time may
        vary based on pharmacy workload, formulation complexity, and prescription verification
        requirements. You will receive an email confirmation when your order ships.
      </p>

      <h2>Shipping Methods and Carriers</h2>
      <p>
        Orders are shipped via UPS, FedEx, or USPS, depending on your location and the pharmacy
        fulfilling your prescription. The carrier is selected by the dispensing pharmacy to ensure
        appropriate handling and delivery timelines. Estimated delivery after shipment is typically
        2–5 business days for standard shipping within the contiguous United States.
      </p>

      <h2>Discreet Packaging</h2>
      <p>
        All orders are shipped in plain, unmarked outer packaging. The return address reflects the
        dispensing pharmacy, as required by pharmacy law. The contents of your package are not
        visible through the outer packaging.
      </p>

      <h2>Cold-Chain and Temperature-Sensitive Products</h2>
      <p>
        Certain compounded peptide formulations require refrigeration. Where applicable, orders
        are shipped with appropriate cold-pack materials and insulated packaging to maintain
        product integrity during transit. Please refrigerate your order promptly upon receipt.
        If you believe your order arrived warm or compromised, do not use the product and contact
        support within 48 hours of delivery.
      </p>

      <h2>Tracking</h2>
      <p>
        A tracking number will be provided via email once your order has shipped. You can use this
        number on the carrier's website to monitor delivery status. Please allow up to 24 hours
        after shipment for tracking information to become active.
      </p>

      <h2>Delivery Issues</h2>
      <p>
        If your order has not arrived within the expected delivery window, first check the carrier
        tracking information. If tracking shows delivery but you have not received the package,
        or if tracking has not updated in 5+ business days, please contact our support team with
        your order number so we can investigate.
      </p>

      <h2>Shipping Restrictions</h2>
      <p>
        We currently ship to states in which our partnered licensed pharmacies are authorized to
        dispense. Shipping to P.O. boxes may not be available for all products. We do not ship
        internationally.
      </p>

      <h2>Address Changes</h2>
      <p>
        To change your shipping address, please contact support before your order is dispatched by
        the pharmacy. We cannot guarantee address changes can be accommodated once the pharmacy
        has processed your order.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about your shipment, please contact our support team through the help center
        with your order number.
      </p>
    </LegalLayout>
  );
}
