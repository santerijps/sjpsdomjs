const ContainerView = (id, ...children) =>
  E$('div', {class: 'container', id}, ...children)

const RowView = (id, ...children) =>
  E$('div', {class: 'row', id, style: 'padding-top: 30px;'}, ...children)

const SignedInView = (state, _state, view) => {
  return RowView('signed-in-view',
    TodoAppView(state.todo, _state.todo, null),
    WordCountAppView(state.wordcount, _state.wordcount, null)
  )
}

const SignInView = (state, _state, view) => {

  const trySignIn = (username, password) => {
    state.username = username
    state.signedIn = username === 'root' && password === 'toor'
  }

  const badLogin = () => {
    return state.signedIn === false
  }

  return RowView('sign-in-view',
    E$('h1', 'Sign in'),
    E$('hr'),
    E$('p', {class: badLogin() ? 'text-danger' : ''}, badLogin() ? 'Invalid username or password!' : 'Try signing in below!'),
    E$('div', {class: 'input-group mb-3'},
      E$('input', {class: 'form-control', id: 'username', type: 'text', placeholder: 'Username', value: state.username || ''})
    ),
    E$('div', {class: 'input-group mb-3'},
      E$('input', {class: 'form-control', id: 'password', type: 'password', placeholder: 'Password'})
    ),
    E$('button', {
      class: 'btn btn-info text-white',
      innerText: 'Sign in',
      onclick: () => trySignIn(V$('#username'), V$('#password'))
    })
  )

}

const SignInAppView = (state, _state, view) => {
  return ContainerView('app',
    state.signedIn && state.signedIn === true
      ? SignedInView(state, _state, Q$('#signed-in-view', view))
      : SignInView(state, _state, Q$('#sign-in-view', view))
  )
}

LOAD$(
  () => IMPORT$('../todo/todo.js', '../wordcount/wordcount.js'),
  () => INIT$('#root', SignInAppView, {todo: {}, wordcount: {}})
)
