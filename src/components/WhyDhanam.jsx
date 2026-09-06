import React from 'react';
import { Sun, Flame, Sparkles, ShieldCheck } from 'lucide-react';

export default function WhyDhanam() {
  const pillars = [
    {
      num: '01',
      icon: <Sun size={26} />,
      title: 'Sun-Dried Whole Herbs',
      tamil: 'இயற்கை சூரிய ஒளியில் உலர்த்தல்',
      desc: 'Herbs and curry leaves are naturally dried under mild solar heat to preserve essential chlorophyll, active phytocompounds, and authentic green aroma.'
    },
    {
      num: '02',
      icon: <Flame size={26} />,
      title: 'Earthen Pot Gentle Roasting',
      tamil: 'மண்பாண்டங்களில் மெதுவான வறுவல்',
      desc: 'Selected native lentils and heirloom spices are slow-roasted in clay pots over low heat, bringing out deep nutty notes without burning.'
    },
    {
      num: '03',
      icon: <Sparkles size={26} />,
      title: 'Ancestral Siddha Ratios',
      tamil: 'பாரம்பரிய சித்த முறை விகிதங்கள்',
      desc: 'Therapeutic botanicals like Pirandai and Mudavattukal are blended strictly in time-honored balanced proportions for maximum physiological benefit.'
    },
    {
      num: '04',
      icon: <ShieldCheck size={26} />,
      title: 'Food-Grade Airtight Jars',
      tamil: 'சுகாதாரமான காற்றுப்புகா பேக்கிங்',
      desc: 'Packed in high-grade clean sealed containers with moisture barrier protection, locking in the stone-milled freshness until the moment it reaches your kitchen.'
    }
  ];

  return (
    <section id="why-dhanam" className="pillars-dark-section">
      <div className="container">
        {/* Section Header */}
        <div className="pillars-header">
          <span className="pillars-kicker">THE DHANAM RIGOR • நான்கு தூண்கள்</span>
          <h2 className="pillars-headline">Four Unyielding Pillars of Purity</h2>
          <p className="pillars-sublead">
            Every step of our production is deliberately slow, intentional, and anchored in ancestral food science.
          </p>
        </div>

        {/* Pillars Staggered Grid */}
        <div className="pillars-grid-layout">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="pillar-sculpted-card">
              <div className="pillar-top-row">
                <span className="pillar-large-num">{pillar.num}</span>
                <div className="pillar-icon-chip">{pillar.icon}</div>
              </div>
              
              <h3 className="pillar-card-title">{pillar.title}</h3>
              <div className="pillar-card-tamil">{pillar.tamil}</div>
              <p className="pillar-card-text">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
