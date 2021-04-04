import React, {useEffect, useRef, useState} from 'react';

import "./verification.less";

type Props = {
    width: string
    height: string
    successCallBack: (status: boolean) => void
    status: boolean
}

const Verification: React.FC<Props> = (props) => {
    const {width, height, successCallBack, status} = props
    const [success, setSuccess] = useState(false)
    const containerRef = useRef(null)
    const btnRef = useRef(null)

    const outContainerStyle = {width, height}
    const grayBackgroundColor = {backgroundColor: "#888888"}
    const blackBackgroundColor = {backgroundColor: "#000000"}
    const normalTextStyle = {lineHeight: height, color: "white"}

    useEffect(() => {
        if (!status) {
            setSuccess(false)
            btnRef.current.style.left = 0
        }
    }, [status])

    const replacePx = (str: string) => {
        return Number(str.replace("px", ""))
    }

    const onMouseDown = (event: React.MouseEvent) => {
        const outContainerWidth = containerRef.current.offsetWidth
        const btnWidth = btnRef.current.offsetWidth
        const distance = outContainerWidth - btnWidth
        const initMouseClientX = event.clientX
        document.onmouseup = () => onMouseUp()

        if (!success) {
            document.onmousemove = (ev) => {
                let offsetWidth = ev.clientX - initMouseClientX
                if (offsetWidth < 0) {
                    offsetWidth = 0
                }
                if (offsetWidth >= distance) {
                    offsetWidth = distance
                }
                btnRef.current.style.left = `${offsetWidth}px`
                if (replacePx(btnRef.current.style.left) === distance) {
                    console.log("我已经到底了")
                    document.onmousemove = null
                    setSuccess(true)
                    successCallBack(true)
                }
            }
        }
    }

    const onMouseUp = () => {
        const outContainerWidth = containerRef.current.offsetWidth
        const btnWidth = btnRef.current.offsetWidth
        const distance = outContainerWidth - btnWidth
        if (replacePx(btnRef.current.style.left) < distance)
            btnRef.current.style.left = 0
        document.onmouseup = null
        document.onmousemove = null
    }

    return (
        <div
            ref={containerRef}
            className="verification-out-container"
            style={outContainerStyle}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseUp}
        >
            <div
                className="verification-bg"
                style={success ? blackBackgroundColor : grayBackgroundColor}
            />
            <div
                className="verification-text"
                style={normalTextStyle}
            >
                {success ? "验证成功" : "滑动以验证"}
            </div>
            <div
                style={{height}}
                ref={btnRef}
                className="verification-btn"
            >
                &gt;&gt;
            </div>
        </div>
    );
};

export default Verification;