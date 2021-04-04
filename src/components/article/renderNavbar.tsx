import React from 'react';
import {Affix} from "antd";

import getDom from '@/utils/getDom';

import "./renderNavbar.less";

type Props = {
    leftNavbar: Array<any>
    linkClassHeader: string
}

type LinkObjProto = {
    id: number
    value: string
    tag: string
    child?: Array<any>
}

const RenderNavbar = (props: Props) => {
    const {leftNavbar, linkClassHeader} = props

    const scrollToAnchor = (anchorName: number) => {
        if (anchorName || anchorName === 0) {
            const anchorElement = getDom(String(anchorName));
            if (anchorElement) {
                anchorElement.scrollIntoView({
                    block: 'start',
                    behavior: 'smooth',
                });
            }
        }
    };

    const renderLinkGroup = () => {
        const linkGroup: Array<JSX.Element> = []

        const intervalPushLinkItem = (item: LinkObjProto[]) => {
            const pushLinkItem = (id: number, value: string, tag: string) => {
                const level = tag === "h1" ? "h1" : tag === "h2" ? "h2" : "h3"
                linkGroup.push(
                    <div id={`${linkClassHeader}-${id}`}
                         className={`link-level-${level}`}
                         key={`link_item_${id}`}
                         onClick={() => {
                             scrollToAnchor(id)
                         }}
                    >
                        {value}
                    </div>
                )
            }
            item.forEach((item2) => {
                const {id, value, tag, child} = item2
                pushLinkItem(id, value, tag)
                if (child.length) {
                    intervalPushLinkItem(child)
                }
            })
        }

        intervalPushLinkItem(leftNavbar)

        return linkGroup
    }

    return (
        <Affix offsetTop={20}>
            <div className="article-navbar-pad">
                {renderLinkGroup()}
            </div>
        </Affix>
    );
};

export default RenderNavbar;