import { Link, useNavigate } from "react-router";
import useOrderVideoPage from "../hooks/useOrderVideoPage";
import { OrderVideoSkeleton } from "../components/LoadingSkeletons";
import { PageError } from "../components/PageError";
import { ArrowLeftIcon, VideoIcon } from "lucide-react";

import {
  CallControls,
  StreamVideo,
  StreamCall,
  StreamTheme,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

function OrderVideoPage() {
  const navigate = useNavigate();

  const { id, order, paid, isLoading, loadError, client, call, error } = useOrderVideoPage();

  if (isLoading) {
    return <OrderVideoSkeleton />;
  }

  if (loadError || !order) {
    return (
      <PageError
        message="Order not found or you don't have access."
        action={{ to: "/orders", label: "Back to orders" }}
      />
    );
  }

  if (!paid) {
    return (
      <div role="alert" className="alert alert-info">
        <span>This order must be paid before you can join video support.</span>
      </div>
    );
  }

  if (error) {
    return <PageError message={error} />;
  }

  if (!client || !call) {
    return (
      <div className="flex min-h-120 items-center justify-center rounded-box border border-base-300 bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <Link to={`/orders/${id}/chat`} className="btn btn-ghost btn-sm gap-2 text-base-content/80">
        <ArrowLeftIcon className="size-4" aria-hidden />
        Back to support chat
      </Link>

      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body flex-row items-start gap-4">
          <div className="avatar placeholder">
            <div className="w-12 rounded-box bg-secondary/20 text-secondary flex items-center justify-center">
              <VideoIcon className="size-6" aria-hidden />
            </div>
          </div>
          <div>
            <h1 className="card-title text-lg">Video call</h1>
            <p className="text-sm text-base-content/70">
              Same room as the invite link in chat. Allow camera and microphone when your browser
              asks.
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-130 flex-col overflow-hidden rounded-box border border-base-300 bg-base-100">
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <StreamTheme className="str-video__theme-custom">
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="relative min-h-105 flex-1 bg-neutral text-neutral-content">
                  <SpeakerLayout />
                </div>
                <div className="shrink-0 border-t border-base-300 bg-base-200/90 px-2 py-3 [&_.str-video__call-controls]:flex-wrap [&_.str-video__call-controls]:justify-center">
                  <CallControls onLeave={() => navigate(`/orders/${id}/chat`)} />
                </div>
              </div>
            </StreamTheme>
          </StreamCall>
        </StreamVideo>
      </div>
    </div>
  );
}

export default OrderVideoPage;
