import React, {memo, useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {useDispatch} from "react-redux";

import {GoblogApiV1} from "@/utils/fetchApi";
import {mdParser} from '@/utils/mdParser';
import {renderArticleNavbar} from '@/customHook/useRenderArticleNavbar';
import RenderArticle from "@/components/article/renderArticle";
import {TITLE_TYPES, updateTitle} from "@/redux/titleReducer";
import RenderNavbar from "@/components/article/renderNavbar";
import RenderComment from '@/components/article/renderComment';
import { SLink } from '@/utils/routerRender';

import './article.less';

type Params = {
    id: string
}

type ArticleData = {
    name: string
    title: string
    cid: number
    synopsis: string
    content: string
    img: string
    boutique: string
}

const Article: React.FC<RouteComponentProps> = memo((props) => {
        const [leftNavbar, setLeftNavbar] = useState([])
        const [article, setArticle] = useState({
            name: "",
            title: "",
            cid: 0,
            synopsis: "",
            content: "",
            img: "",
            boutique: ""
        } as ArticleData)
        const {id} = (props.match.params as Params)
        const dispatch = useDispatch()
        console.log("article被加载了")

        useEffect(() => {
            GoblogApiV1.GET(`/public/article/${id}`).then(res => {
                setArticle(res.data)
                const {title, name, boutique, createTime, content} = res.data
                setLeftNavbar(renderArticleNavbar(mdParser.render(content)))
                dispatch(updateTitle({
                    title: `<div style="font-size: 4rem">${title}</div>`,
                    type: name,
                    date: `创建时间: ${createTime}`,
                    span: `${boutique === "1" ? "精品" : "普通"}`
                }))
            })
            console.log("我被执行了")
            return () => {
                dispatch({
                    type: TITLE_TYPES.INIT_TITLE_OBJ
                })
            }
        }, [id])

        return (
            <div className="page-article-pad">
                <div>
                    <RenderNavbar
                        leftNavbar={leftNavbar}
                        linkClassHeader={"link"}
                    />
                </div>
                <div className="center-pad">
                    <img className="fillImg" src={article.img} alt="填充图片"/>
                    <RenderArticle
                        content={mdParser.render(article.content)}
                        linkClassHeader={"link"}
                    />
                </div>
                <div style={{flex:1}}>
                    <RenderComment
                        commentApiAddress={"/public/comment/find"}
                        replyApiAddress={"/public/reply/find"}
                        articleId={id}
                    />
                </div>
            </div>
        );
    },
    (pre, next) => {
        return pre.match.url === next.match.url
    }
)

export default withRouter(Article);