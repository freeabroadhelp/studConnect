const express = require('express');
const app = express();
app.use(express.json());
app.use('/api', require('./peerCounselling'));

const valuePoints = [
  { title:'Real Student Insights', text:'Current international students share up‑to‑date campus & lifestyle realities.' },
  { title:'Profile Alignment', text:'Get candid feedback on goals, competitiveness & strategic positioning.' },
  { title:'Country & Program Clarity', text:'Compare destinations on cost, outcomes, culture & career pathways.' },
  { title:'Actionable Next Steps', text:'Leave every session with prioritized, time‑bound tasks.' }
];

const flow = [
  { step:1, title:'Request Session', text:'Pick a slot & share quick intent notes.' },
  { step:2, title:'Match & Prep', text:'We pair you with a relevant mentor; you get a mini prep brief.' },
  { step:3, title:'Live Peer Call', text:'45–50 min structured conversation + open Q&A.' },
  { step:4, title:'Session Recap', text:'Key takeaways, links & next‑step checklist.' },
  { step:5, title:'Follow‑Up Window', text:'72h asynchronous clarification support.' }
];

const packages = [
  { id:'starter', name:'Starter', price:'$29', blurb:'Single focused peer session.', features:['1 × 45m peer call','Session recap notes','7‑day booking window'], accent:false },
  { id:'growth', name:'Growth', price:'$79', blurb:'Deep exploration + iterative clarity.', features:['3 × 45m peer calls','Priority matching','Profile positioning pointers','Email follow‑up (72h each)'], accent:true },
  { id:'strategy', name:'Strategy', price:'$149', blurb:'Structured pathway & shortlist direction.', features:['5 × 45m peer calls','Goal refinement framework','Country / program comparison matrix','Light shortlist feedback','Extended follow‑up (5 days)'], accent:false }
];

const faqs = [
  { q:'Who are the peers?', a:'Vetted current international students / recent grads matched by destination & discipline.' },
  { q:'How fast is matching?', a:'Usually under 24 hours; niche profiles may take a bit longer.' },
  { q:'Can I change mentor?', a:'Yes—one complimentary rematch with reason provided.' },
  { q:'Do peers edit SOP/essays?', a:'They give directional feedback only; drafting sits in Application Assistance.' }
];

const testimonials = [
  { name:'Ishika • CS Canada', text:'Gave me realistic insight on co‑ops & budgeting I never saw on blogs.' },
  { name:'Daniel • MS Germany', text:'Helped me choose between two programs with a clear ROI perspective.' },
  { name:'Fatima • UK Health', text:'Left with a concrete 6‑week prep checklist. Removed uncertainty.' }
];

app.get('/peer-counselling-data', (req, res) => {
  res.json({ valuePoints, flow, packages, faqs, testimonials });
});

module.exports = app;