import type { GetServerSideProps, GetServerSidePropsResult } from "next";

export const getServerSideProps: GetServerSideProps = async (): Promise<
  GetServerSidePropsResult<{
    /* type of props */
  }>
> => {
  return {
    redirect: {
      destination: "/dashboard", // Specify the URL you want to redirect to
      permanent: false, // This should generally be false unless this is a permanent redirect for SEO purposes
    },
  };
};

const HomePage = () => {
  return null; // Component does nothing since it always redirects
};

export default HomePage;
