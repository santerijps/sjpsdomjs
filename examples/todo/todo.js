const ListItemClick = (item, index, items) => {
  if (!item.done) item.done = true
  else items.splice(index, 1)
}

const ListItemView = (item, index, items) => (
  E$('li', {class: 'list-group-item list-group-item-action',
    style: 'cursor: pointer;',
    onclick: () => ListItemClick(item, index, items)},
    E$(item.done ? 'del' : 'span', `${index + 1}. ${item.text}`)
  )
)

const ListView = items => (
  items.length > 0 
  ? (E$('ul', {class: 'list-group', style: 'margin-bottom: 50px;'},
      A$(items, ListItemView)))
  : E$('p', 'your todo list is empty :(')
)

const ToastView = () => {
  return (
    E$('div', {class: 'toast d-flex align-items-center', role: 'alert', 
      'aria-live': 'assertive', 'aria-atomic': 'true', id: 'toast'},
      E$('div', {class: 'toast-body'}, 'Hello, toast!'),
      E$('button', {class: 'btn-close ms-auto me-2', 'data-bs-dismiss': 'toast', 'aria-label': 'Close'})
    )
  )
}

const NewItemKeyPress = (event, state) => {
  if (event.key === 'Enter') {
    document.getElementById('new-item-button').click()
  }
}

const NewItemClick = items => {
  let input = document.getElementById('new-todo')
  if (input.value.length > 0 && !items.find(x => x.text === input.value)) {
    let item = {text: input.value, done: false}
    items.push(item)
    input.value = ''
  }
  else {
    let toast = new bootstrap.Toast(Q$('#toast'), {delay: 2000})
    toast.show()
  }
}

const NewItemView = (state, prevState, view) => (
  view || (
    E$('div', {class: 'row', id: 'new-item-view'},
      E$('div', {class: 'col-9'},
        E$('input', {
          type: 'text', placeholder: 'new todo item', id: 'new-todo',
          class: 'form-control', spellcheck: 'false',
          onkeypress: e => NewItemKeyPress(e, state)
        })
      ),
      E$('div', {class: 'col-3'}, 
        E$('button', {
          id: 'new-item-button',
          innerText: 'add to list',
          class: 'btn btn-success',
          onclick: () => NewItemClick(state.items),
        })
      )
    )
  )
)

/* The view should handle a changed state?
   Let's try...
   Pass the old state and current app view to the appViewDefinition
*/
const TodoAppView = (state, prevState, view) => {
  
  state.heading = state.heading || 'todo app tutorial'
  state.items = state.items || [{text: 'make todo list', done: false}]
  
  return (
    E$('div', {class: 'container'},
      ToastView(),
      E$('h1', {style: 'margin-bottom: 25px;'}, state.heading),
      ListView(state.items, prevState, Q$('#list-view', view)),
      NewItemView(state, prevState, Q$('#new-item-view', view)),
    )
  )
}

const todo_import = true
