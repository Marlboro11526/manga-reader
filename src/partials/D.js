import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { BaseDirectory, readDir } from "@tauri-apps/api/fs";



class Dir extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDirectory: "",
            exeDirectory: "",
            read_dir_result: [],
        }
    }

    componentDidMount() {
        invoke("get_exe_location").then((dir) => { this.setState({ exeDirectory: dir }) });
        invoke("get_current_location").then((dir) => {
            this.setState({ currentDirectory: dir });
            readDir(dir, {
                recursive: true,
            }).then((dir) => {
                this.setState({ read_dir_result: dir });
            });

        });

    }
    render() {
        return (
            <div>
                <i className="bi bi-folder"> </i>
                <p>{this.state.currentDirectory}</p>
                <p>{this.state.exeDirectory}</p>
            </div>
        );
    }
}

export default Dir;