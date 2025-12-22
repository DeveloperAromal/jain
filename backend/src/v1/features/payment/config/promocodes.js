// Example promo codes config. In production, use a DB table.
export const PROMO_CODES = [
  {
    code: "WELCOME10",
    discountPercent: 10, // 10% off
    active: true,
    expires: "2099-12-31",
  },
  {
    code: "FESTIVE25",
    discountPercent: 25, // 25% off
    active: true,
    expires: "2099-12-31",
  },
];

export function getPromoDetails(code) {
  const now = new Date();
  return PROMO_CODES.find(
    (p) =>
      p.code.toLowerCase() === code.toLowerCase() &&
      p.active &&
      (!p.expires || new Date(p.expires) > now)
  );
}
