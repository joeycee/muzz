export type PerformanceOption = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  duration: string;
  active: boolean;
  image: string | null;
};

export type AvailabilitySlot = {
  id: number;
  date: string;
  start_time: string | null;
  end_time: string | null;
  is_all_day: boolean;
  notes: string;
};

export type AvailabilityBooking = {
  id: number;
  customer_name: string;
  event_time: string;
  venue: string;
  performance_option: PerformanceOption;
  booking_status: string;
};

export type BookingAvailability = {
  date: string;
  conflict_scope: string;
  default_rule: string;
  blocks: AvailabilitySlot[];
  bookings: AvailabilityBooking[];
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  image: string | null;
  primary_image: string | null;
  images: ProductImage[];
  product_type: "physical" | "digital_single" | "digital_album";
  is_digital: boolean;
  has_downloadable_files: boolean;
  digital_tracks: DigitalTrack[];
  active: boolean;
};

export type ProductImage = {
  id: number;
  image: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
};

export type DigitalTrack = {
  id: number;
  title: string;
  track_number: number;
  duration_seconds: number | null;
  notes: string;
  artwork: string | null;
};

export type CartItem = {
  id: number;
  slug: string;
  name: string;
  price: string;
  image: string | null;
  primary_image?: string | null;
  product_type?: Product["product_type"];
  is_digital?: boolean;
  digital_tracks?: DigitalTrack[];
  quantity: number;
};

export type BookingCreateInput = {
  customer_name: string;
  email: string;
  phone: string;
  event_date: string;
  event_time: string;
  venue: string;
  location: string;
  performance_option_id: number;
  notes: string;
};

export type Booking = {
  id: number;
  customer_name: string;
  email: string;
  phone: string;
  event_date: string;
  event_time: string;
  venue: string;
  location: string;
  performance_option: PerformanceOption;
  notes: string;
  total_price: string;
  deposit_amount: string;
  payment_status: string;
  booking_status: string;
  created_at: string;
  updated_at: string;
};

export type OrderCreateItemInput = {
  product_id: number;
  quantity: number;
};

export type OrderCreateInput = {
  customer_name: string;
  email: string;
  phone: string;
  shipping_address: string;
  shipping_country: string;
  notes: string;
  items: OrderCreateItemInput[];
};

export type OrderItem = {
  id: number;
  product: Product;
  quantity: number;
  unit_price: string;
  line_total: string;
};

export type Order = {
  id: number;
  customer_name: string;
  email: string;
  phone: string;
  shipping_address: string;
  shipping_country: string;
  shipping_amount: string;
  notes: string;
  total_amount: string;
  payment_status: string;
  order_status: string;
  has_downloadable_items: boolean;
  download_access_granted: boolean;
  download_token: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: number;
  amount: string;
  currency: string;
  payment_type: string;
  status: string;
  stripe_payment_intent_id: string;
  stripe_checkout_session_id: string;
  stripe_checkout_url: string;
  receipt_number: string;
  booking: number | null;
  order: number | null;
  created_at: string;
  updated_at: string;
};

export type CheckoutSessionResponse = {
  checkout_session_id: string;
  checkout_url: string;
  payment_id: number;
  reused: boolean;
  expires_at: string | null;
};

export type PaymentStatusResponse = {
  resource_id: number;
  resource_type: string;
  resource_status: string;
  payment_status: string;
  amount: string;
  has_downloadable_items?: boolean;
  download_access_granted?: boolean;
  latest_payment: Payment | null;
};

export type OrderCheckoutVerificationResponse = {
  verified: boolean;
  session_id: string;
  session_status: string;
  stripe_payment_status: string;
  order: Order;
  payment: Payment;
};

export type BookingCheckoutVerificationResponse = {
  verified: boolean;
  session_id: string;
  session_status: string;
  stripe_payment_status: string;
  booking: Booking;
  payment: Payment;
};

export type DownloadableTrack = {
  id: number;
  product_id: number;
  product_name: string;
  title: string;
  track_number: number;
  duration_seconds: number | null;
  notes: string;
  artwork: string | null;
  download_url: string;
};

export type OrderDownloadsResponse = {
  has_downloadable_items: boolean;
  download_access_granted: boolean;
  tracks: DownloadableTrack[];
};
