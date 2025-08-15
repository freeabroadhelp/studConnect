const express = require('express');
const router = express.Router();
const axios = require('axios');

// In-memory mock DB (replace with real DB in production)
const COUNSELLORS = [
  {
    id: 'c1',
    name: 'Aarav Sharma',
    university: 'MIT',
    course: 'Computer Science',
    year: '2024',
    areas: ['Admissions', 'Campus Life', 'Part-time Jobs'],
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Happy to share my MIT journey and tips for international students.',
    calendlyUrl: 'https://calendly.com/demo-counsellor/30min'
  },
  // ...add more
];
const BOOKINGS = [];
const FEEDBACKS = [];
const PAYOUTS = [];

// --- Peer Counsellor Directory ---
router.get('/peer-counsellors', (req, res) => {
  res.json(COUNSELLORS);
});

// --- Get Counsellor Availability (Calendly) ---
router.get('/peer-counsellors/:id/availability', async (req, res) => {
  const c = COUNSELLORS.find(x => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  // For real: Use Calendly API to fetch available slots
  // const calendlyApiKey = process.env.CALENDLY_API_KEY;
  // const resp = await axios.get(`https://api.calendly.com/...`, { headers: { Authorization: `Bearer ${calendlyApiKey}` } });
  // res.json(resp.data);
  res.json({ url: c.calendlyUrl });
});

// --- Create Booking (with Payment, Calendly, Zoom, Email, WhatsApp) ---
router.post('/bookings', async (req, res) => {
  const { counsellorId, studentEmail, studentName, slotTime } = req.body;
  const id = 'b' + (BOOKINGS.length + 1);
  // 1. Payment: Integrate Stripe/PayPal/UPI here
  // const paymentResult = await stripe.paymentIntents.create({...});
  // 2. Calendly: Book slot via Calendly API
  // const calendlyResp = await axios.post('https://api.calendly.com/scheduled_events', {...});
  // 3. Zoom: Create meeting via Zoom API
  // const zoomResp = await axios.post('https://api.zoom.us/v2/users/me/meetings', {...});
  // 4. Email: Send confirmation via SendGrid/Mailgun/SMTP
  // await sendEmail(studentEmail, ...);
  // 5. WhatsApp: Send WhatsApp via Twilio/other
  // await sendWhatsApp(studentPhone, ...);
  // For demo, mock values:
  const zoomLink = 'https://zoom.us/j/1234567890';
  BOOKINGS.push({
    id,
    counsellorId,
    studentEmail,
    studentName,
    slotTime,
    status: 'confirmed',
    zoomLink,
    created: new Date()
  });
  res.json({
    id,
    status: 'confirmed',
    zoomLink,
    calendlyUrl: COUNSELLORS.find(c=>c.id===counsellorId)?.calendlyUrl
  });
});

// --- List Bookings (for admin/counsellor) ---
router.get('/bookings', (req, res) => {
  // Optionally filter by counsellorId or studentEmail
  const { counsellorId, studentEmail } = req.query;
  let list = BOOKINGS;
  if (counsellorId) list = list.filter(b => b.counsellorId === counsellorId);
  if (studentEmail) list = list.filter(b => b.studentEmail === studentEmail);
  res.json(list);
});

// --- Submit Feedback ---
router.post('/feedback', (req, res) => {
  const { bookingId, rating, comments } = req.body;
  FEEDBACKS.push({ bookingId, rating, comments, created: new Date() });
  res.json({ ok: true });
});

// --- List Feedback (admin/counsellor) ---
router.get('/feedback', (req, res) => {
  const { counsellorId } = req.query;
  let list = FEEDBACKS;
  if (counsellorId) {
    const bookingIds = BOOKINGS.filter(b => b.counsellorId === counsellorId).map(b => b.id);
    list = list.filter(f => bookingIds.includes(f.bookingId));
  }
  res.json(list);
});

// --- Admin: Payout Dashboard ---
router.get('/admin/payouts', (req, res) => {
  // Calculate sessions per counsellor
  const summary = COUNSELLORS.map(c => {
    const completed = BOOKINGS.filter(b => b.counsellorId === c.id && b.status === 'confirmed').length;
    const paid = PAYOUTS.filter(p => p.counsellorId === c.id).reduce((sum, p) => sum + p.amount, 0);
    return {
      counsellor: c.name,
      university: c.university,
      completedSessions: completed,
      totalDue: completed * 20, // e.g. $20 per session
      paid
    };
  });
  res.json(summary);
});

// --- Admin: Mark Payout ---
router.post('/admin/payouts', (req, res) => {
  const { counsellorId, amount } = req.body;
  PAYOUTS.push({ counsellorId, amount, date: new Date() });
  res.json({ ok: true });
});

module.exports = router;
