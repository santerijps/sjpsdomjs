class TodoApp {

  constructor(state) {
    state.items = state.items || [{text: 'make todo list', done: false}]
    this.listView = new ListView(state.items)
    this.html = this.generate(state)
  }

  generate(state) {
    return E$('div', {class: 'container'},
      E$('h1', {style: 'margin: 25px 0 25px 0;'}, 'todo-class app tutorial'),
      this.listView.html,
      E$('div', {class: 'row'},
        E$('div', {class: 'col-9'},
          E$('input', {class: 'form-control', spellcheck: false, id: 'todo-input',
            placeholder: 'new todo item', onkeypress: event => this.onkeypress(event, state)
          })
        ),
        E$('div', {class: 'col-3'},
          E$('button', {class: 'btn btn-info', onclick: () => this.onclick(state)}, 'add to todo list')
        )
      )
    )
  }

  update(state) {
    this.listView.update(state.items)
  }

  onclick(state) {
    let input = ID$('todo-input')
    if (input.value.length > 0 && !state.items.find(item => item.text === input.value)) {
      state.items.push({text: input.value, done: false})
      input.value = null
    }
  }

  onkeypress(event, state) {
    if (event.key === 'Enter') {
      this.onclick(state)
    }
  }

}

class ListView {

  constructor(items) {
    this.listItems = items.map(item => new ListItemView(item, items))
    this.html = E$('div', this.generate(this.listItems))
  }

  generate(items) {
    const listItemsHtml = items.map(li => li.html)
    return (
      listItemsHtml.length > 0
      ? E$('ul', {class: 'list-group', style: 'margin-bottom: 50px;'}, listItemsHtml)
      : E$('p', 'no items on your todo list :(')
    )
  }

  update(items) {
    this.listItems = items.map(item => new ListItemView(item, items))
    SETE$(this.html, this.generate(this.listItems))
  }

}

class ListItemView {

  constructor(item, items) {
    this.html = this.generate(item, items)
  }

  generate(item, items) {
    const liClassList = ['list-group-item', 'list-group-item-action', 'text-white', item.done ? 'bg-warning' : 'bg-success']
    return (
      E$('li', {class: liClassList.join(' '), style: 'cursor: pointer;',
        onclick: () => this.onclick(item, items)},
        E$(item.done ? 'del' : 'span', `${items.findIndex(i => i.text === item.text) + 1}. ${item.text}`)
      )
    )
  }

  onclick(item, items) {
    if (item.done) {
      items.splice(items.findIndex(i => i.text === item.text), 1)
    }
    else {
      item.done = !item.done
    }
  }

}