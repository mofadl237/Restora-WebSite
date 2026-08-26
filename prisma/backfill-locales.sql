DO $$
DECLARE loc TEXT;
BEGIN
  FOREACH loc IN ARRAY ARRAY['de','ru','uk','tr','fr','it'] LOOP
    INSERT INTO marketing_section_translations ("sectionId", locale, title, subtitle, description, "ctaLabel", "ctaHref")
    SELECT t."sectionId", loc, t.title, t.subtitle, t.description, t."ctaLabel", t."ctaHref" FROM marketing_section_translations t WHERE t.locale = 'en'
    ON CONFLICT DO NOTHING;

    INSERT INTO faq_translations ("faqId", locale, question, answer)
    SELECT t."faqId", loc, t.question, t.answer FROM faq_translations t WHERE t.locale = 'en'
    ON CONFLICT DO NOTHING;

    INSERT INTO feature_translations ("featureId", locale, name, description)
    SELECT t."featureId", loc, t.name, t.description FROM feature_translations t WHERE t.locale = 'en'
    ON CONFLICT DO NOTHING;

    INSERT INTO gift_translations ("giftId", locale, name, description)
    SELECT t."giftId", loc, t.name, t.description FROM gift_translations t WHERE t.locale = 'en'
    ON CONFLICT DO NOTHING;

    INSERT INTO plan_translations ("planId", locale, name, "shortDescription", "longDescription")
    SELECT t."planId", loc, t.name, t."shortDescription", t."longDescription" FROM plan_translations t WHERE t.locale = 'en'
    ON CONFLICT DO NOTHING;

    INSERT INTO story_scene_translations ("sceneId", locale, kicker, title, body)
    SELECT t."sceneId", loc, t.kicker, t.title, t.body FROM story_scene_translations t WHERE t.locale = 'en'
    ON CONFLICT DO NOTHING;

    INSERT INTO testimonial_translations ("testimonialId", locale, quote)
    SELECT t."testimonialId", loc, t.quote FROM testimonial_translations t WHERE t.locale = 'en'
    ON CONFLICT DO NOTHING;

    INSERT INTO segment_page_translations ("segmentId", locale, title, subtitle, description, problems, "useCases", features, faqs, "seoTitle", "seoDescription")
    SELECT t."segmentId", loc, t.title, t.subtitle, t.description, t.problems, t."useCases", t.features, t.faqs, t."seoTitle", t."seoDescription"
    FROM segment_page_translations t WHERE t.locale = 'en'
    ON CONFLICT DO NOTHING;

    INSERT INTO blog_post_translations ("postId", locale, title, excerpt, content, "readingTime")
    SELECT t."postId", loc, t.title, t.excerpt, t.content, t."readingTime"
    FROM blog_post_translations t WHERE t.locale = 'en'
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;
