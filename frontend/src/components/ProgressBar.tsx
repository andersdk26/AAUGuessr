interface ProgressBarProps {
    progress: number;
    height?: number;
    showLabel?: boolean;
    type?:
        | "primary"
        | "secondary"
        | "success"
        | "danger"
        | "warning"
        | "info"
        | "light"
        | "dark"
        | "default";
}

/**
 * ProgressBar component displays a progress bar with customizable properties.
 *
 * @param {number} progress - The current progress value (0-100).
 * @param {number} [height=16] - The height of the progress bar in pixels.
 * @param {boolean} [showLabel=false] - Whether to show the progress percentage as a label.
 * @param {string} [type="default"] - The type of the progress bar, which determines its color.
 *
 * @returns {JSX.Element} The rendered progress bar component.
 */
const ProgressBar = ({
    progress,
    height = 16,
    showLabel = false,
    type = "default",
}: ProgressBarProps) => {
    return (
        <div
            className="progress noselect"
            role="progressbar"
            style={{ height: height + "px" }}
        >
            <div
                className={
                    "progress-bar" + (type !== "default" ? " bg-" + type : "")
                }
                style={{ width: progress + "%", height: height + "px" }}
            >
                {showLabel && progress + "%"}
            </div>
        </div>
    );
};

export default ProgressBar;
