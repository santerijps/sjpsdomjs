const NavAppViews = {}

NavAppViews.NavItemView = (text, onclick) => {
  return E$('a', {class: 'nav-link', style: 'cursor: pointer;', onclick}, text)
}

NavAppViews.NavBarView = (state, _state, view) => {

  const onclick = event => {
    state.selectedPage = state.pages.find(p => p.name === event.target.innerText)
  }

  return view || (
    E$('div', {class: 'container', id: 'nav-bar-view'},
      E$('navbar', {class: 'nav'},
        ...A$(state.pages, p => NavAppViews.NavItemView(p.name, onclick))
      )
    )
  )

}

NavAppViews.ContentView = (state, _state, view) => {

  const name = state.selectedPage.name

  return view || state.selectedPage.render(state[name], _state[name], view)

}

const NavAppView = (state, _state, view) => {

  state.pages = state.pages || [
    {name: 'todo', render: TodoAppView},
    {name: 'wordcount', render: WordCountAppView},
  ]

  state.selectedPage = state.selectedPage || state.pages[0]

  return (
    E$('div', {class: 'container'},
      NavAppViews.NavBarView(state, _state, ID$('nav-bar-view')),
      NavAppViews.ContentView(state, _state, ID$('content-view')),
    )
  )

}

LOAD$(
  () => IMPORT$('../todo/todo.js', '../wordcount/wordcount.js'),
  () => INIT$('#root', NavAppView, {todo: {}, wordcount: {}})
)

const nav_import = true
