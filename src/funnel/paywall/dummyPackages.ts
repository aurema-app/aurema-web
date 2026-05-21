export type PaywallPlan = {
  id: string;
  label: string;
  note: string;
  price: string;
  isMostPopular?: boolean;
};

export const DUMMY_PAYWALL_PLANS: PaywallPlan[] = [
  {
    id: "annual",
    label: "Annual",
    note: "Best value · per year",
    price: "$39.99",
    isMostPopular: true,
  },
  {
    id: "monthly",
    label: "Monthly",
    note: "Cancel anytime · per month",
    price: "$9.99",
  },
];

export const DUMMY_PURCHASE_KEY = "lexi.dummyPurchase";
