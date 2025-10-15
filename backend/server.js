import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Supabase bağlantısı
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:5173',
  process.env.FRONTEND_URL 
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bu origin CORS tarafından engellendi'));
    }
  },
  credentials: true
}));
app.use(express.json());

app.get('/api/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .limit(1);

    if (error) throw error;
    res.json({ success: true, message: 'Supabase bağlantısı başarılı', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Supabase bağlantı hatası', error: error.message });
  }
});

app.get('/api/locations', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/locations', async (req, res) => {
  try {
    const { name, description, lat, lng, visit_date, category } = req.body;
    const { data, error } = await supabase
      .from('locations')
      .insert([{ name, description, lat, lng, visit_date, category }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/locations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('locations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Lokasyon sil
app.delete('/api/locations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Sunucu çalışıyor: http://localhost:${port}`);
});
