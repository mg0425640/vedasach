'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPolicyPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="border-b border-[#E8E8E8] pb-6 mb-8">
          <h1 className="font-display text-3xl font-bold text-[#111]">
            {lang === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}
          </h1>
          <p className="text-sm text-[#999] font-body mt-2">
            {lang === 'hi' ? 'अंतिम अपडेट: जुलाई 2024' : 'Last updated: July 2024'}
          </p>
        </div>

        <div className="prose prose-sm max-w-none font-body text-[#444] space-y-6">
          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? '1. जानकारी का संग्रह' : '1. Information Collection'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'हम आपकी व्यक्तिगत जानकारी तब एकत्र करते हैं जब आप हमारी वेबसाइट पर पंजीकरण करते हैं, कोई उत्पाद खरीदते हैं, या हमारे संपर्क फ़ॉर्म के माध्यम से संवाद करते हैं। इसमें आपका नाम, ईमेल पता, फोन नंबर, शिपिंग पता और पेमेंट विवरण शामिल हो सकते हैं।'
                : 'We collect your personal information when you register on our website, purchase products, or communicate through our contact form. This may include your name, email address, phone number, shipping address, and payment details.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? '2. जानकारी का उपयोग' : '2. Use of Information'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'हम आपकी जानकारी का उपयोग निम्नलिखित उद्देश्यों के लिए करते हैं: आपके ऑर्डर को प्रोसेस करना, हमारी सेवाओं में सुधार करना, आपको मार्केटिंग संचार भेजना (आपकी सहमति से), और कानूनी आवश्यकताओं का पालन करना।'
                : 'We use your information for the following purposes: processing your orders, improving our services, sending you marketing communications (with your consent), and complying with legal requirements.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? '3. कुकीज़' : '3. Cookies'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'हम आपकी ब्राउज़िंग अनुभव को बेहतर बनाने के लिए कुकीज़ का उपयोग करते हैं। कुकीज़ छोटी डेटा फ़ाइलें हैं जो आपकी प्राथमिकताओं को याद रखने में मदद करती हैं। आप अपने ब्राउज़र सेटिंग्स से कुकीज़ को अक्षम कर सकते हैं, लेकिन इससे कुछ सुविधाओं पर प्रभाव पड़ सकता है।'
                : 'We use cookies to enhance your browsing experience. Cookies are small data files that help remember your preferences. You can disable cookies through your browser settings, but this may affect some features.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? '4. डेटा सुरक्षा' : '4. Data Security'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'हम आपकी जानकारी की सुरक्षा के लिए उचित तकनीकी और संगठनात्मक उपाय करते हैं। हमारी वेबसाइट SSL एन्क्रिप्शन का उपयोग करती है और हम नियमित रूप से हमारी सुरक्षा प्रणालियों की समीक्षा करते हैं।'
                : 'We implement appropriate technical and organizational measures to protect your information. Our website uses SSL encryption and we regularly review our security systems.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? '5. तीसरे पक्ष की सेवाएं' : '5. Third-Party Services'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'हम Google Analytics और Google AdSense का उपयोग करते हैं। ये सेवाएं आपकी ऑनलाइन गतिविधि पर डेटा एकत्र कर सकती हैं। कृपया इनकी गोपनीयता नीतियों की समीक्षा करें।'
                : 'We use Google Analytics and Google AdSense. These services may collect data about your online activity. Please review their privacy policies.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? '6. आपके अधिकार' : '6. Your Rights'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'आपको अपनी व्यक्तिगत डेटा तक पहुंचने, इसे सुधारने या हटाने का अधिकार है। किसी भी संबंधित अनुरोध के लिए हमसे support@vedasach.in पर संपर्क करें।'
                : 'You have the right to access, correct, or delete your personal data. Contact us at support@vedasach.in for any related requests.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? '7. संपर्क' : '7. Contact'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'इस गोपनीयता नीति के बारे में किसी भी प्रश्न के लिए, कृपया हमसे संपर्क करें: support@vedasach.in'
                : 'For any questions about this privacy policy, please contact us: support@vedasach.in'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
