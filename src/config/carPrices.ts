// Car pricing configurations
export interface CarPrice {
  basePrice: number;
  currency: string;
  variants: { name: string; price: number }[];
}

export const CAR_PRICES: Record<string, CarPrice> = {
  "mclaren-mcl38": {
    basePrice: 15500000,
    currency: "USD",
    variants: [
      { name: "Race Spec", price: 15500000 },
      { name: "Show Car", price: 8500000 },
      { name: "Replica", price: 250000 },
    ],
  },
  "mercedes-w14": {
    basePrice: 14800000,
    currency: "USD",
    variants: [
      { name: "Race Spec", price: 14800000 },
      { name: "Show Car", price: 7900000 },
      { name: "Replica", price: 220000 },
    ],
  },
  "mclaren-mcl36": {
    basePrice: 12500000,
    currency: "USD",
    variants: [
      { name: "Race Spec", price: 12500000 },
      { name: "Show Car", price: 6500000 },
      { name: "Replica", price: 180000 },
    ],
  },
  "redbull-rb19": {
    basePrice: 18000000,
    currency: "USD",
    variants: [
      { name: "Race Spec", price: 18000000 },
      { name: "Show Car", price: 9500000 },
      { name: "Replica", price: 300000 },
    ],
  },
  "ferrari-sf23": {
    basePrice: 16500000,
    currency: "USD",
    variants: [
      { name: "Race Spec", price: 16500000 },
      { name: "Show Car", price: 8800000 },
      { name: "Replica", price: 280000 },
    ],
  },
};

export const getCarPrice = (carId: string): CarPrice | undefined => {
  return CAR_PRICES[carId];
};

export const formatPrice = (price: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};
