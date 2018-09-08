import React, { Component } from 'react';
import printLoading from '../../images/loading.gif'
class PrintLoading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingData: props.pageLoading,
        }
        console.log("props.pageLoading", props.pageLoading)
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    render() {
        const loadingShow = {
            visibility: (this.state.loadingData == true ? 'visible' : 'hidden')
        }

        const loadingImg = {
            background: "url(" + printLoading +") no-repeat center"
        }

        return (
            <div className="loading" id="loading" style={loadingShow }>
                <div>
                    <div className="ico" style={ loadingImg }></div>
                    <div className="text">打印准备中…</div>
                </div>
            </div>
        )
    }
}

export default PrintLoading;