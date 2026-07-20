'use client';

import PolicyLayout from '@/components/shared/PolicyLayout';

export default function TermsOfUsePage() {
  return (
    <PolicyLayout
      title={{ en: 'Terms of Use', hi: 'उपयोग की शर्तें' }}
      icon="file"
      sections={[
        {
          title: { en: 'Acceptance of Terms', hi: 'शर्तों की स्वीकृति' },
          body: {
            en: 'By accessing and using VedaWell (vedawell.in), you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any part of these terms, please do not use our website or services. Your continued use of the site constitutes acceptance of these terms.',
            hi: 'VedaWell (vedawell.in) तक पहुंचने और इसका उपयोग करके, आप इन उपयोग की शर्तों और सभी लागू कानूनों और नियमों से बद्ध होने के लिए सहमत होते हैं। यदि आप इन शर्तों के किसी भी हिस्से से सहमत नहीं हैं, तो कृपया हमारी वेबसाइट या सेवाओं का उपयोग न करें। साइट का लगातार उपयोग इन शर्तों की स्वीकृति माना जाता है।',
          },
        },
        {
          title: { en: 'User Responsibilities', hi: 'उपयोगकर्ता की जिम्मेदारियां' },
          body: {
            en: 'You are solely responsible for your use of the website and all content you submit. You agree to: provide accurate and complete information when creating an account; maintain the security and confidentiality of your account credentials; not impersonate another person or misrepresent your affiliation; not engage in any unlawful, harmful, fraudulent, infringing, or harassing activity; not upload viruses, malware, or harmful code; not scrape, copy, or redistribute our content without permission; not use automated systems to access the site; and comply with all applicable Indian and international laws.',
            hi: 'आप वेबसाइट के उपयोग और आपके द्वारा सबमिट की गई सभी सामग्री के लिए पूरी तरह से जिम्मेदार हैं। आप सहमत हैं: खाता बनाते समय सटीक और पूरी जानकारी प्रदान करने; अपने खाता क्रेडेंशियल की सुरक्षा और गोपनीयता बनाए रखने; किसी अन्य व्यक्ति का प्रतिरूप नहीं बनाने या अपने संबंध को गलत तरीके से प्रस्तुत नहीं करने; किसी भी गैरकानूनी, हानिकारक, धोखाधड़ी, उल्लंघनकारी या उत्पीड़न गतिविधि में शामिल नहीं होने; वायरस, मैलवेयर या हानिकारक कोड अपलोड नहीं करने; अनुमति के बिना हमारी सामग्री को स्क्रैप, कॉपी या पुनर्वितरित नहीं करने; साइट तक पहुंचने के लिए स्वचालित सिस्टम का उपयोग नहीं करने; और सभी लागू भारतीय और अंतर्राष्ट्रीय कानूनों का पालन करने के लिए।',
          },
        },
        {
          title: { en: 'Content and Intellectual Property', hi: 'सामग्री और बौद्धिक संपदा' },
          body: {
            en: 'All content on VedaWell — including articles, images, logos, designs, software, and branding — is owned by VedaWell or its content creators and is protected by Indian and international copyright laws. You may view and print content for personal, non-commercial use only. You may not reproduce, distribute, modify, display, or commercially exploit any content without prior written permission. User-generated content (comments, reviews) remains owned by the user, but you grant VedaWell a perpetual, royalty-free license to use, display, and distribute it.',
            hi: 'VedaWell पर सभी सामग्री — लेख, छवियां, लोगो, डिज़ाइन, सॉफ़्टवेयर और ब्रांडिंग सहित — VedaWell या इसके सामग्री निर्माताओं के स्वामित्व में है और भारतीय और अंतर्राष्ट्रीय कॉपीराइट कानूनों द्वारा सुरक्षित है। आप केवल व्यक्तिगत, गैर-व्यावसायिक उपयोग के लिए सामग्री देख और प्रिंट कर सकते हैं। आप पूर्व लिखित अनुमति के बिना किसी भी सामग्री को पुन: पेश नहीं कर सकते, वितरित नहीं कर सकते, संशोधित नहीं कर सकते, प्रदर्शित नहीं कर सकते या व्यावसायिक रूप से शोषण नहीं कर सकते। उपयोगकर्ता-जनित सामग्री (टिप्पणियां, समीक्षाएं) उपयोगकर्ता के स्वामित्व में रहती है, लेकिन आप VedaWell को इसका उपयोग, प्रदर्शन और वितरण के लिए सस्थायी, रॉयल्टी-मुक्त लाइसेंस प्रदान करते हैं।',
          },
        },
        {
          title: { en: 'Product Purchases and Orders', hi: 'उत्पाद खरीद और ऑर्डर' },
          body: {
            en: 'When you purchase products from VedaWell, you agree to provide accurate shipping and payment information. All orders are subject to availability and confirmation. Prices are listed in Indian Rupees (INR) and include applicable taxes. We reserve the right to refuse or cancel any order. Payment is processed securely through Razorpay. You will receive an order confirmation email after successful payment. Delivery timelines are estimates and may vary due to external factors.',
            hi: 'जब आप VedaWell से उत्पाद खरीदते हैं, तो आप सटीक शिपिंग और भुगतान जानकारी प्रदान करने के लिए सहमत होते हैं। सभी ऑर्डर उपलब्धता और पुष्टिकरण के अधीन हैं। मूल्य भारतीय रुपये (INR) में सूचीबद्ध हैं और लागू करों को शामिल करते हैं। हम किसी भी ऑर्डर को अस्वीकार या रद्द करने का अधिकार सुरक्षित रखते हैं। भुगतान Razorpay के माध्यम से सुरक्षित रूप से प्रोसेस किया जाता है। सफल भुगतान के बाद आपको ऑर्डर पुष्टिकरण ईमेल प्राप्त होगा। डिलीवरी समय-सीमा अनुमानित हैं और बाहरी कारकों के कारण भिन्न हो सकती हैं।',
          },
        },
        {
          title: { en: 'Refunds, Returns, and Cancellations', hi: 'रिफंड, रिटर्न और रद्दीकरण' },
          body: {
            en: 'We offer returns within 7 days of delivery for unopened, unused products in original packaging. Refunds are processed within 7-10 business days to the original payment method. Perishable items, personal care products, and items marked as non-returnable are not eligible. Cancellation before shipping is allowed with full refund. For return requests, contact support@vedawell.in with your order ID. Shipping charges are non-refundable unless the return is due to our error.',
            hi: 'हम मूल पैकेजिंग में अनोपन्ड, अप्रयुक्त उत्पादों की डिलीवरी के 7 दिनों के भीतर रिटर्न प्रदान करते हैं। रिफंड मूल भुगतान विधि पर 7-10 व्यावसायिक दिनों के भीतर प्रोसेस किए जाते हैं। जोखिम वस्तुएं, व्यक्तिगत देखभाल उत्पाद और गैर-वापसी योग्य के रूप में चिह्नित वस्तुएं पात्र नहीं हैं। शिपिंग से पहले रद्दीकरण पूर्ण रिफंड के साथ अनुमत है। रिटर्न अनुरोधों के लिए, अपने ऑर्डर ID के साथ support@vedawell.in पर संपर्क करें। शिपिंग शुल्क गैर-वापसी योग्य हैं जब तक कि रिटर्न हमारी त्रुटि के कारण न हो।',
          },
        },
        {
          title: { en: 'Disclaimer of Liability', hi: 'दायित्व का अस्वीकरण' },
          body: {
            en: 'VedaWell provides content for informational and educational purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment. We are not liable for any damages arising from the use of our content or products. Our total liability for any claim is limited to the amount you paid for the product or service in question. We do not guarantee uninterrupted or error-free website access.',
            hi: 'VedaWell केवल सूचनात्मक और शैक्षिक उद्देश्यों के लिए सामग्री प्रदान करता है। इसका उद्देश्य पेशेवर चिकित्सा सलाह, निदान या उपचार का विकल्प नहीं है। हमारी सामग्री या उत्पादों के उपयोग से उत्पन्न किसी भी क्षति के लिए हम उत्तरदायी नहीं हैं। किसी भी दावे के लिए हमारी कुल दायित्व आपके द्वारा उत्पाद या सेवा के लिए भुगतान की गई राशि तक सीमित है। हम निर्बाध या त्रुटि-मुक्त वेबसाइट एक्सेस की गारंटी नहीं देते।',
          },
        },
        {
          title: { en: 'User-Generated Content', hi: 'उपयोगकर्ता-जनित सामग्री' },
          body: {
            en: 'Users may post comments, reviews, and other content. You are responsible for your submissions and must not post content that is illegal, defamatory, infringing, or violates others rights. We reserve the right to moderate, edit, or remove any user content at our discretion without prior notice. Repeat violators may have their accounts terminated.',
            hi: 'उपयोगकर्ता टिप्पणियां, समीक्षाएं और अन्य सामग्री पोस्ट कर सकते हैं। आप अपनी सबमिशन के लिए जिम्मेदार हैं और ऐसी सामग्री पोस्ट नहीं करनी चाहिए जो गैरकानूनी, मानहानिकारक, उल्लंघनकारी या अन्य अधिकारों का उल्लंघन करती हो। हम अपने विवेक पर पूर्व सूचना के बिना किसी भी उपयोगकर्ता सामग्री को मॉडरेट, संपादित या हटाने का अधिकार सुरक्षित रखते हैं। बार-बार उल्लंघन करने वालों के खाते समाप्त किए जा सकते हैं।',
          },
        },
        {
          title: { en: 'Termination', hi: 'समाप्ति' },
          body: {
            en: 'We may suspend or terminate your account and access to our services at any time, with or without cause, and without prior notice. Upon termination, all licenses granted to you cease immediately. You may delete your account at any time through your dashboard settings. Sections on liability, intellectual property, and dispute resolution survive termination.',
            hi: 'हम किसी भी समय, किसी भी कारण या बिना कारण के, पूर्व सूचना के बिना आपके खाते और हमारी सेवाओं तक पहुंच को निलंबित या समाप्त कर सकते हैं। समाप्ति पर, आपको दिए गए सभी लाइसेंस तुरंत समाप्त हो जाते हैं। आप किसी भी समय अपने डैशबोर्ड सेटिंग्स के माध्यम से अपना खाता हटा सकते हैं। दायित्व, बौद्धिक संपदा और विवाद समाधान पर अनुभाग समाप्ति के बाद भी जारी रहते हैं।',
          },
        },
        {
          title: { en: 'Governing Law and Disputes', hi: 'शासित कानून और विवाद' },
          body: {
            en: 'These terms are governed by the laws of India. Any disputes arising from these terms or your use of VedaWell shall be subject to the exclusive jurisdiction of the courts in Delhi, India. We encourage resolving disputes through informal negotiation first. If unresolved within 30 days, disputes may be submitted to arbitration under the Arbitration and Conciliation Act, 1996.',
            hi: 'इन शर्तों पर भारत के कानून शासित हैं। इन शर्तों या VedaWell के आपके उपयोग से उत्पन्न किसी भी विवाद पर दिल्ली, भारत की अदालतों के विशेष क्षेत्राधिकार के अधीन होंगे। हम पहले अनौपचारिक वार्ता के माध्यम से विवादों को हल करने के लिए प्रोत्साहित करते हैं। यदि 30 दिनों के भीतर अनसुलझा रहे, तो विवादों को मध्यस्थता और सामंजस्य अधिनियम, 1996 के तहत मध्यस्थता के लिए प्रस्तुत किया जा सकता है।',
          },
        },
      ]}
    />
  );
}
