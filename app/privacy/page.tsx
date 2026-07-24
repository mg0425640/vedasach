'use client';

import React from 'react';
import PolicyLayout from '@/components/shared/PolicyLayout';
import { Printer } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdatedDate = 'July 1, 2026';
  const effectiveDate = 'July 1, 2026';

  const handlePrint = () => {
    window.print();
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy | Vedasach',
    description: 'Privacy Policy outlining how Vedasach collects, uses, and protects your personal data.',
    datePublished: '2026-07-01',
    dateModified: '2026-07-01',
    publisher: {
      '@type': 'Organization',
      name: 'Vedasach',
      url: 'https://www.vedasach.com',
      logo: 'https://www.vedasach.com/logo.png',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="relative">
        <div className="max-w-4xl mx-auto px-4 pt-6 flex justify-between items-center print:hidden">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span>Effective Date: <strong>{effectiveDate}</strong></span>
            <span className="mx-2">•</span>
            <span>Last Updated: <strong>{lastUpdatedDate}</strong></span>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            aria-label="Print Policy"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>

        <div className="[&_h1]:text-white">
          <PolicyLayout
            title={{
              en: 'Privacy Policy',
              hi: 'गोपनीयता नीति',
            }}
            icon="shield"
            sections={[
              {
                title: { en: 'Introduction & Scope', hi: 'परिचय और दायरा' },
                body: {
                  en: `Welcome to Vedasach ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website vedasach.com or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.`,
                  hi: `वेदासच ("हम", "हमारा") में आपका स्वागत है। हम आपकी गोपनीयता का सम्मान करते हैं और आपके व्यक्तिगत डेटा की सुरक्षा के लिए प्रतिबद्ध हैं। यह गोपनीयता नीति बताती है कि जब आप हमारी वेबसाइट vedasach.com पर जाते हैं या हमारी सेवाओं का उपयोग करते हैं तो हम आपकी जानकारी कैसे एकत्र करते हैं, उसका उपयोग करते हैं, उसका खुलासा करते हैं और उसकी सुरक्षा करते हैं। कृपया इस गोपनीयता नीति को ध्यान से पढ़ें। यदि आप इस गोपनीयता नीति की शर्तों से सहमत नहीं हैं, तो कृपया साइट तक न पहुँचें।`,
                },
              },
              {
                title: { en: 'Information We Collect', hi: 'हम कौन सी जानकारी एकत्र करते हैं' },
                body: {
                  en: 'We collect information you provide directly when you create an account, place an order, subscribe to our newsletter, or contact us. This includes your full name, email address, phone number, billing/shipping address, and secure payment metadata. We also automatically collect technical usage data such as IP address, browser type, device details, referring URLs, pages visited, and time spent on our site through cookies, web beacons, and similar tracking technologies.',
                  hi: 'हम आपके द्वारा प्रदान की गई जानकारी एकत्र करते हैं जब आप खाता बनाते हैं, ऑर्डर देते हैं, न्यूज़लेटर सदस्यता लेते हैं, या हमसे संपर्क करते हैं। इसमें आपका पूरा नाम, ईमेल पता, फोन नंबर, बिलिंग/शिपिंग पता और सुरक्षित भुगतान मेटाडेटा शामिल है। हम कुकीज़, वेब बीकन और समान तकनीकों के माध्यम से आईपी पता, ब्राउज़र प्रकार, डिवाइस विवरण, संदर्भित यूआरएल, विज़िट किए गए पृष्ठ और साइट पर बिताए गए समय जैसे तकनीकी उपयोग डेटा को भी स्वचालित रूप से एकत्र करते हैं।',
                },
              },
              {
                title: { en: 'How We Use Your Information', hi: 'हम आपकी जानकारी का उपयोग कैसे करते हैं' },
                body: {
                  en: 'We use your personal information to process orders, deliver products, send order tracking confirmations, provide responsive customer support, send opted-in newsletters, optimize our content and UI/UX, analyze platform traffic trends, prevent fraudulent transactions, and comply with binding legal obligations. We never trade, rent, or sell your personal data to unauthorized third parties.',
                  hi: 'हम आपकी व्यक्तिगत जानकारी का उपयोग ऑर्डर प्रोसेस करने, उत्पाद डिलीवर करने, ऑर्डर ट्रैकिंग पुष्टिकरण भेजने, उत्तरदायी ग्राहक सहायता प्रदान करने, ऑप्ट-इन न्यूज़लेटर भेजने, हमारी सामग्री और यूआई/यूएक्स को अनुकूलित करने, प्लेटफ़ॉर्म ट्रैफ़िक रुझानों का विश्लेषण करने, धोखाधड़ी वाले लेनदेन को रोकने और कानूनी दायित्वों का पालन करने के लिए करते हैं। हम आपका व्यक्तिगत डेटा कभी भी अनधिकृत तीसरे पक्ष को व्यापार, किराए या बेचते नहीं हैं।',
                },
              },
              {
                title: { en: 'Cookies and Tracking Technologies', hi: 'कुकीज़ और ट्रैकिंग तकनीकें' },
                body: {
                  en: 'We use cookies, web beacons, and similar tracking frameworks to remember user preferences, analyze aggregate traffic metrics, serve personalized advertisements, and ensure core site functionality. Essential cookies are required for basic site operations. Analytics cookies (such as Google Analytics) help us understand user navigation patterns. Advertising cookies (such as Google AdSense) enable tailored ad delivery. You retain the right to manage or disable cookie configurations via your browser preferences or our cookie consent banner.',
                  hi: 'हम उपयोगकर्ता प्राथमिकताओं को याद रखने, कुल ट्रैफ़िक मेट्रिक्स का विश्लेषण करने, व्यक्तिगत विज्ञापन परोसने और कोर साइट कार्यक्षमता सुनिश्चित करने के लिए कुकीज़, वेब बीकन और समान ट्रैकिंग फ्रेमवर्क का उपयोग करते हैं। बुनियादी साइट संचालन के लिए आवश्यक कुकीज़ आवश्यक हैं। एनालिटिक्स कुकीज़ (जैसे Google Analytics) हमें उपयोगकर्ता नेविगेशन पैटर्न को समझने में मदद करती हैं। विज्ञापन कुकीज़ (जैसे Google AdSense) अनुकूलित विज्ञापन वितरण सक्षम करती हैं। आपके पास अपने ब्राउज़र प्राथमिकताओं या हमारी कुकी सहमति बैनर के माध्यम से कुकी कॉन्फ़िगरेशन को प्रबंधित या अक्षम करने का अधिकार है।',
                },
              },
              {
                title: { en: 'Data Sharing and Subprocessors', hi: 'डेटा साझा करना और सबप्रोसेसर' },
                body: {
                  en: 'We share your personal data exclusively with trusted third-party service providers bound by strict data processing agreements to support our operations: payment processors (e.g., Razorpay), logistics and shipping partners, email communication services, cloud infrastructure hosts (e.g., Supabase), and analytics tools (e.g., Google). Additionally, we may disclose your details if mandated by law, court order, or to defend our legal rights.',
                  hi: 'हम हमारे संचालन का समर्थन करने के लिए कड़े डेटा प्रोसेसिंग समझौतों से बंधे विश्वसनीय तृतीय-पक्ष सेवा प्रदाताओं के साथ विशेष रूप से आपका व्यक्तिगत डेटा साझा करते हैं: भुगतान प्रोसेसर (जैसे Razorpay), रसद और शिपिंग पार्टनर, ईमेल संचार सेवाएँ, क्लाउड इन्फ्रास्ट्रक्चर होस्ट (जैसे Supabase), और एनालिटिक्स टूल (जैसे Google)। इसके अलावा, कानून, अदालत के आदेश द्वारा अनिवार्य होने पर, या हमारे कानूनी अधिकारों की रक्षा के लिए हम आपका विवरण प्रकट कर सकते हैं।',
                },
              },
              {
                title: { en: 'Data Security Measures', hi: 'डेटा सुरक्षा उपाय' },
                body: {
                  en: 'We enforce robust industry-standard security protocols, including end-to-end SSL/TLS encryption for all data in transit, cryptographic password hashing via bcrypt, tokenized payment processing through PCI-DSS certified gateways, periodic security reviews, and strict role-based access restrictions. Despite these safeguards, no digital transmission over the internet is completely foolproof, and absolute security cannot be guaranteed.',
                  hi: 'हम पारगमन में सभी डेटा के लिए एंड-टू-एंड SSL/TLS एन्क्रिप्शन, bcrypt के माध्यम से क्रिप्टोग्राफिक पासवर्ड हैशिंग, PCI-DSS प्रमाणित गेटवे के माध्यम से टोकनयुक्त भुगतान प्रोसेसिंग, आवधिक सुरक्षा समीक्षा और कड़े भूमिका-आधारित एक्सेस प्रतिबंधों सहित मजबूत उद्योग-मानक सुरक्षा प्रोटोकॉल लागू करते हैं। इन सुरक्षा उपायों के बावजूद, इंटरनेट पर कोई भी डिजिटल संचरण पूरी तरह से मूर्खतापूर्ण नहीं है, और पूर्ण सुरक्षा की गारंटी नहीं दी जा सकती है।',
                },
              },
              {
                title: { en: 'Limitation of Liability & Disclaimer', hi: 'दायित्व की सीमा और अस्वीकरण' },
                body: {
                  en: 'While we strictly follow all safety rules, security standards, and regulatory guidelines to protect your data and platform experience, Vedasach, its directors, employees, and affiliates shall under no circumstances be held liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, profits, use, or goodwill, arising out of or in connection with your use of our website or services. Your use of our platform is entirely at your own risk.',
                  hi: 'यद्यपि हम आपके डेटा और प्लेटफ़ॉर्म अनुभव की सुरक्षा के लिए सभी सुरक्षा नियमों, सुरक्षा मानकों और विनियामक दिशानिर्देशों का कड़ाई से पालन करते हैं, फिर भी वेदासच, इसके निदेशक, कर्मचारी और सहयोगी किसी भी परिस्थिति में किसी भी अप्रत्यक्ष, आकस्मिक, विशेष, परिणामी या दंडात्मक नुकसान के लिए उत्तरदायी नहीं होंगे, जिसमें डेटा की हानि, लाभ, उपयोग या सद्भावना शामिल है, जो हमारी वेबसाइट या सेवाओं के आपके उपयोग से उत्पन्न या उसके संबंध में है। हमारे प्लेटफ़ॉर्म का आपका उपयोग पूरी तरह से आपके अपने जोखिम पर है।',
                },
              },
              {
                title: { en: 'Your Rights and Responsibilities', hi: 'आपके अधिकार और जिम्मेदारियां' },
                body: {
                  en: 'You hold full rights to access your personal profile data, request corrections to inaccuracies, request account and data erasure, export your stored data, opt out of promotional campaigns, and revoke prior consent for data processing. You remain responsible for maintaining account credential confidentiality and all actions performed under your account profile. To invoke any data rights, please contact us at support@vedasach.com.',
                  hi: 'आपके पास अपने व्यक्तिगत प्रोफ़ाइल डेटा तक पहुँचने, अशुद्धियों में सुधार का अनुरोध करने, खाता और डेटा विलोपन का अनुरोध करने, अपना संग्रहीत डेटा निर्यात करने, प्रचार अभियानों से बाहर निकलने और डेटा प्रोसेसिंग के लिए पूर्व सहमति को रद्द करने का पूरा अधिकार है। आप खाता क्रेडेंशियल गोपनीयता और आपके खाता प्रोफ़ाइल के तहत किए गए सभी कार्यों को बनाए रखने के लिए जिम्मेदार हैं। किसी भी डेटा अधिकार का आह्वान करने के लिए, कृपया support@vedasach.com पर संपर्क करें।',
                },
              },
              {
                title: { en: 'Data Retention Policy', hi: 'डेटा प्रतिधारण नीति' },
                body: {
                  en: 'We retain your personal records only for the duration necessary to satisfy the purposes specified within this policy, comply with mandatory statutory or tax compliance obligations (such as keeping financial transaction logs for up to 7 years), resolve active disputes, and enforce commercial agreements. Account records remain active while your user profile is functional, though you can request manual purging at any time.',
                  hi: 'हम आपके व्यक्तिगत रिकॉर्ड को केवल इस नीति के भीतर निर्दिष्ट उद्देश्यों को पूरा करने, अनिवार्य वैधानिक या कर अनुपालन दायित्वों (जैसे वित्तीय लेनदेन लॉग को 7 साल तक रखना) का पालन करने, सक्रिय विवादों को हल करने और वाणिज्यिक समझौतों को लागू करने के लिए आवश्यक अवधि के लिए रखते हैं। खाता रिकॉर्ड तब तक सक्रिय रहते हैं जब तक आपकी उपयोगकर्ता प्रोफ़ाइल कार्यात्मक होती है, हालांकि आप किसी भी समय मैन्युअल शुद्धिकरण का अनुरोध कर सकते हैं।',
                },
              },
              {
                title: { en: 'Childrens Privacy', hi: 'बाल गोपनीयता' },
                body: {
                  en: 'Our platform and digital services are not intentionally targeted or designed for children under the age of 13. We do not knowingly collect personal or tracking information from minors under 13. If you are a parent or guardian and suspect that your child has provided us with personal information, please reach out to us instantly so we can permanently delete it.',
                  hi: 'हमारा प्लेटफ़ॉर्म और डिजिटल सेवाएँ जानबूझकर 13 वर्ष से कम उम्र के बच्चों के लिए लक्षित या डिज़ाइन नहीं की गई हैं। हम 13 वर्ष से कम उम्र के नाबालिगों से जानबूझकर व्यक्तिगत या ट्रैकिंग जानकारी एकत्र नहीं करते हैं। यदि आप माता-पिता या अभिभावक हैं और आपको संदेह है कि आपके बच्चे ने हमें व्यक्तिगत जानकारी प्रदान की है, तो कृपया तुरंत हमसे संपर्क करें ताकि हम इसे स्थायी रूप से हटा सकें।',
                },
              },
              {
                title: { en: 'Changes to This Policy', hi: 'इस नीति में परिवर्तन' },
                body: {
                  en: `We may revise, amend, or update this Privacy Policy from time to time to accommodate evolving business practices or regulatory shifts. We will alert you regarding major updates by updating the "Last Updated" banner date above and posting a prominent notification on our platform. Continued usage of our services subsequent to any policy adjustments denotes your binding acceptance of the revised terms.`,
                  hi: `हम विकसित व्यावसायिक प्रथाओं या विनियामक बदलावों को समायोजित करने के लिए समय-समय पर इस गोपनीयता नीति को संशोधित, संशोधित या अपडेट कर सकते हैं। हम ऊपर "अंतिम अपडेट" बैनर तिथि को अपडेट करके और हमारे प्लेटफ़ॉर्म पर एक प्रमुख सूचना पोस्ट करके प्रमुख अपडेट के बारे में आपको सचेत करेंगे। किसी भी नीति समायोजन के बाद हमारी सेवाओं का निरंतर उपयोग संशोधित शर्तों की आपकी बाध्यकारी स्वीकृति को दर्शाता है।`,
                },
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}