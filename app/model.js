const routes = [
  { name: "news", icon: "newspaper-outline" },
  { name: "newest", icon: "pulse-outline" },
  { name: "ask", icon: "chatbox-ellipses-outline" },
  { name: "show", icon: "eye-outline" },
  { name: "jobs", icon: "body-outline" },
  { name: "item/:key", icon: "newspaper-outline" },
  { name: "user/:key", icon: "newspaper-outline" },
]

const url = (route) => (page) => {
  let path = route.split("/")[0]
  return `https://api.hnpwa.com/v0/${path}/${page}.json`
}

const urls = routes.reduce((req, route) => {
  req[route.name] = url(route.name)
  return req
}, {})

const http = (mdl) => (url) => (route) =>
  m
    .request({
      url,
      method: "GET",
    })
    .then((data) => {
      mdl.data[route].data = data
      return mdl
    })

const reqs = {
  urls,
  http,
}

const getData = (mdl) => (route) => {
  mdl.state.showComment = false
  mdl.state.comment = {}
  mdl.state.route = route
  let path = mdl.getPath(route)
  mdl.data[route] ? mdl.data[route] : (mdl.data[route] = { data: [] })
  mdl.reqs.http(mdl)(mdl.reqs.urls[path](mdl.state.page))(route)
}

const getDataById = (mdl) => (route) => (id) => {
  mdl.state.prev = mdl.state.route

  if (route == "item") {
    mdl.state.route = route
  }

  mdl.data[route] ? mdl.data[route] : (mdl.data[route] = { data: [] })
  mdl.reqs.http(mdl)(mdl.reqs.urls[`${route}/:key`](id))(route)
}

const getPath = (route) => route.split("/")[1]

const state = {
  key: "",
  url: "",
  route: "",
  page: 1,
  profile: "",
  tabsShowing: false,
  title: "",
  comment: {},
  showModal: false,
  showUser: false,
  user: { id: "" },
}

const toggleComments = ({ mdl, key, level }) =>
  mdl.state.comment[`${key}-${level}`]
    ? (mdl.state.comment[`${key}-${level}`] = !mdl.state.comment[
        `${key}-${level}`
      ])
    : (mdl.state.comment[`${key}-${level}`] = true)

const toggleModal = (mdl) => (mdl.state.showModal = !mdl.state.showModal)

const toggleUser = (mdl) => (id) => {
  mdl.state.user.id = id
  mdl.state.showUser = !mdl.state.showUser
}

export const model = {
  getData,
  getDataById,
  routes,
  getPath,
  reqs,
  data: {},
  state,
  toggleComments,
  toggleModal,
  toggleUser,
}
