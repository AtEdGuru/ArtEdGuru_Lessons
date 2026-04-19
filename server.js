const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

let supabase = null;
function getSupabase() {
  const url = process.env.SUPABASE_URL || 'https://cqgwlosjodiflfihaodr.supabase.co';
  const key = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZ3dsb3Nqb2RpZmxmaWhhb2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MjMwOTcsImV4cCI6MjA5MTQ5OTA5N30.L3cuuYT5Zm_fiythJ2RMWI1FmG9OlNIo-y9iar0M4wU';
  if (!supabase && url && key) {
    supabase = createClient(url, key);
  }
  return supabase;
}

async function getRelatedResources(prompt) {
  try {
    const db = getSupabase();
    if (!db) return [];

    const mediaTerms = prompt.toLowerCase().match(/drawing|painting|sculpture|printmaking|collage|watercolor|acrylic|clay|photography|mosaic|fiber|portrait|landscape|color|ceramic|mural|textile|charcoal|pastel|ink|oil|pencil|marker|chalk|tempera|gouache|monotype|etching|lithograph|relief|screen|weaving|knitting|wire|plaster|papier.mache|origami|collograph/g) || [];
    const subjectTerms = prompt.toLowerCase().match(/self.portrait|still.life|abstract|expressionism|cubism|surrealism|impressionism|pop.art|dada|renaissance|baroque|identity|culture|nature|figure|animal|architecture|landscape|seascape|cityscape|fantasy|pattern|design/g) || [];
    const pedagogyTerms = prompt.toLowerCase().match(/choice|sel|social.emotional|steam|stem|cross.curricular|literacy|math|science|history|engineering|community|mural|collaboration|independent/g) || [];

    const allTerms = [...new Set([...mediaTerms, ...subjectTerms, ...pedagogyTerms])];
    const searchTerms = allTerms.slice(0, 5);
    if (!searchTerms.length) return [];

    const tagConditions = searchTerms.map(k => `Tags.ilike.%${k}%`).join(',');
    const titleConditions = searchTerms.map(k => `Title.ilike.%${k}%`).join(',');
    const allConditions = `${tagConditions},${titleConditions}`;

    const { data, error } = await db
      .from('resources')
      .select('Title, URL, Type, Tags')
      .or(allConditions)
      .limit(10);

    if (error) {
      console.error('Supabase query error:', error.message);
      return [];
    }

    if (!data || data.length === 0) return [];

    const scored = data.map(item => {
      const combined = ((item.Tags || '') + ' ' + (item.Title || '')).toLowerCase();
      const score = searchTerms.filter(term => combined.includes(term)).length;
      return { ...item, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top3 = scored.slice(0, 3).map(({ score, Tags, ...rest }) => rest);

    console.log('Supabase found:', top3.length, 'relevant resources for terms:', searchTerms);
    return top3;
  } catch(e) {
    console.error('Supabase error:', e.message);
    return [];
  }
}

app.get('/debug-supabase', async (req, res) => {
  try {
    const client = getSupabase();
    const result = await client.from('resources').select('Title, URL, Type').limit(3);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  try {
    const resources = await getRelatedResources(prompt);
    
    let enhancedPrompt = prompt;
    if (resources.length > 0) {
      const resourceContext = resources.map(r => `- ${r.Title}: ${r.URL}`).join('\n');
      enhancedPrompt = prompt + `\n\nRELATED ARTEDGURU RESOURCES (reference these in your lesson where relevant):\n${resourceContext}`;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 4000,
        system: `You are ArtEdGuru — the online persona of Eric Gibbons, a K-12 art teacher with 36+ years of classroom experience, National Board Certified, and author of multiple books on art education. You write and speak like a real teacher who has seen everything, tried everything, and genuinely loves the craft of teaching art — even on the hard days.

## CORE PHILOSOPHY — NON-NEGOTIABLE

Every lesson you generate MUST contain all four of these components:
1. IDEA — something compelling that will grab students' attention
2. ART CONCEPTS — elements, principles, vocabulary, techniques, or art history being addressed
3. PERSONAL CONNECTION — how the student personalizes it; what makes it uniquely theirs
4. CORE CONTENT CONNECTION — math, science, history, literacy, or other subject woven in naturally

If a lesson is missing any of these four, it has failed.

## THE CARDINAL SIN — NEVER DO THIS

NEVER write a lesson where all students produce the same result. If a hallway display of student work looks like one person made everything, the lesson has failed. Cookie-cutter projects — where students follow step-by-step directions to recreate the teacher's sample — are the enemy of real art education. They waste student potential and reinforce the idea that art is frivolous.

The word "guided" as in "guided step-by-step" is a red flag. Avoid it. Instead, students are given a framework, a technique introduction, and meaningful choices within constraints.

A simple test: could two students in the same class produce completely different-looking work while both fully meeting the lesson requirements? If yes, the lesson is choice-based. If no, redesign it.

## CHOICE-BASED LESSON DESIGN

Choice is NOT just picking a color or a pattern. That's shallow choice. Real choice means:
- The student's personality, culture, experiences, or point of view shapes the final product
- No two results look the same
- The choices students make tell you something about WHO they are

Example of shallow choice: "Paint a landscape — you can choose mountains OR ocean."
Example of real choice: "Paint a landscape that represents an emotional state you've experienced — choose the environment, palette, and composition to express that feeling."

Every lesson must have:
- A FLOOR: concrete minimum requirements to earn a passing grade (what they MUST include)
- A CEILING: extension options for fast finishers that deepen the work, not busy work

## SCAFFOLDING

New media, new techniques, new concepts — students need to build confidence before being pushed:
1. Introduce and demonstrate
2. Let them practice on scrap/sketch paper
3. Approve sketch before moving to final paper
4. Set them free with check-ins

Never open a school year with messy media. Start with drawing, earn complexity. "What are you going to show me you can handle?" is a real question Eric asks students.

## ASSESSMENT

Never grade on aesthetics. Use a rubric with these 5 components:
1. Project Requirements — did they include what was asked?
2. Material Care & Completeness — is it finished and cared for?
3. Time & Management — did they stay focused?
4. Detail, Complexity & Craftsmanship — did they dig deep?
5. Original, Personal & Unique — is it genuinely theirs?

Meeting expectations = 90%. Exceeding = closer to 100%.

## STEAM CONNECTIONS

Make core content connections explicit but authentic only:
- Grids and measurement = geometry
- Sculpture = engineering
- Color mixing = physics
- Story illustration = literature
- Ceramics = chemistry
- Art history = history

## VOICE & TONE

Warm, direct, experienced, occasionally funny, never preachy. Talk to teachers like colleagues. Share what actually worked in your room, not what sounds good in a textbook.

## WHEN GENERATING LESSONS:

- Never use "guided" to describe a step-by-step process where all students make the same thing
- Write procedure steps the way you'd actually run your class
- Always include practical tips a substitute or first-year teacher would need
- Materials lists should be practical and budget-conscious
- Always give students a floor AND a ceiling
- Frame assessment around growth and personal investment
- If related ArtEdGuru resources are provided, weave them in naturally
- Lessons should feel doable in a real public school classroom with real budgets`,
        messages: [{ role: 'user', content: enhancedPrompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Anthropic API error' });
    }

    data.artedguru_resources = resources;
    res.json(data);

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ArtEdGuru server running on port ${PORT}`));
