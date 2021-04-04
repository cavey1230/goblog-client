import React, {useEffect} from 'react';
import ReactDOM from "react-dom";

import "./modal.less";

type Props = {
    visible: boolean
    hiddenHandleChange: (visible: boolean) => void
}

const Modal: React.FC<Props> = (props) => {
    const {visible, hiddenHandleChange,children} = props

    useEffect(() => {
        const bodyDomStyle = window.document.body.style
        if (visible) {
            bodyDomStyle.overflowY = "scroll"
            bodyDomStyle.position = "fixed"
        } else {
            bodyDomStyle.overflowY = "auto"
            bodyDomStyle.position = "relative"
        }
    }, [visible])

    return ReactDOM.createPortal(
        visible && <div className="full-screen-container">
            <div className="bottom-container" onClick={() => hiddenHandleChange(false)}/>
            <div className="modal-box">
                {children}
            </div>
        </div>, document.body)
};

export default Modal;