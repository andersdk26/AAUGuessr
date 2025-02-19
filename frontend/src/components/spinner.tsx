import { useEffect, useRef } from "react";

interface SpinnerProps {
    type?:
        | "primary"
        | "secondary"
        | "success"
        | "danger"
        | "warning"
        | "info"
        | "default"
        | "light"
        | "dark";
}

/**
 * Spinner component that displays a loading spinner with a dynamic type.
 *
 * @param {SpinnerProps} props - The properties for the Spinner component.
 * @param {string} [props.type="default"] - The type of the spinner, which can be "default", "light", or "dark".
 *
 * @returns {JSX.Element} A JSX element representing the spinner.
 *
 * @remarks
 * If the `type` prop is "default", the spinner type will be determined based on the theme stored in localStorage.
 * If the theme is "dark", the spinner type will be "light", and vice versa.
 */
const Spinner = ({ type = "default" }: SpinnerProps) => {
    const typeRef = useRef(type);

    // Determine the spinner type based on the theme in localStorage
    useEffect(() => {
        if (typeRef.current === "default") {
            const theme = localStorage.getItem("theme") || "dark";
            typeRef.current = theme === "dark" ? "light" : "dark";
        }
    }, [type]);

    return (
        <div className={"spinner-border text-" + typeRef.current} role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    );
};

export default Spinner;
