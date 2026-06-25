import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <LegalLayout title="Refund Policy">
      <p>
        Last updated: June 2026. Please refer to the most current version posted on this site.
      </p>

      <h2>Research Materials</h2>
      <p>
        Because many of our peptide compounds are prepared or handled to order, all
        research-material sales are <strong>final once the order has been confirmed</strong>. We
        are unable to accept returns of research compounds once shipped, in accordance with
        standard research-supply industry practice.
      </p>
      <p>
        If you have concerns about a product you have received, please contact our support team
        within 7 days of delivery. We will work with you to investigate and, where appropriate,
        arrange a replacement.
      </p>

      <h2>Damaged or Incorrect Orders</h2>
      <p>
        If you receive a product that is visibly damaged, incorrectly labeled, or does not match
        your order, please contact our support team immediately (within 5 days of delivery) and
        retain the original packaging and product. Our fulfillment team will investigate and, if
        confirmed, arrange a replacement at no additional charge. Please do not open or use a
        product you believe is damaged or incorrect.
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
        renewal orders that have already been confirmed and processed.
      </p>

      <h2>How to Contact Us</h2>
      <p>
        To initiate a refund inquiry or report an issue with your order, please reach out through
        the help center with your order number and a description of the issue.
      </p>
    </LegalLayout>
  );
}
