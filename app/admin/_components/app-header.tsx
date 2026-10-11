import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/shadcn/separator";
import { SidebarTrigger } from "@/components/ui/shadcn/sidebar";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-white px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-center" />
      <Button
        variant="link"
        render={
          <a href="/" target="_blank" rel="noopener noreferrer" className="ml-auto text-s">
            Visit site
          </a>
        }
      />
    </header>
  );
}
