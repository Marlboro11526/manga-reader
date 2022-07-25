import React from 'react';
import SideBar from './partials/Sidebar';
import Content from './partials/Content';
import './App.css';
import { invoke } from '@tauri-apps/api/tauri';
import { readDir } from '@tauri-apps/api/fs';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dirList: [],
      sidebarContentIsActive: false,
      activeSection: 0,
      activeChapter: "",
      chapter: [],
      useColorTone: false,
      max_color: {
        r: 255,
        g: 255,
        b: 255,
      },
      min_color: {
        r: 0,
        g: 0,
        b: 0,
      },
      settingsLoaded: false,
    }
    this.allowedFile = ['cbz', 'jpg', 'jpeg', 'png', "webp"]
  }

  activeSectionHandler = (section) => { this.setState({ activeSection: section }) }
  sidebarContentIsActiveHandler = (isActive) => { this.setState({ sidebarContentIsActive: isActive }) }
  sectionChangeHandler = (section) => { this.setState({ activeSection: section }) }
  activeChapterHandler = (chapter) => { this.setState({ activeChapter: chapter }) }
  redColorHandler = (minRed, maxRed) => { this.setState({ min_color: { r: minRed, g: this.state.min_color.g, b: this.state.min_color.b }, max_color: { r: maxRed, g: this.state.max_color.g, b: this.state.max_color.b } }) }
  greenColorHandler = (minGreen, maxGreen) => { this.setState({ min_color: { r: this.state.min_color.r, g: minGreen, b: this.state.min_color.b }, max_color: { r: this.state.max_color.r, g: maxGreen, b: this.state.max_color.b } }) }
  blueColorHandler = (minBlue, maxBlue) => { this.setState({ min_color: { r: this.state.min_color.r, g: this.state.min_color.g, b: minBlue }, max_color: { r: this.state.max_color.r, g: this.state.max_color.g, b: maxBlue } }) }
  useColorToneHandler = (useColorTone) => { this.setState({ useColorTone }) }
  sortCompare = (a, b) => {
    if (a.children && b.children) { a.children.sort(this.sortCompare); b.children.sort(this.sortCompare); return 0 }
    else if (a.children) { a.children.sort(this.sortCompare); return -1 }
    else if (b.children) { b.children.sort(this.sortCompare); return 1 }
    else return 0;
  }
  eliminateFile(dirList) {
    return dirList.filter(item => {
      if (item.children) { item.children = this.eliminateFile(item.children); return true }
      if (this.allowedFile.indexOf(item.name.split(".").pop().toLowerCase()) !== -1) return true;
      return false;
    });
  }

  saveSettings = () => {
    invoke("save_settings", {
      settings: JSON.stringify(
        {
          color_tone: this.state.useColorTone,
          max_color: this.state.max_color,
          min_color: this.state.min_color,
        }
      )
    })
      .then(() => { console.log("Settings saved") })
      .catch(err => { console.log(err) })
  }

  componentDidMount() {
    invoke("read_settings").then((result) => {
      result = JSON.parse(result);
      this.setState({
        max_color: result.max_color,
        min_color: result.min_color,
        useColorTone: result.color_tone,
        settingsLoaded: true,
      });
      console.log(this.state.useColorTone);
    });
    invoke("get_current_location").then((dir) => {
      readDir(dir, {
        // recursive: true,
      }).then((result) => {
        result.sort(this.sortCompare);
        result = this.eliminateFile(result);
        this.setState({ dirList: result });
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
  }

  recolorImageList = (imageList) => {
    let newImageList = [];
    Array.from(imageList).forEach((item, index) => {
      let image = new Image();
      image.src = item;
      image.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        let imageData = ctx.getImageData(0, 0, image.width, image.height);
        let data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = (data[i] / 255) * (this.state.max_color.r - this.state.min_color.r) + this.state.min_color.r;
          data[i + 1] = (data[i + 1] / 255) * (this.state.max_color.g - this.state.min_color.g) + this.state.min_color.g;
          data[i + 2] = (data[i + 2] / 255) * (this.state.max_color.b - this.state.min_color.b) + this.state.min_color.b;
        }
        ctx.putImageData(imageData, 0, 0);
        newImageList.push(canvas.toDataURL("image/png"));
        if (imageList.length === newImageList.length) {
          this.setState({ chapter: newImageList });
        }
      }
    });
    return newImageList;
  }

  base64ToSrc = (base64) => { return `data:image/*;base64,${base64}` }

  readImageFile = (path) => {
    invoke("read_chapter_image", { path: path }).then((result) => {
      result = JSON.parse(result);
      result = result.map((item) => { return item = this.base64ToSrc(item) });
      if (this.state.useColorTone) {
        result = this.recolorImageList(result);
      }
      this.setState({ chapter: result });
    })
  }

  readCBZFile = (path) => {
    invoke("read_chapter_cbz", { path: path }).then((result) => {
      result = JSON.parse(result);
      result = result.map((item) => { return item = this.base64ToSrc(item) });
      if (this.state.useColorTone) {
        result = this.recolorImageList(result);
      }
      this.setState({ chapter: result });
    })
  }
  render() {
    return (
      <div className="App">
        <SideBar sectionChangeHandler={this.sectionChangeHandler}
          sidebarContentIsActiveHandler={this.sidebarContentIsActiveHandler}
          sidebarContentIsActive={this.state.sidebarContentIsActive}
          activeSection={this.state.activeSection}
          activeSectionHandler={this.activeSectionHandler}
          activeChapter={this.state.activeChapter}
          activeChapterHandler={this.activeChapterHandler}
          dirList={this.state.dirList}
          readImageFile={this.readImageFile}
          readCBZFile={this.readCBZFile}
          useColorTone={this.state.useColorTone}
          max_color={this.state.max_color}
          min_color={this.state.min_color}
          greenColorHandler={this.greenColorHandler}
          blueColorHandler={this.blueColorHandler}
          redColorHandler={this.redColorHandler}
          useColorToneHandler={this.useColorToneHandler}
          settingsLoaded={this.state.settingsLoaded}
          saveSettings={this.saveSettings}
        />

        <Content dirList={this.state.dirList}
          sidebarContentIsActiveHandler={this.sidebarContentIsActiveHandler}
          activeChapter={this.state.activeChapter}
          chapter={this.state.chapter}
        />
      </div>
    );
  }
}

export default App;
