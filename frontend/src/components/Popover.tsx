import { ReactNode, useState, useRef, useLayoutEffect } from "react";

interface PopoverProps {
    children: ReactNode;
    title?: string;
    content: ReactNode;
    placement?: "top" | "right" | "bottom" | "left";
}

// runtime mapping
const placementMap = {
    top: "top",
    right: "end",
    bottom: "bottom",
    left: "start",
} as const;

function getBsPlacement(p: "top" | "right" | "bottom" | "left") {
    return placementMap[p];
}

/**
 * A Popover component with arrow correctly centered on each side.
 */
function Popover({
    children,
    title,
    content,
    placement = "top",
}: PopoverProps) {
    const [visible, setVisible] = useState(false);
    const triggerRef = useRef<HTMLSpanElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (visible && triggerRef.current && popoverRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const popoverEl = popoverRef.current;

            // Reset
            popoverEl.style.top = "";
            popoverEl.style.left = "";

            if (placement === "bottom") {
                popoverEl.style.top = `${triggerRect.height + 8 + 16}px`;
                popoverEl.style.left = `${
                    triggerRect.width / 2 - popoverEl.offsetWidth / 2
                }px`;
            } else if (placement === "top") {
                popoverEl.style.top = `${-popoverEl.offsetHeight - 8}px`;
                popoverEl.style.left = `${
                    triggerRect.width / 2 - popoverEl.offsetWidth / 2
                }px`;
            } else if (placement === "left") {
                popoverEl.style.top = `${
                    triggerRect.height / 2 - popoverEl.offsetHeight / 2
                }px`;
                popoverEl.style.left = `${-popoverEl.offsetWidth - 8 - 40}px`;
            } else if (placement === "right") {
                popoverEl.style.top = `${
                    triggerRect.height / 2 - popoverEl.offsetHeight / 2 + 8
                }px`;
                popoverEl.style.left = `${triggerRect.width + 8}px`;
            }
        }
    }, [visible, placement]);

    return (
        <div className="d-inline-block position-relative">
            <span
                ref={triggerRef}
                onClick={() => setVisible(!visible)}
                style={{ cursor: "pointer" }}
            >
                {children}
            </span>

            {visible && (
                <div
                    ref={popoverRef}
                    className={`popover bs-popover-${getBsPlacement(
                        placement
                    )} show`}
                    style={{ position: "absolute", zIndex: 1000 }}
                >
                    {/* Arrow */}
                    <div
                        className="popover-arrow"
                        style={{
                            position: "absolute",
                            ...(placement === "top" && {
                                left: "50%",
                                transform: "translateX(-50%)",
                                top: "100%",
                            }),
                            ...(placement === "bottom" && {
                                left: "50%",
                                transform: "translateX(-50%)",
                                bottom: "0",
                            }),
                            ...(placement === "left" && {
                                top: "50%",
                                transform: "translateY(-50%)",
                                left: "0",
                            }),
                            ...(placement === "right" && {
                                top: "50%",
                                transform: "translateY(-50%)",
                                right: "0",
                            }),
                        }}
                    ></div>

                    {title && <div className="popover-header">{title}</div>}
                    <div className="popover-body">{content}</div>
                </div>
            )}
        </div>
    );
}

export default Popover;
