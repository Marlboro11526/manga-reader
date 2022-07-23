import TreeElement from "./TreeElement";
import React from "react";


class Tree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.dirList !== this.props.dirList || nextState !== this.state;
    }

    render() {
        return (
            <div className=" overflow-auto h-100 w-100 d-flex flex-column tree">
                {this.props.dirList.map((item, index) => { return <TreeElement dirList={item} key={`element ${item.path}`} readImageFile={this.props.readImageFile} readCBZFile={this.props.readCBZFile} /> })}
            </div>
        );
    }
}

export default Tree;