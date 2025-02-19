import { ReactNode, useState, useEffect } from "react";

interface ModalProps {
    header: string;
    children?: ReactNode;
    submitText?: string;
    onSubmit: () => void;
    cancelText?: string;
    onCancel: () => void;
    onClose?: () => void;
    verticalCenter?: boolean;
    submitType?:
        | "primary"
        | "secondary"
        | "success"
        | "danger"
        | "warning"
        | "info"
        | "light"
        | "dark";
}

/**
 * A Modal component that displays a modal dialog with customizable header, body, and footer.
 * The modal can be vertically centered and includes submit and cancel buttons with customizable text and actions.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.header - The header text of the modal.
 * @param {React.ReactNode} props.children - The content to be displayed inside the modal body.
 * @param {string} [props.submitText="Submit"] - The text for the submit button.
 * @param {Function} props.onSubmit - The function to be called when the submit button is clicked.
 * @param {string} [props.cancelText="Cancel"] - The text for the cancel button.
 * @param {Function} props.onCancel - The function to be called when the cancel button is clicked.
 * @param {Function} [props.onClose=props.onCancel] - The function to be called when the modal is closed.
 * @param {boolean} [props.verticalCenter=true] - Whether the modal should be vertically centered.
 * @param {string} [props.submitType="primary"] - The Bootstrap class type for the submit button.
 *
 * @returns {JSX.Element} The rendered Modal component.
 */
function Modal({
    header,
    children,
    submitText = "Submit",
    onSubmit,
    cancelText = "Cancel",
    onCancel,
    onClose = onCancel,
    verticalCenter = true,
    submitType = "primary",
}: ModalProps) {
    const [showModal, setShowModal] = useState(false);
    const [first, setFirst] = useState(true);
    const animationDelay = 300;

    useEffect(() => {
        if (first) {
            setShowModal(true);
            setFirst(false);
        }
    }, [showModal, first]);

    return (
        <>
            <div
                className={"modal fade" + (showModal ? " show modal-open" : "")}
                id="modal"
                style={{ display: "block" }}
                onClick={() => {
                    setShowModal(false);
                    setTimeout(() => {
                        onClose();
                    }, animationDelay);
                }}
            >
                <div
                    className={
                        "modal-dialog" +
                        (verticalCenter && " modal-dialog-centered")
                    }
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-content">
                        {/* Modal header with title and close button */}
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="modalLabel">
                                {header}
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    setShowModal(false);
                                    setTimeout(() => {
                                        onClose();
                                    }, animationDelay);
                                }}
                            ></button>
                        </div>
                        {/* Modal body with content */}
                        <div className="modal-body">{children}</div>
                        {/* Modal footer with buttons */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={() => {
                                    setShowModal(false);
                                    setTimeout(() => {
                                        onCancel();
                                    }, animationDelay);
                                }}
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                className={"btn btn-" + submitType}
                                onClick={() => {
                                    setShowModal(false);
                                    setTimeout(() => {
                                        onSubmit();
                                    }, animationDelay);
                                }}
                            >
                                {submitText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal backdrop */}
            <div
                className={"modal-backdrop fade" + (showModal ? " show" : "")}
            ></div>
        </>
    );
}

export default Modal;
