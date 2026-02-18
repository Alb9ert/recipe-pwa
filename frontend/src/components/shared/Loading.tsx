import { Spinner, type SpinnerProps } from "../shadcn/spinner";

const spinnerVariant: SpinnerProps["variant"] = "default";

type LoadingProps = {
  loadingText?: string;
};

const Loading = ({ loadingText = "Loading..." }: LoadingProps) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center text-center flex-col gap-4">
      <Spinner variant={spinnerVariant} size={30} />
      <p>{loadingText}</p>
    </div>
  );
};

export default Loading;
