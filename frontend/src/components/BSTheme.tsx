import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

interface BSThemeProps {
    className?: string;
}

/**
 * A React functional component that toggles between light and dark Bootstrap themes.
 *
 * @component
 * @param {BSThemeProps} props - The properties for the BSTheme component.
 * @param {string} props.className - Additional class names to apply to the button.
 *
 * @returns {JSX.Element} A button that toggles the theme when clicked.
 *
 * @example
 * <BSTheme className="my-custom-class" />
 *
 * @remarks
 * This component uses localStorage to persist the theme across sessions.
 * It also updates the `data-bs-theme` attribute on the document's root element
 * to apply the selected theme.
 */
function BSTheme({ className }: BSThemeProps) {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <Button
            type="secondary"
            onClick={toggleTheme}
            outline={true}
            className={className}
        >
            <FontAwesomeIcon
                icon={theme === "light" ? faMoon : faSun}
                className="fa-lg"
            />
        </Button>
    );
}

export default BSTheme;
