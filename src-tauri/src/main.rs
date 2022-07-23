#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
extern crate base64;

use std::{env, fs, io::Read};
use zip::ZipArchive;

use serde_json::json;
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_exe_location,
            get_current_location,
            read_current_dir,
            print_text,
            read_image,
            read_chapter_image,
            read_chapter_cbz
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_exe_location() -> String {
    env::current_exe()
        .unwrap()
        .to_str()
        .unwrap()
        .to_string()
        .into()
}

#[tauri::command]
fn get_current_location() -> String {
    env::current_dir()
        .unwrap()
        .to_str()
        .unwrap()
        .to_string()
        .into()
}

#[tauri::command]
fn read_current_dir() -> String {
    let data = fs::read_dir(env::current_dir().unwrap())
        .unwrap()
        .map(|entry| entry.unwrap().path().to_str().unwrap().to_string())
        .collect::<Vec<String>>();
    json!(data).to_string().into()
}

#[tauri::command]
fn print_text(text: String) {
    println!("{}", text);
}

#[tauri::command]
fn read_image(path: String) -> String {
    let data = fs::read(path).unwrap();
    base64::encode(&data).into()
}

#[tauri::command]
fn read_chapter_image(mut path: String) -> String {
    let mut data = path.split("\\").collect::<Vec<&str>>();
    data.pop();
    path = data.join("\\");
    let dirlist = fs::read_dir(&path).unwrap();
    let strings = dirlist
        .map(|entry| entry.unwrap().path().to_str().unwrap().to_string())
        .collect::<Vec<String>>();
    let result = strings
        .iter()
        .filter(|s| {
            (s.ends_with(".png") || s.ends_with(".jpg"))
                || s.ends_with(".jpeg")
                || s.ends_with(".webp")
        })
        .map(|s| base64::encode(fs::read(s).unwrap()).into())
        .collect::<Vec<String>>();
    json!(result).to_string().into()
}

#[tauri::command]
async fn read_chapter_cbz(path: String) -> String {
    let mut result = Vec::<String>::new();
    let mut data = ZipArchive::new(fs::File::open(path).unwrap()).unwrap();
    for i in 0..data.len() {
        let mut file = data.by_index(i).unwrap();
        if file.is_file() {
            let mut temp = Vec::<u8>::new();
            file.read_to_end(&mut temp).unwrap();
            result.push(base64::encode(&temp).into());
        }
    }
    json!(result).to_string().into()
}
