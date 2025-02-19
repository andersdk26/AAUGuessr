import { ReactNode } from "react";

interface CardProps {
    topElement?: ReactNode;
    title?: string;
    text?: string;
    bottomElement?: ReactNode;
    width?: string;
}

function Card({
    topElement,
    title,
    text,
    bottomElement,
    width = "18rem",
}: CardProps) {
    return (
        <div className="card" style={{ width: width, padding: "0" }}>
            {topElement}
            <div className="card-body">
                {title && <h5 className="card-title">{title}</h5>}
                {text && <p className="card-text">{text}</p>}
                {bottomElement}
            </div>
        </div>
    );
}

export default Card;
