import React, { Component } from 'react';
import printLoading from '../../images/loading.gif'
class PrintLoading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingData: props.pageLoading,
            loadingText: props.pageLoadingText
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    render() {
        const loadingShow = {
            visibility: (this.state.loadingData == true ? 'visible' : 'hidden')
        }

        const loadingText = this.state.loadingText

        const loadingImg = {
           "background": "url(" + printLoading +") no-repeat center",
           "background-size": "100% 100%"
        }

        return (
            <div className="loading" id="loading" style={loadingShow }>
                <div>
                    <div className="ico" style={ loadingImg }></div>
                    <div className="text">{loadingText }</div>
                </div>
            </div>
        )
    }
}

export default PrintLoading;