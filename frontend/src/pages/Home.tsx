import { useState } from "react";
import "../App.css";

/**
 * Home page
 * @returns Home page
 */
function Home() {
    const [count, setCount] = useState(0);

    return (
        <>
            <h1>Hi</h1>
            <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
            </button>
        </>
    );
}

export default Home;
