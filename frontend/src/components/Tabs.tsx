import { useEffect, useState } from "react";

interface TabsProps {
    items: { name: string; path: string }[];
    selectedPath: string | undefined;
}

/**
 * A functional component that renders a set of tabs.
 *
 * @param {TabsProps} props - The properties object.
 * @param {Array<{ name: string, path: string }>} props.items - An array of tab items, each containing a name and a path.
 * @param {string} props.selectedPath - The path of the currently selected tab.
 *
 * @returns {JSX.Element} The rendered tabs component.
 *
 * @example
 * const items = [
 *   { name: 'Tab 1', path: '/tab1' },
 *   { name: 'Tab 2', path: '/tab2' },
 * ];
 * const selectedPath = '/tab1';
 *
 * <Tabs items={items} selectedPath={selectedPath} />
 */
function Tabs({ items, selectedPath }: TabsProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Set the selected index based on the selected path
    useEffect(() => {
        if (selectedPath) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].path == selectedPath) {
                    setSelectedIndex(i);
                    break;
                }
            }
        }
    }, [selectedPath, items]);

    return (
        <>
            <ul className="nav nav-tabs">
                {/* Render each tab item */}
                {items.map((item, index) => (
                    <li className="nav-item" key={index}>
                        <a
                            className={
                                selectedIndex === index
                                    ? "nav-link active"
                                    : "nav-link" +
                                      (item.name
                                          ? ""
                                          : " placeholder-wave active")
                            }
                            aria-current="page"
                            href={item.path}
                            onClick={() => setSelectedIndex(index)}
                        >
                            {item.name || (
                                <p
                                    className="reset-space placeholder"
                                    style={{
                                        display: "block",
                                        color: "var(--bs-link-color)",
                                    }}
                                >
                                    Loading...
                                </p>
                            )}
                        </a>
                    </li>
                ))}
            </ul>
            <ul className="list-group"></ul>
        </>
    );
}

export default Tabs;
