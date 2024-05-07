// import type { GetServerSideProps, GetServerSidePropsContext } from "next";
// import { getCurrentUser } from "@aws-amplify/auth";

// interface ProtectedProps {
//   authenticated: boolean;
//   username?: string;
// }

// function Protected({ authenticated, username }: ProtectedProps) {
//   if (!authenticated) {
//     return <h1>Not Authenticated</h1>;
//   }
//   return <h1>Hello {username} from SSR route!</h1>;
// }

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const user = await getCurrentUser();
//     console.log("user", user);
//     return {
//       props: {
//         authenticated: true,
//         username: user.username,
//       },
//     };
//   } catch (err) {
//     console.log("Authentication error:", err);
//     return {
//       props: {
//         authenticated: false,
//       },
//     };
//   }
// };

// export default Protected;
