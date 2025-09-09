import { Facebook, Instagram, Linkedin, Clipboard, X } from "lucide-react";

  const ShareModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    url: string;
  }> = ({ isOpen, onClose, url }) => {
  
    if (!isOpen) return null;
  
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
  
    const copyToClipboard = () => {
      navigator.clipboard.writeText(url).then(
        () => {
          // Copy successful
        },
        () => {
          // Copy failed
        }
      );
    };
  
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in p-4"
        onClick={handleBackdropClick}
      >
        <div className="relative bg-card rounded-xl shadow-lg p-6 w-full max-w-md m-4 border border-border">
          <div className=" flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Share Public Link</h2>
  
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 text-foreground rounded-full hover:bg-foreground/10 hover:text-foreground transition-colors z-10 cursor-pointer"
            >
              <X />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 bg-background border border-border rounded-lg p-2">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 bg-transparent text-muted-foreground focus:outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-primary p-2 rounded-md text-sm font-semibold hover:bg-primary/70"
              >
                <Clipboard className="text-white" />
              </button>
            </div>
            <div className="text-center text-muted-foreground text-sm">
              Or share on social media
            </div>
            <div className="flex justify-center gap-4">
              {/* Add your social media icons here */}
              <button className="p-3 border border-border rounded-full hover:bg-blue-300 cursor-pointer">
                <Facebook className="w-6 h-6 text-foreground" />
              </button>
              <button className="p-3 border border-border rounded-full hover:bg-blue-200 cursor-pointer">
                <Linkedin className="w-6 h-6 text-foreground" />
              </button>
              <button className="p-3 border border-border rounded-full hover:bg-pink-200 cursor-pointer">
                <Instagram className="w-6 h-6 text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default ShareModal;

