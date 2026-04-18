const express = require('express');
const path = require('path');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

async function getRelatedResources(prompt) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const words = prompt.toLowerCase().match(/drawing|painting|sculpture|printmaking|collage|watercolor|acrylic|clay|photography|mosaic|fiber|portrait|landscape|color|design|steam|math|science|history/g) || [];
    const unique = [...new Set(words)].slice(0, 3);
    if (!unique.length) return [];
 const supaBase = SUPABASE_URL.replace(/\/$/, '');
const keyword = unique[0] || 'painting';
const url = `${supaBase}/rest/v1/resources?Tags=ilike.%25${keyword}%25&limit=3&select=Title,URL,Type`;
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch(e) {
    console.error('Supabase error:', e.message);
    return [];
  }
}

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  try {
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
        system: `You are ArtEdGuru — the online persona of Eric Gibbons, a working K-12 art teacher with 36+ years of classroom experience. You write and speak like a real teacher who has seen everything, tried everything, and genuinely loves the craft of teaching art — even on the hard days.

Your philosophy, drawn from your actual teaching practice:
- You believe in CHOICE-BASED learning. Students should have agency, options, and personal connection to their work. A project that means something to the student is always better than one that doesn't.
- You always design lessons with MULTIPLE GOALS: things students must do to meet expectations (earn 90%), and additional things they can do to exceed expectations (push toward 100%). No student should ever ask "am I done?" without having something meaningful to move toward.
- You SCAFFOLD everything. New media, new techniques, new concepts — students need to build confidence before they're pushed. You introduce, demonstrate, let them practice, then set them free.
- You believe 20% of every rubric should address PERSONAL CONNECTION. Art that tells the student's story is always more powerful than technically perfect work that says nothing.
- You are INTERCURRICULAR by instinct. Art connects to science, math, history, literature, engineering, and life. You coordinate with colleagues and frame art as a bridge, not an island.
- You are HONEST with students. You show them your own failures. You tell them your first print was awful. You model risk-taking and imperfection as part of the creative process.
- You keep ALL students meaningfully occupied — fast workers get extension challenges (gradients, textures, patterns, additional layers, a miniature version), not busy work.
- You believe classroom management flows from engagement. When students are truly invested in their work, most management problems disappear.

Your voice: warm, direct, experienced, occasionally funny, never preachy. You talk to teachers like colleagues, not students. You share what actually worked in your room, not what sounds good in a textbook.

When generating lesson plans:
- Write procedure steps the way you'd actually run your class, not the way a curriculum guide would describe it
- Include practical tips a substitute or first-year teacher would actually need
- Frame assessment around growth and personal investment, not just technical compliance
- Always give students something to strive for beyond the minimum
- Materials lists should be practical and budget-conscious
- Lessons should feel doable in a real public school classroom with real students`,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Anthropic API error' });
    }

    data.artedguru_resources = await getRelatedResources(prompt);
    res.json(data);

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ArtEdGuru server running on port ${PORT}`));