import { ProjectHub } from "@/src/components/ProjectHub";
import { hub } from "@/src/content/hub";

export default function Home() {
  return <ProjectHub content={hub} />;
}
