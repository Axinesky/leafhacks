import { Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { getModule } from "@/modules/registry";

/** Resolves /learn/:id to the registered module and renders it. */
export function ModuleRoute() {
  const { id } = useParams();
  const module = getModule(id);

  if (!module) {
    return (
      <div>
        <h1>Module not found</h1>
        <p>
          <Link to="/">Back to home</Link>
        </p>
      </div>
    );
  }

  const Component = module.component;
  return (
    <div style={{ ["--accent" as string]: module.accent }}>
      <Suspense fallback={<p>Loading {module.title}…</p>}>
        <Component />
      </Suspense>
    </div>
  );
}
