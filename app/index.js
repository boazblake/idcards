const root = document.body
import { model } from "./model.js"

import { App } from "./app.js"

if (module.hot) {
  module.hot.accept()
}

if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!")
}

// Styles

function getProfile(w) {
  if (w < 668) return "phone"
  if (w < 920) return "tablet"
  return "desktop"
}

let winW = window.innerWidth
model.state.profile = getProfile(winW)

function checkWidth() {
  const w = window.innerWidth
  if (winW !== w) {
    winW = w
    var lastProfile = model.state.profile
    model.state.profile = getProfile(w)
    if (lastProfile != model.state.profile) m.redraw()
  }
  requestAnimationFrame(checkWidth)
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}

checkWidth()
m.route(root, "/news", App(model))
m.route.set("/news")
