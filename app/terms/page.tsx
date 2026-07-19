'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function TermsOfUsePage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="border-b border-[#E8E8E8] pb-6 mb-8">
          <h1 className="font-display text-3xl font-bold text-[#111]">
            {lang === 'hi' ? 'उपयोग की शर्तें' : 'Terms of Use'}
          </h1>
          <p className="text-sm text-[#999] font-body mt-2">
            {lang === 'hi' ? 'अंतिम अपडेट: जुलाई 2024' : 'Last updated: July 2024'}
          </p>
        </div>

        <div className="prose prose-sm max-w-none font-body text-[#444] space-y-6">
          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? '1. स्वीकृति' : '1. Acceptance'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'vedasach वेबसाइट और सेवाओं का उपयोग करके, आप इन उपयोग की शर्तों से बाध्य होने के लिए सहमत होते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया हमारी सेवाओं का उपयोग न करें।'
                : 'By using the vedasach website and services, you agree to be bound by these terms of use. If you do not agree with these terms, please do not use our services.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? '2. सेवाओं का उपयोग' : '2. Use of Services'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'आप हमारी सेवाओं का उपयोग केवल वैध उद्देश्यों के लिए कर सकते हैं। आप किसी भी गैरकानूनी, हानिकारक, या अनुचित गतिविधि में संलग्न नहीं हो सकते हैं। आप हमारे द्वारा प्रदान किए गए किसी भी सामग्री की नकल या वितरण नहीं कर सकते।'
                : 'You may use our services only for lawful purposes. You may not engage in any illegal, harmful, or improper activity. You may not copy or distribute any material provided by us.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? '3. बौद्धिक संपदा' : '3. Intellectual Property'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'vedasach पर सभी सामग्री, लोगो, और ब्रांडिंग हमारी बौद्धिक संपदा है। बिना हमारी लिखित अनुमति के इसका उपयोग या पुनरुत्पादन प्रतिबंधित है।'
                : 'All content, logos, and branding on vedasach is our intellectual property. Use or reproduction without our written permission is prohibited.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? '4. उत्पाद खरीद' : '4. Product Purchases'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'उत्पाद खरीदते समय, आप भुगतान करने और सही शिपिंग जानकारी प्रदान करने के लिए सहमत होते हैं। हम सही मूल्य, उपलब्धता, और विवरण प्रदान करने का प्रयास करते हैं, लेकिन त्रुटियां हो सकती हैं।'
                : 'When purchasing products, you agree to provide payment and accurate shipping information. We strive to provide accurate pricing, availability, and details, but errors may occur.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? '5. रिफंड और रिटर्न' : '5. Refunds and Returns'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'हमारी रिफंड और रिटर्न नीति उत्पाद के प्रकार के आधार पर भिन्न होती है। विस्तृत जानकारी के लिए व्यक्तिगत उत्पाद पृष्ठ देखें या हमारी सहायता टीम से संपर्क करें।'
                : 'Our refund and return policies vary by product type. Please see individual product pages for details or contact our support team.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? '6. सीमित दायित्व' : '6. Limitation of Liability'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'vedasach किसी भी परोक्ष, आकस्मिक, या परिणामी क्षति के लिए उत्तरदायी नहीं होगा। हमारी कुल दायित्व आपके द्वारा भुगतान की गई राशि तक सीमित है।'
                : 'vedasach shall not be liable for any indirect, incidental, or consequential damages. Our total liability is limited to the amount paid by you.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? '7. संशोधन' : '7. Modifications'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'हम किसी भी समय इन शर्तों को संशोधित करने का अधिकार सुरक्षित रखते हैं। जारी रखने से आप संशोधित शर्तों से सहमत माने जाएंगे।'
                : 'We reserve the right to modify these terms at any time. Continued use constitutes acceptance of the modified terms.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? '8. संपर्क' : '8. Contact'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'इन शर्तों के बारे में किसी भी प्रश्न के लिए, कृपया हमसे संपर्क करें: legal@vedasach.in'
                : 'For any questions regarding these terms, please contact us: legal@vedasach.in'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
