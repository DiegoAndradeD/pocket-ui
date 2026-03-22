import { useState } from "react";
import { ComponentCard } from "../ComponentCard";
import Image from "../ui/Image";
import { Button } from "../ui/Button";

const MOCK_IMAGE_1 =
  "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=800&auto=format&fit=crop";

export function ImageDemo() {
  const [reloadKey, setReloadKey] = useState(0);

  const triggerReload = () => setReloadKey((prev) => prev + 1);

  return (
    <div className="w-full flex flex-col gap-8">
      <ComponentCard
        title="Interactive Image"
        description="A clickable image with a built-in zoom effect on hover and keyboard support."
      >
        <div className="w-full max-w-md">
          <Image
            key={`interactive-${reloadKey}`}
            src={MOCK_IMAGE_1}
            alt="Mountain landscape"
            aspect="video"
            radius="lg"
            isClickable
            onClick={() => alert("Image clicked!")}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={triggerReload}
          className="mt-4"
        >
          Reload to see Skeleton
        </Button>
      </ComponentCard>

      <ComponentCard
        title="Aspect Ratios & Object Fit"
        description="Easily enforce aspect ratios without breaking the layout."
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Video (16:9)
            </span>
            <Image src={MOCK_IMAGE_1} aspect="video" radius="md" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Square (1:1)
            </span>
            <Image src={MOCK_IMAGE_1} aspect="square" radius="md" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Portrait (3:4)
            </span>
            <Image src={MOCK_IMAGE_1} aspect="portrait" radius="md" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Wide (21:9)
            </span>
            <Image src={MOCK_IMAGE_1} aspect="wide" radius="md" />
          </div>{" "}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Overlays"
        description="Render text, badges, or gradients directly on top of the image."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          <Image
            src={MOCK_IMAGE_1}
            aspect="video"
            radius="lg"
            overlay={
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md font-medium">
                PRO
              </div>
            }
          />

          <Image
            src={MOCK_IMAGE_1}
            aspect="video"
            radius="lg"
            isClickable
            overlay={
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold">Desert Dunes</h3>
              </div>
            }
          />
        </div>
      </ComponentCard>

      <ComponentCard
        title="States: Loading, Fallback & Error"
        description="How the component behaves when the image is missing or the network fails."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Forced Skeleton
            </span>
            <Image isLoading aspect="square" radius="md" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              No Source (Fallback)
            </span>
            <Image aspect="square" radius="md" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Broken URL (Error)
            </span>
            <Image
              src="https://this-url-does-not-exist.com/image.jpg"
              aspect="square"
              radius="md"
            />
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
