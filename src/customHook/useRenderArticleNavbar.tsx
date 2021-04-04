import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';

export const renderArticleNavbar = (content: string) => {
    const matchArr = content.match(/<h[1-4]>.*?<\/h[1-4]>/ig)
    const innerArr: Array<any> = []

    const getInTagString = (str:string) => {
        return str.replace(/<\/*h[1-4]>/g,"")
    }

    const idObjArr = matchArr?.map((item, index) => {
        return {value: item, id: index}
    })

    const h1IndexArr = idObjArr?.map((item, index) => {
        if (item.value.slice(1, 3) === "h1") {
            innerArr.push({value: getInTagString(item.value),tag:"h1", id: item.id, child: []})
            return String(item.id)
        }
    }).filter(i => i)

    const getChild = (waitAddArr: Array<any>, splitRangeArr: Array<any>, tag: string, maxIndex: number) => {
        waitAddArr?.forEach((item: any, index: number) => {
            const begin = Number(splitRangeArr[index]) + 1
            const end = Number(splitRangeArr[index + 1])
            if (end && !((end - begin) > 0)) return
            const newInnerArr = end ? idObjArr.slice(begin, end) :
                maxIndex !== 0 ? idObjArr.slice(begin, maxIndex) : idObjArr.slice(begin)
            const h2IndexArr = newInnerArr?.map((item2, index2) => {
                if (item2.value.slice(1, 3) === tag) {
                    item.child.push({value: getInTagString(item2.value),tag:tag, id: item2.id, child: []})
                    return String(item2.id)
                }
            }).filter(i => i)

            getChild(item.child, h2IndexArr, "h3", end)
        })
    }
    getChild(innerArr, h1IndexArr, "h2", 0)

    return innerArr
}

export const useRenderArticleNavbar = (): [any[], Dispatch<SetStateAction<string>>] => {
    const [contentData, setContentData] = useState("")
    const [navbarWaitRenderTree, setNavbarWaitRenderTree] = useState([])

    useEffect(() => {
        setNavbarWaitRenderTree(renderArticleNavbar(contentData))
    }, [contentData])

    return [navbarWaitRenderTree, setContentData]
};