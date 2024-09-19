import styles from "./Home.module.css";

export default async function Home() {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <h1>Welcome to FundNeighbors!</h1>
        <p>Find fundraisers to support your community and make a difference</p>
        <p>
          With FundNeighbors, you can discover a wide range of fundraisers
          happening in your local area. Whether it&apos;s supporting a school,
          local charity, or other organized groups, FundNeighbors is your go-to
          platform for finding meaningful ways to give back.
        </p>
        <p>
          Explore our curated list of fundraisers and filter them based on the
          groups you are looking to support. They will certainly appreciate it!
        </p>
        <p>
          Join our vibrant community of individuals who are dedicated to making
          a positive impact through the simple act of eating a meal. Please find
          a place to eat, share your own fundraising initiatives, and encourage
          others to join.
        </p>
        <p>
          Ready to get started? Look at the available events or sign up for an
          account and start exploring the countless opportunities to support
          your community and create a better world for everyone.
        </p>
      </div>
    </div>
  );
}
