# iOS Nostalgia Web 🍏🔓
[![npm version](https://img.shields.io/npm/v/ios-nostalgia-web?color=brightgreen)](https://www.npmjs.com/package/ios-nostalgia-web) [![demo](https://img.shields.io/badge/demo-online-blue)](https://marcgeeklaberge.github.io/ios-nostalgia-web/)

Bring back the **classic skeuomorphic iOS UI** straight into the web. This package ships a **vanilla JavaScript API** and a **custom element** (`<slide-unlock>`) that recreates the nostalgic **“Slide to Unlock”** experience.

## ✨ Features
- 🔓 iOS 6–style **slide-to-unlock** component  
- ⚡ Lightweight, no dependencies
- 🎨 Customizable text, colors, and shimmer effect  
- 🌍 Works in **plain HTML** or any framework (Coming Soon)  
- 📦 Available on [npm](https://www.npmjs.com/package/ios-nostalgia-web) and via CDN  

## 🚀 Demo
👉 [Live Demo on GitHub Pages](https://marcgeeklaberge.github.io/ios-nostalgia-web/)

## 📦 Installation
### npm
`npm install ios-nostalgia-web`

## 🛠 Usage
### 1. With the Custom Element
```html
<script type="module" src="node_modules/ios-nostalgia-web/dist/slide-to-unlock/element.js"></script>

<slide-unlock
  text="slide to unlock"
  shimmer
  background="#000"
  handle-color="#ccc">
</slide-unlock>
```

#### Attributes:
-	text → label inside the slider
-	shimmer → enable iOS-like animated shine
-	background → slider background color
-	handle-color → handle color

### 2. With the Core API
```html
<script type="module">
  import { attachSlider } from "ios-nostalgia-web";

  const container = document.getElementById("my-slider");

  attachSlider(container, {
    text: "slide to unlock",
    background: "#000",
    onUnlock: () => alert("Unlocked!")
  });
</script>

<div id="my-slider" style="width:300px;height:42px;"></div>
```

## 🧪 Development
```
git clone https://github.com/marcgeeklaberge/ios-nostalgia-web.git
cd ios-nostalgia-web
npm install
npm run dev
```

Build & preview production demo:

```
npm run demo:build:ci
npm run preview
```

## 📜 License
MIT © 2025 Marc Laberge

## 💡 Roadmap

- More nostalgic iOS components (buttons, toggles, passcode lock)
- Framework wrappers for easier integration

