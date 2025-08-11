-- Seed data for quiz app
-- This file contains the lead magnet quiz data with updated questions and personality types

-- Insert the quiz
INSERT INTO quizzes (slug, title) VALUES 
('digital-nomad-type', 'What Type of Digital Nomad Are You?');

-- Get the quiz ID for foreign key references
-- We'll use a variable approach that works in PostgreSQL

DO $$
DECLARE
    quiz_uuid UUID;
    q1_uuid UUID;
    q2_uuid UUID;
    q3_uuid UUID;
    q4_uuid UUID;
    q5_uuid UUID;
    q6_uuid UUID;
BEGIN
    -- Get the quiz ID
    SELECT id INTO quiz_uuid FROM quizzes WHERE slug = 'digital-nomad-type';
    
    -- Insert results (persona definitions) with updated content
    INSERT INTO results (quiz_id, key, name, headline, description, email_subject, email_html) VALUES 
    (quiz_uuid, 'A', '🧑‍💻 The Social Butterfly', 'You thrive on connection, community, and a packed calendar.', 
     'You''re the nomad who''s always down for a rooftop party, brunch coworking session, or casual meet-up with strangers who instantly become friends. You love energy, people, and making every city feel like your new home. Best destinations: Medellín (buzzing expat scene and coworking), Playa del Carmen, Mexico City. Your perfect coliving: A lively social hub with group dinners, WhatsApp group chats, and weekend adventures.',
     'Your Digital Nomad Personality: The Social Butterfly �‍💻',
     '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Your Digital Nomad Personality</title></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f5f4;"><div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"><h1 style="color: #b47775; font-size: 28px; margin-bottom: 10px;">Hey there!</h1><p style="color: #43362d; font-size: 16px; margin-bottom: 20px;">Thanks for taking the quiz! You''re officially a <strong>{{RESULT_NAME}}</strong> - {{RESULT_HEADLINE}}</p><p style="color: #43362d; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">{{RESULT_DESCRIPTION}}</p><div style="text-align: center; margin: 30px 0;"><a href="{{CTA_URL}}" style="background: #b47775; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">Explore Our Spaces</a></div><p style="color: #43362d; font-size: 14px; margin-top: 25px;">P.S - We share all the good stuff on Instagram - travel inspo, nomad tips, and what it''s like to live with us. Follow us here!</p></div></body></html>'),
    
    (quiz_uuid, 'B', '☕ The Creative Explorer', 'You''re a soul-led wanderer drawn to charm, culture, and good coffee.', 
     'You seek out places with character - where cobblestone streets and café culture fuel your creativity. You''re less about hustle, more about inspiration, and you value beauty, depth, and a sense of local rhythm. Best destinations: Oaxaca (art, food, and rich tradition), Antigua Guatemala, Buenos Aires. Your perfect coliving: A cozy, quiet space with quirky design, creative vibes, and thoughtful people who get your need for alone time and spontaneous connection.',
     'Your Digital Nomad Personality: The Creative Explorer ☕',
     '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Your Digital Nomad Personality</title></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f5f4;"><div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"><h1 style="color: #b47775; font-size: 28px; margin-bottom: 10px;">Hey there!</h1><p style="color: #43362d; font-size: 16px; margin-bottom: 20px;">Thanks for taking the quiz! You''re officially a <strong>{{RESULT_NAME}}</strong> - {{RESULT_HEADLINE}}</p><p style="color: #43362d; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">{{RESULT_DESCRIPTION}}</p><div style="text-align: center; margin: 30px 0;"><a href="{{CTA_URL}}" style="background: #b47775; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">Explore Our Spaces</a></div><p style="color: #43362d; font-size: 14px; margin-top: 25px;">P.S - We share all the good stuff on Instagram - travel inspo, nomad tips, and what it''s like to live with us. Follow us here!</p></div></body></html>'),
    
    (quiz_uuid, 'C', '🏄 The Free-Spirited Adventurer', 'You''re here for the thrill, the freedom, and the views.', 
     'Deadlines matter, but so does catching the sunrise above the clouds or dancing barefoot on the beach. You like destinations that mix wild beauty with a touch of chaos - somewhere you can feel fully alive. Best destinations: Medellín (mountains, music, movement), Puerto Escondido, Santa Teresa. Your perfect coliving: Flexible and fun, with plenty of spontaneous outings, vibrant communal life, and space to both party and power through a work sprint.',
     'Your Digital Nomad Personality: The Free-Spirited Adventurer �',
     '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Your Digital Nomad Personality</title></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f5f4;"><div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"><h1 style="color: #b47775; font-size: 28px; margin-bottom: 10px;">Hey there!</h1><p style="color: #43362d; font-size: 16px; margin-bottom: 20px;">Thanks for taking the quiz! You''re officially a <strong>{{RESULT_NAME}}</strong> - {{RESULT_HEADLINE}}</p><p style="color: #43362d; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">{{RESULT_DESCRIPTION}}</p><div style="text-align: center; margin: 30px 0;"><a href="{{CTA_URL}}" style="background: #b47775; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">Explore Our Spaces</a></div><p style="color: #43362d; font-size: 14px; margin-top: 25px;">P.S - We share all the good stuff on Instagram - travel inspo, nomad tips, and what it''s like to live with us. Follow us here!</p></div></body></html>'),
    
    (quiz_uuid, 'D', '🌿 The Mindful Minimalist', 'You crave calm, clarity, and space to breathe.', 
     'Your version of success includes balance, boundaries, and feeling grounded. You seek quiet corners of the world where you can focus on your well-being, work intentionally, and reconnect with yourself. Best destinations: San Cristóbal de las Casas (peaceful, spiritual, and soulful), Lake Atitlán, the Andes near Medellín. Your perfect coliving: Minimalist, community-driven, and close to nature - a place where self-care is a priority and slow living is the norm.',
     'Your Digital Nomad Personality: The Mindful Minimalist 🌿',
     '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Your Digital Nomad Personality</title></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f5f4;"><div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"><h1 style="color: #b47775; font-size: 28px; margin-bottom: 10px;">Hey there!</h1><p style="color: #43362d; font-size: 16px; margin-bottom: 20px;">Thanks for taking the quiz! You''re officially a <strong>{{RESULT_NAME}}</strong> - {{RESULT_HEADLINE}}</p><p style="color: #43362d; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">{{RESULT_DESCRIPTION}}</p><div style="text-align: center; margin: 30px 0;"><a href="{{CTA_URL}}" style="background: #b47775; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">Explore Our Spaces</a></div><p style="color: #43362d; font-size: 14px; margin-top: 25px;">P.S - We share all the good stuff on Instagram - travel inspo, nomad tips, and what it''s like to live with us. Follow us here!</p></div></body></html>');

    -- Insert questions with the new content
    INSERT INTO questions (quiz_id, position, title) VALUES 
    (quiz_uuid, 1, 'What''s your ideal work environment?'),
    (quiz_uuid, 2, 'What''s the first thing you do when you arrive in a new city?'),
    (quiz_uuid, 3, 'Pick your dream Sunday plan abroad:'),
    (quiz_uuid, 4, 'Your biggest priority when choosing a destination:'),
    (quiz_uuid, 5, 'What kind of accommodation do you prefer?'),
    (quiz_uuid, 6, 'Which quote speaks to you most?');

    -- Get question IDs for options
    SELECT id INTO q1_uuid FROM questions WHERE quiz_id = quiz_uuid AND position = 1;
    SELECT id INTO q2_uuid FROM questions WHERE quiz_id = quiz_uuid AND position = 2;
    SELECT id INTO q3_uuid FROM questions WHERE quiz_id = quiz_uuid AND position = 3;
    SELECT id INTO q4_uuid FROM questions WHERE quiz_id = quiz_uuid AND position = 4;
    SELECT id INTO q5_uuid FROM questions WHERE quiz_id = quiz_uuid AND position = 5;
    SELECT id INTO q6_uuid FROM questions WHERE quiz_id = quiz_uuid AND position = 6;

    -- Insert options for Question 1: What's your ideal work environment?
    INSERT INTO options (question_id, label, text, result_key) VALUES 
    (q1_uuid, 'A', 'A buzzing coworking space with events every night', 'A'),
    (q1_uuid, 'B', 'A quiet corner of a cute café', 'B'),
    (q1_uuid, 'C', 'A hammock and decent Wi-Fi near the beach', 'C'),
    (q1_uuid, 'D', 'Somewhere I can focus on deep work and wellness', 'D');

    -- Insert options for Question 2: What's the first thing you do when you arrive in a new city?
    INSERT INTO options (question_id, label, text, result_key) VALUES 
    (q2_uuid, 'A', 'Find the nearest coworking space and reserve a desk', 'A'),
    (q2_uuid, 'B', 'Walk around and scope out the cafés', 'B'),
    (q2_uuid, 'C', 'Head straight to the beach or a viewpoint', 'C'),
    (q2_uuid, 'D', 'Unpack in my accommodation and do a quick breathwork session', 'D');

    -- Insert options for Question 3: Pick your dream Sunday plan abroad:
    INSERT INTO options (question_id, label, text, result_key) VALUES 
    (q3_uuid, 'A', 'Networking brunch and rooftop drinks', 'A'),
    (q3_uuid, 'B', 'Lazy start, browsing a local market, journaling in a café', 'B'),
    (q3_uuid, 'C', 'Surf at sunrise, tacos at lunch, dance at sunset', 'C'),
    (q3_uuid, 'D', 'Morning hike, green smoothie, sauna and relax', 'D');

    -- Insert options for Question 4: Your biggest priority when choosing a destination:
    INSERT INTO options (question_id, label, text, result_key) VALUES 
    (q4_uuid, 'A', 'Fast Wi-Fi and an active digital nomad scene', 'A'),
    (q4_uuid, 'B', 'Charm, culture, and cool coffee shops', 'B'),
    (q4_uuid, 'C', 'Sun, nature, and cheap cocktails', 'C'),
    (q4_uuid, 'D', 'Peace, personal growth, and natural beauty', 'D');

    -- Insert options for Question 5: What kind of accommodation do you prefer?
    INSERT INTO options (question_id, label, text, result_key) VALUES 
    (q5_uuid, 'A', 'A buzzing coliving with events and group chat', 'A'),
    (q5_uuid, 'B', 'A stylish local guesthouse', 'B'),
    (q5_uuid, 'C', 'A surf hostel near the water', 'C'),
    (q5_uuid, 'D', 'An eco-retreat or wellness-themed coliving', 'D');

    -- Insert options for Question 6: Which quote speaks to you most?
    INSERT INTO options (question_id, label, text, result_key) VALUES 
    (q6_uuid, 'A', '"Your network is your net worth."', 'A'),
    (q6_uuid, 'B', '"Not all who wander are lost."', 'B'),
    (q6_uuid, 'C', '"Work hard, play harder."', 'C'),
    (q6_uuid, 'D', '"Disconnect to reconnect."', 'D');

END $$;
