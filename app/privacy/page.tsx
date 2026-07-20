'use client';

import PolicyLayout from '@/components/shared/PolicyLayout';

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title={{ en: 'Privacy Policy', hi: 'गोपनीयता नीति' }}
      icon="shield"
      sections={[
        {
          title: { en: 'Information We Collect', hi: 'हम कौन सी जानकारी एकत्र करते हैं' },
          body: {
            en: 'We collect information you provide directly when you create an account, place an order, subscribe to our newsletter, or contact us. This includes your name, email address, phone number, shipping address, and payment information. We also automatically collect usage data such as IP address, browser type, pages visited, and time spent on our site through cookies and similar technologies.',
            hi: 'हम आपके द्वारा प्रदान की गई जानकारी एकत्र करते हैं जब आप खाता बनाते हैं, ऑर्डर देते हैं, न्यूज़लेटर सदस्यता लेते हैं, या हमसे संपर्क करते हैं। इसमें आपका नाम, ईमेल पता, फोन नंबर, शिपिंग पता और भुगतान जानकारी शामिल है। हम कुकीज़ और समान तकनीकों के माध्यम से IP पता, ब्राउज़र प्रकार, विज़िट किए गए पृष्ठ और साइट पर बिताए गए समय जैसे उपयोग डेटा को भी स्वचालित रूप से एकत्र करते हैं।',
          },
        },
        {
          title: { en: 'How We Use Your Information', hi: 'हम आपकी जानकारी का उपयोग कैसे करते हैं' },
          body: {
            en: 'We use your personal information to process orders, deliver products, send order confirmations, provide customer support, send newsletters (with your consent), improve our content and services, analyze user behavior, prevent fraud, and comply with legal obligations. We never sell your personal data to third parties.',
            hi: 'हम आपकी व्यक्तिगत जानकारी का उपयोग ऑर्डर प्रोसेस करने, उत्पाद डिलीवर करने, ऑर्डर पुष्टिकरण भेजने, ग्राहक सहायता प्रदान करने, न्यूज़लेटर भेजने (आपकी सहमति से), अपनी सामग्री और सेवाओं में सुधार करने, उपयोगकर्ता व्यवहार का विश्लेषण करने, धोखाधड़ी रोकने और कानूनी दायित्वों का पालन करने के लिए करते हैं। हम आपका व्यक्तिगत डेटा कभी तीसरे पक्ष को नहीं बेचते।',
          },
        },
        {
          title: { en: 'Cookies and Tracking Technologies', hi: 'कुकीज़ और ट्रैकिंग तकनीकें' },
          body: {
            en: 'We use cookies, web beacons, and similar technologies to remember your preferences, analyze traffic, serve personalized ads, and improve site functionality. Essential cookies are required for the site to function. Analytics cookies (Google Analytics) help us understand visitor behavior. Advertising cookies (Google AdSense) enable personalized ad delivery. You can manage cookie preferences through your browser settings or our cookie consent banner.',
            hi: 'हम आपकी प्राथमिकताओं को याद रखने, ट्रैफ़िक का विश्लेषण करने, व्यक्तिगत विज्ञापन दिखाने और साइट की कार्यक्षमता बेहतर बनाने के लिए कुकीज़, वेब बीकन और समान तकनीकों का उपयोग करते हैं। आवश्यक कुकीज़ साइट के काम करने के लिए जरूरी हैं। एनालिटिक्स कुकीज़ (Google Analytics) आगंतुक व्यवहार को समझने में मदद करती हैं। विज्ञापन कुकीज़ (Google AdSense) व्यक्तिगत विज्ञापन वितरण सक्षम बनाती हैं। आप अपने ब्राउज़र सेटिंग्स या हमारे कुकी सहमति बैनर के माध्यम से कुकी प्राथमिकताएँ प्रबंधित कर सकते हैं।',
          },
        },
        {
          title: { en: 'Data Sharing and Third Parties', hi: 'डेटा साझा करना और तृतीय पक्ष' },
          body: {
            en: 'We share your data only with trusted service providers who help us operate our business: payment processors (Razorpay), shipping partners, email service providers, cloud hosting (Supabase), and analytics platforms (Google). All third parties are bound by data processing agreements and must handle your data securely. We may also disclose data when required by law or to protect our legal rights.',
            hi: 'हम आपका डेटा केवल उन विश्वसनीय सेवा प्रदाताओं के साथ साझा करते हैं जो हमें अपना व्यवसाय चलाने में मदद करते हैं: भुगतान प्रोसेसर (Razorpay), शिपिंग पार्टनर, ईमेल सेवा प्रदाता, क्लाउड होस्टिंग (Supabase), और एनालिटिक्स प्लेटफ़ॉर्म (Google)। सभी तृतीय पक्ष डेटा प्रोसेसिंग समझौतों से बद्ध हैं और उन्हें आपका डेटा सुरक्षित रूप से संभालना होगा। कानून द्वारा आवश्यक होने पर या हमारे कानूनी अधिकारों की रक्षा के लिए भी हम डेटा प्रकट कर सकते हैं।',
          },
        },
        {
          title: { en: 'Data Security', hi: 'डेटा सुरक्षा' },
          body: {
            en: 'We implement industry-standard security measures including SSL/TLS encryption for all data transmissions, hashed passwords using bcrypt, secure payment processing via PCI-DSS compliant gateways, regular security audits, and restricted access controls. Despite these measures, no internet transmission is 100% secure, and we cannot guarantee absolute security.',
            hi: 'हम उद्योग-मानक सुरक्षा उपाय लागू करते हैं जिनमें सभी डेटा संचरण के लिए SSL/TLS एन्क्रिप्शन, bcrypt का उपयोग करके हैश किए गए पासवर्ड, PCI-DSS अनुपालन गेटवे के माध्यम से सुरक्षित भुगतान प्रोसेसिंग, नियमित सुरक्षा ऑडिट और प्रतिबंधित एक्सेस नियंत्रण शामिल हैं। इन उपायों के बावजूद, कोई भी इंटरनेट संचरण 100% सुरक्षित नहीं है, और हम पूर्ण सुरक्षा की गारंटी नहीं दे सकते।',
          },
        },
        {
          title: { en: 'Your Rights and Responsibilities', hi: 'आपके अधिकार और जिम्मेदारियां' },
          body: {
            en: 'You have the right to access your personal data, request corrections, request deletion of your account and data, export your data, opt out of marketing communications, and withdraw consent for data processing. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. To exercise any right, email support@vedawell.in.',
            hi: 'आपको अपने व्यक्तिगत डेटा तक पहुंचने, सुधार का अनुरोध करने, अपने खाते और डेटा को हटाने का अनुरोध करने, अपना डेटा निर्यात करने, विपणन संचार से बाहर निकलने, और डेटा प्रोसेसिंग के लिए सहमति वापस लेने का अधिकार है। आप अपने खाते क्रेडेंशियल की गोपनीयता बनाए रखने और अपने खाते के तहत सभी गतिविधियों के लिए जिम्मेदार हैं। किसी भी अधिकार का उपयोग करने के लिए, support@vedawell.in पर ईमेल करें।',
          },
        },
        {
          title: { en: 'Data Retention', hi: 'डेटा प्रतिधारण' },
          body: {
            en: 'We retain your personal data only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Account data is retained while your account is active. Order data is retained for 7 years per tax regulations. You may request deletion at any time.',
            hi: 'हम आपका व्यक्तिगत डेटा केवल इस नीति में उलिखित उद्देश्यों को पूरा करने, कानूनी दायित्वों का पालन करने, विवादों को सुलझाने और हमारे समझौतों को लागू करने के लिए आवश्यक समय तक रखते हैं। खाता डेटा आपके खाते के सक्रिय रहने तक रखा जाता है। ऑर्डर डेटा कर नियमों के अनुसार 7 वर्षों तक रखा जाता है। आप किसी भी समय हटाने का अनुरोध कर सकते हैं।',
          },
        },
        {
          title: { en: 'Children Privacy', hi: 'बाल गोपनीयता' },
          body: {
            en: 'Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us immediately and we will delete it.',
            hi: 'हमारी सेवाएं 13 वर्ष से कम उम्र के बच्चों के लिए निर्देशित नहीं हैं। हम जानबूझकर 13 वर्ष से कम उम्र के बच्चों से व्यक्तिगत जानकारी एकत्र नहीं करते। यदि आपको लगता है कि किसी बच्चे ने हमें व्यक्तिगत डेटा प्रदान किया है, तो कृपया तुरंत हमसे संपर्क करें और हम इसे हटा देंगे।',
          },
        },
        {
          title: { en: 'Changes to This Policy', hi: 'इस नीति में परिवर्तन' },
          body: {
            en: 'We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on this page and updating the "Last updated" date. We encourage you to review this page periodically. Continued use of our services after changes constitutes acceptance of the updated policy.',
            hi: 'हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। हम इस पृष्ठ पर अद्यतन नीति पोस्ट करके और "अंतिम अपडेट" तिथि को अपडेट करके महत्वपूर्ण परिवर्तनों की सूचना देंगे। हम आपको समय-समय पर इस पृष्ठ की समीक्षा करने के लिए प्रोत्साहित करते हैं। परिवर्तनों के बाद हमारी सेवाओं का लगातार उपयोग अद्यतन नीति की स्वीकृति माना जाएगा।',
          },
        },
      ]}
    />
  );
}
