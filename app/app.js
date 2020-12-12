import Layout from "./components/layout.js"
import Modal from "./components/modal.js"
import Post from "./components/post.js"
import Comment from "./components/comment.js"

import { isEmpty, init, infiniteScroll } from "./utils/index"

const IsLoading = m(".holder", [
  m(".preloader", [
    m("div"),
    m("div"),
    m("div"),
    m("div"),
    m("div"),
    m("div"),
    m("div"),
  ]),
])

const plus =
  "M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"
const minus =
  "M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z"

const toUnFurl = (bool = false) =>
  bool ? m("path.highlight", { d: minus }) : m("path.highlight", { d: plus })

const userModalInfo = (mdl) => ({
  init: (mdl) => mdl.getDataById(mdl)("user")(mdl.state.user.id),
  close: (mdl) => mdl.toggleUser(mdl)(""),
  title: "User",
  contents:
    mdl.data.user && mdl.data.user.data
      ? [
          m("code.row", [m(".bold", "id: "), mdl.data.user.data.id]),
          m("code.row", [m(".bold", "created: "), mdl.data.user.data.created]),
          m("code.row", [m(".bold", "about: "), mdl.data.user.data.about]),
          m("code.row", [m(".bold", "karma: "), mdl.data.user.data.karma]),
        ]
      : [],
  footer: [],
})

const Component = () => {
  const isPost = (data) => data.map
  const isComment = (data) => data.comments && data.comments.map

  return {
    view: ({ attrs: { mdl } }) => {
      let route = mdl.state.route
      let data = mdl.data[route].data

      let showItem = (id, title = "") => {
        mdl.state.title = title
        mdl.state.id = id
        mdl.state.showComment = !mdl.state.showComment
      }
      return m(
        "ion-list",
        {
          id: "component",
          route: mdl.state.route,
          onscroll: infiniteScroll(mdl),
        },
        [
          isEmpty(data)
            ? m(".loader", IsLoading)
            : isPost(data)
            ? data.map((_post, idx) =>
                m(Post, {
                  key: idx,
                  post: _post,
                  mdl,
                  showItem,
                })
              )
            : isComment(data) && [
                m(".titleContainer", [
                  m(
                    "button.backBtn",
                    {
                      onclick: () => m.route.set(mdl.state.prev || "/news"),
                    },
                    "Back"
                  ),
                  m("h1.title", data.title),
                ]),
                data.comments.map((c, idx) =>
                  m(Comment, {
                    key: idx,
                    comment: c,
                    mdl,
                  })
                ),
              ],
          mdl.state.showUser &&
            mdl.state.user.id &&
            m(Modal, { ...userModalInfo(mdl), mdl }),
        ]
      )
    },
  }
}

const makeRoutes = (mdl) => (routes, route) => {
  routes[`/${route.name}`] = {
    onmatch: (_, path) => init(mdl)(path),
    render: () =>
      m(
        Layout,
        {
          mdl,
        },
        m(Component, {
          mdl,
        })
      ),
  }
  return routes
}

export const App = (mdl) => mdl.routes.reduce(makeRoutes(mdl), {})
