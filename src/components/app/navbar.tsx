import React, {useEffect, useRef, useState} from 'react';

import {GoblogApiV1} from "@/utils/fetchApi";
import {SLink} from '@/utils/routerRender';

import "./navbar.less";

const Navbar = () => {
    const [category, setCategory] = useState([])
    const navbar = useRef(null)
    const button = useRef(null)
    const button2 = useRef(null)
    let interValId: NodeJS.Timer

    useEffect(() => {
        GoblogApiV1.GET("/public/all_category").then(result => setCategory([...category, ...result.data]))
    }, [])

    const renderItem = category.map((item, index) => {
        const url = `/category/${item.value}/${item.label}`
        return <SLink key={`nav_item${index}`} to={url}>
            <div className="nav-item">
                {item.label}
            </div>
        </SLink>
    })

    const showButton = () => {
        const {clientWidth, scrollWidth, scrollLeft} = navbar.current
        const scrollBarWidth = scrollWidth - clientWidth
        if (scrollWidth > clientWidth && (scrollLeft + 1) < scrollBarWidth) {
            button.current.style.display = "inline-block"
        }
        if (scrollWidth > clientWidth && scrollLeft > 1) {
            button2.current.style.display = "inline-block"
        }
    }

    const hideButton = () => {
        button.current.style.display = "none"
        button2.current.style.display = "none"
    }

    const move = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: string) => {
        event.nativeEvent.stopImmediatePropagation()
        interValId = setInterval(() => {
            let {scrollLeft, clientWidth} = navbar.current
            console.log(scrollLeft)
            navbar.current.scrollTo(type === "left" ? {
                left: (scrollLeft + 200),
                behavior: "smooth"
            } : {
                left: (scrollLeft - 200),
                behavior: "smooth"
            })
        }, 500)
    }

    return (
        <div className="navbar" onMouseLeave={hideButton} onMouseEnter={showButton}>
            <div ref={navbar} className="navbar-pad">
                {renderItem}
            </div>
            <button
                onMouseEnter={event => move(event, "right")}
                onMouseLeave={() => clearInterval(interValId)}
                className="inner-button-right"
                ref={button2}>
                {"<"}
            </button>
            <button
                onMouseEnter={event => move(event, "left")}
                onMouseLeave={() => clearInterval(interValId)}
                className="inner-button-left"
                ref={button}>
                {">"}
            </button>
        </div>
    );
};

export default Navbar;