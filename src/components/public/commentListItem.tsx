import React, {useEffect, useState} from 'react';
import {CaretDownOutlined, CaretUpOutlined, CommentOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";

import {GoblogApiV1} from "@/utils/fetchApi";
import CommentList from "@/components/public/commentList";
import {updateCommentAndReply} from "@/redux/commentAndReplyReducer";

type ListItemProps = {
    item: {
        [key: string]: any
    }
    index: number
    apiAddress: string
    guestbook?: boolean
}

const CommentListItem: React.FC<ListItemProps> = (props) => {
    const [checkStatus, setCheckStatus] = useState(false)
    const [haveReply, setHaveReply] = useState(false)
    const {item, index, apiAddress, guestbook} = props
    const {
        content, createTime, username,
        username1, id, articleId, replyToCommentId
    } = item
    const dispatch = useDispatch()

    const [data, setData] = useState([])
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 5

    useEffect(() => {
        getCommentData(pageNum)
        return () => {
            setCheckStatus(false)
            setPageNum(1)
            setData([])
        }
    }, [item])

    const getCommentData = (pageNum: number) => {
        const isGuestbook = guestbook ? {
            pageSize: pageSize,
            pageNum: pageNum,
            replyToCommentId: id,
            guestbook: "true"
        } : {
            pageSize: pageSize,
            pageNum: pageNum,
            replyToCommentId: id,
            articleId
        }
        apiAddress && GoblogApiV1.GET(apiAddress, isGuestbook).then(result => {
            if (result.data.data) {
                setData(result.data.data)
                setTotal(result.data.total)
                setHaveReply(true)
            } else {
                setHaveReply(false)
            }
        })
    }

    const dispatchCommentAndReply = () => {
        const commentId = apiAddress ? id : replyToCommentId
        const name = apiAddress ? username : username1
        dispatch(updateCommentAndReply({
            replyToCommentId: commentId,
            replyName: name
        }))
    }

    const renderActionGroup = () => {
        const checkActionIcon = !checkStatus ?
            <CaretUpOutlined style={{fontSize: "1.6rem"}}/> :
            <CaretDownOutlined style={{fontSize: "1.6rem"}}/>
        if (haveReply) {
            return <React.Fragment>
                <span
                    onClick={() => {
                        setCheckStatus(!checkStatus)
                    }}
                >
                    {checkActionIcon}
                    查看(共{total}条)
                </span>
                <span onClick={() => dispatchCommentAndReply()}>
                    <CommentOutlined style={{fontSize: "1.6rem"}}/>
                    回复
                </span>
            </React.Fragment>
        }
        return <span onClick={() => dispatchCommentAndReply()}>
            <CommentOutlined style={{fontSize: "1.6rem"}}/>
            回复
        </span>
    }

    return (<div key={index} className="comment-item">
        <div className="info">
            <span>{apiAddress ? username : username1}</span>
            <span>{createTime}</span>
        </div>
        <div className="content">
            {content}
        </div>
        <div className="action">
            {renderActionGroup()}
        </div>
        {
            checkStatus && <CommentList
                getCommentDataFunc={getCommentData}
                initData={data}
                pageSize={pageSize}
                total={total}
            />
        }
    </div>)
}

export default CommentListItem