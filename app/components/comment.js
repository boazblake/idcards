const Comment = {
  view: ({
    attrs: {
      key,
      mdl,
      comment: { comments, comments_count, id, time_ago, content, level, user },
    },
  }) => {
    let state = {
      showComments: mdl.state.comment[`${key}-${level}`] || false,
    }

    return m(
      ".commentContainer",
      {
        id: `${id}`,
      },
      [
        m(".", [
          m(
            "a.highlight.cursor",
            {
              onclick: () => {
                mdl.toggleUser(mdl)(user)
                console.log(user)
              },
            },
            ` ${user}`
          ),
          m("code", ` ${time_ago}`),
        ]),
        m(".nudgeRight", [
          m("code", m.trust(content)),
          comments_count
            ? m(
                "button.commentBtn",
                { onclick: () => mdl.toggleComments({ mdl, key, level }) },
                [
                  m("svg.toggleCommentSvg", toUnFurl(state.showComments)),
                  `${comments_count} comments`,
                ]
              )
            : "",
          state.showComments
            ? comments.map((c, idx) =>
                m(Comment, {
                  key: idx,
                  comment: c,
                  mdl,
                })
              )
            : "",
        ]),
      ]
    )
  },
}

export default Comment
