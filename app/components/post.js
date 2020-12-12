const toComment = (comments_count) => (showItem) => (id, title) =>
  comments_count
    ? m(
        "ion-link",
        {
          class: "bottom",
          href: `/item/${id}`,
          onclick: () => showItem(id, title),
        },
        m("ion-badge", `${comments_count} comments`)
      )
    : m("ion-badge", `${comments_count} comments`)

const Post = {
  view: ({
    attrs: {
      mdl,
      showItem,
      post: { comments_count, domain, id, points, time_ago, title, url, user },
    },
  }) => {
    return m(
      "ion-item",
      m(
        "ion-grid",
        m("ion-header.ion-no-border", m("ion-toolbar", title)),
        m(
          "ion-row",
          m(
            "ion-link",
            "from ",
            m(
              "a.",
              { target: "_blank", href: url, rel: "noopener" },
              `${domain}`
            )
          )
        ),
        m(
          "ion-item",
          { lines: "none" },
          m(
            "ion-badge",
            { slot: "start", onclick: () => mdl.toggleUser(mdl)(user) },
            user
          ),
          m("ion-badge", { slot: "end" }, points)
        ),
        m(
          "ion-item",
          { lines: "none" },

          m("ion-badge", { slot: "start" }, time_ago),
          m(
            "ion-badge",
            { slot: "end" },
            toComment(comments_count)(showItem)(id, title)
          )
        )
      )
    )
  },
}

export default Post
