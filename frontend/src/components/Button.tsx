import { ReactNode } from "react";

interface ButtonBaseProps {
    outline?: boolean;
    onClick: () => void;
    className?: string;
}

// Normal button variant
interface ButtonWithChildren extends ButtonBaseProps {
    type?:
        | "primary"
        | "secondary"
        | "success"
        | "danger"
        | "warning"
        | "info"
        | "light"
        | "dark";
    children: ReactNode;
}

// Close button variant
interface CloseButton extends ButtonBaseProps {
    type: "close";
    children?: never;
}

// Union type for the two button variants
type ButtonProps = ButtonWithChildren | CloseButton;

/**
 * Button component that renders a styled close or normal button element.
 *
 * @param {ButtonProps} props - The properties for the Button component.
 * @param {ReactNode} [props.children] - The content to be displayed inside the button.
 * @param {"primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "close"} [props.type="primary"] - The type of button, which determines its styling.
 * @param {boolean} [props.outline=false] - Whether the button should have an outline style.
 * @param {() => void} props.onClick - The function to be called when the button is clicked.
 * @param {string} [props.className] - Additional CSS classes to apply to the button.
 *
 * @returns {JSX.Element} The rendered button element.
 */
function Button({
    children,
    type = "primary",
    onClick,
    outline = false,
    className,
}: ButtonProps) {
    const outlineText = () => (outline ? "outline-" : "");

    return (
        <button
            type="button"
            className={`btn btn-${outlineText() + type} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;
