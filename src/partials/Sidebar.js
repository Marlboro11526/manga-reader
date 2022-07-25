import React from "react";
import Tree from "./Tree";
import Settings from "./Settings";

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeChapter: props.activeChapter,
            activeSection: props.activeSection,
        }

    }

    sidebarButtonhandler = (section) => {
        this.props.activeSectionHandler(section);
        this.props.sidebarContentIsActiveHandler(true)
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
    }
    render() {
        return (
            <div className=" sidebar py-4 d-flex" >
                <div className={` h-100 d-flex flex-column button-list ${this.props.sidebarContentIsActive ? " border-end" : ""}`} >
                    <button className=" btn " onClick={() => {
                        this.sidebarButtonhandler(0)
                    }}>
                        <i className="bi bi-folder-fill"></i>
                    </button>
                    <button className="btn mt-auto" onClick={() => {
                        this.sidebarButtonhandler(1)
                    }}>
                        <i className="bi bi-gear-fill"></i>
                    </button>
                </div>
                <div className={`sidebar-content ${this.props.sidebarContentIsActive ? "" : "hidden"}`}>
                    {
                        <>
                            <div className={` w-100 h-100 tree ${this.props.activeSection === 0 ? "" : "hidden"}`}>
                                <Tree dirList={this.props.dirList} readImageFile={this.props.readImageFile} readCBZFile={this.props.readCBZFile}></Tree>
                            </div>
                            <div>
                                <Settings
                                    useColorTone={this.props.useColorTone}
                                    min_color={this.props.min_color}
                                    max_color={this.props.max_color}
                                    useColorToneHandler={this.props.useColorToneHandler}
                                    redColorHandler={this.props.redColorHandler}
                                    greenColorHandler={this.props.greenColorHandler}
                                    blueColorHandler={this.props.blueColorHandler}
                                    settingsLoaded={this.props.settingsLoaded}
                                    saveSettings={this.props.saveSettings}
                                ></Settings>
                            </div>
                        </>
                    }
                </div>
            </div>
        );
    }
}

export default SideBar;