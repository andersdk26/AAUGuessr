import { ReactNode } from "react";

interface DismissibleAlertProps {
    children: ReactNode;
    type?:
        | "primary"
        | "secondary"
        | "success"
        | "danger"
        | "warning"
        | "info"
        | "light"
        | "dark";
    onDismiss: () => void;
}

/**
 * A React component that renders a dismissible alert box.
 *
 * @param {React.ReactNode} children - The content to be displayed inside the alert box.
 * @param {() => void} onDismiss - The callback function to be called when the alert is dismissed.
 *
 * @returns {JSX.Element} The rendered alert component.
 */
function DismissibleAlert({ children, onDismiss }: DismissibleAlertProps) {
    return (
        <div
            className="alert alert-warning alert-dismissible fade show"
            role="alert"
        >
            {children}
            <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                onClick={onDismiss}
            ></button>
        </div>
    );
}

export default DismissibleAlert;
