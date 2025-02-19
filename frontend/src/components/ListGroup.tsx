import { useState } from "react";

interface ListGroupProps {
    items: string[];
    onSelectItem?: (item: string) => void;
}

/**
 * A functional component that renders a list of items. It allows selecting an item from the list.
 *
 * @component
 * @param {ListGroupProps} props - The props for the ListGroup component.
 * @param {Array<string>} props.items - The array of items to be displayed in the list.
 * @param {function} props.onSelectItem - The callback function to be called when an item is selected.
 *
 * @returns {JSX.Element} The rendered ListGroup component.
 */
function ListGroup({ items, onSelectItem }: ListGroupProps) {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const getMessages = () => {
        return items.length === 0 && <p>No items</p>;
    };

    return (
        <>
            {getMessages()}
            <ul className="list-group">
                {/* Creates list elements */}
                {items.map((item, index) => (
                    <li
                        className={
                            selectedIndex === index
                                ? "list-group-item active"
                                : "list-group-item"
                        }
                        key={index}
                        onClick={() => {
                            if (onSelectItem) {
                                setSelectedIndex(index);
                                onSelectItem(item);
                            }
                        }}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default ListGroup;
