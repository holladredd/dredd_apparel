import { useRouter } from "next/router";
import { useRef } from "react";

export default function GoogleButton({}) {
  const googleButtonRef = useRef(null);
  const tokenClientRef = useRef(null);
  const router = useRouter();
  const { setUser, setUserType, setActiveUserType, setIsAuthenticated } =
    useAuth();

  // React Query mutation for Google login
  const googleLoginMutation = useMutation({
    mutationFn: async (access_token) => {
      const payload = {
        access_token,
        is_talent,
        is_recruiter,
        associate_account: true,
      };
      const response = await api.post("/auth/google/callback/", payload);
      return response.data;
    },
    onSuccess: (data) => {
      const { access, refresh, user } = data;

      Cookies.set("authToken", access, { expires: 7 });
      Cookies.set("refreshToken", refresh, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
      const userType = user.is_recruiter ? "recruiter" : "talent";
      Cookies.set("userType", userType, { expires: 7 });
      Cookies.set("activeUserType", userType, { expires: 7 });

      setUser(user);
      setUserType(userType);
      setActiveUserType(userType);
      setIsAuthenticated(true);

      const dashboardPath = `/dashboard/${userType}/overview`;
      const returnTo = router.query.returnTo;

      if (returnTo && returnTo.startsWith("/dashboard/")) {
        if (returnTo.includes(userType)) {
          router.push(returnTo);
        } else {
          router.push(dashboardPath);
        }
      } else {
        router.push(dashboardPath);
      }

      onCompleted?.({ success: true, user, userType, token: access });
    },
    onError: (error) => {
      console.error("Google login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Something went wrong during Google login.",
      });
      onCompleted?.({ success: false, error: error.message });
    },
  });

  useEffect(() => {
    if (!window.google || disabled) return;

    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      callback: async (tokenResponse) => {
        if (tokenResponse?.access_token) {
          googleLoginMutation.mutate(tokenResponse.access_token);
        } else {
          console.error("No access token returned from Google");
        }
      },
    });

    if (googleButtonRef.current) {
      googleButtonRef.current.onclick = () => {
        tokenClientRef.current.requestAccessToken();
      };
    }
  }, [disabled, is_talent, is_recruiter]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />
      <div className="my-4 w-full">
        <button
          ref={googleButtonRef}
          disabled={disabled || googleLoginMutation.isPending}
          className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition duration-200"
          type="button"
        >
          <FaGoogle className="text-orange-600 mx-2" />
          {googleLoginMutation.isPending
            ? "Signing in..."
            : "Sign in with Google"}
        </button>
      </div>
    </>
  );
}
