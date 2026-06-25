import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <LegalLayout title="Refund Policy">
      <p>
        Last updated: June 2026. Please refer to the most current version posted on this site.
      </p>

      <h2>Prescription Products</h2>
      <p>
        Because our products are compounded prescription medications prepared specifically for
        individual patients, they cannot be restocked or reused once dispensed. For this reason,
        all prescription product sales are <strong>final once the order has been processed by the
        pharmacy</strong>. We are unable to accept returns of dispensed prescription medications
        under federal and state pharmacy law.
      </p>
      <p>
        If you have concerns about a product you have received, please contact our support team
        within 7 days of delivery. We will work with you and the dispensing pharmacy to investigate
        and, where appropriate, arrange a replacement.
      </p>

      <h2>Consultation Fees</h2>
      <p>
        Telehealth consultation fees cover the cost of clinical review by a licensed healthcare
        provider and are generally non-refundable once the provider has reviewed your intake,
        regardless of whether a prescription is issued. If a consultation is not yet assigned to a
        provider, please contact support to request a cancellation.
      </p>

      <h2>Damaged or Incorrect Orders</h2>
      <p>
        If you receive a product that is visibly damaged, incorrectly labeled, or does not match
        your prescription, please contact our support team immediately (within 5 days of delivery)
        and retain the original packaging and product. We will coordinate with the dispensing
        pharmacy to investigate and, if confirmed, arrange a replacement at no additional charge.
        Please do not use a product you believe is damaged or incorrect.
      </p>

      <h2>Orders Not Delivered</h2>
      <p>
        If tracking indicates your order was delivered but you did not receive it, please contact
        us within 10 days of the estimated delivery date. We will open an inquiry with the carrier.
        Resolution timelines depend on the carrier investigation process.
      </p>

      <h2>Subscription Orders</h2>
      <p>
        If you are enrolled in an auto-renewal plan, you may cancel your next renewal by contacting
        support at least 5 business days before the next billing date. Refunds are not issued for
        renewal orders that have already been processed by the pharmacy.
      </p>

      <h2>How to Contact Us</h2>
      <p>
        To initiate a refund inquiry or report an issue with your order, please reach out through
        the help center with your order number and a description of the issue.
      </p>
    </LegalLayout>
  );
}
