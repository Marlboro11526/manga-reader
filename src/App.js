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
      chapter: []
    }
    this.allowedFile = ['cbz', 'jpg', 'jpeg', 'png', "webp"]
  }

  sidebarContentIsActiveHandler = (isActive) => { this.setState({ sidebarContentIsActive: isActive }) }
  sectionChangeHandler = (section) => { this.setState({ activeSection: section }) }
  activeChapterHandler = (chapter) => { this.setState({ activeChapter: chapter }) }
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

  componentDidMount() {
    invoke("get_current_location").then((dir) => {
      readDir(dir, {
        recursive: true,
      }).then((result) => {
        result.sort(this.sortCompare);
        result = this.eliminateFile(result);
        this.setState({ dirList: result });
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
  }


  readImageFile = (path) => {
    invoke("read_chapter_image", { path: path }).then((result) => { this.setState({ chapter: JSON.parse(result) }) });
  }

  readCBZFile = (path) => {
    invoke("read_chapter_cbz", { path: path }).then((result) => { this.setState({ chapter: JSON.parse(result) }) });
  }
  render() {
    return (
      <div className="App">
        <SideBar sectionChangeHandler={this.sectionChangeHandler}
          sidebarContentIsActiveHandler={this.sidebarContentIsActiveHandler}
          sidebarContentIsActive={this.state.sidebarContentIsActive}
          activeSection={this.state.activeSection}
          activeChapter={this.state.activeChapter}
          activeChapterHandler={this.activeChapterHandler}
          dirList={this.state.dirList}
          readImageFile={this.readImageFile}
          readCBZFile={this.readCBZFile} />

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
