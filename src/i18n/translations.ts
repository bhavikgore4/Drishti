import { LanguageCode } from '../types';

export interface TranslationDictionary {
  topBar: {
    govtOfIndia: string;
    ministry: string;
    home: string;
    contactUs: string;
    aboutUs: string;
    faqs: string;
    siteMap: string;
    forecastMap: string;
    decreaseFont: string;
    resetFont: string;
    increaseFont: string;
    deptHindi: string;
    deptEnPrefix: string;
    deptName: string;
    portalSubtitle: string;
    drishtiBadge: string;
    drishtiSub: string;
    complianceTag: string;
  };
  navbar: {
    menu: string;
    language: string;
    selectLanguage: string;
    signIn: string;
  };
  hero: {
    slide1: {
      title1: string;
      title2: string;
      connectText: string;
      subText: string;
      desc: string;
      lodgeBtn: string;
      workflowBtn: string;
      citizensLabel: string;
      govtLabel: string;
    };
    slide2: {
      badge: string;
      titleMain: string;
      titleHighlight: string;
      indicPhrase: string;
      desc: string;
      voiceToolBadge: string;
      voiceToolName: string;
      startVoiceBtn: string;
      liveBot: string;
      liveSpeech: string;
    };
    slide3: {
      intro: string;
      title: string;
      question: string;
      opportunity: string;
      desc: string;
      fileAppealBtn: string;
      guidelinesBtn: string;
      step1Title: string;
      step1Desc: string;
      step2Title: string;
      step2Desc: string;
      step3Title: string;
      step3Desc: string;
    };
    slide4: {
      badge: string;
      title1: string;
      title2: string;
      question: string;
      lodgeBtn: string;
      step1: string;
      step2: string;
      step3: string;
      redirectionText: string;
    };
    slide5: {
      badge: string;
      title1: string;
      title2: string;
      indicPhrase: string;
      desc: string;
      sosBtn: string;
      forecastMapBtn: string;
      hotspotsTitle: string;
      activeTriage: string;
      floodCardTitle: string;
      floodCardLoc: string;
      floodCardStatus: string;
      cycloneCardTitle: string;
      cycloneCardLoc: string;
      cycloneCardStatus: string;
      helpline: string;
      tollFree: string;
    };
  };
  about: {
    title: string;
    para1: string;
    para2: string;
    notRedressedTitle: string;
    notRedressedItem1: string;
    notRedressedItem2: string;
    notRedressedItem3: string;
    notRedressedItem4Prefix: string;
    notRedressedItem4Link: string;
    notRedressedItem4Suffix: string;
    noteTitle: string;
    note1Prefix: string;
    note1OrgText: string;
    note1Mid: string;
    note1ClickHere: string;
    note1Suffix: string;
    note2: string;
  };
  whatsNew: {
    title: string;
    card1Day: string;
    card1MonthYear: string;
    card1Title: string;
    card2Day: string;
    card2MonthYear: string;
    card2Title: string;
    card3Day: string;
    card3MonthYear: string;
    card3Title: string;
  };
  actionCards: {
    card1Btn: string;
    card2Btn: string;
    card3Btn: string;
  };
  ticker: {
    advisoryBadge: string;
    mainWarning: string;
    emergencyHotline: string;
  };
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    topBar: {
      govtOfIndia: 'Government of India',
      ministry: 'Ministry of Personnel, Public Grievances & Pensions',
      home: 'Home',
      contactUs: 'Contact Us',
      aboutUs: 'About Us',
      faqs: 'FAQs/Help',
      siteMap: 'Site Map',
      forecastMap: 'Forecast Map',
      decreaseFont: 'Decrease font size',
      resetFont: 'Reset font size',
      increaseFont: 'Increase font size',
      deptHindi: 'प्रशासनिक सुधार और लोक शिकायत विभाग',
      deptEnPrefix: 'DEPARTMENT OF',
      deptName: 'ADMINISTRATIVE REFORMS & DISASTER GRIEVANCES',
      portalSubtitle: 'DRISHTI - Disaster & Public Grievance Management System',
      drishtiBadge: 'DRISHTI',
      drishtiSub: 'Centralized Disaster & Grievance Redress Platform',
      complianceTag: 'GIGW 3.0 & DPDP Act 2023 Compliant Portal',
    },
    navbar: {
      menu: 'Menu',
      language: 'Language :',
      selectLanguage: 'Select Language / भाषा',
      signIn: 'Sign In',
    },
    hero: {
      slide1: {
        title1: 'CITIZEN CENTRIC',
        title2: 'GOVERNANCE',
        connectText: 'WAY TO CONNECT',
        subText: 'CITIZENS WITH THE GOVERNMENT',
        desc: 'Direct AI-assisted grievance redressal, multi-tier escalation, and real-time SLA tracking connecting 1.4 Billion citizens directly with nodal authorities.',
        lodgeBtn: 'Lodge Public Grievance',
        workflowBtn: 'Explore Workflow',
        citizensLabel: 'CITIZENS',
        govtLabel: 'GOVERNMENT',
      },
      slide2: {
        badge: 'Next-Gen Voice & Regional Language Filing',
        titleMain: 'NOW THE GRIEVANCE CAN BE LODGED JUST BY',
        titleHighlight: 'VOICE BASED UTILITY TOOL',
        indicPhrase: 'अब आप अपनी शिकायत बोलचाल के माध्यम से आसानी से दर्ज कर सकते हैं।',
        desc: 'Empowering citizens with low digital literacy. Speak in English, Hindi, or Marathi to automatically categorize and lodge complaints.',
        voiceToolBadge: 'Drishti Smart Voice',
        voiceToolName: 'SAMADHAN MITRA AI',
        startVoiceBtn: 'Start Voice Complaint',
        liveBot: 'AI VOICE BOT',
        liveSpeech: 'Live Speech-to-Text',
      },
      slide3: {
        intro: 'Introducing',
        title: 'Appeal Mechanism',
        question: 'Not Satisfied with redress of your grievance?',
        opportunity: 'One time opportunity to raise your concern with Nodal Appellate Authority',
        desc: 'View Final Status and rate us appropriately to file your appeal within 30 days of resolution.',
        fileAppealBtn: 'File First Appeal',
        guidelinesBtn: 'Appeal Guidelines',
        step1Title: '1. Unsatisfied',
        step1Desc: 'Rate resolution below benchmark',
        step2Title: '2. Joint Secretary',
        step2Desc: 'Independent Senior Officer Review',
        step3Title: '3. Final Redressal',
        step3Desc: 'Direct Binding Decision Issued',
      },
      slide4: {
        badge: 'Redress Process Flow',
        title1: 'Citizen Lodges',
        title2: 'Complaint',
        question: 'ARE YOU AGGRIEVED WITH THE SERVICES OF GOVERNMENT AGENCY?',
        lodgeBtn: 'LODGE YOUR GRIEVANCE HERE',
        step1: 'COMPLAINT LODGE',
        step2: 'AI ASSESSMENT',
        step3: 'REDRESSAL',
        redirectionText: 'Redirection to Concerned Authority & Nodal Officer',
      },
      slide5: {
        badge: '24x7 Disaster Rapid Relief Desk',
        title1: 'AI-DRIVEN DISASTER &',
        title2: 'EMERGENCY GRIEVANCE DESK',
        indicPhrase: 'Report emergency relief and rescue assistance during floods, landslides, or cyclones.',
        desc: 'Direct geo-tagged reporting synchronized with National Disaster Management Authority (NDMA), State SDRF, and district emergency operations centers for zero-delay triage.',
        sosBtn: 'Report Disaster Emergency (SOS)',
        forecastMapBtn: 'View Forecast Map',
        hotspotsTitle: 'Live Incident Hotspots',
        activeTriage: 'ACTIVE TRIAGE',
        floodCardTitle: 'Flood Relief / District Cell',
        floodCardLoc: 'Assam & Bihar Basin',
        floodCardStatus: 'Under Review',
        cycloneCardTitle: 'Cyclone Warning & Shelter',
        cycloneCardLoc: 'Coastal Odisha & AP',
        cycloneCardStatus: 'Deployed',
        helpline: 'Helpline: 1078 / 1905',
        tollFree: 'Toll-Free',
      },
    },
    about: {
      title: 'ABOUT DRISHTI',
      para1:
        'Drishti (Disaster & Public Grievance Management System) is an advanced AI-assisted online platform available to the citizens 24x7 to lodge their grievances and emergency disaster alerts to the public authorities on any subject related to service delivery. It is a single portal connected to all the Ministries/Departments of Government of India and States. Every Ministry and States have role-based access to this system. Drishti is also accessible to the citizens through standalone mobile application downloadable through Google Play store and mobile application integrated with UMANG.',
      para2:
        "The status of the grievance filed in Drishti can be tracked with the unique registration ID provided at the time of registration of the complainant. Drishti also provides appeal facility to the citizens if they are not satisfied with the resolution by the Grievance Officer. After closure of grievance if the complainant is not satisfied with the resolution, he/she can provide feedback. If the rating is 'Poor' the option to file an appeal is enabled. The status of the Appeal can also be tracked by the petitioner with the grievance registration number.",
      notRedressedTitle: 'Issues which are not taken up for redress :',
      notRedressedItem1: 'RTI Matters',
      notRedressedItem2: 'Court related / Subjudice matters',
      notRedressedItem3: 'Religious matters',
      notRedressedItem4Prefix:
        'Grievances of Government employees concerning their service matters including disciplinary proceedings etc. unless the aggrieved employee has already exhausted the prescribed channels keeping in view the ',
      notRedressedItem4Link: 'DoPT OM No. 11013/08/2013-Estt.(A-III) dated 31.08.2015',
      notRedressedItem4Suffix: '.',
      noteTitle: 'Note :',
      note1Prefix:
        'If you have not got a satisfactory redress of your grievance within a reasonable period of time,relating to ',
      note1OrgText: 'Ministries/Departments and Organisations',
      note1Mid: ' under the purview of Directorate of Public Grievances(DPG), Cabinet Secretariat, GOI, you may seek help of DPG in resolution. Please ',
      note1ClickHere: 'click here',
      note1Suffix: ' for details.',
      note2:
        'Government is not charging fee from the public for filing grievances. All money being paid by the public for filing grievance is going only to M/s CSC only',
    },
    whatsNew: {
      title: "WHAT'S NEW",
      card1Day: '27',
      card1MonthYear: 'JULY 2026',
      card1Title:
        'Strengthening of Machinery for Redressal of Public Grievance (Drishti / CPGRAMS) (PDF - 1.05 MB)',
      card2Day: '15',
      card2MonthYear: 'AUGUST 2026',
      card2Title:
        'Comprehensive Guidelines for Handling the Public Grievances & AI Escalation (PDF - 0.25 MB)',
      card3Day: '04',
      card3MonthYear: 'SEPTEMBER 2026',
      card3Title:
        'Standard Operating Procedure for Indic Voice-Based Lodging on Drishti (PDF - 0.78 MB)',
    },
    actionCards: {
      card1Btn: 'REGISTER / LOGIN',
      card2Btn: 'VIEW STATUS',
      card3Btn: 'CONTACT US',
    },
    ticker: {
      advisoryBadge: 'Important Advisory / सूचना :',
      mainWarning:
        'Any Grievance sent by email will not be attended to / entertained. Please lodge your grievance on this portal.',
      emergencyHotline: 'For Emergency Disaster Relocation & Relief Call Toll-Free 1078 / 1905.',
    },
  },
  hi: {
    topBar: {
      govtOfIndia: 'भारत सरकार',
      ministry: 'कार्मिक, लोक शिकायत और पेंशन मंत्रालय',
      home: 'होम',
      contactUs: 'संपर्क करें',
      aboutUs: 'हमारे बारे में',
      faqs: 'एफएक्यू / सहायता',
      siteMap: 'साइट मैप',
      forecastMap: 'पूर्वानुमान मानचित्र',
      decreaseFont: 'फ़ॉन्ट आकार घटाएं',
      resetFont: 'फ़ॉन्ट आकार रीसेट करें',
      increaseFont: 'फ़ॉन्ट आकार बढ़ाएं',
      deptHindi: 'प्रशासनिक सुधार और लोक शिकायत विभाग',
      deptEnPrefix: 'DEPARTMENT OF',
      deptName: 'ADMINISTRATIVE REFORMS & DISASTER GRIEVANCES',
      portalSubtitle: 'दृष्टि - आपदा एवं लोक शिकायत प्रबंधन प्रणाली',
      drishtiBadge: 'दृष्टि (DRISHTI)',
      drishtiSub: 'केंद्रीकृत आपदा एवं लोक शिकायत निवारण मंच',
      complianceTag: 'GIGW 3.0 एवं DPDP अधिनियम 2023 अनुपालक पोर्टल',
    },
    navbar: {
      menu: 'मेन्यू',
      language: 'भाषा :',
      selectLanguage: 'भाषा चुनें / Select Language',
      signIn: 'साइन इन',
    },
    hero: {
      slide1: {
        title1: 'नागरिक केंद्रित',
        title2: 'सुशासन',
        connectText: 'नागरिकों को सरकार से',
        subText: 'जोड़ने का सशक्त माध्यम',
        desc: 'प्रत्यक्ष AI-सहायता प्राप्त शिकायत निवारण, बहुस्तरीय एस्केलेशन एवं रियल-टाइम ट्रैकिंग जो 140 करोड़ नागरिकों को सीधे नोडल प्राधिकारियों से जोड़ती है।',
        lodgeBtn: 'लोक शिकायत दर्ज करें',
        workflowBtn: 'कार्यप्रवाह देखें',
        citizensLabel: 'नागरिक',
        govtLabel: 'सरकार',
      },
      slide2: {
        badge: 'अगली पीढ़ी की आवाज एवं क्षेत्रीय भाषा फाइलिंग',
        titleMain: 'अब आप केवल अपनी आवाज से अपनी शिकायत',
        titleHighlight: 'वॉइस आधारित टूल द्वारा दर्ज कर सकते हैं',
        indicPhrase: 'अब आप अपनी शिकायत बोलचाल के माध्यम से आसानी से दर्ज कर सकते हैं।',
        desc: 'डिजिटल साक्षरता की सीमा से परे, हिंदी, अंग्रेजी अथवा मराठी में बोलकर सीधे शिकायत पंजीकृत कराएं।',
        voiceToolBadge: 'दृष्टि स्मार्ट वॉइस',
        voiceToolName: 'समाधान मित्र AI',
        startVoiceBtn: 'आवाज से शिकायत शुरू करें',
        liveBot: 'AI वॉइस बॉट',
        liveSpeech: 'लाइव स्पीच-टू-टेक्स्ट',
      },
      slide3: {
        intro: 'प्रस्तुत है',
        title: 'अपील निवारण तंत्र',
        question: 'क्या आप अपनी शिकायत के निवारण से संतुष्ट नहीं हैं?',
        opportunity: 'नोडल अपीलीय प्राधिकारी के समक्ष अपनी चिंता उठाने का एकमुश्त अवसर',
        desc: 'अंतिम स्थिति देखें और समाधान के 30 दिनों के भीतर अपनी पहली अपील दर्ज करें।',
        fileAppealBtn: 'प्रथम अपील दायर करें',
        guidelinesBtn: 'अपील दिशानिर्देश',
        step1Title: '1. असंतुष्ट',
        step1Desc: 'समाधान को रेटिंग दें',
        step2Title: '2. संयुक्त सचिव',
        step2Desc: 'वरिष्ठ अधिकारी द्वारा स्वतंत्र समीक्षा',
        step3Title: '3. अंतिम निवारण',
        step3Desc: 'बाध्यकारी अंतिम निर्णय जारी',
      },
      slide4: {
        badge: 'निवारण प्रक्रिया प्रवाह',
        title1: 'नागरिक द्वारा',
        title2: 'शिकायत पंजीकरण',
        question: 'क्या आप किसी सरकारी एजेंसी की सेवाओं से व्यथित हैं?',
        lodgeBtn: 'अपनी शिकायत यहाँ दर्ज करें',
        step1: 'शिकायत दर्ज',
        step2: 'AI मूल्यांकन',
        step3: 'निवारण',
        redirectionText: 'संबंधित प्राधिकारी एवं नोडल अधिकारी को प्रेषण',
      },
      slide5: {
        badge: '24x7 आपदा त्वरित राहत प्रकोष्ठ',
        title1: 'AI-संचालित आपदा एवं',
        title2: 'आपातकालीन शिकायत डेस्क',
        indicPhrase: 'बाढ़, चक्रवात या भूस्खलन में तत्काल राहत और बचाव सहायता दर्ज करें।',
        desc: 'राष्ट्रीय आपदा प्रबंधन प्राधिकरण (NDMA), राज्य SDRF और जिला आपातकालीन केंद्रों के साथ समन्वित त्वरित सहायता प्रणाली।',
        sosBtn: 'आपदा आपातकाल रिपोर्ट करें (SOS)',
        forecastMapBtn: 'पूर्वानुमान मानचित्र देखें',
        hotspotsTitle: 'सक्रिय आपातकालीन क्षेत्र',
        activeTriage: 'सक्रिय निवारण',
        floodCardTitle: 'बाढ़ राहत / जिला प्रकोष्ठ',
        floodCardLoc: 'असम एवं बिहार बेसिन',
        floodCardStatus: 'समीक्षाधीन',
        cycloneCardTitle: 'चक्रवात चेतावनी व आश्रय',
        cycloneCardLoc: 'तटीय ओडिशा व आंध्र प्रदेश',
        cycloneCardStatus: 'तैनात',
        helpline: 'हेल्पलाइन: 1078 / 1905',
        tollFree: 'टोल-फ्री',
      },
    },
    about: {
      title: 'दृष्टि के बारे में',
      para1:
        'दृष्टि (आपदा एवं लोक शिकायत प्रबंधन और निगरानी प्रणाली) नागरिकों के लिए चौबीसों घंटे (24x7) उपलब्ध एक उन्नत AI-सहायता प्राप्त ऑनलाइन मंच है, जिसके माध्यम से वे सेवा वितरण से संबंधित किसी भी विषय पर लोक प्राधिकारियों को अपनी शिकायतें और आपातकालीन आपदा अलर्ट दर्ज कर सकते हैं। यह भारत सरकार और राज्यों के सभी मंत्रालयों/विभागों से जुड़ा हुआ एक एकल पोर्टल है। प्रत्येक मंत्रालय और राज्य के पास इस प्रणाली तक भूमिका-आधारित पहुंच है। दृष्टि नागरिकों के लिए स्टैंडअलोन मोबाइल एप्लिकेशन और उमंग (UMANG) के साथ भी उपलब्ध है।',
      para2:
        "दृष्टि में दर्ज की गई शिकायत की स्थिति को शिकायतकर्ता के पंजीकरण के समय प्रदान की गई विशिष्ट पंजीकरण आईडी (Registration ID) के साथ ट्रैक किया जा सकता है। दृष्टि नागरिकों को शिकायत अधिकारी के निवारण से संतुष्ट न होने पर अपील सुविधा भी प्रदान करता है। शिकायत के निस्तारण के बाद, यदि शिकायतकर्ता समाधान से असंतुष्ट है, तो वह फीडबैक दे सकता है। यदि रेटिंग 'खराब (Poor)' है, तो अपील दायर करने का विकल्प सक्षम हो जाता है। अपील की स्थिति को शिकायत पंजीकरण संख्या द्वारा भी ट्रैक किया जा सकता है।",
      notRedressedTitle: 'वे मामले जिनका निवारण नहीं किया जाता है :',
      notRedressedItem1: 'आरटीआई मामले (RTI Matters)',
      notRedressedItem2: 'अदालत से संबंधित / विचाराधीन मामले (Court related / Subjudice matters)',
      notRedressedItem3: 'धार्मिक मामले (Religious matters)',
      notRedressedItem4Prefix:
        'सरकारी कर्मचारियों की उनकी सेवा संबंधी मामलों की शिकायतें, जिसमें अनुशासनात्मक कार्यवाही आदि शामिल है, जब तक कि पीड़ित कर्मचारी ने ',
      notRedressedItem4Link: 'DoPT OM No. 11013/08/2013-Estt.(A-III) दिनांक 31.08.2015',
      notRedressedItem4Suffix: ' को ध्यान में रखते हुए निर्धारित चैनलों को पहले ही समाप्त न कर लिया हो।',
      noteTitle: 'नोट :',
      note1Prefix:
        'यदि आपको उचित समय के भीतर अपनी शिकायत का संतोषजनक निवारण नहीं मिला है, जो कि लोक शिकायत निदेशालय (DPG), कैबिनेट सचिवालय, भारत सरकार के दायरे में आने वाले ',
      note1OrgText: 'मंत्रालयों/विभागों और संगठनों',
      note1Mid: ' से संबंधित है, तो आप समाधान में DPG की मदद ले सकते हैं। विवरण के लिए कृपया ',
      note1ClickHere: 'यहाँ क्लिक करें',
      note1Suffix: '।',
      note2:
        'सरकार नागरिकों से शिकायत दर्ज करने के लिए कोई शुल्क नहीं ले रही है। शिकायत दर्ज करने के लिए जनता द्वारा भुगतान किया जाने वाला कोई भी शुल्क केवल सीएससी (M/s CSC) को सेवा शुल्क के रूप में जाता है।',
    },
    whatsNew: {
      title: 'नया क्या है',
      card1Day: '27',
      card1MonthYear: 'जुलाई 2026',
      card1Title:
        'लोक शिकायत निवारण तंत्र का सुदृढ़ीकरण (दृष्टि / CPGRAMS) (PDF - 1.05 MB)',
      card2Day: '15',
      card2MonthYear: 'अगस्त 2026',
      card2Title:
        'लोक शिकायतों के निपटारे एवं एआई एस्केलेशन के लिए व्यापक दिशानिर्देश (PDF - 0.25 MB)',
      card3Day: '04',
      card3MonthYear: 'सितंबर 2026',
      card3Title:
        'दृष्टि पर भारतीय भाषाओं में आवाज द्वारा शिकायत दर्ज करने की मानक संचालन प्रक्रिया (PDF - 0.78 MB)',
    },
    actionCards: {
      card1Btn: 'पंजीकरण / लॉगिन',
      card2Btn: 'स्थिति देखें',
      card3Btn: 'संपर्क करें',
    },
    ticker: {
      advisoryBadge: 'महत्वपूर्ण सूचना :',
      mainWarning:
        'ईमेल द्वारा भेजी गई किसी भी शिकायत पर विचार नहीं किया जाएगा। कृपया अपनी शिकायत केवल इसी पोर्टल पर दर्ज करें।',
      emergencyHotline:
        'आपदा राहत एवं त्वरित सहायता के लिए 24x7 हेल्पलाइन 1078 / 1905 पर संपर्क करें।',
    },
  },
  mr: {
    topBar: {
      govtOfIndia: 'भारत सरकार',
      ministry: 'कार्मिक, सार्वजनिक तक्रार आणि निवृत्तीवेतन मंत्रालय',
      home: 'मुख्यपृष्ठ',
      contactUs: 'संपर्क साधा',
      aboutUs: 'आमच्याबद्दल',
      faqs: 'वारंवार विचारले जाणारे प्रश्न / मदत',
      siteMap: 'साइट मॅप',
      forecastMap: 'हवामान व आपत्ती नकाशा',
      decreaseFont: 'फॉन्ट आकार कमी करा',
      resetFont: 'मूळ फॉन्ट आकार',
      increaseFont: 'फॉन्ट आकार वाढवा',
      deptHindi: 'प्रशासकीय सुधारणा आणि सार्वजनिक तक्रार निवारण विभाग',
      deptEnPrefix: 'DEPARTMENT OF',
      deptName: 'ADMINISTRATIVE REFORMS & DISASTER GRIEVANCES',
      portalSubtitle: 'दृष्टी - आपत्ती व सार्वजनिक तक्रार व्यवस्थापन प्रणाली',
      drishtiBadge: 'दृष्टी (DRISHTI)',
      drishtiSub: 'केंद्रीकृत आपत्ती व तक्रार निवारण व्यासपीठ',
      complianceTag: 'GIGW 3.0 आणि DPDP कायदा 2023 सुसंगत पोर्टल',
    },
    navbar: {
      menu: 'मेन्यू',
      language: 'भाषा :',
      selectLanguage: 'भाषा निवडा / Select Language',
      signIn: 'साइन इन करा',
    },
    hero: {
      slide1: {
        title1: 'नागरिक केंद्रित',
        title2: 'सुशासन',
        connectText: 'नागरिकांना थेट शासनाशी',
        subText: 'जोडणारा डिजिटल सेतू',
        desc: 'थेट AI-आधारित तक्रार निवारण, बहुस्तरीय पाठपुरावा आणि वेळेवर निकाल, जे १४० कोटी नागरिकांना थेट शासकीय नोडल अधिकाऱ्यांशी जोडते.',
        lodgeBtn: 'सार्वजनिक तक्रार नोंदवा',
        workflowBtn: 'प्रक्रिया कार्यप्रवाह पहा',
        citizensLabel: 'नागरिक',
        govtLabel: 'शासन',
      },
      slide2: {
        badge: 'आधुनिक व्हॉईस व प्रादेशिक भाषा तक्रार नोंदणी',
        titleMain: 'आता तुम्ही केवळ तुमच्या आवाजाद्वारे थेट',
        titleHighlight: 'व्हॉईस टूलच्या मदतीने तक्रार नोंदवू शकता',
        indicPhrase: 'मराठी, हिंदी किंवा इंग्रजीत बोलून सहज तक्रार नोंदवा.',
        desc: 'कमी डिजिटल साक्षरता असलेल्या नागरिकांसाठी विशेष सोय. मराठी, हिंदी किंवा इंग्रजीमध्ये बोलून त्वरित तक्रार दाखल करा.',
        voiceToolBadge: 'दृष्टी स्मार्ट व्हॉईस',
        voiceToolName: 'समाधान मित्र AI',
        startVoiceBtn: 'व्हॉईस तक्रार सुरू करा',
        liveBot: 'AI व्हॉईस बॉट',
        liveSpeech: 'थेट व्हॉईस-टू-टेक्स्ट',
      },
      slide3: {
        intro: 'सादर करत आहोत',
        title: 'अपील निवारण यंत्रणा',
        question: 'तुम्ही तुमच्या तक्रारीच्या निवारणाने समाधानी नाही का?',
        opportunity: 'नोडल अपील प्राधिकार्‍यांकडे दाद मागण्याची सुवर्णसंधी',
        desc: 'अंतिम निकाल पहा आणि निवारणाच्या ३० दिवसांच्या आत तुमची प्रथम अपील दाखल करा.',
        fileAppealBtn: 'प्रथम अपील दाखल करा',
        guidelinesBtn: 'अपील नियमावली',
        step1Title: '१. असमाधानी',
        step1Desc: 'निकालाला अभिप्राय द्या',
        step2Title: '२. सहसचिव',
        step2Desc: 'वरिष्ठ अधिकाऱ्यांद्वारे स्वतंत्र तपासणी',
        step3Title: '३. अंतिम निकाल',
        step3Desc: 'बंधनकारक अंतिम आदेश जारी',
      },
      slide4: {
        badge: 'तक्रार निवारण टप्पे',
        title1: 'नागरिकाद्वारे',
        title2: 'तक्रार नोंदणी',
        question: 'तुम्ही शासकीय सेवेतील अडचणींमुळे त्रस्त आहात का?',
        lodgeBtn: 'येथे तुमची तक्रार नोंदवा',
        step1: 'तक्रार नोंदणी',
        step2: 'AI मूल्यांकन',
        step3: 'निवारण',
        redirectionText: 'संबंधित प्राधिकारी व नोडल अधिकाऱ्यांकडे वर्ग',
      },
      slide5: {
        badge: '२४x७ आपत्कालीन जलद मदत कक्ष',
        title1: 'AI-चालित आपत्ती व',
        title2: 'आणीबाणी तक्रार कक्ष',
        indicPhrase: 'पूर, चक्रीवादळ किंवा दरड कोसळल्यास तातडीने मदत व बचाव कार्य नोंदवा.',
        desc: 'राष्ट्रीय आपत्ती व्यवस्थापन प्राधिकरण (NDMA) आणि राज्य आपत्ती प्रतिसाद दल (SDRF) यांच्याशी थेट जोडलेली प्रणाली.',
        sosBtn: 'आपत्ती आणीबाणी नोंदवा (SOS)',
        forecastMapBtn: 'हवामान अंदाज नकाशा पहा',
        hotspotsTitle: 'सक्रिय आपत्कालीन क्षेत्र',
        activeTriage: 'सक्रिय तपासणी',
        floodCardTitle: 'पूर मदत / जिल्हा कक्ष',
        floodCardLoc: 'असम व बिहार खोरे',
        floodCardStatus: 'तपासणी सुरू',
        cycloneCardTitle: 'चक्रीवादळ इशारा व निवारा',
        cycloneCardLoc: 'किनारपट्टी ओडिशा व आंध्र प्रदेश',
        cycloneCardStatus: 'तैनात',
        helpline: 'हेल्पलाइन: १०७८ / १९०५',
        tollFree: 'टोल-फ्री',
      },
    },
    about: {
      title: 'दृष्टी विषयी माहिती',
      para1:
        'दृष्टी (आपत्ती व सार्वजनिक तक्रार व्यवस्थापन प्रणाली) हे नागरिकांसाठी २४x७ उपलब्ध असलेले प्रगत AI-सहाय्यित ऑनलाइन व्यासपीठ आहे. याद्वारे नागरिक शासकीय सेवा वितरणाशी संबंधित कोणत्याही विषयावर सार्वजनिक प्राधिकरणांकडे आपल्या तक्रारी व आपत्कालीन अलर्ट नोंदवू शकतात. हे भारत सरकार आणि सर्व राज्य सरकारांच्या सर्व मंत्रालयांशी जोडलेले एकच पोर्टल आहे. प्रत्येक मंत्रालय आणि राज्याला या प्रणालीत भूमिका-आधारित प्रवेश आहे. दृष्टी नागरिकांसाठी स्वतंत्र मोबाइल ॲप आणि \'उमंग\' (UMANG) द्वारे देखील उपलब्ध आहे.',
      para2:
        "दृष्टी पोर्टलवर नोंदवलेल्या तक्रारीची स्थिती नोंदणीच्या वेळी मिळालेल्या युनिक रजिस्ट्रेशन आयडीद्वारे (Registration ID) तपासता येते. तक्रार निवारण अधिकाऱ्याच्या निर्णयाने समाधानी नसल्यास नागरिकांना अपील करण्याची सुविधाही दृष्टी उपलब्ध करून देते. तक्रार बंद झाल्यानंतर समाधानकारक निकाल न मिळाल्यास नागरिक अभिप्राय देऊ शकतात. रेटिंग 'असमाधानकारक (Poor)' असल्यास अपील करण्याचा पर्याय खुला होतो. तक्रारदार अर्जाच्या क्रमांकाने अपीलाची स्थितीही पाहू शकतात.",
      notRedressedTitle: 'ज्या बाबी निवारणासाठी स्वीकारल्या जात नाहीत :',
      notRedressedItem1: 'माहिती अधिकार (RTI) विषयक बाबी',
      notRedressedItem2: 'न्यायालयीन / न्यायप्रविष्ट प्रकरणे',
      notRedressedItem3: 'धार्मिक स्वरूपाच्या बाबी',
      notRedressedItem4Prefix:
        'शासकीय कर्मचाऱ्यांच्या सेवाविषयक तक्रारी, ज्यात शिस्तभंगाच्या कारवाईचा समावेश आहे; जोपर्यंत संबंधित कर्मचाऱ्याने ',
      notRedressedItem4Link: 'DoPT OM No. 11013/08/2013-Estt.(A-III) दिनांक 31.08.2015',
      notRedressedItem4Suffix: ' नुसार निर्धारित सर्व शासकीय मार्ग पूर्ण केलेले नसतील.',
      noteTitle: 'टीप :',
      note1Prefix:
        'जर तुम्हाला सार्वजनिक तक्रार संचालनालय (DPG), मंत्रिमंडळ सचिवालय, भारत सरकारच्या अखत्यारीतील ',
      note1OrgText: 'मंत्रालये/विभाग व संस्थांशी',
      note1Mid: ' संबंधित तक्रारीचे समाधानकारक निवारण योग्य मुदतीत मिळाले नसेल, तर तुम्ही DPG ची मदत घेऊ शकता. तपशीलासाठी कृपया ',
      note1ClickHere: 'येथे क्लिक करा',
      note1Suffix: '.',
      note2:
        'तक्रार नोंदवण्यासाठी सरकार नागरिकांकडून कोणतेही शुल्क घेत नाही. तक्रार नोंदणीसाठी नागरिकांनी दिलेले शुल्क केवळ सीएससी (M/s CSC) केंद्राला सेवा शुल्क म्हणून जाते.',
    },
    whatsNew: {
      title: 'नवीन काय आहे',
      card1Day: '27',
      card1MonthYear: 'जुलै २०२६',
      card1Title:
        'सार्वजनिक तक्रार निवारण यंत्रणेचे बळकटीकरण (दृष्टी / CPGRAMS) (PDF - १.०५ MB)',
      card2Day: '15',
      card2MonthYear: 'ऑगस्ट २०२६',
      card2Title:
        'सार्वजनिक तक्रारींची हाताळणी आणि AI एस्केलेशनसाठी सर्वसमावेशक मार्गदर्शक तत्त्वे (PDF - ०.२५ MB)',
      card3Day: '04',
      card3MonthYear: 'सप्टेंबर २०२६',
      card3Title:
        'दृष्टी पोर्टलवर प्रादेशिक भाषांमध्ये व्हॉईस तक्रार नोंदणीची प्रमाणित कार्यप्रणाली (PDF - ०.७८ MB)',
    },
    actionCards: {
      card1Btn: 'नोंदणी / लॉगिन करा',
      card2Btn: 'स्थिती तपासा',
      card3Btn: 'संपर्क साधा',
    },
    ticker: {
      advisoryBadge: 'महत्त्वाची सूचना :',
      mainWarning:
        'ईमेलद्वारे पाठवलेल्या कोणत्याही तक्रारीची दखल घेतली जाणार नाही. कृपया आपली तक्रार केवळ याच पोर्टलवर नोंदवा.',
      emergencyHotline:
        'आपत्कालीन मदत व तात्काळ साहाय्यासाठी २४x७ टोल-फ्री हेल्पलाइन १०७८ / १९०५ वर संपर्क साधा.',
    },
  },
};
