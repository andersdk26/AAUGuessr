import { useEffect, useRef, useMemo } from "react";

interface PlaceholderProps {
    length?: number;
    animation?: "none" | "wave" | "glow";
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
 * Placeholder component that renders a series of placeholder blocks with specified length, animation, and type.
 *
 * @param {number} [length=2] - The total length of the placeholder blocks. If length is 2 or less, a single block of that length is created. Otherwise, blocks of random lengths (1 to 3) are created until the total length is reached.
 * @param {string} [animation="glow"] - The animation style for the placeholder. Can be "glow", "wave", or any other string for no animation.
 * @param {string} [type="default"] - The type of the placeholder. If "default", the type is determined based on the theme stored in localStorage.
 *
 * @returns {JSX.Element} A paragraph element containing the placeholder blocks with the specified animation and type.
 */
const Placeholder = ({
    length = 2,
    animation = "glow",
    type = "default",
}: PlaceholderProps) => {
    const typeRef = useRef(type);
    const animationClass = useRef<string>("");

    // Generate an array of block lengths to create the placeholder (save as memoized value)
    const blockLength = useMemo(() => {
        const blocks: number[] = [];
        if (length <= 2) {
            blocks[0] = length;
        } else {
            let total = 0;
            while (total < length) {
                const block = Math.floor(Math.random() * 3) + 1;
                blocks.push(block);
                total += block;
            }
        }
        return blocks;
    }, [length]);

    // Update animation class and type based on props
    useEffect(() => {
        if (animation === "wave") {
            animationClass.current = "placeholder-wave";
        } else if (animation === "glow") {
            animationClass.current = "placeholder-glow";
        } else {
            animationClass.current = "";
        }

        if (type === "default") {
            const theme = localStorage.getItem("theme") || "dark";
            typeRef.current = theme === "dark" ? "light" : "dark";
        }
    }, [animationClass, animation, type]);

    return (
        <p className={animationClass.current}>
            {blockLength.map((block, index) => (
                <span
                    key={index}
                    className={`placeholder col-${block} bg-${type}`}
                ></span>
            ))}
        </p>
    );
};

export default Placeholder;
