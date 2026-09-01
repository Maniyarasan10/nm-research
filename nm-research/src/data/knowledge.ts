/**
 * NM Research — RAG knowledge base.
 *
 * A curated, plain-language knowledge corpus grounding the site chatbot.
 * Each entry is a self-contained chunk with a rich `content`, `keywords`
 * (to improve lexical/embedding retrieval) and a `source` route so the
 * assistant can cite where the information lives.
 *
 * Keep these deliberately concise, factual and atomic — retrieval quality
 * improves with focused chunks rather than long walls of text.
 */

export interface KnowledgeDoc {
  id: string;
  category: string;
  title: string;
  content: string;
  source: string;
  linkLabel: string;
  keywords: string[];
  /**
   * Synonymous phrasings used by real users. These join `keywords` for
   * retrieval without polluting the keyword list shown to editorial review.
   */
  aliases?: string[];
}

export const knowledgeDocs: KnowledgeDoc[] = [
  {
    id: "about-org",
    category: "About",
    title: "What is NM Group of Industries and Research Foundation?",
    content:
      "NM Group of Industries and Research Foundation (NM Research) is a globally recognised research and innovation ecosystem. It empowers the next generation of scientists through end-to-end research services, publication support, PhD assistance and global conferences. It is founded by Dr. Mathivanan Nallathambi (M.Sc., Ph.D., PDF), Founder & CEO, and operates across India plus the USA, UK, Canada, Malaysia, Saudi Arabia, Singapore, Japan and the UAE, working with more than 150 academic and industry partners.",
    source: "/about",
    linkLabel: "About the Foundation",
    keywords: ["foundation", "who", "what", "organization", "institute", "nm", "research", "eco system", "who we are"],
    aliases: ["nm group of industries", "research foundation", "what is nm"],
  },
  {
    id: "founder",
    category: "About",
    title: "Who is the founder of NM Research?",
    content:
      "NM Research is founded and led by Dr. Mathivanan Nallathambi (M.Sc., Ph.D., PDF), who serves as Founder & CEO. The organisation name derives from his initials. For direct contact you can reach hello.nmassociation@gmail.com or call +91 8667334697.",
    source: "/about",
    linkLabel: "About the Founder",
    keywords: ["founder", "ceo", "mathivanan", "mathi", "director", "leader", "owner"],
    aliases: ["mathivanan nallathambi", "dr mathivanan", "founder and ceo"],
  },
  {
    id: "mission-values",
    category: "About",
    title: "What are NM Research's mission and values?",
    content:
      "NM Research's core values are Scientific Integrity, Research Excellence, Innovation First, Global Collaboration, Environmental Responsibility, Transparency, Youth Empowerment and Open Science. The foundation is built around empowering young researchers and building globally collaborative, environmentally responsible and transparent research.",
    source: "/about",
    linkLabel: "Our Values",
    keywords: ["mission", "values", "vision", "principles", "integrity", "excellence", "transparency"],
  },
  {
    id: "services-overview",
    category: "Services",
    title: "What services does NM Research provide?",
    content:
      "NM Research provides six main services: (1) Research Paper Writing — original research papers and review articles with editing and plagiarism checks; (2) Publication Support — for SCI, SCIE, Scopus, Web of Science and UGC CARE listed journals; (3) PhD Assistance — topic selection, literature review, methodology and thesis writing; (4) Research Consulting — free initial topic guidance and work-plan sessions; (5) Analytical Services — characterization and testing (XRD, SEM, TEM, FTIR, UV-Vis, BET, EIS, XPS); and (6) Global Conferences — international and national conferences, workshops and webinars.",
    source: "/services",
    linkLabel: "All Services",
    keywords: ["services", "offer", "what do you offer", "capabilities", "writing", "consulting", "analytical", "conferences", "publication"],
    aliases: ["all services", "what can you do", "features"],
  },
  {
    id: "service-writing",
    category: "Services",
    title: "Research paper writing service",
    content:
      "The research paper writing service helps you craft high-quality original research papers and comprehensive review articles with proper methodology and citations. It includes editing and plagiarism checking and covers Original Research, Review Papers, Editing and Plagiarism Check.",
    source: "/services/research-paper-writing",
    linkLabel: "Research Paper Writing",
    keywords: ["writing", "paper", "research paper", "review", "edit", "plagiarism", "manuscript"],
    aliases: ["write my paper", "write my research paper", "edit my paper", "manuscript help"],
  },
  {
    id: "service-publication",
    category: "Services",
    title: "Publication support service",
    content:
      "The publication support service gives complete guidance for publishing in internationally recognised journals including SCI, SCIE, Scopus, Web of Science and UGC CARE listed journals. NM targets more than 58 refereed journals across these indexes, with guidance on journal selection and manuscript submission. Publication support is included in the Platinum and Prime membership plans.",
    source: "/services/publication-support",
    linkLabel: "Publication Support",
    keywords: ["publish", "publication", "journal", "journal selection", "journal", "sci", "scopus", "web of science", "ugc", "impact factor", "58", "refereed", "index", "submit", "acceptance", "reject", "target", "indexed"],
    aliases: ["publish my paper", "submit a manuscript", "where can i publish", "journal submission"],
  },
  {
    id: "service-phd",
    category: "Services",
    title: "PhD assistance service",
    content:
      "The PhD assistance service provides comprehensive doctoral research support from topic selection through thesis writing, including literature review, methodology design and defence preparation. Topics covered include topic selection, literature review, methodology and thesis writing.",
    source: "/services/phd-assistance",
    linkLabel: "PhD Assistance",
    keywords: ["phd", "doctorate", "thesis", "dissertation", "defence", "literature review", "methodology", "research scholar", "ph.d.", "doctoral", "research proposal", "synopsis", "topic"],
    aliases: ["phd help", "ph.d.", "doctoral research", "thesis help"],
  },
  {
    id: "service-consulting",
    category: "Services",
    title: "Research consulting service",
    content:
      "The research consulting service offers free initial topic guidance and work-plan discussions, plus personalised consultancy sessions with domain experts for early-stage and advanced researchers. It includes free guidance, work plans and book publication support.",
    source: "/services/research-consulting",
    linkLabel: "Research Consulting",
    keywords: ["consult", "consulting", "guidance", "mentor", "mentoring", "work plan", "advisor", "topic selection"],
    aliases: ["research advisor", "guidance session", "book publication"],
  },
  {
    id: "service-analytical",
    category: "Services",
    title: "Analytical services",
    content:
      "The analytical services provide access to advanced characterization and analytical testing, including XRD, SEM, TEM, FTIR, UV-Vis, BET, EIS and XPS. Professional data analysis and interpretation is included with all analytical reports.",
    source: "/services/analytical-services",
    linkLabel: "Analytical Services",
    keywords: ["analytical", "characterization", "testing", "xrd", "sem", "tem", "ftir", "uv", "bet", "eis", "xps", "data analysis"],
    aliases: ["sample testing", "characterization testing"],
  },
  {
    id: "service-conferences",
    category: "Services",
    title: "Global conferences service",
    content:
      "The global conferences service organises and supports international and national research conferences, providing networking opportunities with researchers, industry leaders and academics worldwide. It covers international and national conferences, workshops and webinars.",
    source: "/services/global-conferences",
    linkLabel: "Global Conferences",
    keywords: ["conference", "conferences", "international", "national", "workshop", "webinar", "networking", "event", "paper presentation"],
    aliases: ["join a conference", "present at a conference"],
  },
  {
    id: "membership-overview",
    category: "Membership",
    title: "What membership plans does NM Research offer?",
    content:
      "NM Research offers three membership plans: Community (₹2,999/year), Platinum (₹29,999/year, most popular) and Prime (₹49,999/year). Community includes free authorships in a Scopus journal, conferences and webinars. Platinum adds SCI/Scopus publication support, more conferences, consultancy and PhD guidance. Prime is the top tier with 2 SCI/Scopus publications, more conferences, a dedicated research mentor and more.",
    source: "/membership",
    linkLabel: "Membership Plans",
    keywords: ["membership", "plan", "plans", "pricing", "price", "cost", "fee", "subscribe", "join", "community", "platinum", "prime"],
    aliases: ["membership plans at a glance", "plan tiers"],
  },
  {
    id: "membership-community",
    category: "Membership",
    title: "Community membership plan (₹2,999)",
    content:
      "The Community membership plan costs ₹2,999 per year. It includes free authorships in a Scopus journal, 1 international conference participation, 1 national conference participation, monthly research webinars and an NM Member Certificate.",
    source: "/membership/community",
    linkLabel: "Community Plan",
    keywords: ["community", "2999", "cheapest", "basic", "entry", "scopus authorship", "certificate"],
    aliases: ["community plan"],
  },
  {
    id: "membership-platinum",
    category: "Membership",
    title: "Platinum membership plan (₹29,999)",
    content:
      "The Platinum membership plan costs ₹29,999 per year and is the most popular. It includes 1 SCI/Scopus publication support, 2 international conferences, research consultancy sessions, priority publication review, PhD guidance sessions and all Community benefits included.",
    source: "/membership/platinum",
    linkLabel: "Platinum Plan",
    keywords: ["platinum", "29999", "popular", "recommended", "sci", "scopus", "phd guidance", "best value"],
    aliases: ["platinum plan"],
  },
  {
    id: "membership-prime",
    category: "Membership",
    title: "Prime membership plan (₹49,999)",
    content:
      "The Prime membership plan costs ₹49,999 per year, the top tier. It includes 2 SCI/Scopus publication support, 3 international conferences, a dedicated research mentor, book publication assistance, analytical services discount and all Platinum benefits included.",
    source: "/membership/prime",
    linkLabel: "Prime Plan",
    keywords: ["prime", "49999", "premium", "highest", "top", "mentor", "dedicated", "best"],
    aliases: ["prime plan"],
  },
  {
    id: "membership-payment",
    category: "Membership",
    title: "How do I pay for a membership?",
    content:
      "To join, select a plan and click 'Join'. A payment modal opens with a UPI QR code and a 'Pay in UPI App' button. Scan the QR or tap the button, confirm the amount and pay, then note your UPI reference/transaction ID and email a screenshot of the payment to hello.nmassociation@gmail.com. Your membership is activated within 24 hours of payment confirmation. For instant help call +91 8667334697.",
    source: "/membership",
    linkLabel: "Membership & Payment",
    keywords: ["pay", "payment", "upi", "qr", "how to pay", "transaction", "reference", "confirm", "receipt", "activate"],
    aliases: ["transaction id", "payment confirmation", "confirm my payment"],
  },
  {
    id: "research-domains",
    category: "Research",
    title: "What research domains and subjects does NM cover?",
    content:
      "NM Research covers 11 research domains spanning hundreds of subjects. The domains are: Chemistry & Materials Science, Biomedical & Life Sciences, Environmental & Energy Sciences, Agricultural & Food Sciences, Engineering & Technology, Energy Storage & Electrochemistry, Physics Mathematics & Data, Management & Business Sciences, Social Sciences & Humanities, Law IP & Entrepreneurship, and Publication & Academic Support. You can search all subjects on the research page.",
    source: "/research",
    linkLabel: "Research Index",
    keywords: ["domain", "domains", "subject", "subjects", "disciplines", "fields", "index", "areas", "research areas"],
    aliases: ["fields of study", "areas of research"],
  },
  {
    id: "research-search",
    category: "Research",
    title: "How do I find a research subject?",
    content:
      "Visit the Research page and use the search box to search subjects — for example Nanotechnology, Polymer, Virology — or filter by research domain. Every subject is fully supported by NM Foundation. You can also open a subject to request guidance.",
    source: "/research",
    linkLabel: "Search Research",
    keywords: ["search", "find", "look up", "browse", "filter", "list", "search box"],
    aliases: ["browse subjects", "subject search"],
  },
  {
    id: "ai-tools",
    category: "Research",
    title: "What AI research tools does NM provide?",
    content:
      "NM Research provides an AI Topic Generator that synthesises novel, scope-appropriate research topics from the NM subject index based on your domain, expertise level and a focus keyword. Additional tools — an AI PDF Summarizer, AI Citation Generator and Research Roadmap — are in active development and can be requested via the Contact page.",
    source: "/research",
    linkLabel: "AI Research Tools",
    keywords: ["ai", "tool", "tools", "topic generator", "topic", "summarizer", "citation", "roadmap", "artificial intelligence"],
    aliases: ["ai tools", "research chatbot", "subject generator"],
  },
  {
    id: "conferences",
    category: "Research",
    title: "Does NM Research organise conferences?",
    content:
      "Yes. NM Research organises and supports international and national research conferences, workshops and webinars, giving researchers networking opportunities with academics and industry leaders worldwide. Conference participation is included in all membership plans.",
    source: "/services/global-conferences",
    linkLabel: "Global Conferences",
    keywords: ["conference", "conferences", "event", "paper presentation", "participate", "speak", "attend"],
    aliases: ["conference participation"],
  },
  {
    id: "contact-details",
    category: "Contact",
    title: "How can I contact NM Research?",
    content:
      "You can contact NM Research by phone at +91 8667334697 or +91 9578170536, or by email at hello.nmassociation@gmail.com or mathichem777@gmail.com. The contact page also has a form, and there is a WhatsApp community group you can join. Offices span India, USA, UK, Canada, Malaysia, Saudi Arabia, Singapore and Japan.",
    source: "/contact",
    linkLabel: "Contact Us",
    keywords: ["contact", "email", "email address", "phone", "call", "reach", "telephone", "whatsapp", "address", "location", "offices", "get in touch", "help", "support", "talk to", "message"],
    aliases: ["phone number", "email address", "how to reach you"],
  },
  {
    id: "registration",
    category: "Contact",
    title: "How do I register as a researcher or join the community?",
    content:
      "On the Contact/Registration area you can register as a researcher by filling in your name, designation, degree, research field, contact and affiliation. You can also join the NM Research community (including a WhatsApp group) to get updates on webinars, calls for papers and collaboration opportunities.",
    source: "/contact",
    linkLabel: "Registration & Community",
    keywords: ["register", "registration", "join", "join community", "sign up", "enroll", "researcher", "whatsapp"],
    aliases: ["sign up as a researcher"],
  },
  {
    id: "community-whatsapp",
    category: "Contact",
    title: "How do I join the NM Research WhatsApp community?",
    content:
      "On the Registration page you can scan a QR code or tap 'Join WhatsApp Group' to join the NM Research community. The community provides instant updates on webinars, calls for papers and collaboration opportunities.",
    source: "/contact",
    linkLabel: "Join Community",
    keywords: ["whatsapp", "group", "community", "chat", "join", "updates"],
    aliases: ["whatsapp community", "community chat"],
  },
  {
    id: "global-presence",
    category: "About",
    title: "Where does NM Research operate?",
    content:
      "NM Research operates globally across India (Tamil Nadu, Puducherry, Kerala, Andhra Pradesh, Telangana) and internationally in the USA, UK, Canada, Malaysia, Saudi Arabia, Singapore, Japan and the UAE, with more than 150 academic and industry partners.",
    source: "/about",
    linkLabel: "Global Presence",
    keywords: ["where", "location", "countries", "global", "india", "usa", "uk", "canada", "malaysia", "presence", "offices"],
    aliases: ["global offices", "which countries"],
  },
  {
    id: "quick-support",
    category: "Contact",
    title: "Looking for quick help?",
    content:
      "For instant help, call +91 8667334697 or email hello.nmassociation@gmail.com. You can also join the WhatsApp community for updates and support from the NM Research team.",
    source: "/contact",
    linkLabel: "Contact Support",
    keywords: ["help", "support", "assistance", "quick", "urgent", "human", "team"],
    aliases: ["talk to a person", "human help"],
  },
  {
    id: "membership-comparison",
    category: "Membership",
    title: "Which membership plan should I choose?",
    content:
      "NM Research membership starts at Community (₹2,999/year) — free Scopus journal authorships, 1 international + 1 national conference and monthly webinars. Platinum (₹29,999/year) adds 1 SCI/Scopus publication support, 2 international conferences, consultancy and PhD guidance. Prime (₹49,999/year) is the top tier with 2 SCI/Scopus publications, 3 international conferences, a dedicated research mentor, book publication assistance and an analytical services discount. Community is the cheapest; Prime is the fullest.",
    source: "/membership",
    linkLabel: "Compare Membership Plans",
    keywords: ["compare", "comparison", "which plan", "choose", "difference", "differ", "differ from", "vs", "between", "plans", "membership plans", "cheapest", "fullest", "worth it"],
  },
  {
    id: "membership-duration",
    category: "Membership",
    title: "How long does NM membership last and can I renew?",
    content:
      "All NM Research membership plans are annual — Community, Platinum and Prime are each valid for one year from activation. Memberships renew yearly, and you can upgrade or move between tiers when renewing.",
    source: "/membership",
    linkLabel: "Membership Plans",
    keywords: ["duration", "how long", "length", "year", "annual", "renew", "renewal", "expire", "valid"],
  },
  {
    id: "service-book-publication",
    category: "Services",
    title: "Does NM help with book publication?",
    content:
      "Yes. Book publication support is part of the research consulting service, which offers free initial topic guidance, work-plan discussions and personalised consultancy sessions. Book publication assistance is also an included benefit of the Prime membership plan.",
    source: "/services/research-consulting",
    linkLabel: "Research Consulting & Book Publication",
    keywords: ["book", "book publication", "monograph", "publish a book", "author", "manuscript book", "chapters", "textbook"],
  },
  {
    id: "service-research-proposal",
    category: "Services",
    title: "Can NM help with research proposals and synopsis?",
    content:
      "Yes. The PhD assistance service covers research proposal and synopsis preparation as part of complete doctoral support — from topic selection and literature review through methodology design, thesis writing and defence preparation.",
    source: "/services/phd-assistance",
    linkLabel: "PhD Assistance",
    keywords: ["proposal", "research proposal", "synopsis", "synopsis writing", "proposal preparation", "scheme"],
  },
  {
    id: "conference-participation",
    category: "Membership",
    title: "Are conferences included in the membership plans?",
    content:
      "Yes — conference participation is included in every membership plan. Community includes 1 international and 1 national conference. Platinum includes 2 international conferences plus consultancy and PhD guidance sessions. Prime includes 3 international conferences, a dedicated research mentor and more. All members get access to NM's workshops and webinars throughout the year.",
    source: "/membership",
    linkLabel: "Membership Conference Benefits",
    keywords: ["conference included", "included", "plan benefits", "how many conferences", "conference slots", "participation"],
  },
];
