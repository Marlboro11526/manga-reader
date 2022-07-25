import React from "react";
import { readDir } from "@tauri-apps/api/fs";

class TreeElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isChildaOpen: false,
            child: []
        }
        this.divChild = React.createRef();
        this.allowedFile = ['cbz', 'jpg', 'jpeg', 'png', "webp"]
    }

    sortResults = (results) => {
        results.sort((a, b) => {
            if (a.children && b.children) { return 0 }
            else if (a.children) { return -1 }
            else if (b.children) { return 1 }
            else return 0;
        });
        return results;
    }

    eliminateFiles = (results) => {
        return results.filter(item => {
            if (item.children) { return true }
            if (this.allowedFile.indexOf(item.name.split(".").pop().toLowerCase()) !== -1) return true;
            return false;
        });
    }

    isChildaOpenHandler = () => {
        this.setState({ isChildaOpen: !this.state.isChildaOpen });
        if (this.divChild.current.children.length === 0) {
            readDir(this.props.dirList.path).then(res => {
                res = this.sortResults(res);
                res = this.eliminateFiles(res);
                let temp = res.map((item) => {
                    return <TreeElement dirList={item} key={`element ${item.path}`} readImageFile={this.props.readImageFile} readCBZFile={this.props.readCBZFile} />
                })
                this.setState({ child: temp });
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.dirList !== this.props.dirList || nextState !== this.state;
    }

    readFile = (path) => {
        if (this.props.dirList.path.split(".").pop() === "cbz") {
            this.props.readCBZFile(path);
        }
        else this.props.readImageFile(path);
    }

    render() {
        return (
            <>
                {
                    // this.props.dirList.children ? (
                    //     <div key={"outerdiv" + this.props.dirList.path} className=" d-flex flex-column">
                    //         <button key={this.props.dirList.path + this.props.dirList.name + "buttonclose"} className={`text-nowrap btn text-white btn-sm p-1 rounded-0 w-100 text-start`} onClick={this.isChildaOpenHandler}><i className={`bi bi-${this.state.isChildaOpen ? "caret-down" : "caret-right"}`} /> {this.props.dirList.name}</button>
                    //         <div className={`ms-3 d-flex flex-column dir-child ${this.state.isChildaOpen ? "" : "hidden"}`} key={this.props.dirList.path + this.props.dirList.name + "div"}>
                    //             {
                    //                 this.props.dirList.children.map((item, index) => { return <TreeElement dirList={item} key={`element ${item.path}`} readImageFile={this.props.readImageFile} readCBZFile={this.props.readCBZFile} /> })
                    //             }
                    //         </div>
                    //     </div>
                    // ) : (
                    //     <button className=" text-nowrap btn text-white btn-sm w-100 text-start p-1 rounded-0 " key={this.props.dirList.path + this.props.dirList.name + "buttonChapter"} onClick={() => { this.readFile(this.props.dirList.path) }} > <i className=" bi bi-file" /> {this.props.dirList.name}</button>
                    // )
                }
                {
                    this.props.dirList.children ? (
                        <div key={"outerdiv" + this.props.dirList.path} className=" d-flex flex-column">
                            <button key={this.props.dirList.path + this.props.dirList.name + "buttonclose"} className={`text-nowrap btn text-white btn-sm p-1 rounded-0 w-100 text-start`} onClick={this.isChildaOpenHandler}><i className={`bi bi-${this.state.isChildaOpen ? "caret-down" : "caret-right"}`} /> {this.props.dirList.name}</button>
                            <div ref={this.divChild} className={`ms-3 d-flex flex-column dir-child ${this.state.isChildaOpen ? "" : "hidden"}`} key={this.props.dirList.path + this.props.dirList.name + "div"}>
                                {
                                    this.state.child
                                }
                            </div>
                        </div>
                    ) : (
                        <button className=" text-nowrap btn text-white btn-sm w-100 text-start p-1 rounded-0 " key={this.props.dirList.path + this.props.dirList.name + "buttonChapter"} onClick={() => { this.readFile(this.props.dirList.path) }} > <i className=" bi bi-file" /> {this.props.dirList.name}</button>
                    )
                }
            </>
        );

    }
}

export default TreeElement;