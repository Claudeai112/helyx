import { LegalLayout } from "@/components/legal/legal-layout";

export const metadata = { title: "Shipping Policy" };

export default function ShippingPage() {
  return (
    <LegalLayout title="Shipping Policy">
      <p>
        Last updated: June 2026. Please refer to the most current version posted on this site.
        This policy applies to research-supply orders placed on this platform.
      </p>

      <h2>Shipping Charges</h2>
      <p>
        <strong>Shipping is paid by the customer on all orders.</strong> Shipping charges are
        calculated at checkout based on order weight, destination, and any cold-chain requirements,
        and are added to your order total. We do not offer free shipping, and this applies to all
        orders, including bulk and wholesale orders.
      </p>

      <h2>Processing Times</h2>
      <p>
        After your order is confirmed, we typically process and ship within{" "}
        <strong>3–5 business days</strong>. Processing time may vary based on product availability
        and order volume. You will receive an email confirmation when your order ships.
      </p>

      <h2>Shipping Methods and Carriers</h2>
      <p>
        Orders are shipped via UPS, FedEx, or USPS depending on your location. Estimated delivery
        after shipment is typically 2–5 business days within the contiguous United States.
      </p>

      <h2>Discreet Packaging</h2>
      <p>
        All orders ship in plain, unmarked outer packaging. The return address reflects our
        fulfillment center. Contents are not visible through the outer packaging.
      </p>

      <h2>Cold-Chain and Temperature-Sensitive Products</h2>
      <p>
        Certain temperature-sensitive peptide compounds require refrigeration. Where applicable,
        orders are shipped with appropriate cold-pack materials and insulated packaging to maintain
        product integrity during transit. Please refrigerate your order promptly upon receipt. If
        you believe your order arrived warm or compromised, do not open or use the product and
        contact support within 48 hours of delivery.
      </p>

      <h2>Tracking</h2>
      <p>
        A tracking number will be provided via email once your order has shipped. You can use this
        number on the carrier&apos;s website to monitor delivery status. Please allow up to 24 hours
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
        We currently ship within the contiguous United States. We do not ship to P.O. boxes or
        internationally for research compounds.
      </p>

      <h2>Address Changes</h2>
      <p>
        To change your shipping address, please contact support before your order is dispatched.
        We cannot guarantee address changes can be accommodated once the order has been processed.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about your shipment, please contact our support team through the help center
        with your order number.
      </p>
    </LegalLayout>
  );
}
