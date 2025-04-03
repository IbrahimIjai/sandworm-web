import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Facebook, Link, Linkedin, Twitter, X } from "lucide-react";
import { toast } from "sonner";

const sharePlatforms = [
  {
    name: "Twitter",
    url: (link: string) => `https://twitter.com/intent/tweet?url=${link}`,
    Icon: Twitter,
  },
  {
    name: "Facebook",
    url: (link: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${link}`,
    Icon: Facebook,
  },
  {
    name: "LinkedIn",
    url: (link: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${link}`,
    Icon: Linkedin,
  },
];

type ShareDialogueProps = {
  url: string;
};

export const ShareDialogue = ({ url }: ShareDialogueProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success("Query link copied to clipboard!");
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" aria-label="Open share modal">
          Share Query
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-6 text-center">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center ">
            Share Your Query
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-400">
          Share your query with others. Use the social buttons below or copy the
          link to share manually.
        </p>

        <div className="flex justify-center gap-3 my-4">
          {sharePlatforms.map(({ name, url, Icon }) => (
            <Button
              key={name}
              variant="outline"
              size="icon"
              onClick={() => window.open(url(url), "_blank")}
              aria-label={`Share on ${name}`}
            >
              <Icon className="w-5 h-5" />
            </Button>
          ))}
          {navigator.share && (
            <Button
              variant="outline"
              size="icon"
              onClick={shareNative}
              aria-label="Share via system"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between border p-2 rounded-md">
          <span className="truncate text-sm text-gray-200">{url}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={copyToClipboard}
            aria-label="Copy query link"
          >
            <Copy className="w-5 h-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
