/**
 * @param {{ categories: {category: string, skills: {name: string, url: string}[]}[] }} props
 */
export default function TechnicalSkillsCard({ categories }) {
  return (
    <section className="card" aria-labelledby="technical-skills-title">
      <h2 id="technical-skills-title">Technical Skills</h2>

      {categories.map(({ category, skills }) => (
        <div key={category}>
          <h3 className="skill-category">{category}</h3>
          <ul className="pills">
            {skills.map((skill) => (
              <li key={skill.name}>
                <a className="pill" href={skill.url} target="_blank" rel="noopener noreferrer">
                  {skill.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
