import {useEffect, useState} from "react";
import {DomInfoArr} from "@/components/article/renderArticle";
import getDom from "@/utils/getDom";

export const useListenWindowScrollY = (domInfoArr: DomInfoArr, linkClassHeader: string) => {
    let timeOutId: NodeJS.Timer

    const handleScroll = () => {
        // console.log(window.scrollY)
        timeOutId && clearTimeout(timeOutId)
        timeOutId = setTimeout(() => {
            // console.log(window.scrollY)
            const removeStyle = (item: DomInfoArr[0]) => {
                domInfoArr.forEach((k, v) => {
                    const dom = getDom(`${linkClassHeader}-${k.key}`)
                    if (!dom) return
                    if (k.key !== item.key) {
                        dom.classList.remove("activeLink")
                    }
                });
            }
            domInfoArr.forEach((item, index) => {
                const dom = getDom(`${linkClassHeader}-${item.key}`)
                if (!dom) return
                if (window.scrollY + 1 > item.offsetTop) {
                    dom.classList.add("activeLink")
                    removeStyle(item)
                }
            });
        }, 10)
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, true)
        return () => {
            console.log("移除scroll监听")
            window.removeEventListener('scroll', handleScroll, true)
        }
    }, [domInfoArr])

}