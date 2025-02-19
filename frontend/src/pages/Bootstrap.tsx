import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import Alert from "../components/Alert";
import DismissibleAlert from "../components/DismissibleAlert";
import ListGroup from "../components/ListGroup";
import Modal from "../components/Modal";
import Tabs from "../components/Tabs";
import Pagination from "../components/Pagination";
import Placeholder from "../components/Placeholder";
import ProgressBar from "../components/ProgressBar";
import "../App.css";
import Spinner from "../components/spinner";

/**
 * Site showing Bootstrap components
 * @returns Bootstrap page
 */
function Bootstrap() {
    const [count, setCount] = useState(0);
    const [showResetAlert, setShowResetAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<number | undefined>(undefined);
    const list = ["Item 1", "Item 2", "Item 3"];
    const { tab } = useParams();
    console.log(tab);

    useEffect(() => {
        const updateProgress = () => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(intervalRef.current);
                    return 100;
                }
                return prevProgress + 5;
            });
        };
        intervalRef.current = setInterval(updateProgress, 500);
    }, []);

    return (
        <>
            {showModal && (
                <Modal
                    header="Modal"
                    onSubmit={() => setShowModal(false)}
                    onCancel={() => setShowModal(false)}
                    onClose={() => setShowModal(false)}
                >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                    quia incidunt ipsum animi repellendus, laboriosam fugit ea
                    ducimus porro fuga, deserunt delectus adipisci. Dolore neque
                    ipsam laudantium aut, officia tempore!
                </Modal>
            )}
            <h1>Bootstrap</h1>
            <Alert type={count > 0 ? "primary" : "danger"}>
                Count is {count}
            </Alert>
            <div className="btn-group">
                <Button onClick={() => setCount((count) => count + 1)}>
                    Up
                </Button>
                <Button
                    onClick={() => setCount((count) => count - 1)}
                    type="secondary"
                >
                    Down
                </Button>
                <Button
                    onClick={() => {
                        setCount(0);
                        setShowResetAlert(true);
                    }}
                    type="danger"
                >
                    Reset
                </Button>
            </div>
            {showResetAlert && (
                <>
                    <DismissibleAlert
                        onDismiss={() => setShowResetAlert(false)}
                        type="warning"
                    >
                        Count has been reset{" "}
                    </DismissibleAlert>
                    <Button
                        type="close"
                        onClick={() => setShowResetAlert(false)}
                    ></Button>
                </>
            )}
            <ListGroup items={list}></ListGroup>
            <Button onClick={() => setShowModal(true)}>Show Modal</Button>
            <Tabs
                items={[
                    { name: "Overview", path: "overview" },
                    { name: "Tab 1", path: "1" },
                    { name: "Tab 2", path: "2" },
                ]}
                selectedPath={tab}
            />
            {tab === "overview" && <p>Overview</p>}
            {tab === "1" && <p>Tab 1</p>}
            {tab === "2" && <p>Tab 2</p>}
            {!["overview", "1", "2"].includes(tab || "") && <p>Not found</p>}
            <Pagination pages={5} onSelectItem={(item) => console.log(item)} />
            <Pagination
                pages={10}
                type="symbol"
                onSelectItem={(item) => console.log(item)}
            />
            <ProgressBar progress={progress} showLabel={true} />
            <Spinner />
            <Placeholder />
            <Placeholder length={50} animation="wave" />
        </>
    );
}

export default Bootstrap;
