export type Lang = 'en' | 'hi';

export const t: Record<string, Record<Lang, string>> = {
  // Header
  home: { en: 'Home', hi: 'होम' },
  dreams: { en: 'Dream Meanings', hi: 'स्वप्न अर्थ' },
  health: { en: 'Health', hi: 'स्वास्थ्य' },
  ayurveda: { en: 'Ayurveda', hi: 'आयुर्वेद' },
  yoga: { en: 'Yoga', hi: 'योग' },
  beauty: { en: 'Beauty', hi: 'सौंदर्य' },
  blog: { en: 'Blog', hi: 'ब्लॉग' },
  shop: { en: 'Shop', hi: 'शॉप' },
  login: { en: 'Login', hi: 'लॉगिन' },
  logout: { en: 'Logout', hi: 'लॉगआउट' },
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },

  // Auth
  welcome_back: { en: 'Welcome Back', hi: 'वापस स्वागत है' },
  login_subtitle: { en: 'Sign in to your vedasach account', hi: 'अपने वेदावेल खाते में साइन इन करें' },
  username_or_email: { en: 'Username or Email', hi: 'यूज़रनेम या ईमेल' },
  password: { en: 'Password', hi: 'पासवर्ड' },
  sign_in: { en: 'Sign In', hi: 'साइन इन करें' },
  create_account: { en: 'Create Account', hi: 'खाता बनाएं' },
  forgot_password: { en: 'Forgot Password?', hi: 'पासवर्ड भूल गए?' },
  or_continue_with: { en: 'Or continue with', hi: 'या इससे जारी रखें' },
  login_with_google: { en: 'Continue with Google', hi: 'Google से जारी रखें' },
  no_account: { en: "Don't have an account?", hi: 'खाता नहीं है?' },
  already_account: { en: 'Already have an account?', hi: 'पहले से खाता है?' },
  back_to_login: { en: 'Back to Login', hi: 'लॉगिन पर वापस' },

  // Signup
  join_vedasach: { en: 'Join vedasach', hi: 'वेदावेल से जुड़ें' },
  signup_subtitle: { en: 'Create your free wellness account', hi: 'अपना मुफ्त वेलनेस खाता बनाएं' },
  full_name: { en: 'Full Name', hi: 'पूरा नाम' },
  email: { en: 'Email Address', hi: 'ईमेल पता' },
  username: { en: 'Username', hi: 'यूज़रनेम' },
  mobile: { en: 'Mobile Number', hi: 'मोबाइल नंबर' },
  confirm_password: { en: 'Confirm Password', hi: 'पासवर्ड की पुष्टि करें' },
  register: { en: 'Create Account', hi: 'खाता बनाएं' },

  // Forgot Password
  reset_password: { en: 'Reset Password', hi: 'पासवर्ड रीसेट करें' },
  reset_subtitle: { en: 'Enter your email and we will send reset instructions', hi: 'अपना ईमेल दर्ज करें, हम रीसेट निर्देश भेजेंगे' },
  send_reset: { en: 'Send Reset Request', hi: 'रीसेट अनुरोध भेजें' },

  // Dashboard
  my_profile: { en: 'My Profile', hi: 'मेरी प्रोफ़ाइल' },
  my_orders: { en: 'My Orders', hi: 'मेरे ऑर्डर' },
  my_addresses: { en: 'Saved Addresses', hi: 'सहेजे पते' },
  wishlist: { en: 'Wishlist', hi: 'विशलिस्ट' },
  refund_status: { en: 'Refund Status', hi: 'रिफ़ंड स्थिति' },
  messages: { en: 'Messages', hi: 'संदेश' },
  notifications: { en: 'Notifications', hi: 'सूचनाएं' },

  // Cookie
  cookie_title: { en: 'We Value Your Privacy', hi: 'हम आपकी गोपनीयता को महत्व देते हैं' },
  cookie_text: { en: 'We use cookies to enhance your browsing experience, serve personalized content and ads, and analyze our traffic.', hi: 'हम आपके ब्राउज़िंग अनुभव को बेहतर बनाने, व्यक्तिगत सामग्री और विज्ञापन दिखाने के लिए कुकीज़ का उपयोग करते हैं।' },
  accept_all: { en: 'Accept All', hi: 'सभी स्वीकार करें' },
  necessary_only: { en: 'Necessary Only', hi: 'केवल आवश्यक' },
  decline: { en: 'Decline', hi: 'अस्वीकार' },

  // General
  search: { en: 'Search', hi: 'खोजें' },
  search_placeholder: { en: 'Search wellness topics...', hi: 'वेलनेस विषय खोजें...' },
  trending: { en: 'Trending', hi: 'ट्रेंडिंग' },
  featured: { en: 'Featured', hi: 'विशेष' },
  read_more: { en: 'Read More', hi: 'और पढ़ें' },
  view_all: { en: 'View All', hi: 'सभी देखें' },
  load_more: { en: 'Load More', hi: 'और लोड करें' },
  subscribe: { en: 'Subscribe', hi: 'सब्सक्राइब करें' },
  newsletter_title: { en: 'The vedasach Newsletter', hi: 'वेदावेल न्यूज़लेटर' },
  newsletter_subtitle: { en: 'Wellness wisdom delivered every week', hi: 'हर हफ्ते वेलनेस ज्ञान' },

  // Categories
  explore_topics: { en: 'Explore Topics', hi: 'विषय खोजें' },
  featured_stories: { en: 'Featured Stories', hi: 'विशेष कहानियां' },
  latest_articles: { en: 'Latest Articles', hi: 'नवीनतम लेख' },
  wellness_shop: { en: 'Wellness Shop', hi: 'वेलनेस शॉप' },
  ayurvedic_herbs: { en: 'Ayurvedic Herbs', hi: 'आयुर्वेदिक जड़ी-बूटियां' },

  // Status
  email_pending: { en: 'Email Verification Pending', hi: 'ईमेल सत्यापन लंबित' },
  mobile_pending: { en: 'Mobile Verification Pending', hi: 'मोबाइल सत्यापन लंबित' },
  verified: { en: 'Verified', hi: 'सत्यापित' },

  // Orders
  order_status_pending: { en: 'Pending', hi: 'लंबित' },
  order_status_confirmed: { en: 'Confirmed', hi: 'पुष्टि' },
  order_status_dispatched: { en: 'Dispatched', hi: 'भेजा गया' },
  order_status_delivered: { en: 'Delivered', hi: 'डिलीवर' },
  order_status_cancelled: { en: 'Cancelled', hi: 'रद्द' },
  track_order: { en: 'Track Order', hi: 'ऑर्डर ट्रैक करें' },
  cancel_order: { en: 'Cancel Order', hi: 'ऑर्डर रद्द करें' },
  cancel_reason: { en: 'Reason for Cancellation', hi: 'रद्दीकरण का कारण' },
};

export function translate(key: string, lang: Lang): string {
  return t[key]?.[lang] || t[key]?.['en'] || key;
}
