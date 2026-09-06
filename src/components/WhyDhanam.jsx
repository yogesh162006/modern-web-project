import React from 'react';
import { ShieldCheck, Award, Leaf, Clock } from 'lucide-react';

export default function WhyDhanam() {
  const pillars = [
    {
      num: '01',
      title: 'Stone-Milled Purity',
      desc: 'We grind our heritage lentils and wild medicinal herbs slowly at natural temperatures, ensuring heat never compromises authentic nutritional integrity.'
    },
    {
      num: '02',
      title: 'Ancestral Siddha Recipes',
      desc: 'Formulations passed down through generations—incorporating authentic proportions of Cissus (Pirandai), Mudavattukal, and wild moringa for true vitality.'
    },
    {
      num: '03',
      title: 'Zero Chemical Additives',
      desc: '100% natural ingredients only. We refuse to use chemical anti-caking agents, artificial food colorings, synthetic fragrances, or preservatives.'
    },
    {
      num: '04',
      title: 'Direct WhatsApp Ordering',
      desc: 'Seamless personal service directly from the shop owner. We confirm freshness and dispatch promptly across Tamil Nadu and all of India.'
    }
  ];

  return (
    <section id="why-dhanam" className="section" style={{ background: '#FAF7F2' }}>
      <div className="container">
        <div className="section-header text-center">
          <span className="section-pretitle">The Dhanam Standard</span>
          <h2 className="section-title">Why Families Trust Dhanam Organics</h2>
          <p className="section-subtitle">
            Uncompromising authenticity from certified organic soil to your dining table.
          </p>
        </div>

        <div className="pillars-grid">
          {pillars.map((pillar) => (
            <div key={pillar.num} className="pillar-card">
              <div className="pillar-number">{pillar.num}</div>
              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="pillar-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
