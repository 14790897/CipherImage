import SteganographyTool from "@/components/steganography-tool"
import { GitHubBanner } from "@/components/github-banner";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <GitHubBanner />
      <SteganographyTool />
    </div>
  );
}
