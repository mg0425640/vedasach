'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function DisclaimerPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="border-b border-[#E8E8E8] pb-6 mb-8">
          <h1 className="font-display text-3xl font-bold text-[#111]">
            {lang === 'hi' ? 'अस्वीकरण' : 'Disclaimer'}
          </h1>
          <p className="text-sm text-[#999] font-body mt-2">
            {lang === 'hi' ? 'अंतिम अपडेट: जुलाई 2024' : 'Last updated: July 2024'}
          </p>
        </div>

        <div className="prose prose-sm max-w-none font-body text-[#444] space-y-6">
          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? 'चिकित्सा अस्वीकरण' : 'Medical Disclaimer'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'vedasach पर प्रदान की गई जानकारी केवल सूचनात्मक उद्देश्यों के लिए है और यह पेशेवर चिकित्सा सलाक्ष, निदान, या उपचार का विकल्प नहीं है। किसी भी चिकित्सीय स्थिति के लिए हमेशा अपने चिकित्सक या अन्य योग्य स्वास्थ्य सेवा प्रदाता की सलाह लें।'
                : 'The information provided on vedasach is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider for any medical condition.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? 'आयुर्वेदिक जानकारी' : 'Ayurvedic Information'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'आयुर्वेद संबंधी लेख और सामग्री पारंपरिक ज्ञान पर आधारित हैं। परिणाम व्यक्ति के शारीरिक संविधान (प्रकृति) के आधार पर भिन्न हो सकते हैं। किसी भी आयुर्वेदिक उपचार शुरू करने से पहले योग्य आयुर्वेदिक चिकित्सक से परामर्श करें।'
                : 'Ayurveda articles and content are based on traditional knowledge. Results may vary depending on individual body constitution (prakriti). Consult a qualified Ayurvedic practitioner before starting any Ayurvedic treatment.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? 'स्वप्न विवेचन' : 'Dream Interpretations'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'स्वप्न विवेचन विषयक सामग्री व्याख्यात्मक और पारंपरिक है। स्वप्न व्यक्तिगत अनुभव हैं और हमारी व्याख्याएं सार्वभौमिक सत्य नहीं हैं। यह सामग्री मनोरंजन और आत्म-चिंतन के लिए है।'
                : 'Dream interpretation content is interpretive and traditional. Dreams are personal experiences and our interpretations are not universal truths. This content is for entertainment and self-reflection.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? 'उत्पाद दावे' : 'Product Claims'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'हमारे उत्पादों के बारे में जानकारी किसी विशेष बीमारी के इलाज, निदान या रोकथाम के लिए नहीं है। उत्पाद परिणाम व्यक्तिगत उपयोग और शारीरिक स्थिति के आधार पर भिन्न हो सकते हैं।'
                : 'Information about our products is not intended to treat, diagnose, or prevent any specific disease. Product results may vary based on individual use and physical condition.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? 'बाहरी लिंक' : 'External Links'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'हमारी वेबसाइट में तृतीय-पक्ष वेबसाइटों के लिंक हो सकते हैं। हम इन साइटों की सामग्री या गोपनीयता प्रथाओं के लिए जिम्मेदार नहीं हैं।'
                : 'Our website may contain links to third-party websites. We are not responsible for the content or privacy practices of these sites.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? 'सीमित वारंटी' : 'Limited Warranty'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'vedasach किसी भी प्रकार की वारंटी, व्यक्त या निहित, के साथ सेवाएं और सामग्री प्रदान करता है। हम सटीकता, पूर्णता, या विश्वसनीयता की गारंटी नहीं देते।'
                : 'vedasach provides services and content "as is" without any warranties, express or implied. We do not guarantee accuracy, completeness, or reliability.'}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#111] mb-3">
              {lang === 'hi' ? 'संपर्क' : 'Contact'}
            </h2>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'इस अस्वीकरण के बारे में किसी भी प्रश्न के लिए, कृपया हमसे संपर्क करें: support@vedasach.in'
                : 'For any questions regarding this disclaimer, please contact us: support@vedasach.in'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
