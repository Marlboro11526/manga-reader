import React from "react";
import Tree from "./Tree";

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeChapter: props.activeChapter,
            activeSection: props.activeSection,
        }

    }

    sidebarButtonhandler = () => { this.props.sidebarContentIsActiveHandler(true) }

    componentDidMount() {
    }
    render() {
        return (
            <div className=" sidebar py-4 d-flex" >
                <div className={` h-100 d-flex flex-column button-list ${this.props.sidebarContentIsActive ? " border-end" : ""}`} >
                    <button className=" btn " onClick={this.sidebarButtonhandler}>
                        <i className="bi bi-folder-fill"></i>
                    </button>
                    <button className="btn mt-auto" onClick={this.sidebarButtonhandler}>
                        <i className="bi bi-gear-fill"></i>
                    </button>
                </div>
                <div className={`sidebar-content ${this.props.sidebarContentIsActive ? "" : "hidden"}`}>
                    {this.state.activeSection === 0 ? <Tree dirList={this.props.dirList} readImageFile={this.props.readImageFile} readCBZFile={this.props.readCBZFile}></Tree> : null}
                </div>
            </div>
        );
    }
}

export default SideBar;