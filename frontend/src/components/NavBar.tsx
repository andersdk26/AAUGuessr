import { useState } from "react";
import BSTheme from "./BSTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

interface NavBarProps {
    title: string;
    pages: {
        name: string;
        path: string;
        disabled: boolean;
    }[];
}

/**
 * NavBar component renders a responsive navigation bar with a title, pages, and a theme button.
 * It includes a hamburger menu for smaller screens.
 *
 * @component
 * @param {NavBarProps} props - The props for the NavBar component.
 * @param {string} props.title - The title displayed in the navigation bar.
 * @param {Array<{ path: string, name: string, disabled?: boolean }>} props.pages - The list of pages to display in the navigation bar.
 *
 * @example
 * const pages = [
 *   { path: '/home', name: 'Home' },
 *   { path: '/about', name: 'About', disabled: true },
 *   { path: '/contact', name: 'Contact' }
 * ];
 *
 * <NavBar title="My Website" pages={pages} />
 */
function NavBar({ title, pages }: NavBarProps) {
    const [hamburgerShown, setHamburgerShown] = useState(false);
    const [hamburgerAnimation, setHamburgerAnimation] = useState(false);

    return (
        // NavBar breakpoint setting: -sm|-md|-lg|-xl|-xxl
        <nav className="navbar bg-body-tertiary fixed-top navbar-expand-md">
            <div className="container-fluid">
                {/* Title */}
                <a className="navbar-brand" href="/">
                    {title}
                </a>
                {/* Hamburger menu */}
                <div
                    className={
                        "offcanvas offcanvas-end " +
                        (hamburgerShown
                            ? "show showing"
                            : hamburgerAnimation
                            ? "hiding"
                            : "")
                    }
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    aria-modal="true"
                    role="dialog"
                >
                    {/* Hamburger menu title and cross*/}
                    <div className="offcanvas-header">
                        <h5
                            className="offcanvas-title"
                            id="offcanvasNavbarLabel"
                        >
                            {title}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                            onClick={() => {
                                setHamburgerShown(false);
                                setTimeout(
                                    () => setHamburgerAnimation(false),
                                    500
                                );
                            }}
                        ></button>
                    </div>
                    {/* Menu items */}
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-start flex-grow-1 pe-3">
                            {pages.map(({ path, name, disabled }) => (
                                <li className="nav-item" key={name}>
                                    <a
                                        className={
                                            "nav-link " +
                                            (disabled ? "disabled" : "active")
                                        }
                                        aria-current="page"
                                        href={path}
                                    >
                                        {name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Theme button */}
                <div className="justify-content-end">
                    <BSTheme className="navbar-button" />
                    {/* Hamburger menu button */}
                    <button
                        title="Menu"
                        className="btn btn-outline-secondary btn-navbar-toggler navbar-button"
                        onClick={() => {
                            setHamburgerShown(true);
                            setHamburgerAnimation(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faBars} className="fa-lg" />
                    </button>
                </div>
                {/* Hamburger menu backdrop */}
                {hamburgerAnimation && (
                    <div
                        className={
                            "offcanvas-backdrop fade " +
                            (hamburgerShown ? "fade show showing" : "hiding")
                        }
                        onClick={() => {
                            setHamburgerShown(false);
                            setTimeout(() => setHamburgerAnimation(false), 500);
                        }}
                    ></div>
                )}
            </div>
        </nav>
    );
}

export default NavBar;
