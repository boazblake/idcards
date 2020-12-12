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
      {
        detail: true,
      },
      m(
        "ion-grid",
        m("ion-header.ion-no-border", m("ion-toolbar", m("h3", title))),
        m("ion-badge", `${comments_count} comments`),
        m(
          "ion-row",
          m(
            "ion-col",

            m(
              "ion-grid",
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
                "ion-item-group",
                m(
                  "ion-label",
                  "by",
                  m(
                    "ion-chip",
                    {
                      slot: "start",
                      color: "primary",
                      // onclick: () => mdl.toggleUser(mdl)(user),
                    },
                    user
                  )
                )
              ),
              m(
                "ion-item",
                { lines: "none" },
                m("ion-badge", { slot: "end" }, points),
                m("ion-note", { slot: "start" }, time_ago),
                comments_count &&
                  m(m.route.Link, {
                    slot: "end",
                    class: "bottom",
                    href: `/item/${id}`,
                    onclick: () => showItem(id, title),
                  })
              )
            )
          )
        )
      )
    )
  },
}

export default Post
