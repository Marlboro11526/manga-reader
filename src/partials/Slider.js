import React from "react";


class Slider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
    }

    render() {
        return (
            <div className="">
                <input type="range" name="" id="" className="slider-range w-100" min={0} max={255} />
                <input type="range" name="" id="" className="slider-range w-100" min={0} max={255} />
            </div>
        )
    }
}

export default Slider;