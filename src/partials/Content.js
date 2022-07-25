import React from "react";
import { invoke } from "@tauri-apps/api/tauri";



class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: "",
            zoom: 100,
        }
        this.divContent = React.createRef();
        this.mouseRightDown = false;
    }

    sidebarContentCloseHandler = () => {
        this.props.sidebarContentIsActiveHandler(false)
    }

    mouseMoveHandler = (e) => {
        this.divContent.current.scrollLeft -= (e.movementX * 3);
        this.divContent.current.scrollTop -= (e.movementY * 3);
    }

    mouseDownHandler = (e) => {
        if (e.button === 2) this.mouseRightDown = true;
        if (e.button === 0 && this.mouseRightDown) console.log("left and right")
        if (e.button === 0) this.divContent.current.addEventListener("mousemove", this.mouseMoveHandler);
    }

    mouseUpHandler = (e) => {
        if (e.button === 2) this.mouseRightDown = false;
        if (e.button === 0 && this.mouseRightDown) console.log("left and right")
        if (e.button === 0) this.divContent.current.removeEventListener("mousemove", this.mouseMoveHandler);
    }


    scrollHandler = (e) => {
        if (this.mouseRightDown) {
            e.preventDefault();
            let newZoom = this.state.zoom + (e.deltaY * -0.1);
            let oldZoom = this.state.zoom;
            // this.divContent.current.style.transform = `scale(${this.state.zoom + (e.deltaY * -0.04)}%)`;
            this.setState({ zoom: newZoom })
            this.divContent.current.scrollTop *= (newZoom / oldZoom);
        }
    }

    componentDidUpdate(prevProps, prevState) {
    }


    componentDidMount() {
        invoke('read_image', { path: "D:/wave.jpg" }).then((result) => {
            this.setState({ file: result })
        });
        this.divContent.current.addEventListener('wheel', this.scrollHandler, { passive: false });
    }
    render() {
        return (
            <div ref={this.divContent} className=" content d-flex flex-column flex-grow-1" onClick={this.sidebarContentCloseHandler} onContextMenu={(e) => { e.preventDefault() }} onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler} >
                <div className=" m-auto " style={{ width: `${this.state.zoom}%` }}>
                    {
                        this.props.chapter.map((item, index) => {
                            return <img key={index} className=" w-100" src={item} alt="" />
                            // return <p className=" text-white" key={index}>{item}</p>
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Content;