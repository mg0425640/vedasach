'use client';

import PolicyLayout from '@/components/shared/PolicyLayout';

export default function DisclaimerPage() {
  return (
    <PolicyLayout
      title={{ en: 'Disclaimer', hi: 'अस्वीकरण' }}
      icon="alert"
      sections={[
        {
          title: { en: 'General Information Only', hi: 'केवल सामान्य जानकारी' },
          body: {
            en: 'All content on VedaWell is provided for general informational and educational purposes only. It is not intended to be a substitute for professional advice, diagnosis, treatment, or any form of formal guidance. We do not guarantee the accuracy, completeness, reliability, or timeliness of any information on this site. Any reliance you place on such information is strictly at your own risk. Always conduct your own research and due diligence before acting on any information found here.',
            hi: 'VedaWell पर सभी सामग्री केवल सामान्य सूचनात्मक और शैक्षिक उद्देश्यों के लिए प्रदान की जाती है। इसका उद्देश्य पेशेवर सलाह, निदान, उपचार, या किसी भी प्रकार की औपचारिक मार्गदर्शन का विकल्प नहीं है। हम इस साइट पर किसी भी जानकारी की सटीकता, पूर्णता, विश्वसनीयता, या समयबद्धता की गारंटी नहीं देते। ऐसी जानकारी पर आपकी कोई भी निर्भरता पूरी तरह से आपके अपने जोखिम पर है। यहां मिली किसी भी जानकारी पर कार्रवाई करने से पहले हमेशा अपना शोध और परिश्रम करें।',
          },
        },
        {
          title: { en: 'Medical and Health Disclaimer', hi: 'चिकित्सा और स्वास्थ्य अस्वीकरण' },
          body: {
            en: 'The health, nutrition, Ayurveda, yoga, and wellness content on VedaWell is not medical advice. Never disregard professional medical advice or delay seeking it because of something you read here. Always consult a qualified healthcare provider before starting any diet, exercise, supplement, or wellness program. If you think you may have a medical condition, contact a doctor immediately. Do not use this information to self-diagnose or self-treat any condition.',
            hi: 'VedaWell पर स्वास्थ्य, पोषण, आयुर्वेद, योग और वेलनेस सामग्री चिकित्सा सलाह नहीं है। यहां पढ़ी गई किसी भी बात के कारण पेशेवर चिकित्सा सलाह को कभी अनदेखा न करें या उसे लेने में देरी न करें। किसी भी आहार, व्यायाम, सप्लीमेंट, या वेलनेस कार्यक्रम को शुरू करने से पहले हमेशा एक योग्य स्वास्थ्य सेवा प्रदाता से परामर्श करें। यदि आपको लगता है कि आपको कोई चिकित्सीय स्थिति हो सकती है, तो तुरंत डॉक्टर से संपर्क करें। किसी भी स्थिति के आत्म-निदान या आत्म-उपचार के लिए इस जानकारी का उपयोग न करें।',
          },
        },
        {
          title: { en: 'Ayurvedic and Herbal Information', hi: 'आयुर्वेदिक और हर्बल जानकारी' },
          body: {
            en: 'Ayurvedic remedies and herbal information are based on traditional knowledge and ancient texts. Results vary based on individual body constitution (Prakriti), dosha imbalance, and lifestyle. These remedies may interact with medications. Always consult a qualified Ayurvedic practitioner (BAMS doctor) before starting any herbal treatment. We do not claim that Ayurvedic remedies cure, treat, or prevent any disease unless backed by scientific evidence.',
            hi: 'आयुर्वेदिक उपचार और हर्बल जानकारी पारंपरिक ज्ञान और प्राचीन ग्रंथों पर आधारित है। परिणाम व्यक्तिगत शारीरिक संविधान (प्रकृति), दोष असंतुलन और जीवनशैली के आधार पर भिन्न होते हैं। ये उपचार दवाओं के साथ परस्पर क्रिया कर सकते हैं। किसी भी हर्बल उपचार को शुरू करने से पहले हमेशा एक योग्य आयुर्वेदिक चिकित्सक (BAMS डॉक्टर) से परामर्श करें। हम दावा नहीं करते कि आयुर्वेदिक उपचार किसी भी बीमारी को ठीक, उपचार या रोकते हैं जब तक कि वैज्ञानिक साक्ष्य द्वारा समर्थित न हो।',
          },
        },
        {
          title: { en: 'Dream Interpretations and Spiritual Content', hi: 'स्वप्न व्याख्या और आध्यात्मिक सामग्री' },
          body: {
            en: 'Dream interpretations, astrology, Vastu, and spiritual content are based on traditional, cultural, and symbolic frameworks. These interpretations are subjective and for entertainment and self-reflection purposes only. They are not scientifically validated and should not be used as a basis for major life decisions. VedaWell does not endorse any supernatural claims and presents this content as cultural knowledge, not as factual truth.',
            hi: 'स्वप्न व्याख्या, ज्योतिष, वास्तु और आध्यात्मिक सामग्री पारंपरिक, सांस्कृतिक और प्रतीकात्मक ढांचे पर आधारित हैं। ये व्याख्याएं व्यक्तिपरक हैं और केवल मनोरंजन और आत्म-चिंतन उद्देश्यों के लिए हैं। इन्हें वैज्ञानिक रूप से मान्यता प्राप्त नहीं है और इन्हें बड़े जीवन निर्णयों के आधार के रूप में उपयोग नहीं किया जाना चाहिए। VedaWell किसी भी अलौकिक दावे का समर्थन नहीं करता और इस सामग्री को सांस्कृतिक ज्ञान के रूप में प्रस्तुत करता है, न कि तथ्यात्मक सत्य के रूप में।',
          },
        },
        {
          title: { en: 'Product Claims and Purchases', hi: 'उत्पाद दावे और खरीद' },
          body: {
            en: 'Product descriptions, ingredient lists, and claims on our shop are based on information provided by manufacturers. We do not manufacture products ourselves. Product results may vary based on individual use, body type, and lifestyle. We are not liable for any adverse reactions from product use. Always read product labels and consult a healthcare provider before using any wellness product, especially if you are pregnant, nursing, or on medication.',
            hi: 'हमारे शॉप पर उत्पाद विवरण, सामग्री सूची और दावे निर्माताओं द्वारा प्रदान की गई जानकारी पर आधारित हैं। हम स्वयं उत्पाद निर्मित नहीं करते। उत्पाद परिणाम व्यक्तिगत उपयोग, शारीरिक प्रकार और जीवनशैली के आधार पर भिन्न हो सकते हैं। हम उत्पाद उपयोग से किसी भी प्रतिकूल प्रतिक्रिया के लिए उत्तरदायी नहीं हैं। किसी भी वेलनेस उत्पाद का उपयोग करने से पहले हमेशा उत्पाद लेबल पढ़ें और स्वास्थ्य सेवा प्रदाता से परामर्श करें, विशेष रूप से यदि आप गर्भवती, स्तनपान करा रही हैं, या दवा पर हैं।',
          },
        },
        {
          title: { en: 'User Responsibility', hi: 'उपयोगकर्ता की जिम्मेदारी' },
          body: {
            en: 'You are solely responsible for how you use the information and products from VedaWell. You agree to: conduct thorough research before acting on any information; consult qualified professionals for medical, legal, or financial matters; verify product suitability for your specific needs; follow all product instructions and warnings; and not hold VedaWell liable for any consequences arising from your use of our content or products. By using this website, you acknowledge that you have read and understood this disclaimer.',
            hi: 'आप VedaWell से प्राप्त जानकारी और उत्पादों का उपयोग करने के तरीके के लिए पूरी तरह से जिम्मेदार हैं। आप सहमत हैं: किसी भी जानकारी पर कार्रवाई करने से पहले पूरी तरह से शोध करने; चिकित्सा, कानूनी या वित्तीय मामलों के लिए योग्य पेशेवरों से परामर्श करने; अपनी विशिष्ट आवश्यकताओं के लिए उत्पाद उपयुक्तता सत्यापित करने; सभी उत्पाद निर्देशों और चेतावनियों का पालन करने; और हमारी सामग्री या उत्पादों के उपयोग से उत्पन्न किसी भी परिणाम के लिए VedaWell को उत्तरदायी नहीं ठहराने के लिए। इस वेबसाइट का उपयोग करके, आप स्वीकार करते हैं कि आपने इस अस्वीकरण को पढ़ और समझ लिया है।',
          },
        },
        {
          title: { en: 'External Links and Third-Party Content', hi: 'बाहरी लिंक और तृतीय-पक्ष सामग्री' },
          body: {
            en: 'Our website may contain links to third-party websites and content. We have no control over the nature, content, and availability of those sites. Inclusion of any links does not necessarily imply endorsement. We are not responsible for the accuracy, privacy practices, or content of any third-party websites. Visiting external links is at your own risk.',
            hi: 'हमारी वेबसाइट में तृतीय-पक्ष वेबसाइटों और सामग्री के लिंक हो सकते हैं। हमारे पास उन साइटों की प्रकृति, सामग्री और उपलब्धता पर कोई नियंत्रण नहीं है। किसी भी लिंक को शामिल करना जरूरी नहीं कि समर्थन का तात्पर्य हो। हम किसी भी तृतीय-पक्ष वेबसाइटों की सटीकता, गोपनीयता प्रथाओं, या सामग्री के लिए जिम्मेदार नहीं हैं। बाहरी लिंक पर जाना आपके अपने जोखिम पर है।',
          },
        },
        {
          title: { en: 'No Warranty', hi: 'कोई वारंटी नहीं' },
          body: {
            en: 'VedaWell provides all content and services "as is" without any warranties, express or implied. We do not warrant that the website will be error-free, uninterrupted, secure, or that defects will be corrected. We make no warranties regarding the accuracy, reliability, or completeness of any content. Your use of the website is at your sole discretion and risk.',
            hi: 'VedaWell सभी सामग्री और सेवाएं "जैसी हैं" बिना किसी वारंटी, व्यक्त या निहित प्रदान करता है। हम वारंटी नहीं करते कि वेबसाइट त्रुटि-मुक्त, निर्बाध, सुरक्षित होगी, या दोषों को सुधारा जाएगा। हम किसी भी सामग्री की सटीकता, विश्वसनीयता, या पूर्णता के बारे में कोई वारंटी नहीं देते। वेबसाइट का आपका उपयोग आपके विवेक और जोखिम पर है।',
          },
        },
      ]}
    />
  );
}
