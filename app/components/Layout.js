const Toolbar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "ion-header",
        m(
          "ion-toolbar",
          m("ion-title", { size: "large" }, mdl.getPath(mdl.state.route))
        )
      ),
  }
}

const Footer = ({ attrs: { mdl } }) => {
  const Routes = mdl.routes.filter((r) => r.name.split("/").length == 1)
  return {
    view: ({ attrs: { mdl } }) => {
      return m(
        "ion-footer",
        m(
          "ion-tab-bar",
          m("ion-tabs", [
            Routes.map((r) => m("ion-tab", { tab: `${r.name}` })),
            m("ion-tab-bar", { slot: "bottom" }, [
              Routes.map((r) =>
                m(
                  "ion-tab-button",
                  {
                    onclick: () => {
                      console.log("r.name", r.name)
                      m.route.set(`/${r.name}`)
                    },
                    tab: `${r.name}`,
                  },
                  [m("ion-label", r.name), m("ion-icon", { name: r.icon })]
                )
              ),
              m(
                "ion-tab-button",
                {
                  onclick: () => showSettings(mdl),
                },
                [
                  m("ion-label", "settings"),
                  m("ion-icon", { name: "ellipsis-vertical-outline" }),
                ]
              ),
            ]),
          ])
        )
      )
    },
  }
}

const Layout = ({ attrs: { mdl } }) => {
  return {
    view: ({ children }) =>
      m(
        "ion-app",
        children && [
          m(Toolbar, { mdl }),
          m("ion-content", children),
          m(Footer, { mdl }),
        ]
      ),
  }
}

export default Layout
