import type { Metadata } from "next";
import { ProjectIndex } from "@/components/project-index";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected works by Studio Motian.",
};

export default function WorkPage() {
  return (
    <section className="container-x pb-10 pt-28 md:pt-48">
      <ProjectIndex projects={projects} />
    </section>
  );
}
