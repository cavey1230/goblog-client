import React, {useEffect, useState} from 'react';

import "./blogroll.less";
import {GoblogApiV1} from "@/utils/fetchApi";

const Blogroll = () => {
    const [data, setData] = useState([{
        link: "",
        title: "",
    }])

    useEffect(() => {
        GoblogApiV1.GET("/public/blogroll").then(res => {
            setData(res.data)
        })
    }, [])

    const renderLinks = data.map((item,index) => {
        const {link, title} = item
        return  <a href={link} key={`blogroll_${index}`} target="_blank">{title}</a>
    })

    return (
        <div className="blogroll-pad">
            {renderLinks}
        </div>
    );
};

export default Blogroll;