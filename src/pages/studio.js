import dynamic from "next/dynamic";

const StudioNoSSR = dynamic(() => import("../components/StudioCanvas"), {
  ssr: false,
});

export default function Studio() {
  return <StudioNoSSR />;
}
