import { VisitCounter } from "./visit-counter";

export default function Home() {
  return (
    <div className="coming-soon">
      <div className="page">
        <div className="background">
          <div className="sky" />
          <div className="torii" />
          <div className="sakura-layer">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className={`petal petal-${(i % 6) + 1}`} />
            ))}
          </div>
          <div className="grid" />
          <div className="orb one" />
          <div className="orb two" />
          <div className="orb three" />
          <div className="jp-text jp-left">未来 - future</div>
          <div className="jp-text jp-right">構築中 - building</div>
          <div className="code code-left">
            const future = await build();
            <br />
            deploy(future);
            <br />
            <br />
            if (ready) {"{"}
            <br />
            &nbsp;&nbsp;launch();
            <br />
            {"}"}
          </div>
          <div className="code code-right">
            01001001 01000001
            <br />
            model.train(data);
            <br />
            cloud.connect();
            <br />
            system.ready = true;
          </div>
        </div>

        <main>
          <section className="content">
            <div className="badge">
              <span className="status-dot" />
              Work in progress
            </div>
            <h1>
              <span className="glow-text">Coming soon.</span>
            </h1>
            <p className="description">
              A new utility is currently being built. Something useful is on its
              way.
            </p>
            <div className="terminal">
              <span className="prompt">~</span> preparing something useful
              <span className="cursor" />
            </div>
          </section>
        </main>

        <footer>
          <div className="tools-banner">
            Looking for useful tools?
            <a href="https://tools.mausamgiri.in">
              Explore tools.mausamgiri.in
              <span className="arrow">→</span>
            </a>
          </div>
          <VisitCounter />
        </footer>
      </div>
    </div>
  );
}