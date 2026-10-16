import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold text-ink">Page not found</h1>
      <p className="text-sm text-muted">The page you requested does not exist.</p>
      <Button href="/">Back to home</Button>
    </div>
  );
}
