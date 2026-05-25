export type PaywallPlan = {
  id: string;
  label: string;
  savePct: number;
  originalPrice: string;
  price: string;
  perDay: string;
  isMostPopular?: boolean;
};

export const DUMMY_PAYWALL_PLANS: PaywallPlan[] = [
  {
    id: "weekly",
    label: "1 week",
    savePct: 50,
    originalPrice: "$13.99",
    price: "$6.99",
    perDay: "$1.00",
  },
  {
    id: "monthly",
    label: "1 month",
    savePct: 65,
    originalPrice: "$22.61",
    price: "$7.91",
    perDay: "$0.26",
    isMostPopular: true,
  },
  {
    id: "quarterly",
    label: "3 months",
    savePct: 70,
    originalPrice: "$49.95",
    price: "$14.98",
    perDay: "$0.16",
  },
];

export const DUMMY_PURCHASE_KEY = "lexi.dummyPurchase";
