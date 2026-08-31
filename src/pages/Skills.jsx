import Reveal from '../components/layout/Reveal.jsx';
import ListCard from '../components/skills/ListCard.jsx';
import TechnicalSkillsCard from '../components/skills/TechnicalSkillsCard.jsx';
import TimelineCard from '../components/skills/TimelineCard.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import skills from '../data/skills.json';

export default function Skills() {
  useDocumentTitle('Skills');

  const education = skills.education.map((e) => ({
    title: e.degree,
    subtitle: `${e.institution} (${e.period})`,
    details: e.details,
  }));

  const experience = skills.experience.map((e) => ({
    title: e.role,
    subtitle: `${e.company} (${e.period})`,
    details: e.details,
  }));

  return (
    <section className="container skills-page">
      <header className="hero u-text-center">
        <p className="eyebrow">Profile</p>
        <h1 className="home-section-title" style={{ marginBottom: '1rem' }}>
          Skills &amp; Background
        </h1>
        <p className="subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Computer Engineering student driven by curiosity. I love building digital experiences,
          exploring new technologies, and continuously learning.
        </p>
      </header>

      <div className="grid grid-skills">
        <Reveal className="skills-full-width">
          <TechnicalSkillsCard categories={skills.technicalSkills} />
        </Reveal>

        <Reveal>
          <TimelineCard id="education-title" title="Education" items={education} />
        </Reveal>

        <Reveal className="skills-column">
          <TimelineCard id="experience-title" title="Experience" items={experience} />
          <ListCard
            id="languages-title"
            title="Languages"
            items={skills.languages.map((l) => ({ name: l.name, note: l.level }))}
          />
          <ListCard
            id="interests-title"
            title="Interests"
            items={skills.interests.map((i) => ({ name: i.name, note: i.details }))}
            parenthesiseNote
          />
        </Reveal>
      </div>
    </section>
  );
}
