import { useState } from "react";

interface PaginationProps {
    pages: number;
    pagesToShow?: number;
    onSelectItem: (page: number) => void;
    type?: "text" | "symbol";
}

/**
 * Pagination component for navigating through pages.
 *
 * @param {Object} props - The properties object.
 * @param {number} props.pages - The total number of pages.
 * @param {function} props.onSelectItem - Callback function to handle page selection.
 * @param {number} [props.pagesToShow=5] - The number of pages to display in the pagination control.
 * @param {string} props.type - The type of pagination labels ("symbol" for symbols or default for text).
 *
 * @returns {JSX.Element} The rendered pagination component.
 */
function Pagination({
    pages,
    onSelectItem,
    pagesToShow = 5,
    type,
}: PaginationProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    let labels = ["First", "Previous", "Next", "Last"];

    if (type === "symbol") {
        labels = ["«", "‹", "›", "»"];
    }

    const firstIndex = () => {
        if (selectedIndex < 1) {
            return 1;
        }
        return 0;
    };

    const lastIndex = () => {
        if (selectedIndex >= pages - 1) {
            return 1;
        }
        return 0;
    };

    const getItems = () => {
        const items = [];
        let count = 0;

        for (let i = 0; i < pages; i++) {
            // Calculate which pages to show
            if (
                (i < selectedIndex - pagesToShow / 2 &&
                    selectedIndex < pages - pagesToShow / 2) ||
                (i < pages - pagesToShow &&
                    selectedIndex > pages - pagesToShow / 2) ||
                count >= pagesToShow
            ) {
                continue;
            }
            count++;

            // Add page item
            items.push(
                <li key={i} className="page-item">
                    <a
                        className={
                            selectedIndex === i
                                ? "page-link no-select active"
                                : "page-link no-select"
                        }
                        onClick={() => {
                            setSelectedIndex(i);
                            onSelectItem(i);
                        }}
                    >
                        {i + 1}
                    </a>
                </li>
            );
        }

        return items;
    };

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
                {/* "First" button */}
                {pages > pagesToShow && (
                    <li
                        className={
                            "page-item" + (firstIndex() ? " disabled" : "")
                        }
                    >
                        <a
                            className="page-link no-select"
                            onClick={() => {
                                setSelectedIndex(0);
                                onSelectItem(selectedIndex);
                            }}
                        >
                            {labels[0]}
                        </a>
                    </li>
                )}
                {/* "Previous" button */}
                <li className={"page-item" + (firstIndex() ? " disabled" : "")}>
                    <a
                        className="page-link no-select"
                        onClick={() => {
                            setSelectedIndex(selectedIndex - 1);
                            onSelectItem(selectedIndex);
                        }}
                    >
                        {labels[1]}
                    </a>
                </li>
                {/* Page items */}
                {getItems()}
                {/* "Next" button */}
                <li className={"page-item " + (lastIndex() ? "disabled" : "")}>
                    <a
                        className="page-link no-select"
                        onClick={() => {
                            setSelectedIndex(selectedIndex + 1);
                            onSelectItem(selectedIndex);
                        }}
                    >
                        {labels[2]}
                    </a>
                </li>
                {/* "Last" button */}
                {pages > pagesToShow && (
                    <li
                        className={
                            "page-item " + (lastIndex() ? "disabled" : "")
                        }
                    >
                        <a
                            className="page-link no-select"
                            onClick={() => {
                                setSelectedIndex(pages - 1);
                                onSelectItem(selectedIndex);
                            }}
                        >
                            {labels[3]}
                        </a>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Pagination;
