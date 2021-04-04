import React, {useEffect, useState} from 'react';

import "./copyright.less";
import {GoblogApiV1} from "@/utils/fetchApi";

const Copyright = () => {
    const [data, setData] = useState([{
        title: "",
        content: "",
    }])

    useEffect(() => {
        GoblogApiV1.GET("/public/copyright").then(res => {
            setData(res.data)
        })
    }, [])

    const renderCopyInfos = data.map((item, index) => {
        const {content, title} = item
        return <div key={`blogroll_${index}`} className="copyright-item">
            <span> {title}:</span> {content}</div>
    })
    return (
        <div className="copyright-pad">
            {renderCopyInfos}
        </div>
    );
};

export default Copyright;