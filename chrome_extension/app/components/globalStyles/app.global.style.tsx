import React, {Component} from 'react';
import ToastifyStyle from "./toastify.style";
import GlobalPageStyle from "./general.style";
import EditorStyle from "./editor";

class AppGlobalStyle extends Component {
    render() {
        return (
            <>
                <EditorStyle />
            </>
        );
    }
}

export default AppGlobalStyle;
