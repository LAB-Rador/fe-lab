"use client";

import {store} from "@/src/redux/store/store";
import React, {ReactNode, Suspense} from 'react';
import {Provider} from "react-redux";

const CustomLayout = ({children} : {children: ReactNode}) => {
    return (
        <Provider store={store}>
            <Suspense fallback={null}>
                {children}
            </Suspense>
        </Provider>
    );
};

export default CustomLayout;