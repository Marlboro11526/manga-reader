import React from "react";

class TreeElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isChildaOpen: false,
        }
    }


    // recursiveRender(dL) {
    //     return dL.map((item, index) => {
    //         if (item.children) {
    //             return (
    //                 <div key={"outerdiv" + item.path} className=" d-flex flex-column">
    //                     <button key={item.path + item.name + "buttonclose"} className=" text-nowrap btn btn-primary text-white btn-sm w-100 text-start" >{item.name}</button>
    //                     <div className=" ms-2 d-flex flex-column dir-child hidden" key={item.path + item.name + "div"}>
    //                         {this.recursiveRender(item.children)}
    //                     </div>
    //                 </div>
    //             )
    //         }
    //         else {
    //             return <button className=" text-nowrap btn text-white btn-sm w-100 text-start " key={item.path + item.name + "buttonChapter"}>{item.name}</button>
    //         }
    //         // return <p className=" text-white">{item.name}</p>
    //     })
    // }

    isChildaOpenHandler = () => { this.setState({ isChildaOpen: !this.state.isChildaOpen }) }

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
                {/* iterasinya didalem div hiddenable */}
                {
                    this.props.dirList.children ? (
                        <div key={"outerdiv" + this.props.dirList.path} className=" d-flex flex-column">
                            <button key={this.props.dirList.path + this.props.dirList.name + "buttonclose"} className={`text-nowrap btn text-white btn-sm p-1 rounded-0 w-100 text-start`} onClick={this.isChildaOpenHandler}><i className={`bi bi-${this.state.isChildaOpen ? "caret-down" : "caret-right"}`} /> {this.props.dirList.name}</button>
                            <div className={`ms-3 d-flex flex-column dir-child ${this.state.isChildaOpen ? "" : "hidden"}`} key={this.props.dirList.path + this.props.dirList.name + "div"}>
                                {
                                    this.props.dirList.children.map((item, index) => { return <TreeElement dirList={item} key={`element ${item.path}`} readImageFile={this.props.readImageFile} readCBZFile={this.props.readCBZFile} /> })
                                }
                            </div>
                        </div>
                    ) : (
                        <button className=" text-nowrap btn text-white btn-sm w-100 text-start p-1 rounded-0 " key={this.props.dirList.path + this.props.dirList.name + "buttonChapter"} onClick={() => { this.readFile(this.props.dirList.path) }} > <i className=" bi bi-file" /> {this.props.dirList.name}</button>
                    )
                    // return <p className=" text-white">{item.name}</p>
                }
                {
                    // this.props.dirList.children ? (
                    //     <Tree content={this.props.dirList.name} key={this.props.dirList.path + this.props.dirList.name + "tree"}

                    //     >
                    //         {this.props.dirList.children.map((item, index) => { return <TreeElement dirList={item} key={`element ${item.path}`} /> })}
                    //     </Tree>
                    // ) : (
                    //     <Tree content={this.props.dirList.name} key={this.props.dirList.path + this.props.dirList.name + "tree"} />
                    // )
                }



            </>
        );

    }
}

export default TreeElement;