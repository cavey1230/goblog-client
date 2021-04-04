import React from "react";

import {listItem} from "@/utils/routerRender";
import Home from "../pages/home";
import Page404 from "../pages/page404";
import Article from "@/pages/article";
import Category from "@/pages/category";
import Guestbook from "@/pages/guestbook";

export const routers: listItem[] = [
    {
        path: "/",
        exact: true,
        component: Home,
    },
    {
        path: "/article/:id",
        component: Article,
    },
    {
        path: "/category/:category/:name",
        component: Category,
    },
    {
        path: "/guestbook",
        component: Guestbook,
    },
    {
        path: "/replace",
        redirect: "/",
    },
    {
        component: Page404
    }
]