import { ReactNode } from "react";

interface AlertProps {
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
}

/**
 * Alert component to display a styled alert message.
 *
 * @param {React.ReactNode} children - The content to be displayed inside the alert.
 * @param {string} [type="primary"] - The type of alert, which determines the styling. Default is "primary".
 * @returns {JSX.Element} A div element with the appropriate alert class and role.
 */
const Alert = ({ children, type = "primary" }: AlertProps) => {
    return (
        <div className={"alert alert-" + type} role="alert">
            {children}
        </div>
    );
};

export default Alert;
