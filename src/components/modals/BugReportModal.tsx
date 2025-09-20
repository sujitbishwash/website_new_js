import { Bug, Check, CircleCheck, File, Paperclip, X } from "lucide-react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  appContainerRef: React.RefObject<null>;
}

export default function BugReportModal({
  isOpen,
  onClose,
  appContainerRef,
}: BugReportModalProps) {
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [attachScreenshot, setAttachScreenshot] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Dynamically load the dom-to-image-more script when the component mounts
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/dom-to-image-more@3.1.6/dist/dom-to-image-more.min.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachScreenshot(false); // Turn off screenshot if a file is manually selected
      setAttachment(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachmentPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachmentPreview(null);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
  };

  const handleScreenshotToggle = async (checked) => {
    setAttachScreenshot(checked);

    if (checked) {
      removeAttachment();

      if (typeof window.domtoimage === "undefined") {
        setError(
          "Screenshot library is loading. Please try again in a moment."
        );
        setAttachScreenshot(false);
        return;
      }

      if (!appContainerRef.current) {
        setError("Could not find the app container to screenshot.");
        setAttachScreenshot(false);
        return;
      }

      try {
        // Filter function to exclude the modal from the screenshot
        const filter = (node) => {
          // Return false for the modal container to exclude it
          if (
            node.classList &&
            node.classList.contains("bug-report-modal-container")
          ) {
            return false;
          }
          // Return true for all other nodes to include them
          return true;
        };

        // Use domtoimage.toPng with the filter option
        const screenshotDataUrl = await window.domtoimage.toPng(
          appContainerRef.current,
          { filter: filter }
        );

        setAttachmentPreview(screenshotDataUrl);

        const blob = await (await fetch(screenshotDataUrl)).blob();
        const screenshotFile = new File([blob], "screenshot.png", {
          type: "image/png",
        });
        setAttachment(screenshotFile);
      } catch (err) {
        console.error(
          "Error capturing screenshot with dom-to-image-more:",
          err
        );
        setError("Could not capture screenshot. Please try again.");
        setAttachScreenshot(false);
      }
    } else {
      removeAttachment();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description) {
      setError("Please fill out all required fields.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    console.log({
      description,
      attachment: attachment ? attachment.name : "No file attached",
    });
    setError("");
    setIsSubmitted(true);
  };

  const handleNewReport = () => {
    setDescription("");
    setAttachment(null);
    setAttachmentPreview(null);
    setError("");
    setIsSubmitted(false);
    setAttachScreenshot(false);
  };

  const closeModal = () => {
    // The timeout prevents the image from disappearing before the modal fade-out animation completes.
    setTimeout(() => {
      setAttachment(null);
      setAttachmentPreview(null);
      setIsSubmitted(false); // Reset submission status on close
    }, 300);
    setIsModalOpen(false);
  };
  const inputBaseClass =
    "w-full p-4 bg-background-subtle text-foreground border border-border rounded-lg transition placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in p-4">
      {isSubmitted ? (
        <div className="relative w-full max-w-xl bg-card rounded-2xl shadow-2xl border border-border flex flex-col max-h-[90vh] p-4">
        <div className="text-center">
          <div className="mx-auto mb-5 flex items-center justify-center">
            <CircleCheck className="h-14 w-14 text-[#30d158]" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Report Submitted
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Thank you for your feedback. Our team will look into it shortly.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleNewReport}
              className="py-2 px-5 bg-[#3a3a3c] hover:bg-[#4a4a4c] text-white font-semibold rounded-lg transition"
            >
              Submit Another
            </button>
            <button
              onClick={() => {
                handleNewReport(); // reset all fields
                onClose(); // existing close logic
              }}
              className="py-2 px-6 bg-[#0a84ff] hover:bg-[#0071e3] text-white font-semibold rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
        </div>
      ) : (
        <div className="bug-report-modal-container relative w-full max-w-xl bg-card rounded-2xl shadow-2xl border border-border flex flex-col max-h-[90vh]">
          {/* Modal Header */}
          <div className="p-5 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-foreground">
              What happened?
            </h3>
            <button
              onClick={() => {
                handleNewReport(); // reset all fields
                onClose(); // existing close logic
              }}
              className="absolute top-3 right-3 p-2 text-foreground rounded-full hover:bg-foreground/10 hover:text-foreground transition-colors z-10 cursor-pointer"
            >
              <X />
            </button>
          </div>
          <form noValidate className="px-4 space-y-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className={inputBaseClass}
                    placeholder="Tell us about the issue you encountered."
                    required
                  ></textarea>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-start gap-2">
                  <span className="text-sm">Attach image</span>
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer rounded-full p-2 text-border-medium hover:bg-border/50"
                    title="Upload a file"
                  >
                    <Paperclip className="w-6 h-6" />
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <span className="text-sm">Attach current screen</span>
                  <label
                    htmlFor="screenshot-toggle"
                    className="relative inline-flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      id="screenshot-toggle"
                      className="sr-only peer"
                      checked={attachScreenshot}
                      onChange={(e) => handleScreenshotToggle(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
                {attachment && (
                  <div className="mt-4 relative flex items-center p-3 w-full bg-border/50 rounded-lg">
                    <div className="flex-shrink-0">
                      {attachmentPreview ? (
                        <img
                          src={attachmentPreview}
                          alt="Preview"
                          className="h-12 w-12 object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-card rounded-md flex items-center justify-center">
                          <File className="h-6 w-6 text-border-medium" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="cursor-pointer ml-4 flex-shrink-0 p-1 text-foreground hover:bg-border-medium rounded-full  transition"
                      title="Remove attachment"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p className="text-[#ff453a] text-sm mt-4 text-center">{error}</p>
            )}
          </form>

          <div className="flex justify-end items-center gap-4 p-5 border-border bg-card rounded-b-2xl">
            <button
              onClick={() => {
                handleNewReport(); // reset all fields
                onClose(); // existing close logic
              }}
              className="cursor-pointer px-5 py-2 text-sm font-semibold text-muted-foreground bg-foreground/10 rounded-lg hover:bg-foreground/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors"
            >
              Cancel
            </button>
            <button
            onClick={handleSubmit}
              className="cursor-pointer px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1d1d1f] transition-all disabled:bg-blue-600/50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
