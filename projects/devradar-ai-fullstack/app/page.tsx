import './styles.css';

const candidateSkills = ['HTML', 'CSS', 'JavaScript', 'Git', 'SQL', 'Atendimento ao Usuário'];

const targetJob = {
  title: 'Desenvolvedor Full Stack Júnior',
  requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'TypeScript']
};

function analyzeGap(candidate: string[], required: string[]) {
  const normalizedCandidate = candidate.map((skill) => skill.toLowerCase());
  const matched = required.filter((skill) => normalizedCandidate.includes(skill.toLowerCase()));
  const missing = required.filter((skill) => !normalizedCandidate.includes(skill.toLowerCase()));
  const score = Math.round((matched.length / required.length) * 100);

  return { matched, missing, score };
}

export default function Home() {
  const report = analyzeGap(candidateSkills, targetJob.requiredSkills);

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">FULLSTACK MARKET INTELLIGENCE</p>
        <h1>DevRadar AI</h1>
        <p className="hero-text">
          Compare suas habilidades com vagas reais e descubra exatamente quais tecnologias estudar para chegar mais rápido em uma oportunidade.
        </p>
      </section>

      <section className="grid">
        <article className="panel">
          <span className="panel-label">Vaga alvo</span>
          <h2>{targetJob.title}</h2>
          <div className="chips">
            {targetJob.requiredSkills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </article>

        <article className="panel score-panel">
          <span className="panel-label">Compatibilidade</span>
          <strong>{report.score}%</strong>
          <p>Score baseado nas habilidades declaradas do candidato.</p>
        </article>

        <article className="panel success">
          <span className="panel-label">Você já tem</span>
          <div className="chips">
            {report.matched.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </article>

        <article className="panel danger">
          <span className="panel-label">Falta estudar</span>
          <div className="chips">
            {report.missing.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="roadmap">
        <h2>Roadmap sugerido</h2>
        <ol>
          {report.missing.map((skill, index) => (
            <li key={skill}>
              <strong>{index + 1}. {skill}</strong>
              <p>Crie um mini projeto aplicando {skill} e publique no GitHub com README profissional.</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
