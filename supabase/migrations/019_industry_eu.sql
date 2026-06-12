-- Migration 019: Neue Branche "EU-Regulatorik & Gesetzgebung" (ID 21)
-- Branchen-übergreifende EU-Gesetzgebung für Public-Affairs, GCs, Compliance-Teams

INSERT INTO industries (id, name, slug, description, sources, tags_taxonomy, crawl_interval_minutes, is_active)
VALUES (
  21,
  'EU-Regulatorik & Gesetzgebung',
  'eu-regulatorik',
  'EU-Gesetzgebungsverfahren, neue Verordnungen & Richtlinien, Institutionen-News, Trilog-Ergebnisse',
  '[
    {"name":"EUR-Lex — Neues Amtsblatt","url":"https://eur-lex.europa.eu/rss/rss.xml","type":"rss","trust_level":"official"},
    {"name":"EU-Parlament — Pressemitteilungen","url":"https://www.europarl.europa.eu/rss/doc/latest-news/de.rss","type":"rss","trust_level":"official"},
    {"name":"EU-Rat — Pressemitteilungen","url":"https://www.consilium.europa.eu/de/press/press-releases/rss","type":"rss","trust_level":"official"},
    {"name":"EU-Kommission — Pressemitteilungen","url":"https://ec.europa.eu/commission/presscorner/api/rss","type":"rss","trust_level":"official"},
    {"name":"Euractiv","url":"https://www.euractiv.com/feed/","type":"rss","trust_level":"media"},
    {"name":"Politico Europe","url":"https://www.politico.eu/feed/","type":"rss","trust_level":"media"}
  ]',
  '{
    "legislation":["Verordnung","Richtlinie","Beschluss","Delegierter-Rechtsakt","Durchführungsrechtsakt","Trilog","Interinstitutionelle-Vereinbarung"],
    "policy_areas":["Digitalpolitik","AI-Act","Data-Act","DMA","DSA","DORA","CSRD","EU-Taxonomie","Lieferkette","Handelspolitik","Wettbewerbsrecht","Beihilferecht"],
    "institutions":["EU-Kommission","EU-Parlament","EU-Rat","EuGH","ESMA","EBA","EIOPA","ENISA","EFRAG","ERA"],
    "process":["Erstenlesung","Zweitlesung","Trilog","Konsultation","Folgenabschätzung","Komitologie","Implementierungsfrist"]
  }',
  30,
  true
);
