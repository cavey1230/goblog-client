import React from 'react';
import {List} from "antd";

import CommentListItem from "./commentListItem";

type Props = {
    getCommentDataFunc: (page: number) => void
    pageSize: number
    total: number
    initData: Array<any>
    apiAddress?: string
    guestbook?: boolean
}

const CommentList: React.FC<Props> = (props) => {
    const {getCommentDataFunc, pageSize, total, initData, apiAddress, guestbook} = props

    return (<List
        itemLayout="vertical"
        pagination={{
            onChange: page => {
                getCommentDataFunc(page)
            },
            pageSize: pageSize,
            total: total,
            size: "small"
        }}
        style={apiAddress ? {marginBottom: "1rem"} :
            {
                marginBottom: "1rem",
                backgroundColor: "#f7f7f7",
                paddingLeft: "2rem"
            }}
        dataSource={initData}
        renderItem={(item, index) => (
            <CommentListItem
                item={item}
                index={index}
                apiAddress={apiAddress}
                guestbook={guestbook}
            />
        )}/>);
};

export default CommentList;