import styles from "./Page.module.css";

export default async function About() {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <h1>About FundNeighbors</h1>
        <p>
          FundNeighbors is a platform created to make it easier for individuals
          and families to find and support fundraisers. It was born out of the
          need to have a central source to locate various fundraisers and
          contribute to causes that matter.
        </p>
        <h2>Why FundNeighbors?</h2>
        <p>
          Our family has always enjoyed supporting different fundraisers, but we
          often faced challenges in finding relevant and ongoing events. We
          wanted to create a solution that would simplify the process and
          provide a comprehensive platform for fundraisers of all types.
        </p>
        <h2>The Team</h2>
        <p>
          FundNeighbors is a collaborative effort between the Morse family. We
          share a common goal of making a positive impact in our community by
          supporting various causes. We aim to create an intuitive and
          user-friendly platform for fundraisers and donors alike. Please
          don&apos;t hesitate to give any feedback to make the process easier
          for everyone.
        </p>
        <h2>Contact Us</h2>
        <p>
          Email:{" "}
          <a href="mailto:fundneighbors@morsepages.com">
            fundneighbors@morsepages.com
          </a>
        </p>
      </div>
    </div>
  );
}
