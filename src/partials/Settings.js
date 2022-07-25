import React from "react";
import RangeSlider from "react-range-slider-input";

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
        console.log(this.props.min_color, this.props.max_color);
    }


    redColorHandler = (value) => {
        this.props.redColorHandler(...value);
    }

    greenColorHandler = (value) => {
        this.props.greenColorHandler(...value);
    }

    blueColorHandler = (value) => {
        this.props.blueColorHandler(...value);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return this.props.min_color !== nextProps.min_color || this.props.max_color !== nextProps.max_color;
    // }

    render() {
        return (
            <div className="settings w-100 h-100 p-4">
                <div className=" border-bottom ">
                    <div className=" d-flex justify-content-start mb-4">

                        <input className=" form-check-input mx-2 cursor checkbox" type="checkbox" name="" id="color-tone-check" checked={this.props.useColorTone ? true : false} onChange={() => {
                            this.props.useColorToneHandler(!this.props.useColorTone)
                        }} />
                        <label className=" form-check-label text-white" htmlFor="color-tone-check"> Color Tone</label>
                    </div>
                    <div className=" mb-4">
                        {
                            this.props.settingsLoaded ? <RangeSlider id="redSlider" max={255}
                                defaultValue={[this.props.min_color.r, this.props.max_color.r]}
                                onInput={this.redColorHandler}
                            ></RangeSlider> : <></>
                        }
                        <div className=" d-flex text-white justify-content-between">
                            <span>{this.props.min_color.r}</span>
                            <span>Red</span>
                            <span>{this.props.max_color.r}</span>
                        </div>
                    </div>
                    <div className=" mb-4">
                        {
                            this.props.settingsLoaded ? <RangeSlider id="blueSlider" max={255}
                                defaultValue={[this.props.min_color.g, this.props.max_color.g]}
                                onInput={this.greenColorHandler}
                            ></RangeSlider> : <></>
                        }
                        <div className=" d-flex text-white justify-content-between">
                            <span>{this.props.min_color.g}</span>
                            <span>Green</span>
                            <span>{this.props.max_color.g}</span>
                        </div>
                    </div>
                    <div className=" mb-4">
                        {
                            this.props.settingsLoaded ? <RangeSlider id="greenSlider" max={255}
                                defaultValue={[this.props.min_color.b, this.props.max_color.b]}
                                onInput={this.blueColorHandler}
                            ></RangeSlider> : <></>
                        }
                        <div className=" d-flex text-white justify-content-between">
                            <span>{this.props.min_color.b}</span>
                            <span>Blue</span>
                            <span>{this.props.max_color.b}</span>
                        </div>
                    </div>
                    <div className=" d-flex ">
                        <button className="btn btn-success m-2" onClick={this.props.saveSettings}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Settings;