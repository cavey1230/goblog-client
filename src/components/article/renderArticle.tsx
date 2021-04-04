import React, {memo, useEffect, useMemo, useState} from 'react';
import {useDispatch} from "react-redux";

import {useListenWindowScrollY} from '@/customHook/useListenWindowScrollY';
import {updateDomInfoArray} from '@/redux/domInfoArrayReducer';
import getDom from '@/utils/getDom';

import "./renderArticle.less";


type Props = {
    content: string
    linkClassHeader: string
}

export type DomInfoArr = { key: number, offsetTop: number }[]

const RenderArticle = (props: Props) => {
    const {content, linkClassHeader} = props
    const baseRegExpString = /<h([1-4])>(.*?)<\/h[1-4]>/
    const [domInfoArray, setDomInfoArray] = useState([])
    useListenWindowScrollY(domInfoArray, linkClassHeader)
    const dispatch = useDispatch()

    const [matchArray, replaceH1ToH3] = useMemo(() => {
        const reg = new RegExp(baseRegExpString, "g")
        const matchArray = content.match(reg)
        let copyFromContent = content
        matchArray?.map((item, index) => {
            copyFromContent = copyFromContent.replace(baseRegExpString, `<h$1 id=${index}>$2</h$1>`)
        })
        return [matchArray, copyFromContent]
    }, [content])

    // console.log(domInfoArray)
    console.log("RenderArticle被渲染了")
    // console.log(scrollTop)

    useEffect(() => {
        window.scrollTo({top: 0})
        setTimeout(() => {
            const innerArr: { key: number, offsetTop: number }[] = []
            const matchArrayLength = matchArray?.length
            for (let i = 0; i < matchArrayLength; i++) {
                const innerDomInfo = getDom(i)
                innerDomInfo && innerArr.push({key: i, offsetTop: innerDomInfo.getBoundingClientRect().top})
            }
            // console.log(innerArr)
            if (innerArr.length) {
                setDomInfoArray(innerArr)
                dispatch(updateDomInfoArray(innerArr))
            }
        }, 0)
    }, [replaceH1ToH3])

    return (
        <div>
            <div
                className="custom-html-style"
                dangerouslySetInnerHTML={{
                    __html: replaceH1ToH3
                }}
            />
        </div>
    );
}

export default memo(RenderArticle);