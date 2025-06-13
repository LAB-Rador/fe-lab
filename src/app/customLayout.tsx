"use client";

import {store} from "@/src/redux/store/store";
import React, {ReactNode} from 'react';
import {Provider} from "react-redux";

const CustomLayout = ({children} : {children: ReactNode}) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};

export default CustomLayout;