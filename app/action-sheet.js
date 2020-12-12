import { actionSheetController } from "@ionic/core"

export const showSettings = (mdl) => {
  const showAction = () => {
    actionSheetController
      .create({
        header: "Settings",
        buttons: [
          {
            handler: () => {
              mdl.state.mode = mdl.state.mode == "light" ? "dark" : "light"
              document.body.classList.toggle("dark")
              window.matchMedia("(prefers-color-scheme: dark)")
            },
            text:
              mdl.state.mode == "light"
                ? "Enter Dark Mode"
                : "Enter Light Mode",
          },
        ],
      })
      .then((x) => x.present())
  }
  showAction()
}
