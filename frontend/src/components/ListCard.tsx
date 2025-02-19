import { ReactNode } from "react";

interface ListCardProps {
    title?: string;
    width?: string;
    height?: string;
    listHeaders: string[] | ReactNode[];
    list: string[][] | ReactNode[][];
}

function ListCard({
    title,
    width = "18rem",
    height = "400px",
    listHeaders,
    list,
}: ListCardProps) {
    return (
        <div
            className="card"
            style={{
                width: width,
                height: height,
                padding: "0",
            }}
        >
            <div className="card-body">
                {title && <h5 className="card-title">{title}</h5>}
            </div>
            <div
                className="overflow-y-auto overflow-x-hidden"
                style={{ height: `calc(${height} - 2rem)` }}
            >
                <table
                    className="table table-hover list-card-table no-select"
                    style={{
                        width: `calc(${width} - 2px)`,
                        overflow: "hidden",
                    }}
                >
                    <thead>
                        <tr>
                            {listHeaders.map((header) => (
                                <th scope="col" className="text-center">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((row) => (
                            <tr className="text-center">
                                {row.map((cell) => (
                                    <td>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListCard;
