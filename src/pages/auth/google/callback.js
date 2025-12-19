import { useEffect } from "react";
import { useRouter } from "next/router";

const GoogleCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const { accessToken, user: userString } = router.query;

    if (accessToken && userString) {
      try {
        const user = JSON.parse(userString);
        const { refreshToken, ...userData } = user;

        if (refreshToken) {
          window.opener.postMessage(
            {
              accessToken,
              refreshToken,
              user: userData,
            },
            window.location.origin
          );
        } else {
          console.error(
            "RefreshToken not found in user object from Google callback"
          );
        }
      } catch (error) {
        console.error("Failed to parse user data from Google callback", error);
      } finally {
        window.close();
      }
    } else if (router.query.error) {
      console.error("Google authentication error:", router.query.error);
      window.close();
    }
  }, [router.query]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
